import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww5.readfairytail.com'

export const ReadFairyTailEdensZeroMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadFairyTailEdensZeroMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadFairyTailEdensZeroMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/edens-zero/",
        DOMAIN+"/manga/fairy-tail/",
        DOMAIN+"/manga/fairy-tail-zero/",
        DOMAIN+"/manga/fairy-tail-city-hero/",
        DOMAIN+"/manga/heros/",
        DOMAIN+"/manga/fairy-tail-happys-grand-adventure/",
        DOMAIN+"/manga/fairy-tail-100-years-quest/",
        DOMAIN+"/manga/fairy-tail-ice-trail/",
        DOMAIN+"/manga/fairy-tail-x-nanatsu-no-taizai-christmas-special/",
        DOMAIN+"/manga/parasyte-x-fairy-tail/",
        DOMAIN+"/manga/monster-hunter-orage/",
        DOMAIN+"/manga/rave-master/",
        DOMAIN+"/manga/fairy-tail-x-rave/",
        DOMAIN+"/manga/fairy-tail-gaiden-raigo-issen/",
        DOMAIN+"/manga/fairy-tail-gaiden-kengami-no-souryuu/",
        DOMAIN+"/manga/fairy-tail-gaiden-road-knight/"
    ]
}