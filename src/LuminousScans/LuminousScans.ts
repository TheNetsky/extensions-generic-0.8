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

const DOMAIN = 'https://luminousscans.com'

export const LuminousScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LuminousScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'yehru',
    authorWebsite: 'http://github.com/yehrupx',
    icon: 'logo.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class LuminousScans extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'series'

    override usePostIds = false

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false
    }
}