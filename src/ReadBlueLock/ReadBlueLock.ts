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

const DOMAIN = 'https://bluelockread.com'

export const ReadBlueLockInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadBlueLock',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadBlueLock extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/yv8QOj4.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadBlueLock (Blue Lock)',
            url: DOMAIN + '/manga/blue-lock'
        },
        {
            title: 'ReadBlueLock (Tesla Note)',
            url: DOMAIN + '/manga/tesla-note'
        },
        {
            title: 'ReadBlueLock (Blue Lock Light Novel)',
            url: DOMAIN + '/manga/blue-lock-light-novel'
        },
        {
            title: 'ReadBlueLock (Jagaaaaaan)',
            url: DOMAIN + '/manga/jagaaaaaan'
        },
        {
            title: 'ReadBlueLock (Super Ball Girls)',
            url: DOMAIN + '/manga/super-ball-girls'
        },
        {
            title: 'ReadBlueLock (Blue Lock: Episode Nagi)',
            url: DOMAIN + '/manga/blue-lock-episode-nagi'
        }
    ]
}