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

const DOMAIN = 'https://readkomik.com'

export const ReadKomikInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadKomik',
    description: 'Extension that pulls manga from ReadKomik',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class ReadKomik extends MangaStream {

    baseUrl: string = DOMAIN

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false
    }
}