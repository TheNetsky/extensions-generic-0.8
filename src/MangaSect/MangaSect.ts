import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    Liliana,
    getExportVersion
} from '../Liliana'

const DOMAIN = 'https://mangasect.net'

export const MangaSectInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'Manga Sect',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'xOnlyFadi',
    authorWebsite: 'http://github.com/xOnlyFadi',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class MangaSect extends Liliana {

    baseUrl: string = DOMAIN

    override usesPostSearch = true
}