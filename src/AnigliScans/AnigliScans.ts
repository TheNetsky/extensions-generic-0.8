
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

const DOMAIN = 'https://anigliscans.com'

export const AnigliScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AnigliScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ]
}

export class AnigliScans extends MangaStream {

    baseUrl: string = DOMAIN

    override usePostIds = false

    override directoryPath = 'series'

    override configureSections(): void {
        this.homescreen_sections['new_titles'].enabled = false
    }
}