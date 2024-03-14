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
    HomeSectionType
} from '@paperback/types'

import { Parser } from './MangaCatalogParser'
import {
    SourceBase,
    SourceBaseData
} from './MangaCatalogInterface'

const BASE_VERSION = '1.1.0'

export const getExportVersion = (EXTENSION_VERSION: string): string => {
    // Thanks to https://github.com/TheNetsky/
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class MangaCatalog implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(private cheerio: CheerioAPI) { }

    abstract baseUrl: string

    abstract iconUrl: string

    abstract baseSourceList: SourceBase[]

    private sourceData: SourceBaseData[] = [] // Store the manga 

    mangaTitleSelector = 'div.container > h1'
    mangaDescriptionSelector = 'div.text-text-muted'

    chaptersArraySelector = 'div.col-span-4'
    chapterTitleSelector = 'a.text'
    chapterIdSelector = 'a.text'

    chapterImagesArraySelector = 'div.my-3'
    chapterImageSelector = 'img'
    chapterDateSelector = ''

    language = '🇬🇧'

    parser = new Parser()

    requestManager = App.createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${this.baseUrl}/`
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

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${this.baseUrl}/manga/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseMangaDetails($, mangaId, this)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${this.baseUrl}/manga/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseChapters($, mangaId, this)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${this.baseUrl}/chapter/${chapterId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseChapterDetails($, mangaId, chapterId, this)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        await this.populateMangaList()

        for (const source of this.sourceData) {
            const secion = App.createHomeSection({
                id: source.data.title,
                title: source.data.title,
                containsMoreItems: true,
                type: HomeSectionType.singleRowNormal
            })

            secion.items = [source.items]
            sectionCallback(secion)
        }
    }

    async getSearchResults(query: SearchRequest, metadata: unknown): Promise<PagedResults> {
        await this.populateMangaList()

        const results = this.sourceData.map(x => x.items).filter(x => {
            const title = x.title.toLowerCase()
            const queryTitle = (query?.title || '').toLowerCase()

            return title.includes(queryTitle)
        })

        return App.createPagedResults({
            results: results,
            metadata: undefined
        })
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        await this.populateMangaList()

        return App.createPagedResults({
            results: this.sourceData.map(x => x.items),
            metadata: undefined
        })
    }

    // Populate the "SourceBaseData" array
    async populateMangaList(): Promise<SourceBaseData[]> {
        // If the list is already populated, return list
        if (this.sourceData.length == this.baseSourceList.length) {
            return this.sourceData
        }

        const fetchPromises: Promise<void>[] = []

        for (const source of this.baseSourceList) {
            const request = App.createRequest({
                url: source.url,
                method: 'GET'
            })

            const fetchPromise = this.requestManager.schedule(request, 1)
                .then(response => {
                    const $ = this.cheerio.load(response.data as string)
                    const title: string = this.parser.decodeHTMLEntity($(this.mangaTitleSelector).text().trim())
                    const id: string = source.url.split('/')[4] || ''

                    if (id && title) {
                        this.sourceData.push({
                            data: source,
                            items: App.createPartialSourceManga({
                                image: this.iconUrl,
                                title: title,
                                mangaId: id
                            })
                        })
                    }
                }).catch(error => {
                    throw new Error(error)
                })

            fetchPromises.push(fetchPromise)
        }

        await Promise.all(fetchPromises)

        return this.sourceData
    }
}