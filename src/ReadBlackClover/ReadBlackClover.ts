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

const DOMAIN = 'https://ww7.readblackclover.com'

export const ReadBlackCloverInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadBlackClover',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadBlackClover extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadBlackClover (Black Clover)',
            url: DOMAIN + '/manga/black-clover'
        },
        {
            title: 'ReadBlackClover (Black Clover Gaiden Quertet Knights)',
            url: DOMAIN + '/manga/black-clover-gaiden-quartet-knights'
        },
        {
            title: 'ReadBlackClover (Black Clover Colored)',
            url: DOMAIN + '/manga/black-clover-colored'
        },
        {
            title: 'ReadBlackClover (Hungry Joker)',
            url: DOMAIN + '/manga/hungry-joker'
        }
    ]
}