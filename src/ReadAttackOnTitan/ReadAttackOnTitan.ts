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

const DOMAIN = 'https://readsnk.com'

export const ReadAttackOnTitanInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadAttackOnTitan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadAttackOnTitan extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/XDcjemc.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadAttackOnTitan (Shingeki No Kyojin)',
            url: DOMAIN + '/manga/shingeki-no-kyojin'
        },
        {
            title: 'ReadAttackOnTitan (Shingeki No Kyojin Colored)',
            url: DOMAIN + '/manga/shingeki-no-kyojin-colored'
        },
        {
            title: 'ReadAttackOnTitan (Shingeki No Kyojin Before the Fall)',
            url: DOMAIN + '/manga/shingeki-no-kyojin-before-the-fall'
        },
        {
            title: 'ReadAttackOnTitan (Shingeki No Kyojin Lost Girls)',
            url: DOMAIN + '/manga/shingeki-no-kyojin-lost-girls/'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan No Regrets)',
            url: DOMAIN + '/manga/attack-on-titan-no-regrets'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan Junior High)',
            url: DOMAIN + '/manga/attack-on-titan-junior-high'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan Harsh Mistress of the City)',
            url: DOMAIN + '/manga/attack-on-titan-harsh-mistress-of-the-city'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan Anthology)',
            url: DOMAIN + '/manga/attack-on-titan-anthology'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan Exclusive Art Book)',
            url: DOMAIN + '/manga/attack-on-titan-exclusive-art-book'
        },
        {
            title: 'ReadAttackOnTitan (Spoof On Titan)',
            url: DOMAIN + '/manga/spoof-on-titan'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan Guidebook Inside Outside)',
            url: DOMAIN + '/manga/attack-on-titan-guidebook-inside-outside'
        },
        {
            title: 'ReadAttackOnTitan (Attack On Titan No Regrets Colored)',
            url: DOMAIN + '/manga/attack-on-titan-no-regrets-colored'
        }
    ]
}