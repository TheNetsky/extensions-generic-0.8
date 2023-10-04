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

const DOMAIN = 'https://ww4.readdrstone.com'

export const ReadDrStoneInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadDrStone',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedace',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadDrStone extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadDrStone (Dr. Stone)',
            url: DOMAIN + '/manga/dr-stone'
        },
        {
            title: 'ReadDrStone (Dr. Stone Reboot: Byakuya)',
            url: DOMAIN + '/manga/dr-stone-reboot-byakuya'
        },
        {
            title: 'ReadDrStone (Sun-Ken Rock)',
            url: DOMAIN + '/manga/sun-ken-rock'
        },
        {
            title: 'ReadDrStone (Origin)',
            url: DOMAIN + '/manga/origin'
        },
        {
            title: 'ReadDrStone (Raqiya)',
            url: DOMAIN + '/manga/raqiya'
        }
    ]
}