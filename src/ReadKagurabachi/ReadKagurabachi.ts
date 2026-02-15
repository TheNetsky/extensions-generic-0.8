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

const DOMAIN = 'https://readkagurabachimanga.com'

export const ReadKagurabachiInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadKagurabachi',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadKagurabachi extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/N5ZF28b.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadKagurabachi (Kagurabachi)',
            url: DOMAIN + '/manga/kagurabachi'
        },
        {
            title: 'ReadKagurabachi (Chain)',
            url: DOMAIN + '/manga/chain'
        },
        {
            title: 'ReadKagurabachi (Madogiwa de Amu)',
            url: DOMAIN + '/manga/knitting-by-the-window'
        },
        {
            title: 'ReadKagurabachi (Roku no Meiyaku)',
            url: DOMAIN + '/manga/roks-death-testament'
        },
        {
            title: 'ReadKagurabachi (Enten)',
            url: DOMAIN + '/manga/enten'
        },
        {
            title: 'ReadKagurabachi (Farewell! Cherry Boy!)',
            url: DOMAIN + '/manga/farewell-cherry-boy'
        }
    ]
}