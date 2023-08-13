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

const DOMAIN = 'https://realmscans.xyz'

export const RealmScansInfo: SourceInfo = {
    version: getExportVersion('0.0.2'),
    name: 'RealmScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Seyden',
    authorWebsite: 'http://github.com/Seyden',
    icon: 'icon.webp',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class RealmScans extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'm050523/series'

    override usePostIds = false

    override configureSections(): void {
        this.homescreen_sections['new_titles'].enabled = false
    }
}
