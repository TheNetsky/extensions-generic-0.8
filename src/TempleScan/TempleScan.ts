import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Hean
} from '../Hean'

const DOMAIN = 'https://templescan.net'

export const TempleScanInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'TempleScan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'YvesPa',
    authorWebsite: 'http://github.com/YvesPa',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class TempleScan extends Hean {

    baseUrl: string = DOMAIN

    apiUrl = 'https://templescan.net/apiv1'

    override useChapterQuery = false
}