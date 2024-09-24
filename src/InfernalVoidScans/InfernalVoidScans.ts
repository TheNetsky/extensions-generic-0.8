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

const DOMAIN = 'https://hivetoon.net'

export const InfernalVoidScansInfo: SourceInfo = {
    version: getExportVersion('0.0.3'),
    name: 'InfernalVoidScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'nicknitewolf',
    authorWebsite: 'http://github.com/nicknitewolf',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class InfernalVoidScans extends MangaStream {

    baseUrl: string = DOMAIN

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false
    }
}
