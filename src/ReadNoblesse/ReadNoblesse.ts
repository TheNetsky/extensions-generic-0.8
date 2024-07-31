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

const DOMAIN = 'https://readnoblesse.com'

export const ReadNoblesseInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNoblesse',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadNoblesse extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = ''

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