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

const DOMAIN = 'https://lunarscan.org'

export const LunarScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LunarScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ]
}

export class LunarScans extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'series'

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false
    }
}