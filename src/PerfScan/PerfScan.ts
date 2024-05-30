import {
    ContentRating,
    SourceInfo,
    SourceIntents,
    BadgeColor
} from '@paperback/types'

import {
    getExportVersion,
    Hean
} from '../Hean'

const DOMAIN = 'https://perf-scan.fr'

export const PerfScanInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'PerfScan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'YvesPa',
    authorWebsite: 'http://github.com/YvesPa',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'French',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class PerfScan extends Hean {

    baseUrl: string = DOMAIN

    apiUrl: string = DOMAIN.replace('://', '://api.')

    override language = '🇫🇷'
}