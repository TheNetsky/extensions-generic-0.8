import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    SearchResultsProviding,
    ChapterProviding,
    MangaProviding,
    HomePageSectionsProviding,
    HomeSectionType,
    TagSection
} from '@paperback/types'

import { HeanParser } from './HeanParser'

import {

    HeanChapterList,
    HeanMetadata,
    HeanTag
} from './HeanInterfaces'

const BASE_VERSION = '1.0.0'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class Hean implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    /**
     *  Request manager override
     */
    requestsPerSecond = 5
    requestTimeout = 20000

    requestManager = App.createRequestManager({
        requestsPerSecond: this.requestsPerSecond,
        requestTimeout: this.requestTimeout,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                        'referer': `${this.baseUrl}/`,
                        'origin': `${this.baseUrl}/`
                    }
                }
                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })

    /**
    * The base URL of the website. Eg. https://example.com
    */
    abstract baseUrl: string

    /**
    * The API sub domain.
    */
    abstract apiUrl: string

    /**
     * The language code the source's content is served in in string form.
     */
    language = '🇬🇧'

    /**
     * The common directory path for items after the baseURL
     */
    directoryPath = 'series'

    /** Insert stuff here */
    useChapterQuery = true

    /** Insert stuff here */
    useGenres = true

    parser = new HeanParser()

    getMangaShareUrl(mangaId: string): string {
        const slug = this.parser.convertMangaIdToSlug(mangaId)

        return `${this.baseUrl}/${this.directoryPath}/${slug}`
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const id = this.parser.convertMangaIdToSlug(mangaId)

        const request = App.createRequest({
            url: `${this.apiUrl}/${this.directoryPath}/${id}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const data = JSON.parse(response.data as string)

        return this.parser.parseDetails(data)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        if (this.useChapterQuery) {
            const chapters: Chapter[] = []
            const params = { page: 1, perPage: 500, series_id: this.parser.convertMangaIdToId(mangaId) }
            let hasMore = true

            while (hasMore) {
                const request = App.createRequest({
                    url: `${this.apiUrl}/chapter/query`,
                    method: 'GET',
                    param: this.paramsToString(params)
                })

                const response = await this.requestManager.schedule(request, 1)
                this.checkResponseError(response)
                const data: HeanChapterList = JSON.parse(response.data as string)
                const result = this.parser.parseChaptersList(this, data, params.page)

                chapters.push(...result.chapters)
                params.page++
                hasMore = result.hasMore
            }

            return chapters
        } else {
            const slug = this.parser.convertMangaIdToSlug(mangaId)

            const request = App.createRequest({
                url: `${this.apiUrl}/${this.directoryPath}/${slug}`,
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            this.checkResponseError(response)
            const data = JSON.parse(response.data as string)

            return this.parser.parseChapterFromMangaDetails(this, data)
        }
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const slug = this.parser.convertMangaIdToSlug(mangaId)

        const request = App.createRequest({
            url: `${this.apiUrl}/chapter/${slug}/${chapterId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const data = JSON.parse(response.data as string)

        return this.parser.parseChapterDetails(data, mangaId, chapterId, this.apiUrl)
    }

    /*
    Better the keep this removed since there are usually not enough to fill the slot on the homepage
    getCarouselTitles(): Promise<PagedResults> {
        return this.ExecRequest(
            { url: `${this.apiUrl}/series/banners` },
            HeanParser.parseCarouselTitles)
    }
    */

    async getTitles(queryParams: Record<string, unknown>, metadata?: HeanMetadata | undefined): Promise<PagedResults> {
        if (metadata && metadata.current_page === metadata.last_page) {
            return Promise.resolve<PagedResults>(App.createPagedResults({}))
        }

        const params = {
            ...queryParams,
            adult: true,
            page: (metadata?.current_page ?? 0) + 1,
            per_page: metadata?.per_page ?? 10
        }

        const request = App.createRequest({
            url: `${this.apiUrl}/query`,
            method: 'GET',
            param: this.paramsToString(params)
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const data = JSON.parse(response.data as string)

        return this.parser.parseSearchResults(data)
    }

    async getSearchResults(query: SearchRequest, metadata: HeanMetadata | undefined): Promise<PagedResults> {
        const params = {
            query_string: query?.title ?? '',
            tags_ids: `[${(query?.includedTags.map(a => a.id) ?? []).join(',')}]`
        }
        return await this.getTitles(params, metadata)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections: { request: Promise<PagedResults>, section: HomeSection }[] =
            [
                {
                    request: this.getTitles({ order: 'desc', orderBy: 'latest' }),
                    section: App.createHomeSection({
                        id: 'latest_releases',
                        title: 'Our latest releases on comics',
                        containsMoreItems: true,
                        type: HomeSectionType.singleRowNormal
                    })
                },
                {
                    request: this.getTitles({ order: 'desc', orderBy: 'day_views' }),
                    section: App.createHomeSection({
                        id: 'daily',
                        title: 'Daily trending',
                        containsMoreItems: true,
                        type: HomeSectionType.singleRowNormal
                    })
                },
                {
                    request: this.getTitles({ order: 'desc', orderBy: 'latest' }),
                    section: App.createHomeSection({
                        id: 'most_viewed',
                        title: 'Most viewed all times',
                        containsMoreItems: true,
                        type: HomeSectionType.singleRowNormal
                    })
                }
            ]

        const promises: Promise<void>[] = []
        for (const section of sections) {
            promises.push(section.request.then(items => {
                section.section.items = items.results
                sectionCallback(section.section)
            }))
        }

    }

    async getSearchTags(): Promise<TagSection[]> {
        if (this.useGenres) {

            const request = App.createRequest({
                url: `${this.apiUrl}/tags`,
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            this.checkResponseError(response)
            const data: HeanTag[] = JSON.parse(response.data as string)
            const tags = this.parser.parseGenres(data)

            return [App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags
            })]
        } else {
            return []
        }
    }

    async getViewMoreItems(homepageSectionId: string, metadata: HeanMetadata | undefined): Promise<PagedResults> {
        let param: Record<string, unknown>

        switch (homepageSectionId) {
            case 'latest_releases':
                param = { order: 'desc', orderBy: 'latest' }
                break
            case 'daily':
                param = { order: 'desc', orderBy: 'day_views' }
                break
            case 'most_viewed':
                param = { order: 'desc', orderBy: 'latest' }
                break
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }

        return await this.getTitles(param, metadata)
    }

    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: this.baseUrl,
            method: 'GET',
            headers: {
                'referer': `${this.baseUrl}/`,
                'origin': `${this.baseUrl}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        })
    }

    // Utils
    checkResponseError(response: Response): void {
        const status = response.status
        switch (status) {
            case 403:
            case 503:
                throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to the homepage of <${this.baseUrl}> and press the cloud icon.`)
            case 404:
                throw new Error(`The requested page ${response.request.url} was not found!`)
        }
    }

    paramsToString = (params: Record<string, unknown>): string => {
        return '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    }
}
