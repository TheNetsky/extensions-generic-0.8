import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww4.readneverland.com'

export const ReadThePromisedNeverlandMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadThePromisedNeverlandMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadThePromisedNeverlandMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/the-promised-neverland/",
        DOMAIN+"/manga/the-parodied-jokeland/",
        DOMAIN+"/manga/novels/",
        DOMAIN+"/manga/poppy-no-negai/",
        DOMAIN+"/manga/shinrei-shashinshi-kouno-saburou/",
        DOMAIN+"/manga/ashley-goeth-no-yukue/",
    ]
}