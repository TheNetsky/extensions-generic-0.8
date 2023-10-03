import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww2.readtowerofgod.com'

export const ReadTowerOfGodManhwaMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadTowerOfGodManhwaMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadTowerOfGodManhwaMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/tower-of-god-season-1/",
        DOMAIN+"/manga/tower-of-god-season-2/",
        DOMAIN+"/manga/tower-of-god-season-3/",
        DOMAIN+"/manga/tower-of-god-spoilers-raw/",
        DOMAIN+"/manga/siu-blog-post-translation/",
    ]
}