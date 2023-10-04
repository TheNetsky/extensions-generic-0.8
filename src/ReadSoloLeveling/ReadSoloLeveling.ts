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

const DOMAIN = 'https://ww1.readsololeveling.org/'

export const ReadSoloLevelingInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadSoloLeveling',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadSoloLeveling extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadSoloLeveling (Solo Leveling)',
            url: DOMAIN + '/manga/solo-leveling'
        },
        {
            title: 'ReadSoloLeveling (Solo Leveling Novel)',
            url: DOMAIN + '/manga/solo-leveling-novel'
        }
    ]
}