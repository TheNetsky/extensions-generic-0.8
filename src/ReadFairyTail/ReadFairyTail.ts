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

const DOMAIN = 'https://readfairytail.com'

export const ReadFairyTailInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadFairyTail',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadFairyTail extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/XUDUoez.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadFairyTail (Edens Zero)',
            url: DOMAIN + '/manga/edens-zero'
        },
        {
            title: 'ReadFairyTail (Fairy Tail)',
            url: DOMAIN + '/manga/fairy-tail'
        },
        {
            title: 'ReadFairyTail (Fairy Tail: Zero)',
            url: DOMAIN + '/manga/fairy-tail-zero'
        },
        {
            title: 'ReadFairyTail (Fairy Tail: City Hero)',
            url: DOMAIN + '/manga/fairy-tail-city-hero'
        },
        {
            title: 'ReadFairyTail (Heros)',
            url: DOMAIN + '/manga/heros'
        },
        {
            title: 'ReadFairyTail (Fairy Tail: Happy\'s Grand Adventure)',
            url: DOMAIN + '/manga/fairy-tail-happys-grand-adventure'
        },
        {
            title: 'ReadFairyTail (Fairy Tail: 100 Years Quest)',
            url: DOMAIN + '/manga/fairy-tail-100-years-quest'
        },
        {
            title: 'ReadFairyTail (Fairy Tail: Ice Trail)',
            url: DOMAIN + '/manga/fairy-tail-ice-trail'
        },
        {
            title: 'ReadFairyTail (Fairy Tail x Nanatsu no Taizai Christmas Special)',
            url: DOMAIN + '/manga/fairy-tail-x-nanatsu-no-taizai-christmas-special'
        },
        {
            title: 'ReadFairyTail (Parasyte x Fairy Tail)',
            url: DOMAIN + '/manga/parasyte-x-fairy-tail'
        },
        {
            title: 'ReadFairyTail (Monster Hunter: Orage)',
            url: DOMAIN + '/manga/monster-hunter-orage'
        },
        {
            title: 'ReadFairyTail (Rave Master)',
            url: DOMAIN + '/manga/rave-master'
        },
        {
            title: 'ReadFairyTail (Fairy Tail x Rave)',
            url: DOMAIN + '/manga/fairy-tail-x-rave'
        },
        {
            title: 'ReadFairyTail (Fairy Tail Gaiden: Raigo Issen)',
            url: DOMAIN + '/manga/fairy-tail-gaiden-raigo-issen'
        },
        {
            title: 'ReadFairyTail (Fairy Tail Gaiden: Kengami no Souryuu)',
            url: DOMAIN + '/manga/fairy-tail-gaiden-kengami-no-souryuu'
        },
        {
            title: 'ReadFairyTail (Fairy Tail Gaiden: Road Knight)',
            url: DOMAIN + '/manga/fairy-tail-gaiden-road-knight'
        }
    ]
}