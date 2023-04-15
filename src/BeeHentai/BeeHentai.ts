import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    BuddyComplex
} from '../BuddyComplex'

const DOMAIN = 'https://beehentai.com'

export const BeeHentaiInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'BeeHentai',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class BeeHentai extends BuddyComplex {

    baseUrl: string = DOMAIN

}