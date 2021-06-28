import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { MangaStream } from '../MangaStream'

const READKOMIK_DOMAIN = "https://readkomik.com"

export const ReadKomikInfo: SourceInfo = {
    version: '1.0.2',
    name: 'ReadKomik',
    description: 'Extension that pulls manga from ReadKomik',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: READKOMIK_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN
        }
    ]
}

export class ReadKomik extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = READKOMIK_DOMAIN
    languageCode: LanguageCode = LanguageCode.ENGLISH
    hasAdvancedSearchPage: boolean = true

    //----MANGA DETAILS SELECTORS
    /*
    If a website uses different names/words for the status below, change them to these.
    These must also be changed id a different language is used!
    Don't worry, these are case insensitive.
    */

    //manga_StatusTypes: object = { 
    //    ONGOING: "ongoing",
    //    COMPLETED: "completed"
    //}

    //----HOMESCREEN SELECTORS
    //Disabling some of these will cause some Home-Page tests to fail, be sure to test this in the app!
    homescreen_PopularToday_enabled: boolean = true

    homescreen_LatestUpdate_enabled: boolean = true

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
