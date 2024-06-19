import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Hean
} from '../Hean'

const DOMAIN = 'https://omegascans.org'

export const OmegaScansInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'OmegaScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'YvesPa',
    authorWebsite: 'http://github.com/YvesPa',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class OmegaScans extends Hean {

    baseUrl: string = DOMAIN

    apiUrl: string = DOMAIN.replace('://', '://api.')
}