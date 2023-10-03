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

const DOMAIN = 'https://ww5.readfairytail.com'

export const ReadFairyTailInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadFairyTail',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadFairyTail extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadEdensZero (Edens Zero)',
            url: DOMAIN + '/manga/edens-zero'
        },
        {
            title: 'ReadEdensZero (Fairy Tail)',
            url: DOMAIN + '/manga/fairy-tail'
        },
        {
            title: 'ReadEdensZero (Fairy Tail: Zero)',
            url: DOMAIN + '/manga/fairy-tail-zero'
        },
        {
            title: 'ReadEdensZero (Fairy Tail: City Hero)',
            url: DOMAIN + '/manga/fairy-tail-city-hero'
        },
        {
            title: 'ReadEdensZero (Heros)',
            url: DOMAIN + '/manga/heros'
        },
        {
            title: 'ReadEdensZero (Fairy Tail: Happy\'s Grand Adventure)',
            url: DOMAIN + '/manga/fairy-tail-happys-grand-adventure'
        },
        {
            title: 'ReadEdensZero (Fairy Tail: 100 Years Quest)',
            url: DOMAIN + '/manga/fairy-tail-100-years-quest'
        },
        {
            title: 'ReadEdensZero (Fairy Tail: Ice Trail)',
            url: DOMAIN + '/manga/fairy-tail-ice-trail'
        },
        {
            title: 'ReadEdensZero (Fairy Tail x Nanatsu no Taizai Christmas Special)',
            url: DOMAIN + '/manga/fairy-tail-x-nanatsu-no-taizai-christmas-special'
        },
        {
            title: 'ReadEdensZero (Parasyte x Fairy Tail)',
            url: DOMAIN + '/manga/parasyte-x-fairy-tail'
        },
        {
            title: 'ReadEdensZero (Monster Hunter: Orage)',
            url: DOMAIN + '/manga/monster-hunter-orage'
        },
        {
            title: 'ReadEdensZero (Rave Master)',
            url: DOMAIN + '/manga/rave-master'
        },
        {
            title: 'ReadEdensZero (Fairy Tail x Rave)',
            url: DOMAIN + '/manga/fairy-tail-x-rave'
        },
        {
            title: 'ReadEdensZero (Fairy Tail Gaiden: Raigo Issen)',
            url: DOMAIN + '/manga/fairy-tail-gaiden-raigo-issen'
        },
        {
            title: 'ReadEdensZero (Fairy Tail Gaiden: Kengami no Souryuu)',
            url: DOMAIN + '/manga/fairy-tail-gaiden-kengami-no-souryuu'
        },
        {
            title: 'ReadEdensZero (Fairy Tail Gaiden: Road Knight)',
            url: DOMAIN + '/manga/fairy-tail-gaiden-road-knight'
        }
    ]
}