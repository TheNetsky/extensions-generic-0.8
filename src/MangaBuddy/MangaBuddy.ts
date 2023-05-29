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
    BuddyComplex
} from '../BuddyComplex'

const DOMAIN = 'https://mangabuddy.com'

export const MangaBuddyInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaBuddy',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class MangaBuddy extends BuddyComplex {

    baseUrl: string = DOMAIN

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = App.createHomeSection({ id: 'hot_updates', title: 'Hot Updates', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section2 = App.createHomeSection({ id: 'latest_update', title: 'Latest Updates', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section3 = App.createHomeSection({ id: 'top_today', title: 'Top Today', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section4 = App.createHomeSection({ id: 'top_weekly', title: 'Top Weekly', type: HomeSectionType.singleRowNormal, containsMoreItems: true })
        const section5 = App.createHomeSection({ id: 'top_monthly', title: 'Top Monthly', type: HomeSectionType.singleRowNormal, containsMoreItems: true })

        const sections: HomeSection[] = [section1, section2, section3, section4, section5]

        const request = App.createRequest({
            url: `${this.baseUrl}/home`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.CloudFlareError(response.status)
        const $ = this.cheerio.load(response.data as string)
        this.parser.parseHomeSections($, sections, sectionCallback)
    }
}