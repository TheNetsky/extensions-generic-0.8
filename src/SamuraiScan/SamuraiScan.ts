import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents,
    HomeSection,
    HomeSectionType
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

import {
    SamuraiScanParser
} from './SamuraiScanParser'

const DOMAIN = 'https://samuraiscan.com'

export const SamuraiScanInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'SamuraiScan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky & Seitenca',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'Spanish',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class SamuraiScan extends Madara {

    baseUrl: string = DOMAIN

    override language = '🇪🇸'

    override alternativeChapterAjaxEndpoint = true

    override parser: SamuraiScanParser = new SamuraiScanParser()

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const sections = [
            {
                request: this.constructAjaxHomepageRequest(0, 10, '_wp_manga_week_views_value'),
                section: App.createHomeSection({
                    id: '0',
                    title: 'Currently Trending',
                    type: HomeSectionType.featured,
                    containsMoreItems: true
                })
            },
            {
                request: this.constructAjaxHomepageRequest(0, 10, '_latest_update'),
                section: App.createHomeSection({
                    id: '1',
                    title: 'Recently Updated',
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