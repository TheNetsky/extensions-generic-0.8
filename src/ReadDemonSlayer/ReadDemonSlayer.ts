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

const DOMAIN = 'https://demonslayermanga.com'

export const ReadDemonSlayerInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadDemonSlayer',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadDemonSlayer extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/aPt6kZ1.jpg'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadDemonSlayer (Demon Slayer: Kimetsu no Yaiba)',
            url: DOMAIN + '/manga/demon-slayer-kimetsu-no-yaiba'
        }
    ]
}