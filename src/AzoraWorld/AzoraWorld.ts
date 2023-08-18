import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

import { AzoraWorldParser } from './AzoraWorldParser'

const DOMAIN = 'https://azoranov.com'

export const AzoraWorldInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AzoraWorld',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'Arabic',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class AzoraWorld extends Madara {

    baseUrl: string = DOMAIN

    override language = '🇦🇪'

    override alternativeChapterAjaxEndpoint = true
    
    override parser: AzoraWorldParser = new AzoraWorldParser()
}