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

const DOMAIN = 'https://mangagalaxy.me'

export const MangaGalaxyInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaGalaxy',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class MangaGalaxy extends Madara {

    baseUrl: string = DOMAIN

    override chapterEndpoint = 1
}