import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://ww4.readnoblesse.com'

export const ReadNoblesseManhwaOnlineInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadNoblesseManhwaOnline',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadNoblesseManhwaOnline extends MangaCatalog {

    baseUrl: string = DOMAIN
    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/noblesse/",
        DOMAIN+"/manga/noblesse-rais-adventure/",
        DOMAIN+"/manga/noblesse-s/",
        DOMAIN+"/manga/ability/",
    ]
}