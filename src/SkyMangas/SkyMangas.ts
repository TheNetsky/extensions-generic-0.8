import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { MangaStream } from '../MangaStream'

const SKYMANGAS_DOMAIN = "http://skymangas.com"

export const SkyMangasInfo: SourceInfo = {
    version: '1.0.1',
    name: 'SkyMangas',
    description: 'Extension that pulls manga from SkyMangas',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: SKYMANGAS_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN
        },
        {
            text: "Spanish",
            type: TagType.GREY
        }
    ]
}

export class SkyMangas extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = SKYMANGAS_DOMAIN
    languageCode: LanguageCode = LanguageCode.FRENCH
    hasAdvancedSearchPage: boolean = true

    //----DATE SETTINGS
    dateMonths = {
        january: "enero",
        february: "febrero",
        march: "marzo",
        april: "abril",
        may: "mayo",
        june: "junio",
        july: "julio",
        august: "agosto",
        september: "septiembre",
        october: "octubre",
        november: "noviembre",
        december: "diciembre"
    };
    dateTimeAgo = {
        now: ["less than an hour", "just now"],
        yesterday: ["ayer"],
        years: ["año", "ano"],
        months: ["mes", "meses"],
        weeks: ["semana", "semanas"],
        days: ["día", "dia", "dias"],
        hours: ["hora"],
        minutes: ["minutre"],
        seconds: ["segundo"]
    };

    //----MANGA DETAILS SELECTORS
    manga_selector_author: string = "Autor"

    manga_selector_artist: string = "Artista"

    manga_selector_status: string = "Estado"

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

    homescreen_PopularToday_enabled: boolean = true
    homescreen_PopularToday_selector: string = "h2:contains(Popular Hoy)"

    homescreen_LatestUpdate_enabled: boolean = true
    homescreen_LatestUpdate_selector_box: string = "h2:contains(Actualizaciones)"

    homescreen_NewManga_enabled: boolean = false

    homescreen_TopAllTime_enabled: boolean = true
    homescreen_TopMonthly_enabled: boolean = true
    homescreen_TopWeekly_enabled: boolean = true

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

    tags_SubdirectoryPathName: string = ""
    tags_selector_box: string = "ul.genre"
    tags_selector_item: string = "li"
    tags_selector_label: string = ""

}
