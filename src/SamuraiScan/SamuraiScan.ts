import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

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

    override hasAdvancedSearchPage = true

}