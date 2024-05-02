import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    PagedResults,
    Request,
    Response,
    SourceIntents,
    SearchResultsProviding,
    ChapterProviding,
    MangaProviding,
    HomePageSectionsProviding,
    HomeSectionType,
    TagSection,
    RequestManager
} from '@paperback/types'

import { HeanCmsParser } from './HeanCmsParser'

import { 
    ChapterDetailDto,
    ChapterListDto, 
    HeanCmsMetadata
} from './HeanCmsDto'

const BASE_VERSION = '0.8.2'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}
export const getExportDesciption = (BASE_URL: string): string => {
    return `Extension that pulls manga from ${BASE_URL}` 
}

export const BaseSourceInfo = {
    author: 'YvesPa',
    authorWebsite: 'http://github.com/YvesPa',
    icon: 'icon.png',
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export abstract class HeanCms implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    baseUrl: string
    apiUrl: string
    mangaSubdivision: string
    requestManager!: RequestManager
    rateLimit: number
    useChapterQuery: boolean
    useGenres: boolean


    constructor(
        baseUrl: string,
        init = true
    ){
        this.baseUrl = baseUrl
        this.apiUrl = baseUrl.replace('://', '://api.')
        this.mangaSubdivision = 'series'
        this.rateLimit = 2
        this.useChapterQuery = true
        this.useGenres = true

        if (init)
            this.init()
    }

    init(){
        this.requestManager = App.createRequestManager({
            requestsPerSecond: this.rateLimit,
            requestTimeout: 20000,
            interceptor: {
                interceptRequest: async (request: Request): Promise<Request> => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        'Referer': this.baseUrl + '/',
                        'Origin': this.baseUrl,
                        'user-agent': await this.requestManager.getDefaultUserAgent()
                    }
                    return request
                },
                interceptResponse: async (response: Response): Promise<Response> => {
                    return response
                }
            }
        })
    }

    async ExecRequest<TJson, TResult>(
        infos: { url: string, headers?: Record<string, string>, param?: string}, 
        parseMethods: (_: TJson) => TResult) : Promise<TResult> 
    {
        const request = App.createRequest({ ...infos, method: 'GET'})
        const response = await this.requestManager.schedule(request, 1)
        const data = JSON.parse(response.data as string) as TJson
        return parseMethods.call(HeanCmsParser, data)
    }

    getMangaShareUrl(mangaId: string): string {
        const slug = HeanCmsParser.convertMangaIdToSlug(mangaId)
        return `${this.baseUrl}/${this.mangaSubdivision}/${slug}`
    }

    getMangaDetails(mangaId: string): Promise<SourceManga> {
        return this.ExecRequest(
            {url: `${this.apiUrl}/${this.mangaSubdivision}/id/${HeanCmsParser.convertMangaIdToId(mangaId)}`},
            HeanCmsParser.parseDetails
        )
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        if (this.useChapterQuery)
            return this.getChaptersForChapterQuery(mangaId)
        else
            return this.getChaptersForMangaQuery(mangaId)
    }

    async getChaptersForChapterQuery(mangaId: string): Promise<Chapter[]> {
        const chapters : Chapter[] = []
        const params = { page: 1, perPage: 500, series_id: HeanCmsParser.convertMangaIdToId(mangaId) }
        let hasMore = false

        do {
            const result = await this.ExecRequest(
                { 
                    url: `${this.apiUrl}/chapter/query`,
                    param: this.paramsToString(params) 
                },
                (data: ChapterListDto) => HeanCmsParser.parseChaptersList(data, params.page))

            chapters.push(...result.chapters)
            params.page++
            hasMore = result.hasMore
        } while (hasMore)
        
        return chapters
    }
    
    async getChaptersForMangaQuery(mangaId: string): Promise<Chapter[]> {
        return this.ExecRequest(
            {url: `${this.apiUrl}/${this.mangaSubdivision}/id/${HeanCmsParser.convertMangaIdToId(mangaId)}`},
            HeanCmsParser.parseChapterFromMangaDetails
        )
    }

    getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return this.ExecRequest(
            { url: `${this.apiUrl}/chapter/${HeanCmsParser.convertMangaIdToSlug(mangaId)}/${chapterId}` },
            (data: ChapterDetailDto) => HeanCmsParser.parseChapterDetails(data, mangaId, chapterId)
        )
    }

    getCarouselTitles(): Promise<PagedResults> {
        return this.ExecRequest(
            { url: `${this.apiUrl}/series/banners` }, 
            HeanCmsParser.parseCarouselTitles)
    }

    getLatestReleasesTitles(metadata?: HeanCmsMetadata | undefined): Promise<PagedResults> {
        const param = { order: 'desc', orderBy: 'latest' }
        return this.getTitles(param, metadata)
    }

    getDailyTitles(metadata?: HeanCmsMetadata | undefined): Promise<PagedResults> {
        const param = { order: 'desc', orderBy: 'day_views' }
        return this.getTitles(param, metadata)
    }

    getMostViewedTitles(metadata?: HeanCmsMetadata | undefined): Promise<PagedResults> {
        const param = { order: 'desc', orderBy: 'latest' }
        return this.getTitles(param, metadata)
    }

    getTitles(queryParams: Record<string, unknown>,
        metadata?: HeanCmsMetadata | undefined) : Promise<PagedResults>
    {
        if (metadata && metadata.current_page === metadata.last_page) 
            return Promise.resolve<PagedResults>(App.createPagedResults({}))

        const params = {
            ...queryParams,
            adult: true,
            page: (metadata?.current_page ?? 0) + 1,
            per_page: metadata?.per_page ?? 10
        }

        return this.ExecRequest(
            {
                url: `${this.apiUrl}/query`,
                param: this.paramsToString(params)
            },
            HeanCmsParser.parseSearchResults)
    }

    getSearchResults(query: SearchRequest, metadata: HeanCmsMetadata | undefined): Promise<PagedResults> {
        const params = { 
            query_string: query?.title ?? '', 
            tags_ids: `[${(query?.includedTags.map(a => a.id) ?? []).join(',')}]`
        }
        return this.getTitles(params, metadata)

    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections : {request: Promise<PagedResults>, section: HomeSection}[] = 
        [
            {
                request: this.getCarouselTitles(),
                section: App.createHomeSection({
                    id: 'test',
                    title: 'test',
                    containsMoreItems: true,
                    type: HomeSectionType.featured
                })
            },
            {
                request: this.getLatestReleasesTitles(),
                section: App.createHomeSection({
                    id: 'latest_releases',
                    title: 'Our latest releases on comics',
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal
                })
            },
            {
                request: this.getDailyTitles(),
                section: App.createHomeSection({
                    id: 'daily',
                    title: 'Daily trending',
                    containsMoreItems: true,
                    type: HomeSectionType.singleRowNormal
                })
            },
            {
                request: this.getMostViewedTitles(),
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
        return this.useGenres 
            ? [ 
                App.createTagSection({
                    id: '0', 
                    label: 'genres', 
                    tags: await this.ExecRequest(
                        {url: `${this.apiUrl}/tags` }, 
                        HeanCmsParser.parseGenres) 
                })
            ]
            : []
    }

    getViewMoreItems(homepageSectionId: string, metadata: HeanCmsMetadata | undefined): Promise<PagedResults> {
        switch (homepageSectionId) {        
            case 'latest_releases':
                return  this.getLatestReleasesTitles(metadata)
            case 'daily':
                return  this.getDailyTitles(metadata)
            case 'most_viewed':
                return  this.getMostViewedTitles(metadata)
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }
    }

    paramsToString = (params: Record<string, unknown>): string => {
        return '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    } 
}
