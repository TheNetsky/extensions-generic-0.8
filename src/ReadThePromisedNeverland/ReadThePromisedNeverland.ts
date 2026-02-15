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

const DOMAIN = 'https://readneverland.com'

export const ReadThePromisedNeverlandInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'ReadThePromisedNeverland',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadThePromisedNeverland extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/yv8QOj4.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadThePromisedNeverland (The Promised Neverland)',
            url: DOMAIN + '/manga/the-promised-neverland'
        },
        {
            title: 'ReadThePromisedNeverland (The Parodied Jokeland)',
            url: DOMAIN + '/manga/the-parodied-jokeland'
        },
        {
            title: 'ReadThePromisedNeverland (Novels)',
            url: DOMAIN + '/manga/novels'
        },
        {
            title: 'ReadThePromisedNeverland (Poppy no Negai)',
            url: DOMAIN + '/manga/poppy-no-negai'
        },
        {
            title: 'ReadThePromisedNeverland (Shinrei Shashinshi Kouno Saburou)',
            url: DOMAIN + '/manga/shinrei-shashinshi-kouno-saburou'
        },
        {
            title: 'ReadThePromisedNeverland (Ashley Goeth no Yukue)',
            url: DOMAIN + '/manga/ashley-goeth-no-yukue'
        }
    ]
}