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

const DOMAIN = 'https://modescanlator.com'

export const ModeScanlatorInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ModeScanlator',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'YvesPa',
    authorWebsite: 'http://github.com/YvesPa',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'Brazil',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class ModeScanlator extends Hean {

    baseUrl: string = DOMAIN

    apiUrl: string = DOMAIN.replace('://', '://api.')

    override language = '🇧🇷'
}