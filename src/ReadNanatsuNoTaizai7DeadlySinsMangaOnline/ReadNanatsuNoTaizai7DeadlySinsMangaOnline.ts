import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww4.read7deadlysins.com'

export const ReadNanatsuNoTaizai7DeadlySinsMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNanatsuNoTaizai7DeadlySinsMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadNanatsuNoTaizai7DeadlySinsMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/four-horsemen-of-the-apocalypse/",
        DOMAIN+"/manga/mayoe-nanatsu-no-taizai-gakuen/",
        DOMAIN+"/manga/nanatsu-no-taizai-seven-days/",
        DOMAIN+"/manga/nanatsu-no-taizai-vampires-of-edinburgh/",
        DOMAIN+"/manga/the-queen-of-the-altar/",
        DOMAIN+"/manga/nanatsu-no-taizai-nanairo-no-tsuioku/",
        DOMAIN+"/manga/fairy-tail-x-nanatsu-no-taizai-christmas-special/",
        DOMAIN+"/manga/nanatsu-no-taizai/",
        DOMAIN+"/manga/nanatsu-no-taizai-the-seven-scars-which-they-left-behind/",
        DOMAIN+"/manga/kongou-banchou/",
    ]
}