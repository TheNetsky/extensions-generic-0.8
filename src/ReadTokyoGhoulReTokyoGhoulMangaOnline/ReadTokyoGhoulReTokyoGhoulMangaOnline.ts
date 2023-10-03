import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww9.tokyoghoulre.com'

export const ReadTokyoGhoulReTokyoGhoulMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadTokyoGhoulReTokyoGhoulMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadTokyoGhoulReTokyoGhoulMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/tokyo-ghoul/",
        DOMAIN+"/manga/tokyo-ghoulre/",
        DOMAIN+"/manga/tokyo-ghoul-jack/",
        DOMAIN+"/manga/tokyo-ghoulre-colored/",
        DOMAIN+"/manga/this-gorilla-will-die-in-1-day/",
        DOMAIN+"/manga/tokyo-ghoul-zakki/",
        DOMAIN+"/manga/tokyo-ghoul-re-light-novels/",
    ]
}