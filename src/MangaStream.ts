import {
    Chapter,
    ChapterDetails,
    HomeSection,
    LanguageCode,
    Manga,
    MangaUpdates,
    PagedResults, RequestHeaders,
    SearchRequest,
    Source, TagSection,

} from "paperback-extensions-common"

import { Parser, UpdatedManga } from './MangaStreamParser'

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
};
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
};
interface StatusTypes {
    ONGOING: string,
    COMPLETED: string
};

export abstract class MangaStream extends Source {
    /**
     * The URL of the website. Eg. https://mangadark.com without a trailing slash
     */
    abstract baseUrl: string

    /**
     * The language code which this source supports.
     */
    abstract languageCode: LanguageCode

    /**
     * Helps with CloudFlare for some sources, makes it worse for others; override with empty string if the latter is true
     */
    userAgentRandomizer: string = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/78.0${Math.floor(Math.random() * 100000)}`

    //----GENERAL SELECTORS----
    /**
     * The pathname between the domain and the manga.
     * Eg. https://mangadark.com/manga/mashle-magic-and-muscles the pathname would be "manga"
     * Default = "manga"
     */
    sourceTraversalPathName: string = "manga"

    /**
     * N/A.
     */
    hasAdvancedSearchPage: boolean = false

    /**
     * Fallback image if no image is present
     * Default = "https://i.imgur.com/GYUxEX8.png"
     */
    fallbackImage: string = "https://i.imgur.com/GYUxEX8.png"

    //----MANGA DETAILS SELECTORS----
    /**
     * The selector for alternative titles.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "b:contains(Alternative Titles)"
    */
    manga_selector_AlternativeTitles: string = "Alternative Titles"
    /**
     * The selector for authors.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "Author" (English)
    */
    manga_selector_author: string = "Author"
    /**
     * The selector for artists.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "Artist" (English)
    */
    manga_selector_artist: string = "Artist"

    manga_selector_status: string = "Status"

    manga_tag_selector_box: string = "span.mgen"

    manga_tag_TraversalPathName: string = "genres"
    /**
     * The selector for the manga status.
     * These can change depending on the language
     * Default = "ONGOING: "ONGOING", COMPLETED: "COMPLETED"
    */
    manga_StatusTypes: StatusTypes = {
        ONGOING: "ONGOING",
        COMPLETED: "COMPLETED"
    }


    //----DATE SELECTORS----
    /**
     * Enter the months for the website's language in correct order, case insensitive.
     * Default = English Translation
     */
    dateMonths: dateMonths = {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December"
    };
    /**
     * In this object, add the site's translations for the following time formats, case insensitive.
     * If the site uses "12 hours ago" or "1 hour ago", only adding "hour" will be enough since "hours" includes "hour".
     * Default =  English Translation
     */
    dateTimeAgo: TimeAgo = {
        now: ["less than an hour", "just now"],
        yesterday: ["yesterday"],
        years: ["year"],
        months: ["month"],
        weeks: ["week"],
        days: ["day"],
        hours: ["hour"],
        minutes: ["min"],
        seconds: ["second"]
    };
    //----CHAPTER SELECTORS----
    /**
     * The selector for the chapter box
     * This box contains all the chapter items
     * Default = "div#chapterlist.eplister"
    */
    chapter_selector_box: string = "div#chapterlist"
    /**
     * The selector for each individual chapter element
     * This is the element for each small box containing the chapter information
     * Default = "li"
    */
    chapter_selector_item: string = "li"

    //----TAGS SELECTORS----
    /**
     * The selector to select the subdirectory for the genre page
     * Eg. https://mangadark.com/genres/ needs this selector to be set to "/genres/"
     * Default = ""
    */
    tags_SubdirectoryPathName: string = ""
    /**
     * The selector to select the box with all the genres
     * Default = "ul.genre"
    */
    tags_selector_box: string = "ul.genre"
    /**
     * The selector to select each individual genre box
     * Default = "li"
    */
    tags_selector_item: string = "li"
    /**
     * The selector to select the label name
     * Some sites have a result number after the genre name, this selector allows you to filter this.
     * Default = ""
    */
    tags_selector_label: string = ""

    //----HOMESCREEN SELECTORS----
    /**
     * Enable or disable the "Popular Today" section on the homescreen
     * Some sites don't have this section on this homescreen, if they don't disable this.
     * Enabled Default = true
     * Selector Default = "h2:contains(Popular Today)"
    */
    homescreen_PopularToday_enabled: boolean = true
    homescreen_PopularToday_selector: string = "h2:contains(Popular Today)"

    homescreen_LatestUpdate_enabled: boolean = true
    homescreen_LatestUpdate_selector_box: string = "h2:contains(Latest Update)"
    homescreen_LatestUpdate_selector_item: string = "div.uta"

    homescreen_NewManga_enabled: boolean = true
    homescreen_NewManga_selector: string = "h3:contains(New Series)"

    homescreen_TopAllTime_enabled: boolean = true
    homescreen_TopAllTime_selector: string = "div.serieslist.pop.wpop.wpop-alltime"

    homescreen_TopMonthly_enabled: boolean = true
    homescreen_TopMonthly_selector: string = "div.serieslist.pop.wpop.wpop-monthly"

    homescreen_TopWeekly_enabled: boolean = true
    homescreen_TopWeekly_selector: string = "div.serieslist.pop.wpop.wpop-weekly"

    //----REQUEST MANAGER----
    requestManager = createRequestManager({
        requestsPerSecond: 2.5,
        requestTimeout: 15000,
    });

    parser = new Parser();

    getMangaShareUrl(mangaId: string): string {
        return `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`;
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
            method: 'GET',
            headers: this.constructHeaders({})
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        let $ = this.cheerio.load(response.data);

        return this.parser.parseMangaDetails($, mangaId, this);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/`,
            method: 'GET',
            headers: this.constructHeaders({})
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        let $ = this.cheerio.load(response.data);

        return this.parser.parseChapterList($, mangaId, this);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${chapterId}/`,
            method: 'GET',
            headers: this.constructHeaders({}),
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        return this.parser.parseChapterDetails(response.data, mangaId, chapterId);
    }

    async getTags(): Promise<TagSection[] | null> {
        const request = createRequestObject({
            url: `${this.baseUrl}/`,
            method: "GET",
            param: this.tags_SubdirectoryPathName
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);;
        return this.parser.parseTags($, this);
    }

    async searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        let page = metadata?.page ?? 0;
        const search = this.parser.generateSearch(query);
        const request = createRequestObject({
            url: `${this.baseUrl}/page/${page}/?s=`,
            method: "GET",
            param: search
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        const manga = this.parser.parseSearchResults($, this);
        metadata = !this.parser.isLastPage($, "search_request") ? { page: page + 1 } : undefined;

        return createPagedResults({
            results: manga,
            metadata
        });
    }

    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
        let page = 1;
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true,
        };

        while (updatedManga.loadMore) {
            const request = createRequestObject({
                url: `${this.baseUrl}/page/${page++}/`,
                method: "GET",
            });

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            updatedManga = this.parser.parseUpdatedManga($, time, ids, this)
            if (updatedManga.ids.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.ids
                }));
            }
        }

    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = createHomeSection({ id: 'popular_today', title: 'Popular Today', view_more: true });
        const section2 = createHomeSection({ id: 'latest_update', title: 'Latest Updates', view_more: true });
        const section3 = createHomeSection({ id: 'new_titles', title: 'New Titles', view_more: true });
        const section4 = createHomeSection({ id: 'top_alltime', title: 'Top All Time', view_more: false });
        const section5 = createHomeSection({ id: 'top_monthly', title: 'Top Monthly', view_more: false });
        const section6 = createHomeSection({ id: 'top_weekly', title: 'Top Weekly', view_more: false });

        const sections: any[] = [];
        if (this.homescreen_PopularToday_enabled) sections.push(section1);
        if (this.homescreen_LatestUpdate_enabled) sections.push(section2);
        if (this.homescreen_NewManga_enabled) sections.push(section3);
        if (this.homescreen_TopAllTime_enabled) sections.push(section4);
        if (this.homescreen_TopMonthly_enabled) sections.push(section5);
        if (this.homescreen_TopWeekly_enabled) sections.push(section6);

        const request = createRequestObject({
            url: `${this.baseUrl}/`,
            method: "GET",
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        this.parser.parseHomeSections($, sections, sectionCallback, this);
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
        let page: number = metadata?.page ?? 1;
        let param = "";
        switch (homepageSectionId) {
            case "new_titles":
                param = `/${this.sourceTraversalPathName}/?page=${page}&order=latest`;
                break;
            case "latest_update":
                param = `/${this.sourceTraversalPathName}/?page=${page}&order=update`;
                break;
            case "popular_today":
                param = `/${this.sourceTraversalPathName}/?page=${page}&order=popular`;
                break;
            default:
                return Promise.resolve(null);;
        }

        const request = createRequestObject({
            url: `${this.baseUrl}/`,
            method: "GET",
            param,
        });

        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);

        const manga = this.parser.parseViewMore($, this);
        metadata = !this.parser.isLastPage($, "view_more") ? { page: page + 1 } : undefined;
        return createPagedResults({
            results: manga,
            metadata
        });
    }

    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${this.baseUrl}/`,
            method: 'GET',
            headers: this.constructHeaders({})
        })
    }

    constructHeaders(headers: any, refererPath?: string): any {
        if (this.userAgentRandomizer !== '') {
            headers["user-agent"] = this.userAgentRandomizer;
        }
        headers["referer"] = `${this.baseUrl}${refererPath ?? ''}`;
        return headers;
    }

    globalRequestHeaders(): RequestHeaders {
        if (this.userAgentRandomizer !== '') {
            return {
                "referer": `${this.baseUrl}/`,
                "user-agent": this.userAgentRandomizer,
                "accept": "image/jpeg,image/png,image/*;q=0.8"
            }
        } else {
            return {
                "referer": `${this.baseUrl}/`,
                "accept": "image/jpeg,image/png,image/*;q=0.8"
            }
        }
    }

    CloudFlareError(status: any) {
        if (status == 503) {
            throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > \<\The name of this source\> and press Cloudflare Bypass');
        }
    }

}
