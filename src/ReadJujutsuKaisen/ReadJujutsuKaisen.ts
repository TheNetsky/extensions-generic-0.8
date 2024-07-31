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

const DOMAIN = 'https://readjujutsukaisen.com'

export const ReadJujutsuKaisenInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadJujutsuKaisen',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadJujutsuKaisen extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/AHz5hzf.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadJujutsuKaisen (Jujutsu Kaisen)',
            url: DOMAIN + '/manga/jujutsu-kaisen'
        },
        {
            title: 'ReadJujutsuKaisen (Jujutsu Kaisen 0)',
            url: DOMAIN + '/manga/jujutsu-kaisen-0'
        },
        {
            title: 'ReadJujutsuKaisen (Jujutsu Kaisen: First Light Novel)',
            url: DOMAIN + '/manga/jujutsu-kaisen-first-light-novel'
        },
        {
            title: 'ReadJujutsuKaisen (No. 9)',
            url: DOMAIN + '/manga/no-9'
        },
        {
            title: 'ReadJujutsuKaisen (Jujutsu Kaisen Colored)',
            url: DOMAIN + '/manga/jujutsu-kaisen-colored'
        },
        {
            title: 'ReadJujutsuKaisen (Jujutsu Kaisen Official Fanbook)',
            url: DOMAIN + '/manga/jujutsu-kaisen-official-fanbook'
        }
    ]
}
