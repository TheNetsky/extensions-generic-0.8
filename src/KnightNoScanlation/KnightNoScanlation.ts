import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

import {
    KnightNoScanlationParser
} from './KnightNoScanlationParser'

const DOMAIN = 'https://kns.twobluescans.com'

export const KnightNoScanlationInfo: SourceInfo = {
    version: getExportVersion('0.0.2'),
    name: 'KnightNoScanlation',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky & Seitenca',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'Spanish',
            type: BadgeColor.GREY
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class KnightNoScanlation extends Madara {

    baseUrl: string = DOMAIN

    override language = '🇪🇸'

    override chapterEndpoint = 1

    override parser: KnightNoScanlationParser = new KnightNoScanlationParser()
}
