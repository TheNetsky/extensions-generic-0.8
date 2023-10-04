import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog,
    getExportVersion
} from '../MangaCatalog'

import { SourceBase } from '../MangaCatalogInterface'

const DOMAIN = 'https://ww6.readmha.com'

export const ReadMyHeroAcademiaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadMyHeroAcademia',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadMyHeroAcademia extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadBokuNoHeroAcademia (Boku no Hero Academia)',
            url: DOMAIN + '/manga/boku-no-hero-academia'
        },
        {
            title: 'ReadBokuNoHeroAcademia (Vigilante: Boku no Hero Academia Illegals)',
            url: DOMAIN + '/manga/vigilante-boku-no-hero-academia-illegals'
        },
        {
            title: 'ReadBokuNoHeroAcademia (My Hero Academia: Team Up Mission)',
            url: DOMAIN + '/manga/my-hero-academia-team-up-mission'
        },
        {
            title: 'ReadBokuNoHeroAcademia (Boku no Hero Academia: Smash!!)',
            url: DOMAIN + '/manga/boku-no-hero-academia-smash'
        },
        {
            title: 'ReadBokuNoHeroAcademia (My Hero Academia: School Briefs)',
            url: DOMAIN + '/manga/my-hero-academia-school-briefs'
        },
        {
            title: 'ReadBokuNoHeroAcademia (Deku & Bakugo: Rising)',
            url: DOMAIN + '/manga/deku-bakugo-rising'
        },
        {
            title: 'ReadBokuNoHeroAcademia (Boku no Hero Academia: Colored)',
            url: DOMAIN + '/manga/boku-no-hero-academia-colored'
        },
        {
            title: 'ReadBokuNoHeroAcademia (Oumagadoki Zoo)',
            url: DOMAIN + '/manga/oumagadoki-zoo'
        },
        {
            title: 'ReadBokuNoHeroAcademia (Sensei no Bulge)',
            url: DOMAIN + '/manga/sensei-no-bulge'
        }
    ]
}