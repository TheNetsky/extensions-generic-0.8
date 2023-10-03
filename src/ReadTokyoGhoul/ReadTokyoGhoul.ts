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

const DOMAIN = 'https://ww9.tokyoghoulre.com'

export const ReadTokyoGhoulInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadTokyoGhoul',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadTokyoGhoul extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadTokyoGhoul (Tokyo Ghoul)',
            url: DOMAIN + '/manga/tokyo-ghoul'
        },
        {
            title: 'ReadTokyoGhoul (Tokyo Ghoul:re)',
            url: DOMAIN + '/manga/tokyo-ghoulre'
        },
        {
            title: 'ReadTokyoGhoul (Tokyo Ghoul: Jack)',
            url: DOMAIN + '/manga/tokyo-ghoul-jack'
        },
        {
            title: 'ReadTokyoGhoul (Tokyo Ghoul:re Colored)',
            url: DOMAIN + '/manga/tokyo-ghoulre-colored'
        },
        {
            title: 'ReadTokyoGhoul (This Gorilla Will Die in 1 Day)',
            url: DOMAIN + '/manga/this-gorilla-will-die-in-1-day'
        },
        {
            title: 'ReadTokyoGhoul (Tokyo Ghoul: Zakki)',
            url: DOMAIN + '/manga/tokyo-ghoul-zakki'
        },
        {
            title: 'ReadTokyoGhoul (Tokyo Ghoul:re Light Novels)',
            url: DOMAIN + '/manga/tokyo-ghoul-re-light-novels'
        }
    ]
}