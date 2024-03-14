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

const DOMAIN = 'https://readchainsawman.com'

export const ReadChainsawManInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadChainsawMan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadChainsawMan extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/EOwoyN9.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadChainsawMan (Chainsaw Man)',
            url: DOMAIN + '/manga/chainsaw-man'
        },
        {
            title: 'ReadChainsawMan (Chainsaw Man Part 2)',
            url: DOMAIN + '/manga/chainsaw-man-part-2'
        }
    ]
}