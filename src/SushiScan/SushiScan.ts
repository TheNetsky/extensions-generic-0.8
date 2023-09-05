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

const DOMAIN = 'https://sushiscan.net'

export const SushiScanInfo: SourceInfo = {
    version: getExportVersion('0.0.2'),
    name: 'Sushi Scan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: 'French',
            type: BadgeColor.GREY
        }
    ]
}

export class SushiScan extends MangaStream {
    baseUrl: string = DOMAIN

    override usePostIds = false

    override directoryPath = 'catalogue'

    override language = '🇫🇷'

    override manga_tag_selector_box = 'div.seriestugenre'

    override manga_selector_artist = 'Dessinateur'
    override manga_selector_author = 'Auteur'
    override manga_selector_status = 'Statut'

    override manga_StatusTypes = {
        ONGOING: 'En Cours',
        COMPLETED: 'Terminé'
    }

    // ----DATE SELECTORS----
    /**
     * Enter the months for the website's language in correct order, case insensitive.
     * Default = English Translation
     */
    override dateMonths = {
        january: 'janvier',
        february: 'février',
        march: 'mars',
        april: 'avril',
        may: 'mai',
        june: 'juin',
        july: 'juillet',
        august: 'août',
        september: 'septembre',
        october: 'octobre',
        november: 'novembre',
        december: 'décembre'
    }

    override configureSections() {
        this.homescreen_sections['popular_today'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Populaire Aujourd\'hui)')?.parent()?.next())
        this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioStatic) => $('div.utao', $('h2:contains(Dernières Sorties)')?.parent()?.next())
        this.homescreen_sections['new_titles'].enabled = false
    }
}