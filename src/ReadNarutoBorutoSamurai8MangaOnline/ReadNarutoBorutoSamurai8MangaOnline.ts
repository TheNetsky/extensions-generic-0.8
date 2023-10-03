import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww8.readnaruto.com'

export const ReadNarutoBorutoSamurai8MangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNarutoBorutoSamurai8MangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadNarutoBorutoSamurai8MangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/boruto-naruto-next-generations/",
        DOMAIN+"/manga/naruto/",
        DOMAIN+"/manga/naruto-digital-colored-comics/",
        DOMAIN+"/manga/naruto-gaiden-the-seventh-hokage/",
        DOMAIN+"/manga/samurai-8-hachimaru-den/",
    ]
}