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

const DOMAIN = 'https://mangamad.com'

export const MangaMadInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaMad',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class MangaMad extends BuddyComplex {

    baseUrl: string = DOMAIN

}