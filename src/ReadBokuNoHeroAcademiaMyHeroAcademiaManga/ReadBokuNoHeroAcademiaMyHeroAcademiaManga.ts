import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww6.readmha.com'

export const ReadBokuNoHeroAcademiaMyHeroAcademiaMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadBokuNoHeroAcademiaMyHeroAcademiaManga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadBokuNoHeroAcademiaMyHeroAcademiaManga extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/boku-no-hero-academia/",
        DOMAIN+"/manga/vigilante-boku-no-hero-academia-illegals/",
        DOMAIN+"/manga/my-hero-academia-team-up-mission/",
        DOMAIN+"/manga/boku-no-hero-academia-smash/",
        DOMAIN+"/manga/my-hero-academia-school-briefs/",
        DOMAIN+"/manga/deku-bakugo-rising/",
        DOMAIN+"/manga/boku-no-hero-academia-colored/",
        DOMAIN+"/manga/oumagadoki-zoo/",
        DOMAIN+"/manga/sensei-no-bulge/",
    ]
}