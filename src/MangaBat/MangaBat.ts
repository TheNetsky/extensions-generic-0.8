import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaBox,
} from '../MangaBox'

const SITE_DOMAIN = 'https://h.mangabat.com'

export const MangaBatInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaBat',
    icon: 'icon.png',
    author: 'Batmeow',
    authorWebsite: 'https://github.com/Batmeow',
    description: `Extension that pulls manga from ${SITE_DOMAIN}.`,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SITE_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ],
    intents: SourceIntents.SETTINGS_UI | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.MANGA_CHAPTERS
}

export class MangaBat extends MangaBox {
    // Website base URL.
    baseURL = SITE_DOMAIN

    // Language code supported by the source.
    languageCode = '🇬🇧'

    // Path for manga list.
    mangaListPath = 'manga-list-all'

    // Selector for manga in manga list.
    mangaListSelector = 'div.panel-list-story div.list-story-item'

    // Selector for subtitle in manga list.
    mangaSubtitleSelector = 'a.genres-item-chap.text-nowrap, div.item-right a.item-chapter'
}
