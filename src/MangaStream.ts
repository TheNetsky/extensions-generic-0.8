/* eslint-disable linebreak-style */
import {
    Chapter,
    ChapterDetails,
    HomeSection,
    LanguageCode,
    Manga,
    MangaUpdates,
    PagedResults,
    SearchRequest,
    Source,
    TagSection,
    Request,
    Response
} from 'paperback-extensions-common'

import {
    MangaStreamParser,
    UpdatedManga
} from './MangaStreamParser'

interface TimeAgo {
    now: string[],
    yesterday: string[],
    years: string[],
    months: string[],
    weeks: string[],
    days: string[],
    hours: string[],
    minutes: string[],
    seconds: string[]
}
interface dateMonths {
    january: string,
    february: string,
    march: string,
    april: string,
    may: string,
    june: string,
    july: string,
    august: string,
    september: string,
    october: string,
    november: string,
    december: string
}
interface StatusTypes {
    ONGOING: string,
    COMPLETED: string
}


// Set the version for the base, changing this version will change the versions of all sources
const BASE_VERSION = '2.1.6'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class MangaStream extends Source {
    /**
     * The URL of the website. Eg. https://mangadark.com without a trailing slash
     */
    abstract baseUrl: string

    /**
     * The language code which this source supports.
     */
    abstract languageCode: LanguageCode

    //----GENERAL SELECTORS----
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
     * Sets the to be used UserAgent for requests
     */
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44'

    //----MANGA DETAILS SELECTORS----
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

    manga_tag_TraversalPathName = 'genres'
    /**
     * The selector for the manga status.
     * These can change depending on the language
     * Default = "ONGOING: "ONGOING", COMPLETED: "COMPLETED"
    */
    manga_StatusTypes: StatusTypes = {
        ONGOING: 'ONGOING',
        COMPLETED: 'COMPLETED'
    }


    //----DATE SELECTORS----
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
    };
    /**
     * In this object, add the site's translations for the following time formats, case insensitive.
     * If the site uses "12 hours ago" or "1 hour ago", only adding "hour" will be enough since "hours" includes "hour".
     * Default =  English Translation
     */
    dateTimeAgo: TimeAgo = {
        now: ['less than an hour', 'just now'],
        yesterday: ['yesterday'],
        years: ['year'],
        months: ['month'],
        weeks: ['week'],
        days: ['day'],
        hours: ['hour'],
        minutes: ['min'],
        seconds: ['second']
    };
    //----CHAPTER SELECTORS----
    /**
     * The selector for the chapter box
     * This box contains all the chapter items
     * Default = "div#chapterlist.eplister"
    */
    chapter_selector_box = 'div#chapterlist'
    /**
     * The selector for each individual chapter element
     * This is the element for each small box containing the chapter information
     * Default = "li"
    */
    chapter_selector_item = 'li'

    //----TAGS SELECTORS----
    /**
     * Use the Tag Label as Id (Some Sites dont have an Id for their Tags)
     * Default = false
     */
    tags_use_label_as_id = false
    /**
     * The selector to select the subdirectory for the genre page
     * Eg. https://mangadark.com/genres/ needs this selector to be set to "/genres/"
     * Default = ""
    */
    tags_SubdirectoryPathName = ''
    /**
     * The selector to select the box with all the genres
     * Default = "ul.genre"
    */
    tags_selector_box = 'ul.genre'
    /**
     * The selector to select each individual genre box
     * Default = "li"
    */
    tags_selector_item = 'li'
    /**
     * The selector to select the label name
     * Some sites have a result number after the genre name, this selector allows you to filter this.
     * Default = ""
    */
    tags_selector_label = ''

    //----HOMESCREEN SELECTORS----
    /**
     * Enable or disable the "Popular Today" section on the homescreen
     * Some sites don't have this section on this homescreen, if they don't disable this.
     * Enabled Default = true
     * Selector Default = "h2:contains(Popular Today)"
    */
    homescreen_PopularToday_enabled = true
    homescreen_PopularToday_selector = 'h2:contains(Popular Today)'

    homescreen_LatestUpdate_enabled = true
    homescreen_LatestUpdate_selector_box = 'h2:contains(Latest Update)'
    homescreen_LatestUpdate_selector_item = 'div.uta'

    homescreen_NewManga_enabled = true
    homescreen_NewManga_selector = 'h3:contains(New Series)'

    homescreen_TopAllTime_enabled = true
    homescreen_TopAllTime_selector = 'div.serieslist.pop.wpop.wpop-alltime'

    homescreen_TopMonthly_enabled = true
    homescreen_TopMonthly_selector = 'div.serieslist.pop.wpop.wpop-monthly'

    homescreen_TopWeekly_enabled = true
    homescreen_TopWeekly_selector = 'div.serieslist.pop.wpop.wpop-weekly'

    //----REQUEST MANAGER----
    requestManager = createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': this.userAgent,
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

    parser = new MangaStreamParser();

    override getMangaShareUrl(mangaId: string): string {
        return `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`
    }

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        return this.parser.parseMangaDetails($, mangaId, this)
    }

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)

        return this.parser.parseChapterList($, mangaId, this)
    }

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${chapterId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapterDetails($, mangaId, chapterId)
    }

    override async getSearchTags(): Promise<TagSection[]> {
        const request = createRequestObject({
            url: `${this.baseUrl}/`,
            method: 'GET',
            param: this.tags_SubdirectoryPathName
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseTags($, this)
    }

    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 1
        let request

        if (query.title) {
            request = createRequestObject({
                url: `${this.baseUrl}/page/${page}/?s=`,
                method: 'GET',
                param: encodeURI(query.title)
            })
        } else {
            request = createRequestObject({
                url: `${this.baseUrl}/`,
                method: 'GET',
                param: `genres/${query?.includedTags?.map((x: any) => x.id)[0]}/page/${page}`
            })
        }

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)
        const manga = this.parser.parseSearchResults($, this)
        metadata = !this.parser.isLastPage($, 'search_request') ? { page: page + 1 } : undefined

        return createPagedResults({
            results: manga,
            metadata
        })
    }

    override async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        let page = 1
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${this.baseUrl}/page/${page++}/`,
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            updatedManga = this.parser.parseUpdatedManga($, time, ids, this)
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }))
            }
        }

    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'popular_today', title: 'Popular Today', view_more: true })
        const section2 = createHomeSection({ id: 'latest_update', title: 'Latest Updates', view_more: true })
        const section3 = createHomeSection({ id: 'new_titles', title: 'New Titles', view_more: true })
        const section4 = createHomeSection({ id: 'top_alltime', title: 'Top All Time', view_more: false })
        const section5 = createHomeSection({ id: 'top_monthly', title: 'Top Monthly', view_more: false })
        const section6 = createHomeSection({ id: 'top_weekly', title: 'Top Weekly', view_more: false })

        const sections: any[] = []
        if (this.homescreen_PopularToday_enabled) sections.push(section1)
        if (this.homescreen_LatestUpdate_enabled) sections.push(section2)
        if (this.homescreen_NewManga_enabled) sections.push(section3)
        if (this.homescreen_TopAllTime_enabled) sections.push(section4)
        if (this.homescreen_TopMonthly_enabled) sections.push(section5)
        if (this.homescreen_TopWeekly_enabled) sections.push(section6)

        const request = createRequestObject({
            url: `${this.baseUrl}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data)
        this.parser.parseHomeSections($, sections, sectionCallback, this)
    }

    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let param = ''
        switch (homepageSectionId) {
            case 'new_titles':
                param = `/${this.sourceTraversalPathName}/?page=${page}&order=latest`
                break
            case 'latest_update':
                param = `/${this.sourceTraversalPathName}/?page=${page}&order=update`
                break
            case 'popular_today':
                param = `/${this.sourceTraversalPathName}/?page=${page}&order=popular`
                break
            default:
                throw new Error(`Invalid homeSectionId | ${homepageSectionId}`)
        }

        const request = createRequestObject({
            url: `${this.baseUrl}/`,
            method: 'GET',
            param
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = this.parser.parseViewMore($, this)
        metadata = !this.parser.isLastPage($, 'view_more') ? { page: page + 1 } : undefined
        return createPagedResults({
            results: manga,
            metadata
        })
    }

    override getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${this.baseUrl}/`,
            method: 'GET',
            headers: {
                'user-agent': this.userAgent
            }
        })
    }

    CloudFlareError(status: any) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > <The name of this source> and press Cloudflare Bypass')
        }
    }
}
