/* eslint-disable linebreak-style */
import {
    LanguageCode,
    SourceInfo,
    TagType,
    ContentRating
} from 'paperback-extensions-common'

import {
    MangaStream,
    getExportVersion
} from '../MangaStream'

const BLACKARMY_DOMAIN = 'https://blackarmy.fr'

export const BlackArmyInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'BlackArmy',
    description: 'Extension that pulls manga from BlackArmy',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: BLACKARMY_DOMAIN,
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

export class BlackArmy extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = BLACKARMY_DOMAIN
    languageCode: LanguageCode = LanguageCode.FRENCH

    //----DATE SETTINGS
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
    override dateTimeAgo = {
        now: ['less than an hour', 'just now'],
        yesterday: ['hier'],
        years: ['year'],
        months: ['mois'],
        weeks: ['semaine'],
        days: ['jour'],
        hours: ['heure'],
        minutes: ['minute'],
        seconds: ['second']
    };

    //----MANGA DETAILS SELECTORS
    override manga_selector_author = 'Autheur'

    override manga_selector_artist = 'Artiste'

    override manga_selector_status = 'Statut'

    /*
    If a website uses different names/words for the status below, change them to these.
    These must also be changed id a different language is used!
    Don't worry, these are case insensitive.
    */
    /*
        manga_StatusTypes = {
            ONGOING: "En cours",
            COMPLETED: "Terminée"
        }
    */
    //----HOMESCREEN SELECTORS
    //Disabling some of these will cause some Home-Page tests to fail, edit these test files to match the setting.
    //Always be sure to test this in the app!

    override homescreen_PopularToday_enabled = true
    override homescreen_PopularToday_selector = 'h2:contains(Populaire aujourd\'hui)'

    override homescreen_LatestUpdate_enabled = true
    override homescreen_LatestUpdate_selector_box = 'h2:contains(Dernière Sortie)'

    override homescreen_NewManga_enabled = true
    override homescreen_NewManga_selector = 'h3:contains(nouvelle séries)'

    override homescreen_TopAllTime_enabled = true
    override homescreen_TopMonthly_enabled = true
    override homescreen_TopWeekly_enabled = true

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

    override tags_SubdirectoryPathName = ''
    override tags_selector_box = 'ul.genre'
    override tags_selector_item = 'li'
    override tags_selector_label = ''

}
