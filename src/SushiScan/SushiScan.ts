/* eslint-disable linebreak-style */
import {
    LanguageCode,
    SourceInfo,
    ContentRating,
    TagType
} from 'paperback-extensions-common'

import {
    MangaStream,
    getExportVersion
} from '../MangaStream'
import { SushiScanParser } from './SushiScanParser'

const SUSHI_SCAN_DOMAIN = 'https://sushiscan.su'

export const SushiScanInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'Sushi Scan',
    description: 'Extension that pulls manga from sushiscan.su',
    author: 'btylerh7',
    authorWebsite: 'http://github.com/btylerh7',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: SUSHI_SCAN_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: TagType.GREEN
        },
        {
            text: 'French',
            type: TagType.GREY
        }
    ]
}

export class SushiScan extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = SUSHI_SCAN_DOMAIN
    languageCode: LanguageCode = LanguageCode.FRENCH
    override parser = new SushiScanParser()

    //----MANGA DETAILS SELECTORS
    /*
    If a website uses different names/words for the status below, change them to these.
    These must also be changed id a different language is used!
    Don't worry, these are case insensitive.
    */

    override manga_selector_artist = 'Dessinateur'
    override manga_selector_author = 'Auteur'
    override manga_selector_status = 'Statut'

    /**
    * The selector for the manga status.
    * These can change depending on the language
    * Default = "ONGOING: "ONGOING", COMPLETED: "COMPLETED"
   */
    override manga_StatusTypes = {
        ONGOING: 'En Cours',
        COMPLETED: 'Terminé'
    }

    override tags_SubdirectoryPathName = 'manga'

    //----DATE SELECTORS----
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
    };
    /**
     * In this object, add the site's translations for the following time formats, case insensitive.
     * If the site uses "12 hours ago" or "1 hour ago", only adding "hour" will be enough since "hours" includes "hour".
     * Default =  English Translation
     */
    override dateTimeAgo = {
        now: ['moins d’une heure', 'tout à l\'heure', 'moment', 'maintenant'], // The "now" quotes are not confirmed
        yesterday: ['hier'],
        years: ['an'],
        months: ['mois'],
        weeks: ['semaine'],
        days: ['jour'],
        hours: ['heur'],
        minutes: ['min'],
        seconds: ['second']
    };


    //----HOMESCREEN SELECTORS
    //Disabling some of these will cause some Home-Page tests to fail, edit these test files to match the setting.
    //Always be sure to test this in the app!

    override homescreen_PopularToday_enabled = true
    override homescreen_PopularToday_selector = 'h2:contains(Populaire Aujourd\'hui)'

    override homescreen_LatestUpdate_enabled = true
    override homescreen_LatestUpdate_selector_box = 'h2:contains(Dernières Sorties)'
    override homescreen_LatestUpdate_selector_item = 'div.bsx'

    override homescreen_TopAllTime_enabled = true

    override homescreen_TopMonthly_enabled = true

    override homescreen_TopWeekly_enabled = true

    override homescreen_NewManga_enabled = false

    /*
    ----TAG SELECTORS
    PRESET 1 (default): Genres are on homepage ex. https://mangagenki.com/
    tags_SubdirectoryPathName: string = ""
    tags_selector_box: string = "ul.genre"
    tags_selector_item: string = "li"
    tags_selector_label: string = ""

    PRESET 2: with /genre/ subdirectory ex. https://mangadark.com/genres/
    tags_SubdirectoryPathName: string = "/genres/"
    tags_selector_box: string = "ul.genre"
    tags_selector_item: string = "li"
    tags_selector_label: string = "span"
    */
}
