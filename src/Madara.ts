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
    SourceStateManager,
    DUINavigationButton,
    PartialSourceManga,
    SearchResultsProviding,
    MangaProviding,
    ChapterProviding,
    DUISection,
    Tag,
    HomePageSectionsProviding,
    HomeSectionType
} from '@paperback/types'

import { Parser } from './MadaraParser'
import { URLBuilder } from './MadaraHelper'

const BASE_VERSION = '3.1.1'
export const getExportVersion = (EXTENSION_VERSION: string): string => {
    return BASE_VERSION.split('.').map((x, index) => Number(x) + Number(EXTENSION_VERSION.split('.')[index])).join('.')
}

export abstract class Madara implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {

    constructor(public cheerio: CheerioAPI) { }

    /**
     *  Request manager override
     */
    requestsPerSecond = 5
    requestTimeout = 20000

    requestManager = App.createRequestManager({
        requestsPerSecond: this.requestsPerSecond,
        requestTimeout: this.requestTimeout,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': await this.requestManager.getDefaultUserAgent(),
                        'referer': `${this.baseUrl}/`,
                        'origin': `${this.baseUrl}/`,
                        ...(request.url.includes('wordpress.com') && { 'Accept': 'image/avif,image/webp,*/*' }) // Used for images hosted on Wordpress blogs
                    }
                }
                request.cookies = [
                    App.createCookie({ name: 'wpmanga-adault', value: '1', domain: this.baseUrl }),
                    App.createCookie({ name: 'toonily-mature', value: '1', domain: this.baseUrl })
                ]

                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    });


    stateManager = App.createSourceStateManager()

    async getSourceMenu(): Promise<DUISection> {
        return App.createDUISection({
            id: 'sourceMenu',
            header: 'Source Menu',
            isHidden: false,
            rows: async () => [
                this.sourceSettings(this.stateManager)
            ]
        })
    }

    sourceSettings = (stateManager: SourceStateManager): DUINavigationButton => {
        return App.createDUINavigationButton({
            id: 'madara_settings',
            label: 'Source Settings',
            form: App.createDUIForm({
                sections: async () => [
                    App.createDUISection({
                        id: 'hq_thumb',
                        isHidden: false,
                        footer: 'Enabling HQ thumbnails will use more bandwidth and will load thumbnails slightly slower.',
                        rows: async () => [
                            App.createDUISwitch({
                                id: 'HQthumb',
                                label: 'HQ Thumbnails',
                                value: App.createDUIBinding({
                                    get: async () => await stateManager.retrieve('HQthumb') ?? false,
                                    set: async (newValue) => await stateManager.store('HQthumb', newValue)
                                })
                            })
                        ]
                    })
                ]
            })
        })
    }

    /**
    * The Madara URL of the website. Eg. https://webtoon.xyz
    */
    abstract baseUrl: string

    /**
     * The language code the source's content is served in in string form.
     */
    language = '🇬🇧'

    /**
     * Different Madara sources might have a slightly different selector which is required to parse out
     * each manga object while on a search result page. This is the selector
     * which is looped over. This may be overridden if required.
     */
    searchMangaSelector = 'div.c-tabs-item__content'

    /**
     * Set to true if your source has advanced search functionality built in.
     * If this is not true, no genre tags will be shown on the homepage!
     * See https://www.webtoon.xyz/?s=&post_type=wp-manga if they have a "advanced" option, if NOT, set this to false.
     */
    hasAdvancedSearchPage = true

    /**
     * The path used for search pagination. Used in search function.
     * Eg. for https://mangabob.com/page/2/?s&post_type=wp-manga it would be 'page'
     */
    searchPagePathName = 'page'

    /**
     * Set to true if the source makes use of the manga chapter protector plugin.
     * (https://mangabooth.com/product/wp-manga-chapter-protector/)
     */
    hasProtectedChapters = false

    /**
     * Some sources may in the future change how to get the chapter protector data,
     * making it configurable, will make it way more flexible and open to customized installations of the protector plugin.
     */
    protectedChapterDataSelector = '#chapter-protector-data'

    /**
     * Some sites use the alternate URL for getting chapters through ajax
     */
    alternativeChapterAjaxEndpoint = false

    /**
     * Different Madara sources might have a slightly different selector which is required to parse out
     * each page while on a chapter page. This is the selector
     * which is looped over. This may be overridden if required.
     */
    chapterDetailsSelector = 'div.page-break > img'

    /**
     * Some websites have the Cloudflare defense check enabled on specific parts of the website, these need to be loaded when using the Cloudflare bypass within the app
     */
    bypassPage = ''

    /**
     * If it's not possible to use postIds for certain reasons, you can disable this here.
     */
    usePostIds = true

    /**
     * When not using postIds, you need to set the directory path
     */
    directoryPath = 'manga'

    /**
     * Some sources may redirect to the manga page instead of the chapter page if adding the parameter '?style=list'
     */
    useListParameter = true

    parser = new Parser()

    getMangaShareUrl(mangaId: string): string {
        return this.usePostIds ? `${this.baseUrl}/?p=${mangaId}/` : `${this.baseUrl}/${this.directoryPath}/${mangaId}/`
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: this.usePostIds ? `${this.baseUrl}/?p=${mangaId}/` : `${this.baseUrl}/${this.directoryPath}/${mangaId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseMangaDetails($, mangaId, this)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        let endpoint: string

        if (this.alternativeChapterAjaxEndpoint) {
            if (this.usePostIds) {
                const slugData: any = await this.convertPostIdToSlug(Number(mangaId))
                endpoint = `${this.baseUrl}/${slugData.path}/${slugData.slug}/ajax/chapters`
            } else {
                endpoint = `${this.baseUrl}/${this.directoryPath}/${mangaId}/ajax/chapters`
            }
        } else {
            endpoint = `${this.baseUrl}/wp-admin/admin-ajax.php`
        }

        const request = App.createRequest({
            url: endpoint,
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'action': 'manga_get_chapters',
                'manga': this.usePostIds ? mangaId : await this.convertSlugToPostId(mangaId, this.directoryPath)
            }
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseChapterList($, mangaId, this)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {

        let url: string
        if (this.usePostIds) {
            const slugData: any = await this.convertPostIdToSlug(Number(mangaId))
            url = `${this.baseUrl}/${slugData.path}/${slugData.slug}/${chapterId}/${this.useListParameter ? '?style=list' : ''}`
        } else {
            url = `${this.baseUrl}/${this.directoryPath}/${mangaId}/${chapterId}/${this.useListParameter ? '?style=list' : ''}`
        }

        const request = App.createRequest({
            url: url,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        if (this.hasProtectedChapters) {
            return this.parser.parseProtectedChapterDetails($, mangaId, chapterId, this.protectedChapterDataSelector, this)
        }

        return this.parser.parseChapterDetails($, mangaId, chapterId, this.chapterDetailsSelector, this)
    }

    async getSearchTags(): Promise<TagSection[]> {
        let request
        if (this.hasAdvancedSearchPage) {
            // Adding the fake query "the" since some source revert to homepage when none is given!
            request = App.createRequest({
                url: `${this.baseUrl}/?s=the&post_type=wp-manga`,
                method: 'GET'
            })
        } else {
            request = App.createRequest({
                url: `${this.baseUrl}/`,
                method: 'GET'
            })
        }

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseTags($, this.hasAdvancedSearchPage)
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        // If we're supplied a page that we should be on, set our internal reference to that page. Otherwise, we start from page 0.
        const page = metadata?.page ?? 1

        const request = this.constructSearchRequest(page, query)
        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)
        const results = await this.parser.parseSearchResults($, this)

        const manga: PartialSourceManga[] = []
        for (const result of results) {
            if (this.usePostIds) {
                const postId = await this.slugToPostId(result.slug, result.path)

                manga.push(App.createPartialSourceManga({
                    mangaId: String(postId),
                    image: result.image,
                    title: result.title,
                    subtitle: result.subtitle
                }))
            } else {
                manga.push(App.createPartialSourceManga({
                    mangaId: result.slug,
                    image: result.image,
                    title: result.title,
                    subtitle: result.subtitle
                }))
            }
        }

        return App.createPagedResults({
            results: manga,
            metadata: { page: (page + 1) }
        })
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            {
                request: this.constructAjaxHomepageRequest(0, 10, '_latest_update'),
                section: App.createHomeSection({
                    id: '0',
                    title: 'Recently Updated',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: this.constructAjaxHomepageRequest(0, 10, '_wp_manga_week_views_value'),
                section: App.createHomeSection({
                    id: '1',
                    title: 'Currently Trending',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: this.constructAjaxHomepageRequest(0, 10, '_wp_manga_views'),
                section: App.createHomeSection({
                    id: '2',
                    title: 'Most Popular',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: this.constructAjaxHomepageRequest(0, 10, '_wp_manga_status', 'end'),
                section: App.createHomeSection({
                    id: '3',
                    title: 'Completed',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            }
        ]

        const promises: Promise<void>[] = []
        for (const section of sections) {
            // Let the app load empty sections
            sectionCallback(section.section)

            // Get the section data
            promises.push(
                this.requestManager.schedule(section.request, 1).then(async response => {
                    this.checkResponseError(response)
                    const $ = this.cheerio.load(response.data as string)
                    section.section.items = await this.parser.parseHomeSection($, this)
                    sectionCallback(section.section)
                })
            )

        }

        // Make sure the function completes
        await Promise.all(promises)
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page = metadata?.page ?? 0
        let sortBy: any[] = []

        switch (homepageSectionId) {
            case '0': {
                sortBy = ['_latest_update']
                break
            }
            case '1': {
                sortBy = ['_wp_manga_week_views_value']
                break
            }
            case '2': {
                sortBy = ['_wp_manga_views']
                break
            }
            case '3': {
                sortBy = ['_wp_manga_status', 'end']
                break
            }
        }

        const request = this.constructAjaxHomepageRequest(page, 50, sortBy[0], sortBy[1])
        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)
        const items: PartialSourceManga[] = await this.parser.parseHomeSection($, this)

        let mData: any = { page: (page + 1) }
        if (items.length < 50) {
            mData = undefined
        }

        return App.createPagedResults({
            results: items,
            metadata: mData
        })
    }

    // Utility
    constructSearchRequest(page: number, query: SearchRequest): any {
        return App.createRequest({
            url: new URLBuilder(this.baseUrl)
                .addPathComponent(this.searchPagePathName)
                .addPathComponent(page.toString())
                .addQueryParameter('s', encodeURIComponent(query?.title ?? ''))
                .addQueryParameter('post_type', 'wp-manga')
                .addQueryParameter('genre', query?.includedTags?.map((x: Tag) => x.id))
                .buildUrl({ addTrailingSlash: true, includeUndefinedParameters: false }),
            method: 'GET'
        })
    }

    constructAjaxHomepageRequest(page: number, postsPerPage: number, meta_key: string, meta_value?: string): any {
        return App.createRequest({
            url: `${this.baseUrl}/wp-admin/admin-ajax.php`,
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                'action': 'madara_load_more',
                'template': 'madara-core/content/content-archive',
                'page': page,
                'vars[paged]': '1',
                'vars[posts_per_page]': postsPerPage,
                'vars[orderby]': 'meta_value_num',
                'vars[sidebar]': 'right',
                'vars[post_type]': 'wp-manga',
                'vars[order]': 'desc',
                'vars[meta_key]': meta_key,
                'vars[meta_value]': meta_value
            }
        })
    }

    async slugToPostId(slug: string, path: string): Promise<string> {
        if (await this.stateManager.retrieve(slug) == null) {
            const postId = await this.convertSlugToPostId(slug, path)

            const existingMappedSlug = await this.stateManager.retrieve(postId)
            if (existingMappedSlug != null) {
                await this.stateManager.store(slug, undefined)
            }

            await this.stateManager.store(postId, slug)
            await this.stateManager.store(slug, postId)
        }

        const postId = await this.stateManager.retrieve(slug)
        if (!postId) throw new Error(`Unable to fetch postId for slug:${slug}`)

        return postId
    }

    async convertPostIdToSlug(postId: number): Promise<any> {
        const request = App.createRequest({
            url: `${this.baseUrl}/?p=${postId}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

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

        parseSlug = parseSlug
            .replace(/\/$/, '')
            .split('/')

        const slug = parseSlug.slice(-1).pop()
        const path = parseSlug.slice(-2).shift()

        return { path, slug }
    }

    async convertSlugToPostId(slug: string, path: string): Promise<string> { // Credit to the MadaraDex team :-D
        const headRequest = App.createRequest({
            url: `${this.baseUrl}/${path}/${slug}`,
            method: 'HEAD'
        })
        const headResponse = await this.requestManager.schedule(headRequest, 1)

        let postId: any

        const postIdRegex = headResponse?.headers['Link']?.match(/\?p=(\d+)/)
        if (postIdRegex && postIdRegex[1]) postId = postIdRegex[1]
        if (postId || !isNaN(Number(postId))) {
            return postId?.toString()
        } else {
            postId = ''
        }

        const request = App.createRequest({
            url: `${this.baseUrl}/${path}/${slug}`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        // Step 1: Try to get postId from shortlink
        postId = Number($('link[rel="shortlink"]')?.attr('href')?.split('/?p=')[1])

        // Step 2: If no number has been found, try to parse from data-post
        if (isNaN(postId)) {
            postId = Number($('a.wp-manga-action-button').attr('data-post'))
        }

        // Step 3: If no number has been found, try to parse from manga script
        if (isNaN(postId)) {
            const page = $.root().html()
            const match = page?.match(/manga_id.*\D(\d+)/)
            if (match && match[1]) {
                postId = Number(match[1]?.trim())
            }
        }

        if (!postId || isNaN(postId)) {
            throw new Error(`Unable to fetch numeric postId for this item! (path:${path} slug:${slug})`)
        }

        return postId.toString()
    }

    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: this.bypassPage || this.baseUrl,
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