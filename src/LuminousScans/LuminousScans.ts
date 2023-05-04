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

const LUMINOUSSCANS_DOMAIN = 'https://luminousscans.com'

export const LuminousScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LuminousScans',
    description: 'Extension that pulls manga from LuminousScans',
    author: 'yehru',
    authorWebsite: 'http://github.com/yehrupx',
    icon: 'logo.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: LUMINOUSSCANS_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ]
}

export class LuminousScans extends MangaStream {

    baseUrl: string = LUMINOUSSCANS_DOMAIN
    language: string = '🇬🇧'

    override sourceTraversalPathName = 'series'

    override configureSections() {
        this.newMangaSection.enabled = false
    }

}