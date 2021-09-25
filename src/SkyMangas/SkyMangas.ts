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

const SKYMANGAS_DOMAIN = 'https://skymangas.com'

export const SkyMangasInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'SkyMangas',
    description: 'Extension that pulls manga from SkyMangas',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SKYMANGAS_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: TagType.GREEN
        },
        {
            text: 'Spanish',
            type: TagType.GREY
        }
    ]
}

export class SkyMangas extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = SKYMANGAS_DOMAIN
    languageCode: LanguageCode = LanguageCode.SPANISH

    //----DATE SETTINGS
    override dateMonths = {
        january: 'enero',
        february: 'febrero',
        march: 'marzo',
        april: 'abril',
        may: 'mayo',
        june: 'junio',
        july: 'julio',
        august: 'agosto',
        september: 'septiembre',
        october: 'octubre',
        november: 'noviembre',
        december: 'diciembre'
    };
    override dateTimeAgo = {
        now: ['less than an hour', 'just now'],
        yesterday: ['ayer'],
        years: ['año', 'ano'],
        months: ['mes', 'meses'],
        weeks: ['semana', 'semanas'],
        days: ['día', 'dia', 'dias'],
        hours: ['hora'],
        minutes: ['minutre'],
        seconds: ['segundo']
    };

    //----MANGA DETAILS SELECTORS
    override manga_selector_author = 'Autor'

    override manga_selector_artist = 'Artista'

    override manga_selector_status = 'Estado'

    /*
    If a website uses different names/words for the status below, change them to these.
    These must also be changed if a different language is used!
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
    override homescreen_PopularToday_selector = 'h2:contains(Popular Hoy)'

    override homescreen_LatestUpdate_enabled = true
    override homescreen_LatestUpdate_selector_box = 'h2:contains(Actualizaciones)'

    override homescreen_NewManga_enabled = false

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
