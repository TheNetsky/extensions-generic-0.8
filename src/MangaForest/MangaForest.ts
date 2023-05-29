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

const DOMAIN = 'https://mangaforest.com'

export const MangaForestInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaForest',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class MangaForest extends BuddyComplex {

    baseUrl: string = DOMAIN

}