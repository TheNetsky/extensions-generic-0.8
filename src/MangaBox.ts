/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */

import {
    Chapter,
    ChapterDetails,
    ChapterProviding,
    DUISection,
    HomeSection,
    HomeSectionType,
    MangaProviding,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    Searchable,
    SourceManga,
    TagSection
} from '@paperback/types'

import {
    isLastPage,
    parseChapterDetails,
    parseChapters,
    parseMangaDetails,
    parseManga,
    parseTags
} from './MangaBoxParser'

import {
    chapterSettings,
    getImageServer,
} from './MangaBoxSettings'

import { URLBuilder } from './MangaBoxHelpers'

const BASE_VERSION = '4.0.1'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class MangaBox implements Searchable, MangaProviding, ChapterProviding {
    // Website base URL. Eg. https://manganato.com
    abstract baseURL: string

    // Language code supported by the source.
    abstract languageCode: string

    // Path for manga list. Eg. https://manganato.com/genre-all the path is 'genre-all'
    abstract mangaListPath: string

    // Selector for manga in manga list.
    abstract mangaListSelector: string

    // Selector for subtitle in manga list.
    abstract mangaSubtitleSelector: string

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
        + 'ul.manga-info-text li:contains(Author) a'

    // Selector for manga description.
    mangaDescSelector = 'div#panel-story-info-description, div#noidungm'

    // Selector for manga tags.
    mangaGenresSelector = 'div.story-info-right td:contains(Genre) + td a,'
        + 'ul.manga-info-text li:contains(Genres) a'

    // Selector for manga chapter list.
    chapterListSelector = 'div.panel-story-chapter-list ul.row-content-chapter li,'
        + 'div.manga-info-chapter div.chapter-list div.row'

    // Selector for manga chapter time updated.
    chapterTimeSelector = 'span.chapter-time, span'

    // Selector for manga chapter images.
    chapterImagesSelector = 'div.container-chapter-reader img'

    constructor(public cheerio: CheerioAPI) { }

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
        return App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            isHidden: false,
            rows: async () => [chapterSettings(this.stateManager)],
        })
    }

    getMangaShareUrl(mangaId: string): string { return `${mangaId}` }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            {
                request: App.createRequest({
                    url: new URLBuilder(this.baseURL)
                        .addPathComponent(this.mangaListPath)
                        .addQueryParameter('type', 'latest')
                        .buildUrl(),
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: 'latest',
                    title: 'Latest Updates',
                    type: HomeSectionType.singleRowLarge,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: new URLBuilder(this.baseURL)
                        .addPathComponent(this.mangaListPath)
                        .addQueryParameter('type', 'newest')
                        .buildUrl(),
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: 'newest',
                    title: 'New Titles',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: new URLBuilder(this.baseURL)
                        .addPathComponent(this.mangaListPath)
                        .addQueryParameter('type', 'topview')
                        .buildUrl(),
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: 'topview',
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
                        const $ = this.cheerio.load(response.data as string)
                        const items = parseManga($, this)
                        section.section.items = items
                        sectionCallback(section.section)
                    })
            )
        }
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseMangaDetails($, mangaId, this)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${mangaId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseChapters($, this)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const cookieDomainRegex = chapterId.match(/(.*.com\/).*$/g)
        const cookieDomain = cookieDomainRegex ? cookieDomainRegex[0] : this.baseURL
        const imageServer = await getImageServer(this.stateManager).then(value => value[0])

        const request = App.createRequest({
            url: `${chapterId}`,
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
        const $ = this.cheerio.load(response.data as string)
        return parseChapterDetails($, mangaId, chapterId, this)
    }

    async getViewMoreItems(homePageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent(`${this.mangaListPath}/${page}`)
                .addQueryParameter('type', homePageSectionId)
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        const results = parseManga($, this)

        metadata = !isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results: results,
            metadata: metadata
        })
    }

    async supportsTagExclusion(): Promise<boolean> {
        return true
    }

    async getSearchTags(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent('advanced_search')
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        return parseTags($, this)
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent('advanced_search')
                .addQueryParameter('keyw', query.title?.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ +/g, '_').toLowerCase() ?? '')
                .addQueryParameter('g_i', `_${query.includedTags?.map(t => t.id).join('_')}_`)
                .addQueryParameter('g_e', `_${query.excludedTags?.map(t => t.id).join('_')}_`)
                .addQueryParameter('page', page)
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        const results = parseManga($, this)

        metadata = !isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results: results,
            metadata: metadata
        })
    }
}
