import {
    Chapter,
    ChapterDetails,
    ChapterProviding,
    DUISection,
    HomePageSectionsProviding,
    HomeSection,
    HomeSectionType,
    MangaProviding,
    PagedResults,
    PartialSourceManga,
    Request,
    Response,
    SearchRequest,
    SearchResultsProviding,
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'

import { decodeHTML } from 'entities'

import { MangaBoxParser } from './MangaBoxParser'

import { URLBuilder } from './MangaBoxHelpers'

import {
    chapterSettings,
    getImageServer,
    resetSettings
} from './MangaBoxSettings'

const BASE_VERSION = '2.0.1'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export interface HomeSectionsParams {
    key: string
    values: [latest: string, newest: string, popular: string]
}

export interface APIChapter {
    chapter_name: string
    chapter_slug: string
    chapter_num: number
    updated_at: string
    view: number
}

export abstract class MangaBox implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    // Website base URL. Eg. https://manganato.com
    abstract baseURL: string

    // Language code supported by the source.
    abstract languageCode: string

    // Path for manga list. Eg. https://manganato.com/genre-all the path is 'genre-all'
    abstract mangaListPath: string

    // Appended path for manga list home sections. Eg. https://www.natomanga.com/genre/all the appended path is 'all'
    abstract mangaListHomeSectionsPath: string

    // Homepage sections key value mappings.
    mangaListHomeSectionsParams: HomeSectionsParams = {
        key: 'filter',
        values: ['4', '1', '7']
    }

    // Selector for manga in manga list.
    abstract mangaListSelector: string

    // Selector for subtitle in manga list.
    abstract mangaSubtitleSelector: string

    // Bypass for sites that use Captcha or CloudFlare.
    abstract bypassPage: string

    // Selector for genre list items.
    genreListSelector = 'div.advanced-search-tool-genres-list span.advanced-search-tool-genres-item'

    // Selector for status list items.
    statusListSelector = 'div.advanced-search-tool-status select.advanced-search-tool-status-content option'

    // Root selector for getMangaDetails.
    mangaRootSelector = 'div.panel-story-info, div.manga-info-top'

    // Selector for manga thumbnail.
    mangaThumbnailSelector = 'span.info-image img, div.manga-info-pic img'

    // Selector for manga main title.
    mangaTitleSelector = 'div.story-info-right h1, ul.manga-info-text li:first-of-type h1'

    // Selector for manga alternative titles.
    mangaAltTitleSelector = 'div.story-info-right td:contains(Alternative) + td h2,'
        + 'ul.manga-info-text h2.story-alternative'

    // Selector for manga status.
    mangaStatusSelector = 'div.story-info-right td:contains(Status) + td,'
        + 'ul.manga-info-text li:contains(Status)'

    // Selector for manga author.
    mangaAuthorSelector = 'div.story-info-right td:contains(Author) + td a,'
        + 'ul.manga-info-text li:contains(Author)'

    // Selector for manga description.
    mangaDescSelector = 'div.leftCol div#contentBox, div.chapter + div#contentBox, div#panel-story-info-description, div.manga-info-top + div#contentBox'

    // Selector for manga tags.
    mangaGenresSelector = 'div.story-info-right td:contains(Genre) + td a,'
        + 'ul.manga-info-text li:contains(Genres) a'

    // Selector for manga chapter list.
    chapterListSelector = 'div#chapter div.manga-info-chapter div#chapter-list-container div.chapter-list div.row,'
        + 'div.panel-story-chapter-list ul.row-content-chapter li'

    // Selector for manga chapter time updated.
    chapterTimeSelector = 'span.chapter-time, span:last-of-type'

    // Selector for manga chapter images.
    chapterImagesSelector = 'div.container-chapter-reader img'

    constructor(public cheerio: CheerioAPI) { }

    parser = new MangaBoxParser()

    stateManager = App.createSourceStateManager()

    requestManager = App.createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${this.baseURL}/`,
                        'user-agent': await this.requestManager.getDefaultUserAgent()
                    }
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })

    async getSourceMenu(): Promise<DUISection> {
        return Promise.resolve(App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            isHidden: false,
            rows: async () => [
                chapterSettings(this.stateManager),
                resetSettings(this.stateManager)
            ]
        }))
    }

    getMangaShareUrl(mangaId: string): string { return `${this.baseURL}/manga/${mangaId}/` }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            {
                request: App.createRequest({
                    url: new URLBuilder(this.baseURL)
                        .addPathComponent(`${this.mangaListPath}/${this.mangaListHomeSectionsPath}`)
                        .addQueryParameter(this.mangaListHomeSectionsParams.key, this.mangaListHomeSectionsParams.values[0])
                        .addQueryParameter('page', '1')
                        .buildUrl(),
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: `${this.mangaListHomeSectionsParams.values[0]}`,
                    title: 'Latest Updates',
                    type: HomeSectionType.singleRowLarge,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: new URLBuilder(this.baseURL)
                        .addPathComponent(`${this.mangaListPath}/${this.mangaListHomeSectionsPath}`)
                        .addQueryParameter(this.mangaListHomeSectionsParams.key, this.mangaListHomeSectionsParams.values[1])
                        .addQueryParameter('page', '1')
                        .buildUrl(),
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: `${this.mangaListHomeSectionsParams.values[1]}`,
                    title: 'New Titles',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: new URLBuilder(this.baseURL)
                        .addPathComponent(`${this.mangaListPath}/${this.mangaListHomeSectionsPath}`)
                        .addQueryParameter(this.mangaListHomeSectionsParams.key, this.mangaListHomeSectionsParams.values[2])
                        .addQueryParameter('page', '1')
                        .buildUrl(),
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: `${this.mangaListHomeSectionsParams.values[2]}`,
                    title: 'Most Popular',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            }
        ]

        const promises: Promise<void>[] = []

        for (const section of sections) {
            sectionCallback(section.section)
            promises.push(
                this.requestManager.schedule(section.request, 1)
                    .then(response => {
                        this.checkResponseError(response)
                        const $ = this.cheerio.load(response.data as string)
                        const items = this.parser.parseManga($, this)
                        section.section.items = items
                        sectionCallback(section.section)
                    })
            )
        }
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent('manga')
                .addPathComponent(mangaId)
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)

        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseMangaDetails($, mangaId, this)
    }

    async getChaptersAPI(mangaId: string, limit = 50, offset: number): Promise<any> {
        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent('api')
                .addPathComponent('manga')
                .addPathComponent(mangaId)
                .addPathComponent('chapters')
                .addQueryParameter('limit', limit.toString())
                .addQueryParameter('offset', offset.toString())
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)

        if (!response.data) throw new Error('No data received from Chapter API')
        return JSON.parse(response.data)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const apiChapters: APIChapter[] = []

        const limit = 5000
        let offset = 0
        let hasMore = true

        while (hasMore) {
            const chapters_api_data = await this.getChaptersAPI(mangaId, limit, offset)
            if (!chapters_api_data.success) throw new Error('API did not return success for chapters request')
            apiChapters.push(...chapters_api_data.data.chapters)

            if (!chapters_api_data.data.pagination.has_more) {
                hasMore = false
                break
            }
            offset += limit
        }

        return this.parser.parseChapters(apiChapters, mangaId, this)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const cookieDomainRegex = chapterId.match(/(https?:\/\/[^\\/]+\/)/g)
        const cookieDomain = cookieDomainRegex ? cookieDomainRegex[0] : this.baseURL
        const imageServer = await getImageServer(this.stateManager).then(value => value[0])

        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent('manga')
                .addPathComponent(mangaId)
                .addPathComponent(chapterId)
                .buildUrl(),
            method: 'GET',
            cookies: [
                App.createCookie({
                    name: 'content_server',
                    value: imageServer ?? 'server1',
                    domain: cookieDomain
                })
            ]
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)

        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapterDetails($, mangaId, chapterId, this)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getViewMoreItems(homePageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent(`${this.mangaListPath}/${this.mangaListHomeSectionsPath}`)
                .addQueryParameter(this.mangaListHomeSectionsParams.key, homePageSectionId)
                .addQueryParameter('page', page)
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)

        const $ = this.cheerio.load(response.data as string)
        const results = this.parser.parseManga($, this)

        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results: results,
            metadata: metadata
        })
    }

    async supportsTagExclusion(): Promise<boolean> {
        return false
    }

    parseTagId(url: string): string | undefined {
        return url.split(`${this.mangaListPath}/`).pop()?.replace(/all.*/g, '')
    }

    async getSearchTags(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: this.baseURL,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)

        const $ = this.cheerio.load(response.data as string)

        const tags: Tag[] = []

        for (const tag of $('div.panel-category tbody a').toArray()) {
            const id = this.parseTagId($(tag).attr('href') ?? '')
            const label = $(tag).text().trim()
            if (!id || !label) continue
            tags.push({ id: id, label: label })
        }

        tags.sort((a, b) => {
            if (a.label > b.label) return 1
            if (a.label < b.label) return -1
            return 0
        })

        const TagSection: TagSection[] = [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags.map(t => App.createTag(t))
            })
        ]
        return TagSection
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        const tag: string = query.includedTags[0]?.id ?? ''
        let results: PartialSourceManga[] = []

        if (tag && tag.length != 0) {
            const request = App.createRequest({
                url: new URLBuilder(this.baseURL)
                    .addPathComponent(`${this.mangaListPath}/${tag}`)
                    .addQueryParameter('page', page)
                    .buildUrl(),
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            this.checkResponseError(response)

            const $ = this.cheerio.load(response.data as string)

            results = this.parser.parseManga($, this)
            metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        } else {
            const request = App.createRequest({
                url: new URLBuilder(this.baseURL)
                    .addPathComponent('search')
                    .addPathComponent('story')
                    .addPathComponent(query.title?.replace(/[^a-zA-Z0-9\s&'/-]/g, '')
                        .replace(/[\s&'/-]/g, '_')
                        .replace(/(__)/g,'')
                        .toLowerCase() ?? '')
                    .addQueryParameter('page', page)
                    .buildUrl(),
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            this.checkResponseError(response)

            const $ = this.cheerio.load(response.data as string)

            const collecedIds: string[] = []

            for (const manga of $('div.panel_story_list div.story_item').toArray()) {
                const mangaId = this.parser.idCleaner($('a', manga).attr('href') ?? '')
                const image = $('img', manga).first().attr('src') ?? ''
                const title = decodeHTML($('h3.story_name a', manga).first().text().trim() ?? '')
                const subtitle = decodeHTML($('h3.story_name + em.story_chapter a', manga).text().trim() ?? '')

                if (!mangaId || !title || collecedIds.includes(mangaId)) continue
                results.push(App.createPartialSourceManga({
                    mangaId: mangaId,
                    image: image,
                    title: title,
                    subtitle: subtitle ? subtitle : 'No Chapters'
                }))
                collecedIds.push(mangaId)
            }
            metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        }

        return App.createPagedResults({
            results: results,
            metadata: metadata
        })
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        return App.createRequest({
            url: `${this.bypassPage || this.baseURL}/`,
            method: 'GET',
            headers: {
                'referer': `${this.baseURL}/`,
                'origin': `${this.baseURL}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        })
    }

    checkResponseError(response: Response): void {
        const status = response.status
        switch (status) {
            case 403:
            case 503:
                throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to the homepage of <${this.baseURL}> and press the cloud icon.`)
            case 404:
                throw new Error(`The requested page ${response.request.url} was not found!`)
        }
    }
}
