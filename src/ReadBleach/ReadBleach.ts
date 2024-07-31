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

const DOMAIN = 'https://readbleachmanga.com/'

export const ReadBleachInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadBleach',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadBleach extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/Vf65wQL.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadBleach (Bleach)',
            url: DOMAIN + '/manga/bleach'
        },
        {
            title: 'ReadBleach (Bleach Digital Colored Comics)',
            url: DOMAIN + '/manga/bleach-digital-colored-comics'
        },
        {
            title: 'ReadBleach (Bleach One Shot: Burn the Witch)',
            url: DOMAIN + '/manga/bleach-one-shot-burn-the-witch'
        }
    ]
}