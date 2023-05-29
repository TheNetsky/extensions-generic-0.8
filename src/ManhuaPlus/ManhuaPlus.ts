import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents,
    HomeSectionType,
    HomeSection
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://manhuaplus.com'

export const ManhuaPlusInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ManhuaPlus',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class ManhuaPlus extends Madara {

    baseUrl: string = DOMAIN

    override alternativeChapterAjaxEndpoint = true

    override hasAdvancedSearchPage = true

    override chapterDetailsSelector = 'li.blocks-gallery-item > figure > img, div.page-break > img, div#chapter-video-frame > p > img, div.text-left > p > img'

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            {
                request: App.createRequest({
                    url: `${this.baseUrl}/manga/?m_orderby=latest`,
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: '0',
                    title: 'Recently Updated',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: `${this.baseUrl}/manga/?m_orderby=trending`,
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: '1',
                    title: 'Currently Trending',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: `${this.baseUrl}/manga/?m_orderby=views`,
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: '2',
                    title: 'Most Popular',
                    type: HomeSectionType.singleRowNormal,
                    containsMoreItems: true
                })
            },
            {
                request: App.createRequest({
                    url: `${this.baseUrl}/manga/?m_orderby=new-manga`,
                    method: 'GET'
                }),
                section: App.createHomeSection({
                    id: '3',
                    title: 'New Manga',
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

}