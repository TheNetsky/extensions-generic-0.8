import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { MangaStream } from '../MangaStream'

const BLACKARMY_DOMAIN = "https://blackarmy.fr"

export const BlackArmyInfo: SourceInfo = {
    version: '1.0.1',
    name: 'BlackArmy',
    description: 'Extension that pulls manga from BlackArmy',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: BLACKARMY_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN
        },
        {
            text: "French",
            type: TagType.GREY
        }
    ]
}

export class BlackArmy extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = BLACKARMY_DOMAIN
    languageCode: LanguageCode = LanguageCode.FRENCH
    hasAdvancedSearchPage: boolean = true

    //----DATE SETTINGS
    dateMonths = {
        january: "janvier",
        february: "février",
        march: "mars",
        april: "avril",
        may: "mai",
        june: "juin",
        july: "juillet",
        august: "aout",
        september: "septembre",
        october: "octobre",
        november: "novembre",
        december: "décembre"
    };
    dateTimeAgo = {
        now: ["less than an hour", "just now"],
        yesterday: ["hier"],
        years: ["year"],
        months: ["mois"],
        weeks: ["semaine"],
        days: ["jour"],
        hours: ["heure"],
        minutes: ["minute"],
        seconds: ["second"]
    };

    //----MANGA DETAILS SELECTORS
    manga_selector_author: string = "Autheur"

    manga_selector_artist: string = "Artiste"

    manga_selector_status: string = "Statut"

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

    homescreen_PopularToday_enabled: boolean = true
    homescreen_PopularToday_selector: string = "h2:contains(Populaire aujourd'hui)"

    homescreen_LatestUpdate_enabled: boolean = true
    homescreen_LatestUpdate_selector_box: string = "h2:contains(Dernière Sortie)"

    homescreen_NewManga_enabled: boolean = true
    homescreen_NewManga_selector: string = "h3:contains(nouvelle séries)"

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
