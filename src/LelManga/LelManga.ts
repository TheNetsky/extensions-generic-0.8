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

const DOMAIN = 'https://www.lelmanga.com'

export const LelMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LelManga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: 'French',
            type: BadgeColor.GREY
        }
    ]
}

export class LelManga extends MangaStream {

    baseUrl: string = DOMAIN
    override language = '🇫🇷'

    override manga_selector_author = 'Autheur'
    override manga_selector_artist = 'Artiste'

    override configureSections() {
        this.homescreen_sections['popular_today'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Top Managa Aujourd\'hui)')?.parent()?.next())
        this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioStatic) => $('div.uta', $('h2:contains(Dernières Sorties)')?.parent()?.next())
        this.homescreen_sections['new_titles'].enabled = false
    }

    override supportsTagExclusion = async (): Promise<boolean> => true
}