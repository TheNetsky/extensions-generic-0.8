import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww2.readkaguyasama.com'

export const ReadKaguyaSamaMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadKaguyaSamaMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadKaguyaSamaMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/kaguya-sama-love-is-war/",
        DOMAIN+"/manga/kaguya-wants-to-be-confessed-to-official-doujin/",
        DOMAIN+"/manga/we-want-to-talk-about-kaguya/",
        DOMAIN+"/manga/kaguya-sama-light-novel/",
        DOMAIN+"/manga/ib-instant-bullet/",
        DOMAIN+"/manga/oshi-no-ko/",
        DOMAIN+"/manga/sayonara-piano-sonata/",
        DOMAIN+"/manga/original-hinatazaka/",
    ]
}