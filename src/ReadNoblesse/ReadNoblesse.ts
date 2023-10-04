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

const DOMAIN = 'https://ww4.readnoblesse.com'

export const ReadNoblesseInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNoblesse',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedace',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadNoblesse extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadNoblesse (Noblesse)',
            url: DOMAIN + '/manga/noblesse'
        },
        {
            title: 'ReadNoblesse (Noblesse: Rai\'s Adventure)',
            url: DOMAIN + '/manga/noblesse-rais-adventure'
        },
        {
            title: 'ReadNoblesse (Noblesse S)',
            url: DOMAIN + '/manga/noblesse-s'
        },
        {
            title: 'ReadNoblesse (Ability)',
            url: DOMAIN + '/manga/ability'
        }
    ]
}