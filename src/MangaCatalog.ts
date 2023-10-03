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
    PartialSourceManga,
    HomeSectionType
} from '@paperback/types'

import { 
    parseChapterDetails, 
    parseChapters, 
    parseMangaDetails 
} from './MangaCatalogParser';

import { decodeHTMLEntity } from './MangaCatalogUtil';

const BASE_VERSION = '0.0.0'

export const getExportVersion = (EXTENSION_VERSION: string): string => {
    // Thanks to https://github.com/TheNetsky/
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class MangaCatalog implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    
    constructor(private cheerio: CheerioAPI) {}
    
    abstract baseUrl: string
    
    abstract sourceUrlList: string[]
    private mangas: PartialSourceManga[] = []

    mangaTitleSelector: string = "div.container > h1"
    mangaImageSelector: string = "div.flex > img"
    mangaDescriptionSelector: string = "div.text-text-muted"

    chaptersArraySelector: string = '.bg-bg-secondary.p-3.rounded.mb-3.shadow'
    chapterTitleSelector: string = 'a.text'
    chapterIdSelector: string = 'a.text'

    chapterImagesArraySelector: string = 'div.text-center'
    chapterImageSelector: string = 'img'
    chapterDateSelector: string = ''

    language = '🇬🇧'

    requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': `${this.baseUrl}/`,
                    }
                }
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    });

    getMangaShareUrl(mangaId: string): string { return `${this.baseUrl}/manga/${mangaId}` }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${this.baseUrl}/manga/${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseMangaDetails($, mangaId, this.mangaImageSelector, this.mangaTitleSelector, this.mangaDescriptionSelector)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${this.baseUrl}/manga/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        return parseChapters($, mangaId, this.chaptersArraySelector, this.chapterTitleSelector, this.chapterIdSelector, this.chapterDateSelector)
    }

   async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${this.baseUrl}/chapter/${chapterId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseChapterDetails($, mangaId, chapterId, this.chapterImagesArraySelector, this.chapterImageSelector)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const mainSection = App.createHomeSection({
            id: 'main',
            title: 'Manga',
            containsMoreItems: false,
            type: HomeSectionType.featured
        })

        await this.populateMangas()
    

        mainSection.items = this.mangas
        sectionCallback(mainSection)
    }
    
    async getSearchResults(query: SearchRequest, metadata: unknown): Promise<PagedResults> {
        
        await this.populateMangas()
        const searchedMangas: PartialSourceManga[] = []

        for(const manga of this.mangas){
            if(manga.title.toLowerCase().includes(query?.title?.toLowerCase() ?? "")){
                searchedMangas.push(
                    manga
                )
            }
        }
        return App.createPagedResults({
            results: searchedMangas,
            metadata
        })
    }
    
    getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        throw new Error('Method not implemented.');
    }

    private async populateMangas(){
        
        if(this.mangas.length == this.sourceUrlList.length) return
        this.mangas = []
        for(const sourceUrl of this.sourceUrlList){
            const request = App.createRequest({
                url: `${sourceUrl}`,
                method: 'GET'
            })
            
            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data as string)
            
            const title: string = decodeHTMLEntity($(this.mangaTitleSelector).text().trim());
            const image: string = $(this.mangaImageSelector).attr('src') ?? ""
            const id: string = sourceUrl.split('/')[4] ?? ""

            if(!(!title || !image || !id)){
                this.mangas.push(App.createPartialSourceManga({
                    image: image,
                    title: title,
                    mangaId: id,
                }))
            }
        }
        
    }
}