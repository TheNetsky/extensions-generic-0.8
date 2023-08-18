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

const DOMAIN = 'https://void-scans.com'

export const InfernalVoidScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
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
        this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioStatic) => $('div.uta', $('h2:contains(Project Update)')?.parent()?.next())
        this.homescreen_sections['new_titles'].selectorFunc = ($: CheerioStatic) => $('li', $('h3:contains(New series)')?.parent()?.next())
        this.homescreen_sections['new_titles'].enabled = false
    }
}