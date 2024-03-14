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

const DOMAIN = 'https://readhxh.com'

export const ReadHunterxHunterInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadHunterxHunter',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadHunterxHunter extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/IJGrbuU.jpg'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadHunterXHunter (Hunter x Hunter)',
            url: DOMAIN + '/manga/hunter-x-hunter'
        },
        {
            title: 'ReadHunterXHunter (Hunter x Hunter Colored)',
            url: DOMAIN + '/manga/hunter-x-hunter-colored'
        },
        {
            title: 'ReadHunterXHunter (Level E)',
            url: DOMAIN + '/manga/level-e'
        },
        {
            title: 'ReadHunterXHunter (Yu Yu Hakusho)',
            url: DOMAIN + '/manga/yu-yu-hakusho'
        }
    ]
}