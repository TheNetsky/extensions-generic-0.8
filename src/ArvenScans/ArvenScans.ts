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

const DOMAIN = 'https://arvenscans.org/'

export const ArvenScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ArvenScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Gabe',
    authorWebsite: 'http://github.com/GabrielCWT',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class ArvenScans extends MangaStream {

    baseUrl: string = DOMAIN
    
    override directoryPath = 'series'

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false

    }
}