import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaBox
} from '../MangaBox'

const SITE_DOMAIN = 'https://www.manganato.gg'

export const ManganatoInfo: SourceInfo = {
    version: getExportVersion('4.0.0'),
    name: 'Manganato',
    icon: 'icon.png',
    author: 'Batmeow',
    authorWebsite: 'https://github.com/Batmeow',
    description: `Extension that pulls manga from ${SITE_DOMAIN}.`,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SITE_DOMAIN,
    sourceTags: [],
    intents: SourceIntents.SETTINGS_UI | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.MANGA_CHAPTERS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class Manganato extends MangaBox {
    // Website base URL.
    baseURL = SITE_DOMAIN

    // Language code supported by the source.
    languageCode = '🇬🇧'

    // Path for manga list.
    mangaListPath = 'genre'

    // Appended path for manga list home sections.
    mangaListHomeSectionsPath = 'all'

    // Selector for manga in manga list.
    mangaListSelector = 'div.comic-list div.list-comic-item-wrap'

    // Selector for subtitle in manga list.
    mangaSubtitleSelector = 'a.list-story-item-wrap-chapter'

    // CloudFlare Bypass url if required.
    bypassPage = `${this.baseURL}/search/story/`
}
