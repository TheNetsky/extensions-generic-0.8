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

const LELMANGA_DOMAIN = 'https://www.lelmanga.com'

export const LelMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LelManga',
    description: 'Extension that pulls manga from LelManga',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: LELMANGA_DOMAIN,
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

export class LelManga extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = LELMANGA_DOMAIN
    languageCode: LanguageCode = LanguageCode.FRENCH

    //----MANGA DETAILS SELECTORS
    /*
    If a website uses different names/words for the status below, change them to these.
    These must also be changed id a different language is used!
    Don't worry, these are case insensitive.
    */

    //----MANGA DETAILS SELECTORS
    override manga_selector_author = 'Autheur'

    override manga_selector_artist = 'Artiste'

    //manga_StatusTypes: object = { 
    //    ONGOING: "ongoing",
    //    COMPLETED: "completed"
    //}


    //----HOMESCREEN SELECTORS
    //Disabling some of these will cause some Home-Page tests to fail, edit these test files to match the setting.
    //Always be sure to test this in the app!

    override homescreen_PopularToday_enabled = true
    override homescreen_PopularToday_selector = 'h2:contains(Top Managa Aujourd\'hui)'

    override homescreen_LatestUpdate_enabled = true
    override homescreen_LatestUpdate_selector_box = 'h2:contains(Dernières Sorties)'

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
