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

const DOMAIN = 'https://ww8.readnaruto.com'

export const ReadNarutoBorutoInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNarutoBoruto',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedace',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadNarutoBoruto extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadBorutoNaruto (Boruto: Naruto Next Generations)',
            url: DOMAIN + '/manga/boruto-naruto-next-generations'
        },
        {
            title: 'ReadBorutoNaruto (Naruto)',
            url: DOMAIN + '/manga/naruto'
        },
        {
            title: 'ReadBorutoNaruto (Naruto: Digital Colored Comics)',
            url: DOMAIN + '/manga/naruto-digital-colored-comics'
        },
        {
            title: 'ReadBorutoNaruto (Naruto Gaiden: The Seventh Hokage)',
            url: DOMAIN + '/manga/naruto-gaiden-the-seventh-hokage'
        },
        {
            title: 'ReadBorutoNaruto (Samurai 8: Hachimaru Den)',
            url: DOMAIN + '/manga/samurai-8-hachimaru-den'
        }
    ]
}