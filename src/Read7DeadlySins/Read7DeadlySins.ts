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

const DOMAIN = 'https://read7deadlysins.com'

export const Read7DeadlySinsInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'Read7DeadlySins',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class Read7DeadlySins extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/kgIqH74.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'Read7DeadlySins (Four Horsemen of The Apocalypse)',
            url: DOMAIN + '/manga/four-horsemen-of-the-apocalypse'
        },
        {
            title: 'Read7DeadlySins (Mayoe Nanatsu No Taizai Gakuen)',
            url: DOMAIN + '/manga/mayoe-nanatsu-no-taizai-gakuen'
        },
        {
            title: 'Read7DeadlySins (Nanatsu No Taizai Seven Days)',
            url: DOMAIN + '/manga/nanatsu-no-taizai-seven-days'
        },
        {
            title: 'Read7DeadlySins (Nanatsu No Taizai Vampires of Edinburgh)',
            url: DOMAIN + '/manga/nanatsu-no-taizai-vampires-of-edinburgh'
        },
        {
            title: 'Read7DeadlySins (The Queen of the Altar)',
            url: DOMAIN + '/manga/the-queen-of-the-altar'
        },
        {
            title: 'Read7DeadlySins (Nanatsu No Taizai Nanairo No Tsuioku)',
            url: DOMAIN + '/manga/nanatsu-no-taizai-nanairo-no-tsuioku'
        },
        {
            title: 'Read7DeadlySins (Fairy Tail X Nanatsu No Taizai Christmas Special)',
            url: DOMAIN + '/manga/fairy-tail-x-nanatsu-no-taizai-christmas-special'
        },
        {
            title: 'Read7DeadlySins (Nanatsu No Taizai)',
            url: DOMAIN + '/manga/nanatsu-no-taizai'
        },
        {
            title: 'Read7DeadlySins (Nanatsu No Taizai the Seven Scars Which They Left Behind)',
            url: DOMAIN + '/manga/nanatsu-no-taizai-the-seven-scars-which-they-left-behind'
        },
        {
            title: 'Read7DeadlySins (Kongou Banchou)',
            url: DOMAIN + '/manga/kongou-banchou'
        }
    ]
}