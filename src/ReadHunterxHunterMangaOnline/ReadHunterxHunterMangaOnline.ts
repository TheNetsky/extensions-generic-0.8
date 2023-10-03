import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww3.readhxh.com'

export const ReadHunterxHunterMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadHunterxHunterMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadHunterxHunterMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/hunter-x-hunter/",
        DOMAIN+"/manga/hunter-x-hunter-colored/",
        DOMAIN+"/manga/level-e/",
        DOMAIN+"/manga/yu-yu-hakusho/",
    ]
}