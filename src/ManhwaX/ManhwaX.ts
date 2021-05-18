import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { MangaStream } from '../MangaStream'

const MANHWAX_DOMAIN = "https://manhwax.com"

export const ManhwaXInfo: SourceInfo = {
    version: '1.0.0',
    name: 'ManhwaX',
    description: 'Extension that pulls manga from ManhwaX',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: MANHWAX_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN
        }
    ]
}

export class ManhwaX extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = MANHWAX_DOMAIN
    languageCode: LanguageCode = LanguageCode.ENGLISH
    hasAdvancedSearchPage: boolean = true

    //----HOMESCREEN SELECTORS
    //Disabling some of these will cause some Home-Page tests to fail, be sure to test this in the app!
    homescreenPopularTodayEnabled: boolean = false
    homescreenLatestUpdateEnabled: boolean = true
    homescreenNewMangaEnabled: boolean = false
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

    tagsSubdirectoryPathName: string = ""
    tagsBoxSelector: string = "ul.genre"
    tagsElementSelector: string = "li"
    tagsLabelSelector: string = ""

}
