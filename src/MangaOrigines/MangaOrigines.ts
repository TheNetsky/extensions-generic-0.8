import {
    ContentRating,
    BadgeColor,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://mangas-origines.fr'

export const MangaOriginesInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'MangaOrigines',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: 'French',
            type: BadgeColor.GREY
        },
        {
            text: 'Region Locked',
            type: BadgeColor.RED
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class MangaOrigines extends Madara {

    baseUrl: string = DOMAIN

    override chapterEndpoint = 1

    override directoryPath = 'oeuvre'

    override language = '🇫🇷'
}