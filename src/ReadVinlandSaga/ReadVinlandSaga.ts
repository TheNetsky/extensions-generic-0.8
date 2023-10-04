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

const DOMAIN = 'https://ww2.readvinlandsaga.com'

export const ReadVinlandSagaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadVinlandSaga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadVinlandSaga extends MangaCatalog {

    baseUrl: string = DOMAIN

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