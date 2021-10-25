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

const ALPHASCANS_DOMAIN = 'https://alpha-scans.org'

export const AlphaScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AlphaScans',
    description: 'Extension that pulls manga from AlphaScans',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: ALPHASCANS_DOMAIN
}

export class AlphaScans extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = ALPHASCANS_DOMAIN
    languageCode: LanguageCode = LanguageCode.ENGLISH

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
    //Disabling some of these will cause some Home-Page tests to fail, edit these test files to match the setting.
    //Always be sure to test this in the app!

    override homescreen_PopularToday_enabled = true

    override homescreen_LatestUpdate_enabled = false //Directly links chapter, not manga details page!

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

}
