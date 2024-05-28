import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    Liliana,
    getExportVersion
} from '../Liliana'

const DOMAIN = 'https://mangakoma01.net'

export const MangaKomaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'Manga Koma',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'xOnlyFadi',
    authorWebsite: 'http://github.com/xOnlyFadi',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class MangaKoma extends Liliana {

    baseUrl: string = DOMAIN
    override usesPostSearch = true
    override language = '🇯🇵'
}