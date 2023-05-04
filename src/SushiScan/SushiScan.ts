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

const SUSHI_SCAN_DOMAIN = 'https://sushiscan.net'

export const SushiScanInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'Sushi Scan',
    description: 'Extension that pulls manga from sushiscan.su',
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: SUSHI_SCAN_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
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

export class SushiScan extends MangaStream {
    baseUrl: string = SUSHI_SCAN_DOMAIN
    language: string = '🇫🇷'

    override manga_tag_selector_box = 'div.seriestugenre'

    override manga_selector_artist = 'Dessinateur'
    override manga_selector_author = 'Auteur'
    override manga_selector_status = 'Statut'

    override manga_StatusTypes = {
        ONGOING: 'En Cours',
        COMPLETED: 'Terminé'
    }

    override sourceTraversalPathName = 'manga'

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
    /**
     * In this object, add the site's translations for the following time formats, case insensitive.
     * If the site uses "12 hours ago" or "1 hour ago", only adding "hour" will be enough since "hours" includes "hour".
     * Default =  English Translation
     */
    override dateTimeAgo = {
        now: [
            'moins d’une heure',
            'tout à l\'heure',
            'moment',
            'maintenant'
        ], // The "now" quotes are not confirmed
        yesterday: ['hier'],
        years: ['an'],
        months: ['mois'],
        weeks: ['semaine'],
        days: ['jour'],
        hours: ['heur'],
        minutes: ['min'],
        seconds: ['second']
    }

    override configureSections() {
        this.popularTodaySection.selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Populaire Aujourd\'hui)')?.parent()?.next())
        this.latestUpdateSection.selectorFunc = ($: CheerioStatic) => $('div.utao', $('h2:contains(Dernières Sorties)')?.parent()?.next())
        this.newMangaSection.enabled = false
    }
}