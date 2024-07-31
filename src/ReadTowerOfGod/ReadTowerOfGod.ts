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

const DOMAIN = 'https://readtowerofgod.com'

export const ReadTowerOfGodInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadTowerOfGod',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadTowerOfGod extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = ''

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadTowerOfGod (Tower of God: Season 1)',
            url: DOMAIN + '/manga/tower-of-god-season-1'
        },
        {
            title: 'ReadTowerOfGod (Tower of God: Season 2)',
            url: DOMAIN + '/manga/tower-of-god-season-2'
        },
        {
            title: 'ReadTowerOfGod (Tower of God: Season 3)',
            url: DOMAIN + '/manga/tower-of-god-season-3'
        },
        {
            title: 'ReadTowerOfGod (Tower of God: Spoilers Raw)',
            url: DOMAIN + '/manga/tower-of-god-spoilers-raw'
        },
        {
            title: 'ReadTowerOfGod (SIU Blog Post Translation)',
            url: DOMAIN + '/manga/siu-blog-post-translation'
        }
    ]
}