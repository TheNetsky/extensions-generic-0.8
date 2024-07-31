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

const DOMAIN = 'https://dbsmanga.com'

export const ReadDragonBallInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadDragonBall',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadDragonBall extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/xKpUtga.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadDragonBall (Dragon Ball Super)',
            url: DOMAIN + '/manga/dragon-ball-super'
        },
        {
            title: 'ReadDragonBall (Dragon Ball)',
            url: DOMAIN + '/manga/dragon-ball'
        },
        {
            title: 'ReadDragonBall (Dragon Ball: Episode of Bardock)',
            url: DOMAIN + '/manga/dragon-ball-episode-of-bardock'
        },
        {
            title: 'ReadDragonBall (Dragon Ball Heroes: Victory Mission)',
            url: DOMAIN + '/manga/dragon-ball-heroes-victory-mission'
        },
        {
            title: 'ReadDragonBall (Dragon Ball SD)',
            url: DOMAIN + '/manga/dragon-ball-sd'
        },
        {
            title: 'ReadDragonBall (Dragon Ball Side Story: Yamcha Isekai)',
            url: DOMAIN + '/manga/dragon-ball-side-story-yamcha-isekai'
        },
        {
            title: 'ReadDragonBall (Dragon Ball x One Piece)',
            url: DOMAIN + '/manga/dragon-ball-x-one-piece'
        },
        {
            title: 'ReadDragonBall (Dragon Ball Z: Rebirth of F)',
            url: DOMAIN + '/manga/dragon-ball-z-rebirth-of-f'
        },
        {
            title: 'ReadDragonBall (Attack on Titan: Exclusive Art Book)',
            url: DOMAIN + '/manga/attack-on-titan-exclusive-art-book'
        },
        {
            title: 'ReadDragonBall (Super Dragon Ball Heroes: Universe Mission)',
            url: DOMAIN + '/manga/super-dragon-ball-heroes-universe-mission'
        },
        {
            title: 'ReadDragonBall (Dragon Ball Full Color: Saiyan Arc)',
            url: DOMAIN + '/manga/dragon-ball-full-color-saiyan-arc'
        },
        {
            title: 'ReadDragonBall (Dragon Ball Full Color: Freeza Arc)',
            url: DOMAIN + '/manga/dragon-ball-full-color-freeza-arc'
        },
        {
            title: 'ReadDragonBall (Super Dragon Ball Heroes: Big Bang Mission)',
            url: DOMAIN + '/manga/super-dragon-ball-heroes-big-bang-mission'
        },
        {
            title: 'ReadDragonBall (Dragon Ball Super Colored)',
            url: DOMAIN + '/manga/dragon-ball-super-colored'
        }
    ]
}