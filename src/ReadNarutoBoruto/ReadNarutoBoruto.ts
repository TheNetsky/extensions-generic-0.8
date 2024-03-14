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

const DOMAIN = 'https://readnaruto.com'

export const ReadNarutoBorutoInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNarutoBoruto',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadNarutoBoruto extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/KY6yui9.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadNarutoBoruto (Boruto: Naruto Next Generations)',
            url: DOMAIN + '/manga/boruto-naruto-next-generations'
        },
        {
            title: 'ReadNarutoBoruto (Naruto)',
            url: DOMAIN + '/manga/naruto'
        },
        {
            title: 'ReadNarutoBoruto (Naruto: Digital Colored Comics)',
            url: DOMAIN + '/manga/naruto-digital-colored-comics'
        },
        {
            title: 'ReadNarutoBoruto (Naruto Gaiden: The Seventh Hokage)',
            url: DOMAIN + '/manga/naruto-gaiden-the-seventh-hokage'
        },
        {
            title: 'ReadNarutoBoruto (Samurai 8: Hachimaru Den)',
            url: DOMAIN + '/manga/samurai-8-hachimaru-den'
        }
    ]
}