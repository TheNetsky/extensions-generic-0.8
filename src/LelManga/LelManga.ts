/* eslint-disable linebreak-style */
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

const LELMANGA_DOMAIN = 'https://www.lelmanga.com'

export const LelMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LelManga',
    description: 'Extension that pulls manga from LelManga',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: LELMANGA_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
        {
            text: 'French',
            type: BadgeColor.GREY
        }
    ]
}

export class LelManga extends MangaStream {

    baseUrl: string = LELMANGA_DOMAIN
    language: string = '🇫🇷'

    override manga_selector_author = 'Autheur'
    override manga_selector_artist = 'Artiste'

    override configureSections() {
        this.sections['popular_today']!.selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Top Managa Aujourd\'hui)')?.parent()?.next())
        this.sections['latest_update']!.selectorFunc = ($: CheerioStatic) => $('div.uta', $('h2:contains(Dernières Sorties)')?.parent()?.next())
        this.sections['new_titles']!.enabled = false
    }

    override supportsTagExclusion = async (): Promise<boolean> => true
}