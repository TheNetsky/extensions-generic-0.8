/* eslint-disable linebreak-style */
import {
    Chapter,
    ChapterDetails,
    ChapterProviding,
    HomePageSectionsProviding,
    HomeSection,
    MangaProviding,
    PagedResults,
    PartialSourceManga,
    Request,
    Response,
    SearchRequest,
    SearchResultsProviding,
    SourceManga,
    TagSection
} from '@paperback/types'

import { MangaStreamParser } from './MangaStreamParser'
import { URLBuilder } from './UrlBuilder'
import {
    createHomeSection,
    DefaultHomeSectionData,
    getFilterTagsBySection,
    getIncludedTagBySection,
    HomeSectionData
} from './MangaStreamHelper'

interface TimeAgo {
    now: string[]
    yesterday: string[]
    years: string[]
    months: string[]
    weeks: string[]
    days: string[]
    hours: string[]
    minutes: string[]
    seconds: string[]
}

interface dateMonths {
    january: string
    february: string
    march: string
    april: string
    may: string
    june: string
    july: string
    august: string
    september: string
    october: string
    november: string
    december: string
}

interface StatusTypes {
    ONGOING: string
    COMPLETED: string
}

// Set the version for the base, changing this version will change the versions of all sources
const BASE_VERSION = '2.2.0'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.')
                       .map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index]))
                       .join('.')
}

export abstract class MangaStream implements ChapterProviding, HomePageSectionsProviding, MangaProviding, SearchResultsProviding {
    constructor(public cheerio: CheerioAPI) {
        this.configureSections()
    }

    stateManager = App.createSourceStateManager()
    parser = new MangaStreamParser()

    // ----REQUEST MANAGER----
    requestManager = App.createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}), ...{
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                        referer: `${this.baseUrl}/`, ...((request.url.includes('wordpress.com') || request.url.includes('wp.com')) && {
                            Accept: 'image/avif,image/webp,*/*'
                        }) // Used for images hosted on Wordpress blogs
                    }
                }

                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                this.interceptResponse(response)
                return response
            }
        }
    })

    interceptResponse(response: Response): void {
    }

    /**
     * The URL of the website. Eg. https://mangadark.com without a trailing slash
     */
    abstract baseUrl: string

    /**
     * The language code which this source supports.
     */
    abstract language: string

    // ----GENERAL SELECTORS----

    /**
     * The pathname between the domain and the manga.
     * Eg. https://mangadark.com/manga/mashle-magic-and-muscles the pathname would be "manga"
     * Default = "manga"
     */
    sourceTraversalPathName = 'manga'

    /**
     * Fallback image if no image is present
     * Default = "https://i.imgur.com/GYUxEX8.png"
     */
    fallbackImage = 'https://i.imgur.com/GYUxEX8.png'

    /**
     * Some websites have the Cloudflare defense check enabled on specific parts of the website, these need to be loaded when using the Cloudflare bypass within the app
     */
    bypassPage = ''

    /**
     * If it's not possible to use postIds for certain reasons, you can disable this here.
     */
    usePostIds = true

    // ----MANGA DETAILS SELECTORS----
    /**
     * The selector for alternative titles.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "b:contains(Alternative Titles)"
     */
    manga_selector_AlternativeTitles = 'Alternative Titles'
    /**
     * The selector for authors.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "Author" (English)
     */
    manga_selector_author = 'Author'
    /**
     * The selector for artists.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "Artist" (English)
     */
    manga_selector_artist = 'Artist'

    manga_selector_status = 'Status'

    manga_tag_selector_box = 'span.mgen'

    /**
     * The selector for the manga status.
     * These can change depending on the language
     * Default = "ONGOING: "ONGOING", COMPLETED: "COMPLETED"
     */
    manga_StatusTypes: StatusTypes = {
        ONGOING: 'ONGOING',
        COMPLETED: 'COMPLETED'
    }

    // ----DATE SELECTORS----
    /**
     * Enter the months for the website's language in correct order, case insensitive.
     * Default = English Translation
     */
    dateMonths: dateMonths = {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
    }

    /**
     * In this object, add the site's translations for the following time formats, case insensitive.
     * If the site uses "12 hours ago" or "1 hour ago", only adding "hour" will be enough since "hours" includes "hour".
     * Default =  English Translation
     */
    dateTimeAgo: TimeAgo = {
        now: [
            'less than an hour',
            'just now'
        ],
        yesterday: ['yesterday'],
        years: ['year'],
        months: ['month'],
        weeks: ['week'],
        days: ['day'],
        hours: ['hour'],
        minutes: ['min'],
        seconds: ['second']
    }

    // ----HOMESCREEN SELECTORS----
    /**
     * Enable or disable the "Popular Today" section on the homescreen
     * Some sites don't have this section on this homescreen, if they don't disable this.
     * Enabled Default = true
     * Selector Default = "h2:contains(Popular Today)"
     */

    configureSections(): void {
    }

    sections: Record<string, HomeSectionData> = {
        'popular_today': {
            ...DefaultHomeSectionData,
            section: createHomeSection('popular_today', 'Popular Today'),
            selectorFunc: ($: CheerioStatic) => $('div.bsx', $('h2:contains(Popular Today)')?.parent()?.next()),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('a', element).attr('title'),
            subtitleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('div.epxs', element).text().trim(),
            getViewMoreItemsFunc: (page: string) => `${this.sourceTraversalPathName}/?page=${page}&order=popular`,
            sortIndex: 10
        },
        'latest_update': {
            ...DefaultHomeSectionData,
            section: createHomeSection('latest_update', 'Latest Updates'),
            selectorFunc: ($: CheerioStatic) => $('div.uta', $('h2:contains(Latest Update)')?.parent()?.next()),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('a', element).attr('title'),
            subtitleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('li > span', $('div.luf', element)).first().text().trim(),
            getViewMoreItemsFunc: (page: string) => `${this.sourceTraversalPathName}/?page=${page}&order=update`,
            sortIndex: 20
        },
        'new_titles': {
            ...DefaultHomeSectionData,
            section: createHomeSection('new_titles', 'New Titles'),
            selectorFunc: ($: CheerioStatic) => $('li', $('h3:contains(New Series)')?.parent()?.next()),
            getViewMoreItemsFunc: (page: string) => `${this.sourceTraversalPathName}/?page=${page}&order=latest`,
            sortIndex: 30
        },
        'top_alltime': {
            ...DefaultHomeSectionData,
            section: createHomeSection('top_alltime', 'Top All Time', false),
            selectorFunc: ($: CheerioStatic) => $('li', $('div.serieslist.pop.wpop.wpop-alltime')),
            sortIndex: 40
        },
        'top_monthly': {
            ...DefaultHomeSectionData,
            section: createHomeSection('top_monthly', 'Top Monthly', false),
            selectorFunc: ($: CheerioStatic) => $('li', $('div.serieslist.pop.wpop.wpop-monthly')),
            sortIndex: 50
        },
        'top_weekly': {
            ...DefaultHomeSectionData,
            section: createHomeSection('top_weekly', 'Top Weekly', false),
            selectorFunc: ($: CheerioStatic) => $('li', $('div.serieslist.pop.wpop.wpop-weekly')),
            sortIndex: 60
        }
    }

    getMangaShareUrl(mangaId: string): string {
        return this.usePostIds
               ? `${this.baseUrl}/?p=${mangaId}/`
               : `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`
    }

    getMangaData = async (mangaId: string): Promise<CheerioStatic> => await this.loadRequestData(this.getMangaShareUrl(mangaId))

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const $ = await this.getMangaData(mangaId)
        return this.parser.parseMangaDetails($, mangaId, this)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const $ = await this.getMangaData(mangaId)
        return await this.parser.parseChapterList($, mangaId, this)
    }

    async getChapterSlug(mangaId: string, chapterId: string): Promise<string> {
        const chapterKey = `${mangaId}:${chapterId}`
        let existingMappedChapterLink = await this.stateManager.retrieve(chapterKey)
        // If the Chapter List wasn't retrieved since the app was opened, retrieve it first and initialize it for all chapters
        if (existingMappedChapterLink == null) {
            await this.getChapters(mangaId)
        }

        existingMappedChapterLink = await this.stateManager.retrieve(chapterKey)
        if (existingMappedChapterLink == null) {
            throw new Error(`Could not parse out Chapter Link when getting chapter details for postId: ${mangaId} chapterId: ${chapterId}`)
        }

        return existingMappedChapterLink
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        let chapterLink: string = await this.getChapterSlug(mangaId, chapterId)
        const $ = await this.loadRequestData(`${this.baseUrl}/${chapterLink}/`)
        return this.parser.parseChapterDetails($, mangaId, chapterId)
    }

    async getSearchTags(): Promise<TagSection[]> {
        const $ = await this.loadRequestData(`${this.baseUrl}/${this.sourceTraversalPathName}`)
        return this.parser.parseTags($, this)
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        const request = await this.constructSearchRequest(page, query)
        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)
        const results = await this.parser.parseSearchResults($, this)

        const manga: PartialSourceManga[] = []
        for (const result of results) {
            let mangaId: string = result.slug
            if (this.usePostIds) {
                mangaId = await this.slugToPostId(result.slug, result.path)
            }

            manga.push(App.createPartialSourceManga({
                mangaId,
                image: result.image,
                title: result.title,
                subtitle: result.subtitle
            }))
        }

        metadata = !this.parser.isLastPage($, 'search_request')
                   ? { page: page + 1 }
                   : undefined

        return App.createPagedResults({
            results: manga,
            metadata
        })
    }

    async constructSearchRequest(page: number, query: SearchRequest): Promise<any> {
        let urlBuilder: URLBuilder = new URLBuilder(this.baseUrl)
        .addPathComponent(this.sourceTraversalPathName)
        .addQueryParameter('page', page.toString())

        if (query?.title) {
            urlBuilder = urlBuilder.addQueryParameter('s', encodeURIComponent(query?.title.replace(/[’–][a-z]*/g, '') ?? ''))
        } else {
            urlBuilder = urlBuilder
            .addQueryParameter('genre', getFilterTagsBySection('genres', query?.includedTags, true))
            .addQueryParameter('genre', getFilterTagsBySection('genres', query?.excludedTags, false, await this.supportsTagExclusion()))
            .addQueryParameter('status', getIncludedTagBySection('status', query?.includedTags))
            .addQueryParameter('type', getIncludedTagBySection('type', query?.includedTags))
            .addQueryParameter('order', getIncludedTagBySection('order', query?.includedTags))
        }

        return App.createRequest({
            url: urlBuilder.buildUrl({
                addTrailingSlash: true,
                includeUndefinedParameters: false
            }),
            method: 'GET'
        })
    }

    async supportsTagExclusion(): Promise<boolean> {
        return false
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const $ = await this.loadRequestData(`${this.baseUrl}/`)

        const promises: Promise<void>[] = []
        const sectionValues = Object.values(this.sections).sort((n1, n2) => n1.sortIndex - n2.sortIndex)
        for (const section of sectionValues) {
            if (!section.enabled) {
                continue
            }
            // Let the app load empty sections
            sectionCallback(section.section)
        }

        for (const section of sectionValues) {
            if (!section.enabled) {
                continue
            }

            promises.push(new Promise(async () => {
                section.section.items = await this.parser.parseHomeSection($, section, this)
                sectionCallback(section.section)
            }))
        }

        // Make sure the function completes
        await Promise.all(promises)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        let param = this.sections[homepageSectionId]!.getViewMoreItemsFunc(page) ?? undefined
        if (!param) {
            throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }

        const $ = await this.loadRequestData(`${this.baseUrl}/${param}`)

        const items: PartialSourceManga[] = await this.parser.parseViewMore($, this)
        metadata = !this.parser.isLastPage($, 'view_more')
                   ? { page: page + 1 }
                   : undefined
        return App.createPagedResults({
            results: items,
            metadata
        })
    }

    async slugToPostId(slug: string, path: string): Promise<string> {
        if ((await this.stateManager.retrieve(slug)) == null) {
            const postId = await this.convertSlugToPostId(slug, path)

            const existingMappedSlug = await this.stateManager.retrieve(postId)
            if (existingMappedSlug != null) {
                await this.stateManager.store(slug, undefined)
            }

            await this.stateManager.store(postId, slug)
            await this.stateManager.store(slug, postId)
        }

        const postId = await this.stateManager.retrieve(slug)
        if (!postId) {
            throw new Error(`Unable to fetch postId for slug:${slug}`)
        }

        return postId
    }

    async convertPostIdToSlug(postId: number): Promise<any> {
        const $ = await this.loadRequestData(`${this.baseUrl}/?p=${postId}`)

        let parseSlug: any
        // Step 1: Try to get slug from og-url
        parseSlug = String($('meta[property="og:url"]').attr('content'))

        // Step 2: Try to get slug from canonical
        if (!parseSlug.includes(this.baseUrl)) {
            parseSlug = String($('link[rel="canonical"]').attr('href'))
        }

        if (!parseSlug || !parseSlug.includes(this.baseUrl)) {
            throw new Error('Unable to parse slug!')
        }

        parseSlug = parseSlug.replace(/\/$/, '').split('/')

        const slug = parseSlug.slice(-1).pop()
        const path = parseSlug.slice(-2).shift()

        return {
            path,
            slug
        }
    }

    async convertSlugToPostId(slug: string, path: string): Promise<string> {
        // Credit to the MadaraDex team :-D
        const headRequest = App.createRequest({
            url: `${this.baseUrl}/${path}/${slug}/`,
            method: 'HEAD'
        })
        const headResponse = await this.requestManager.schedule(headRequest, 1)
        this.CloudFlareError(headResponse.status)

        let postId: any

        const postIdRegex = headResponse?.headers.Link?.match(/\?p=(\d+)/)
        if (postIdRegex?.[1]) {
            postId = postIdRegex[1]
        }

        if (postId || !isNaN(Number(postId))) {
            return postId?.toString()
        }

        const $ = await this.loadRequestData(`${this.baseUrl}/${path}/${slug}/`)

        // Step 1: Try to get postId from shortlink
        postId = Number($('link[rel="shortlink"]')?.attr('href')?.split('/?p=')[1])

        // Step 2: If no number has been found, try to parse from data-id
        if (isNaN(postId)) {
            postId = Number($('div.bookmark').attr('data-id'))
        }

        // Step 3: If no number has been found, try to parse from manga script
        if (isNaN(postId)) {
            const page = $.root().html()
            const match = page?.match(/postID.*\D(\d+)/)
            if (match != null && match[1]) {
                postId = Number(match[1]?.trim())
            }
        }

        if (!postId || isNaN(postId)) {
            throw new Error(`Unable to fetch numeric postId for this item! (path:${path} slug:${slug})`)
        }

        return postId.toString()
    }

    async loadRequestData(url: string, method: string = 'GET'): Promise<CheerioStatic> {
        const request = App.createRequest({
            url,
            method
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        return this.cheerio.load(response.data as string)
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

    CloudFlareError(status: any): void {
        if (status > 400) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass')
        }
    }
}