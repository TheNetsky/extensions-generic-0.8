import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { MangaStream } from '../MangaStream'

const MANGADARK_DOMAIN = "https://mangadark.com"

export const MangaDarkInfo: SourceInfo = {
    version: '1.0.0',
    name: 'MangaDark',
    description: 'Extension that pulls manga from MangaDark',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: MANGADARK_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN
        }
    ]
}

export class MangaDark extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = MANGADARK_DOMAIN
    languageCode: LanguageCode = LanguageCode.ENGLISH
    hasAdvancedSearchPage: boolean = true

    //----HOMESCREEN SELECTORS
    //Disabling some of these will cause some Home-Page tests to fail, be sure to test this in the app!
    homescreenPopularTodayEnabled: boolean = true
    homescreenLatestUpdateEnabled: boolean = true
    homescreenNewMangaEnabled: boolean = true
    homescreenTopAllTimeEnabled: boolean = true
    homescreenTopMonthlyEnabled: boolean = true

    /*
    ----TAG SELECTORS
    PRESET 1 (default): Genres are on homepage ex. https://mangagenki.com/
    tagsSubdirectoryPathName: string = ""
    tagsBoxSelector: string = "ul.genre"
    tagsElementSelector: string = "li"
    tagsLabelSelector: string = ""

    PRESET 2: with /genre/ subdirectory ex. https://mangadark.com/genres/
    tagsSubdirectoryPathName: string = "/genres/"
    tagsBoxSelector: string = "ul.genre"
    tagsElementSelector: string = "li"
    */

    tagsSubdirectoryPathName: string = "/genres/"
    tagsBoxSelector: string = "div.page"
    tagsElementSelector: string = "li"
    tagsLabelSelector: string = "span"

}
