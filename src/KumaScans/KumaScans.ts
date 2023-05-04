/* eslint-disable linebreak-style */
import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'

const KUMASCANS_DOMAIN = 'https://kumascans.com'

export const KumaScansInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'KumaScans',
    description: 'Extension that pulls manga from KumaScans',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: KUMASCANS_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ]
}

export class KumaScans extends MangaStream {

    baseUrl: string = KUMASCANS_DOMAIN
    language: string = '🇬🇧'

    override configureSections() {
        this.latestUpdateSection.selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Latest Update)')?.parent()?.next())
    }

}