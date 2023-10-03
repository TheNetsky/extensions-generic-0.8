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

const DOMAIN = 'https://ww1.readchainsawman.com'

export const ReadChainsawManInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadChainsawMan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadChainsawMan extends MangaCatalog {

    baseUrl: string = DOMAIN


    baseSourceList: SourceBase[] = [
        {
            title: 'ReadChainsawMan (Chainsaw Man)',
            url: DOMAIN + '/manga/chainsaw-man'
        },
        {
            title: 'ReadChainsawMan (Fire Punch)',
            url: DOMAIN + '/manga/fire-punch'
        },
        {
            title: 'ReadChainsawMan (Yogen No Nayuta)',
            url: DOMAIN + '/manga/yogen-no-nayuta'
        },
        {
            title: 'ReadChainsawMan (Chainsaw Man Colored)',
            url: DOMAIN + '/manga/chainsaw-man-colored'
        }
    ]
}