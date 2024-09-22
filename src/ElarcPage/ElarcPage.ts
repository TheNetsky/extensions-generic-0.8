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

const DOMAIN = 'https://elarctoons.biz'

export const ElarcPageInfo: SourceInfo = {
    version: getExportVersion('0.0.4'),
    name: 'ElarcPage',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class ElarcPage extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'series'

    override configureSections(): void {
        this.homescreen_sections['new_titles'].enabled = false
    }
}
