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

const DOMAIN = 'https://readhaikyuu.com'

export const ReadHaikyuuInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadHaikyuu',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadHaikyuu extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/w2ubpnd.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadHaikyuu (Haikyuu!!)',
            url: DOMAIN + '/manga/haikyuu'
        },
        {
            title: 'ReadHaikyuu (Haikyuu!! Bu)',
            url: DOMAIN + '/manga/haikyuu-bu'
        },
        {
            title: 'ReadHaikyuu (Haikyuu!! x Nisekoi)',
            url: DOMAIN + '/manga/haikyuu-x-nisekoi'
        },
        {
            title: 'ReadHaikyuu (Let\'s Haikyu!!)',
            url: DOMAIN + '/manga/lets-haikyu'
        }
    ]
}