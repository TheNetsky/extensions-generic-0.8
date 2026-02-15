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

const DOMAIN = 'https://readtokyorevengers.net'

export const ReadTokyoRevengersInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadTokyoRevengers',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadTokyoRevengers extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/Gwpyjgi.jpeg'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadTokyoRevengers (Tokyo Revengers)',
            url: DOMAIN + '/manga/tokyo-revengers'
        },
        {
            title: 'ReadTokyoRevengers (Tokyo Revengers: Letter from Keisuke Baji)',
            url: DOMAIN + '/manga/tokyo-revengers-letter-from-keisuke-baji'
        }
    ]
}