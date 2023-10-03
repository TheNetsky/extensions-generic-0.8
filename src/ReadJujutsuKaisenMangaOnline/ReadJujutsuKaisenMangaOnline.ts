import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww2.readjujutsukaisen.com'

export const ReadJujutsuKaisenMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadJujutsuKaisenMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadJujutsuKaisenMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/jujutsu-kaisen/",
        DOMAIN+"/manga/jujutsu-kaisen-0/",
        DOMAIN+"/manga/jujutsu-kaisen-first-light-novel/",
        DOMAIN+"/manga/no-9/",
        DOMAIN+"/manga/jujutsu-kaisen-colored/",
        DOMAIN+"/manga/jujutsu-kaisen-official-fanbook/",
    ]
}