import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    ChapterProviding,
    MangaProviding,
    SearchResultsProviding,
    HomePageSectionsProviding,
    HomeSectionType,
    PartialSourceManga,
    TagSection,
    Tag
} from '@paperback/types'

import { Parser } from './LilianaParser'
import {DefaultHomeSectionData, HomeSectionData, URLBuilder, createHomeSection, getFilterTagsBySection, getIncludedTagBySection} from './LilianaHelper'

const BASE_VERSION = '1.0.0'

export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class Liliana implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    abstract baseUrl: string

    language = '🇬🇧'
    
    directoryPath = 'manga'
    
    usesPostSearch = false
    
    /**
     * Some websites have the Cloudflare defense check enabled on specific parts of the website, these need to be loaded when using the Cloudflare bypass within the app
     */

    bypassPage = ''
    
    homescreen_sections: Record<'trending' | 'latest' | 'daily' | 'weekly' | 'monthly', HomeSectionData> = {
        'trending': {
            ...DefaultHomeSectionData,
            section: createHomeSection('trending', 'Trending', false, HomeSectionType.featured),
            selectorFunc: ($: CheerioStatic) => $('#recommend .widget-content figure'),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('.block img', element).attr('alt')?.trim(),
            getImageFunc: ($: CheerioStatic, element: CheerioElement) => $('.block img', element),
            getIdFunc: ($: CheerioStatic, element: CheerioElement) => $('a.block', element).attr('href'),
            sortIndex: 10
        },
        'latest': {
            ...DefaultHomeSectionData,
            section: createHomeSection('latest', 'Latest', true, HomeSectionType.singleRowNormal),
            selectorFunc: ($: CheerioStatic) => $('#home-tab-update .full-i'),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('.block img', element).attr('alt')?.trim(),
            getImageFunc: ($: CheerioStatic, element: CheerioElement) => $('.block img', element),
            getIdFunc: ($: CheerioStatic, element: CheerioElement) => $('a.block', element).attr('href'),
            getViewMoreItemsFunc: (page: string) => `filter/${page}?sort=latest-updated`,
            sortIndex: 20
        },
        'daily': {
            ...DefaultHomeSectionData,
            section: createHomeSection('daily', 'Daily', true, HomeSectionType.singleRowNormal),
            selectorFunc: ($: CheerioStatic) => $('.listtop #series-day article'),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $(".item-thumbnail img", element).attr('alt')?.trim(),
            getImageFunc: ($: CheerioStatic, element: CheerioElement) => $('.item-thumbnail img', element),
            getIdFunc: ($: CheerioStatic, element: CheerioElement) => $('.item-thumbnail a', element).attr('href'),
            getViewMoreItemsFunc: (page: string) => `filter/${page}?sort=views_day`,
            sortIndex: 30
        },
        'weekly': {
            ...DefaultHomeSectionData,
            section: createHomeSection('weekly', 'Weekly', true, HomeSectionType.singleRowNormal),
            selectorFunc: ($: CheerioStatic) => $('.listtop #series-week article'),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $(".item-thumbnail img", element).attr('alt')?.trim(),
            getImageFunc: ($: CheerioStatic, element: CheerioElement) => $('.item-thumbnail img', element),
            getIdFunc: ($: CheerioStatic, element: CheerioElement) => $('.item-thumbnail a', element).attr('href'),
            getViewMoreItemsFunc: (page: string) => `filter/${page}?sort=views_week`,
            sortIndex: 40
        },
        'monthly': {
            ...DefaultHomeSectionData,
            section: createHomeSection('monthly', 'Monthly', true, HomeSectionType.singleRowNormal),
            selectorFunc: ($: CheerioStatic) => $('.listtop #series-month article.grid'),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $(".item-thumbnail img", element).attr('alt')?.trim(),
            getImageFunc: ($: CheerioStatic, element: CheerioElement) => $('.item-thumbnail img', element),
            getIdFunc: ($: CheerioStatic, element: CheerioElement) => $('.item-thumbnail a', element).attr('href'),
            getViewMoreItemsFunc: (page: string) => `filter/${page}?sort=views_month`,
            sortIndex: 50
        },
    }

    parser = new Parser()

    requestManager = App.createRequestManager({
        requestsPerSecond: 10,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                if(request.url.includes('https://intercept.me/')) {
                    const url = request.url.replace('https://intercept.me/', '')
                    request.url = url
                    request.headers = {
                        ...(request.headers ?? {}),
                        ...{
                            'Accept': `image/avif,image/webp,*/*`
                        }
                    }
                } else {
                    request.headers = {
                        ...(request.headers ?? {}),
                        ...{
                            'referer': `${this.baseUrl}/`
                        }
                    }
                }

                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })

    getMangaShareUrl(mangaId: string): string { return `${this.baseUrl}/manga/${mangaId}` }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const request = App.createRequest({
            url: `${this.baseUrl}`,
            method: 'GET'
        })
        
        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)
        const promises: Promise<void>[] = []
        const sectionValues = Object.values(this.homescreen_sections).sort((n1, n2) => n1.sortIndex - n2.sortIndex)

        for (const section of sectionValues) {
            if (!section.enabled) {
                continue
            }

            // eslint-disable-next-line no-async-promise-executor
            promises.push(new Promise(() => {
                section.section.items = this.parser.parseHomeSection($, section, this)
                sectionCallback(section.section)
            }))
        }

        // Make sure the function completes
        await Promise.all(promises)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const param = this.homescreen_sections[homepageSectionId].getViewMoreItemsFunc(page) ?? undefined
        if (!param) {
            throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }

        const request = App.createRequest({
            url: `${this.baseUrl}/${param}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        const items: PartialSourceManga[] = await this.parser.parseSearchResults($, this)
        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results: items,
            metadata
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        if (query?.title && this.usesPostSearch) {
            const request =  App.createRequest({
                url: `${this.baseUrl}/ajax/search`,
                method: 'POST',
                headers: {
                   'Accept': 'application/json, text/javascript, */*; q=0.01',
                   'Origin': this.baseUrl,
                   'X-Requested-With': 'XMLHttpRequest',
                   'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    search: query?.title   
                }
            })

            const response = await this.requestManager.schedule(request, 1)
            this.checkResponseError(response)
            const data = JSON.parse(response?.data ?? '{}') 
            const results = this.parser.parseJSONSearchResults(data, this)
            
            return App.createPagedResults({
                results,
                metadata
            })
        }
        
        const detail_tag = query?.includedTags?.find((x: Tag) => x.id.startsWith(`manga_genres:`))?.id.replace(`manga_genres:`, '')
        if(detail_tag) {
            let urlBuilder: URLBuilder = new URLBuilder(this.baseUrl)
            .addPathComponent('genres')
            .addPathComponent(detail_tag)
            .addPathComponent(page.toString())
            
            const request = App.createRequest({
                url: decodeURI(urlBuilder.buildUrl({ addTrailingSlash: true, includeUndefinedParameters: false })),
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            this.checkResponseError(response)
            const $ = this.cheerio.load(response.data as string)
            const results = await this.parser.parseSearchResults($, this)
    
            metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
            return App.createPagedResults({
                results,
                metadata
            })
        }

        const request = await this.constructSearchRequest(page, query)

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)
        const results = await this.parser.parseSearchResults($, this)

        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results,
            metadata
        })
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${this.baseUrl}/${this.directoryPath}/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseMangaDetails($, mangaId, this)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${this.baseUrl}/${this.directoryPath}/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseChapters($, mangaId, this)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${this.baseUrl}/${this.directoryPath}/${mangaId}/${chapterId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)

        const cID = response.data?.match(/const CHAPTER_ID\s*=\s*(\d+)/gi)?.[0].replace(/const chapter_id = /gi, '')

        const ajaxRequest = App.createRequest({
            url: `${this.baseUrl}/ajax/image/list/chap/${cID}`,
            method: 'GET'
        })
        const ajaxResponse = await this.requestManager.schedule(ajaxRequest, 1)

        const ajaxData = JSON.parse(ajaxResponse?.data ?? '{}')

        const $ = this.cheerio.load(ajaxData.html)

        return this.parser.parseChapterDetails($, mangaId, chapterId, this)
    }

    async getSearchTags(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: `${this.baseUrl}/filter`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseTags($)
    }

    async constructSearchRequest(page: number, query: SearchRequest): Promise<any> {


        if (query?.title) {
            let urlBuilder: URLBuilder = new URLBuilder(this.baseUrl)
            .addPathComponent('search')
            .addPathComponent(page.toString())
            urlBuilder = urlBuilder.addQueryParameter('keyword', encodeURIComponent(query?.title.replace(/[’–][a-z]*/g, '') ?? ''))
        
        return App.createRequest({
            url: urlBuilder.buildUrl({ addTrailingSlash: true, includeUndefinedParameters: false }),
            method: 'GET'
        })
        } else {
            let urlBuilder: URLBuilder = new URLBuilder(this.baseUrl)
            .addPathComponent('filter')
            .addPathComponent(page.toString())
            urlBuilder = urlBuilder
                .addQueryParameter('genres', getFilterTagsBySection('genres', query?.includedTags, true))
                .addQueryParameter('notGenres', getFilterTagsBySection('genres', query?.excludedTags, true, await this.supportsTagExclusion()))
                .addQueryParameter('type', getIncludedTagBySection('type', query?.includedTags))
                .addQueryParameter('count', getIncludedTagBySection('count', query?.includedTags))
                .addQueryParameter('status', getIncludedTagBySection('status', query?.includedTags))
                .addQueryParameter('gender', getIncludedTagBySection('gender', query?.includedTags))
                .addQueryParameter('sort', getIncludedTagBySection('sort', query?.includedTags))

            return App.createRequest({
                url: decodeURI(urlBuilder.buildUrl({ addTrailingSlash: true, includeUndefinedParameters: false })),
                method: 'GET'
            })
        }
    }

    async supportsTagExclusion(): Promise<boolean> {
        return true
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        return App.createRequest({
            url: `${this.bypassPage || this.baseUrl}/`,
            method: 'GET',
            headers: {
                'referer': `${this.baseUrl}/`,
                'origin': `${this.baseUrl}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        })
    }

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
}