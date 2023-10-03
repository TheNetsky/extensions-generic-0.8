import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww7.dbsmanga.com'

export const ReadDragonBallSuperChouMangaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadDragonBallSuperChouMangaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadDragonBallSuperChouMangaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/dragon-ball-super/",
        DOMAIN+"/manga/dragon-ball/",
        DOMAIN+"/manga/dragon-ball-episode-of-bardock/",
        DOMAIN+"/manga/dragon-ball-heroes-victory-mission/",
        DOMAIN+"/manga/dragon-ball-sd/",
        DOMAIN+"/manga/dragon-ball-side-story-yamcha-isekai/",
        DOMAIN+"/manga/dragon-ball-x-one-piece/",
        DOMAIN+"/manga/dragon-ball-z-rebirth-of-f/",
        DOMAIN+"/manga/attack-on-titan-exclusive-art-book/",
        DOMAIN+"/manga/super-dragon-ball-heroes-universe-mission/",
        DOMAIN+"/manga/dragon-ball-full-color-saiyan-arc/",
        DOMAIN+"/manga/dragon-ball-full-color-freeza-arc/",
        DOMAIN+"/manga/super-dragon-ball-heroes-big-bang-mission/",
        DOMAIN+"/manga/dragon-ball-super-colored/"
    ]
}