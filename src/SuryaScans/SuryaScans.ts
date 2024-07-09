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

const DOMAIN = 'https://genztoons.com'

export const SuryaScansInfo: SourceInfo = {
    version: getExportVersion('0.0.4'),
    name: 'SuryaScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class SuryaScans extends MangaStream {

    baseUrl: string = DOMAIN

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false

    }
}
