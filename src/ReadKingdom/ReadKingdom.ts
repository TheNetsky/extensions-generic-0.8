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

const DOMAIN = 'https://ww3.readkingdom.com'

export const ReadKingdomInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadKingdom',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadKingdom extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadKingdom (Kingdom)',
            url: DOMAIN + '/manga/kingdom'
        },
        {
            title: 'ReadKingdom (Li Mu)',
            url: DOMAIN + '/manga/li-mu'
        },
        {
            title: 'ReadKingdom (Meng Wu and Chu Zi: One-Shot)',
            url: DOMAIN + '/manga/meng-wu-and-chu-zi-one-shot'
        }
    ]
}