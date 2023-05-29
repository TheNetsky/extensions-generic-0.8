import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaBox
} from '../MangaBox'

const SITE_DOMAIN = 'https://manganato.com'

export const ManganatoInfo: SourceInfo = {
    version: getExportVersion('0.0.3'),
    name: 'Manganato',
    icon: 'icon.png',
    author: 'Batmeow',
    authorWebsite: 'https://github.com/Batmeow',
    description: `Extension that pulls manga from ${SITE_DOMAIN}.`,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SITE_DOMAIN,
    sourceTags: [],
    intents: SourceIntents.SETTINGS_UI | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.MANGA_CHAPTERS
}

export class Manganato extends MangaBox {
    // Website base URL.
    baseURL = SITE_DOMAIN

    // Language code supported by the source.
    languageCode = '🇬🇧'

    // Path for manga list.
    mangaListPath = 'genre-all'

    // Selector for manga in manga list.
    mangaListSelector = 'div.panel-content-genres div.content-genres-item'

    // Selector for subtitle in manga list.
    mangaSubtitleSelector = 'a.genres-item-chap.text-nowrap'
}
