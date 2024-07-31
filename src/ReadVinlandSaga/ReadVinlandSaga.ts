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

const DOMAIN = 'https://readvinlandsaga.com'

export const ReadVinlandSagaInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'ReadVinlandSaga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadVinlandSaga extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/yv8QOj4.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadVinlandSaga (Vinland Saga)',
            url: DOMAIN + '/manga/vinland-saga'
        },
        {
            title: 'ReadVinlandSaga (Vinland Saga: Colored)',
            url: DOMAIN + '/manga/vinland-saga-colored'
        },
        {
            title: 'ReadVinlandSaga (Planetes)',
            url: DOMAIN + '/manga/planetes'
        }
    ]
}