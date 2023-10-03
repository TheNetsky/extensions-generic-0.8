import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww9.readonepiece.com'

export const ReadOnePieceMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadOnePieceMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadOnePieceMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/one-piece/",
        DOMAIN+"/manga/one-piece-digital-colored-comics/",
        DOMAIN+"/manga/shokugeki-no-sanji-one-shot/",
        DOMAIN+"/manga/one-piece-x-toriko/",
        DOMAIN+"/manga/one-piece-party/",
        DOMAIN+"/manga/dragon-ball-x-one-piece/",
        DOMAIN+"/manga/wanted-one-piece/",
        DOMAIN+"/manga/one-piece-ace-s-story/",
        DOMAIN+"/manga/one-piece-omake/",
        DOMAIN+"/manga/vivre-card-databook/",
        DOMAIN+"/manga/one-piece-databook/",
        DOMAIN+"/manga/one-piece-ace-story-manga/"
    ]
}