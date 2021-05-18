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
    sourceTraversalPathName: string = 'manga'

    /**
     * N/A.
     */
    hasAdvancedSearchPage: boolean = false

    //----MANGA DETAILS SELECTORS----
    /**
     * The selector for alternative titles.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "b:contains(Alternative Titles)"
    */
    mangaAlternativeTitlesSelector: string = "b:contains(Alternative Titles)"
    /**
     * The selector for alternative titles.
     * This can change depending on the language
     * Leave default if not used!
     * Default = "b:contains(Author)"
    */
    mangaAuthorSelector: string = "b:contains(Author)"

    //----CHAPTER SELECTORS----
    /**
     * The selector for the chapter box
     * This box contains all the chapter items
     * Default = "div#chapterlist.eplister"
    */
    chapterBoxSelector: string = "div#chapterlist.eplister"
    /**
     * The selector for each individual chapter element
     * This is the element for each small box containing the chapter information
     * Default = "li"
    */
    chapterElementSelector: string = "li"

    //----TAGS SELECTORS----
    /**
     * The selector to select the subdirectory for the genre page
     * Eg. https://mangadark.com/genres/ needs this selector to be set to "/genres/"
     * Default = ""
    */
    tagsSubdirectoryPathName: string = ""
    /**
     * The selector to select the box with all the genres
     * Default = "ul.genre"
    */
    tagsBoxSelector: string = "ul.genre"
    /**
     * The selector to select each individual genre boxes
     * Default = "li"
    */
    tagsElementSelector: string = "li"
    /**
     * The selector to select the label name
     * Some sites have a result number after the genre name, this selector allows you to filter this.
     * Default = ""
    */
    tagsLabelSelector: string = ""

    //----HOMESCREEN SELECTORS----
    /**
     * Enable or disable the "Popular Today" section on the homescreen
     * Some sites don't have this section on this homescreen, if they don't disable this.
     * Default = true
    */
    homescreenPopularTodayEnabled: boolean = true
    /**
     * The selector for the "Popular Today" section.
     * This can change depending on the language
     * Default = "h2:contains(Popular Today)"
    */
    homescreenPopularTodaySelector: string = "h2:contains(Popular Today)"

    homescreenLatestUpdateEnabled: boolean = true
    homescreenLatestUpdateBoxSelector: string = "h2:contains(Latest Update)"
    homescreenLatestUpdateElementSelector: string = "div.uta"

    homescreenNewMangaEnabled: boolean = true
    homescreenNewMangaSelector: string = "h3:contains(New Series)"

    homescreenTopAllTimeEnabled: boolean = true
    homescreenTopAllTimeSelector: string = "div.serieslist.pop.wpop.wpop-alltime"

    homescreenTopMonthlyEnabled: boolean = true
    homescreenTopMonthlySelector: string = "div.serieslist.pop.wpop.wpop-monthly"

    //----FILTER UPDATED MANGA SELECTORS----
    /**
     * The selector for the updated manga section
     * This uses the @homescreenLatestUpdateBoxSelector by default
    */
    updateBoxSelector: string = this.homescreenLatestUpdateBoxSelector
    /**
     * The selector for the updated manga section
     * This uses the @homescreenLatestUpdateBoxSelector by default
    */
    updateElementSelector: string = this.homescreenLatestUpdateElementSelector

    requestManager = createRequestManager({
        requestsPerSecond: 2.5,
        requestTimeout: 15000,
    });

    parser = new Parser();

    getMangaShareUrl(mangaId: string): string {
        return `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}`;
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}`,
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
            url: `${this.baseUrl}/${mangaId}`,
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
            url: `${this.baseUrl}/${chapterId}`,
            method: 'GET',
            headers: this.constructHeaders({}),
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        return this.parser.parseChapterDetails(response.data, mangaId, chapterId);
    }

    async getTags(): Promise<TagSection[] | null> {
        const request = createRequestObject({
            url: this.baseUrl,
            method: "GET",
            param: this.tagsSubdirectoryPathName
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

        const sections: any[] = [];
        if (this.homescreenPopularTodayEnabled) sections.push(section1);
        if (this.homescreenLatestUpdateEnabled) sections.push(section2);
        if (this.homescreenNewMangaEnabled) sections.push(section3);
        if (this.homescreenTopAllTimeEnabled) sections.push(section4);
        if (this.homescreenTopMonthlyEnabled) sections.push(section5);

        const request = createRequestObject({
            url: this.baseUrl,
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
                param = `/manga/?page=${page}&order=latest`;
                break;
            case "latest_update":
                param = `/manga/?page=${page}&order=update`;
                break;
            case "popular_today":
                param = `/manga/?page=${page}&order=popular`;
                break;
            default:
                return Promise.resolve(null);;
        }

        const request = createRequestObject({
            url: this.baseUrl,
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
            url: this.baseUrl,
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
