import {
    ContentRating,
    BadgeColor,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://manhwa-raw.com'

export const ManhwaRawInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ManhwaRaw',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.YELLOW
        },
        {
            text: 'Korean',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class ManhwaRaw extends Madara {

    baseUrl: string = DOMAIN

    override chapterEndpoint = 3

    override language = '🇰🇷'

    override hasAdvancedSearchPage = false
}
