import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww8.readsnk.com'

export const ReadAttackOnTitanShingekiNoKyojinMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadAttackOnTitanShingekiNoKyojinManga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadAttackOnTitanShingekiNoKyojinManga extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/shingeki-no-kyojin/",
        DOMAIN+"/manga/shingeki-no-kyojin-colored/",
        DOMAIN+"/manga/shingeki-no-kyojin-before-the-fall/",
        DOMAIN+"/manga/shingeki-no-kyojin-lost-girls/",
        DOMAIN+"/manga/attack-on-titan-no-regrets/",
        DOMAIN+"/manga/attack-on-titan-junior-high/",
        DOMAIN+"/manga/attack-on-titan-harsh-mistress-of-the-city/",
        DOMAIN+"/manga/attack-on-titan-anthology/",
        DOMAIN+"/manga/attack-on-titan-exclusive-art-book/",
        DOMAIN+"/manga/spoof-on-titan/",
        DOMAIN+"/manga/attack-on-titan-guidebook-inside-outside/",
        DOMAIN+"/manga/attack-on-titan-no-regrets-colored/"
    ]
}