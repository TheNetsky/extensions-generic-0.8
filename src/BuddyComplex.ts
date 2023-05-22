import {
    Chapter,
    ChapterDetails,
    HomeSection,
    PagedResults,
    SearchRequest,
    SourceManga,
    TagSection,
    Request,
    Response,
    SearchResultsProviding,
    MangaProviding,
    ChapterProviding,
    HomeSectionType,
    HomePageSectionsProviding,
    Tag
} from '@paperback/types'

import {
    BuddyComplexParser
} from './BuddyComplexParser'

import { URLBuilder } from './BuddyComplexHelper'

// Set the version for the base, changing this version will change the versions of all sources
const BASE_VERSION = '2.0.2'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class BuddyComplex implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(public cheerio: CheerioAPI) { }

    //----REQUEST MANAGER----
    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                        'referer': `${this.baseUrl}/`
                    }
                }

                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    });

    /**
     * The URL of the website. Eg. https://mangafab.com without a trailing slash
     */
    abstract baseUrl: string

    parser = new BuddyComplexParser()


    getMangaShareUrl(mangaId: string): string {
        return `${this.baseUrl}/${mangaId}/`
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${this.baseUrl}/${mangaId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${this.baseUrl}/api/manga/${mangaId}/chapters?source=detail`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseChapterList($)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${this.baseUrl}/${mangaId}/${chapterId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseChapterDetails($, mangaId, chapterId)
    }


    async getSearchTags(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: `${this.baseUrl}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return this.parser.parseTags($)
    }


    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1

        const url = new URLBuilder(this.baseUrl)
            .addPathComponent('search')
            .addQueryParameter('page', page)
            .addQueryParameter('q', encodeURI(query?.title || ''))
            .buildUrl() + query.includedTags?.map((x: Tag) => `&genre%5B%5D=${x.id}`).join('')

        const request = App.createRequest({
            url: url,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)
        const manga = this.parser.parseViewMore($)
        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined

        return App.createPagedResults({
            results: manga,
            metadata
        })
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = App.createHomeSection({ id: 'hot_updates', title: 'Hot Updates', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section2 = App.createHomeSection({ id: 'latest_update', title: 'Latest Updates', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section3 = App.createHomeSection({ id: 'top_today', title: 'Top Today', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section4 = App.createHomeSection({ id: 'top_weekly', title: 'Top Weekly', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section5 = App.createHomeSection({ id: 'top_monthly', title: 'Top Monthly', type: HomeSectionType.singleRowNormal, containsMoreItems: true })

        const sections: HomeSection[] = [section1, section2, section3, section4, section5]

        const request = App.createRequest({
            url: `${this.baseUrl}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)
        this.parser.parseHomeSections($, sections, sectionCallback)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let param = ''
        switch (homepageSectionId) {
            case 'hot_updates':
                param = 'popular'
                break
            case 'latest_update':
                param = 'latest'
                break
            case 'top_today':
                param = 'top/day'
                break
            case 'top_weekly':
                param = 'top/week'
                break
            case 'top_monthly':
                param = 'top/month'
                break
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }

        const request = App.createRequest({
            url: `${this.baseUrl}/${param}?page=${page}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        const manga = this.parser.parseViewMore($)

        metadata = !this.parser.isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results: manga,
            metadata
        })
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
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


    CloudFlareError(status: number): Error | void {
        if (status == 503 || status == 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > ${this.baseUrl} and press Cloudflare Bypass`)
        }
    }

}