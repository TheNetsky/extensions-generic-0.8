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

import { AsuraScansParser } from './AsuraScansParser'

const DOMAIN = 'https://www.asurascans.com'

export const AsuraScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AsuraScans',
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
        },
        {
            text: 'CloudFlare',
            type: BadgeColor.RED
        }
    ]
}

export class AsuraScans extends MangaStream {

    baseUrl: string = DOMAIN

    override readonly parser: AsuraScansParser = new AsuraScansParser()

    override configureSections(): void {
        this.homescreen_sections['new_titles'].enabled = false
    }
}