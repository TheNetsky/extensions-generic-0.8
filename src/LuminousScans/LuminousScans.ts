/* eslint-disable linebreak-style */
import {
    LanguageCode,
    SourceInfo,
    ContentRating,
    TagType
} from 'paperback-extensions-common'

import { MangaStream,
    getExportVersion } from '../MangaStream'

import { LuminousScansParser } from './LuminousScansParser'

const LUMINOUSSCANS_DOMAIN = 'https://luminousscans.com'

export const LuminousScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'LuminousScans',
    description: 'Extension that pulls manga from LuminousScans',
    author: 'yehru',
    authorWebsite: 'http://github.com/yehrupx',
    icon: 'logo.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: LUMINOUSSCANS_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: TagType.GREEN
        }
    ]
}

export class LuminousScans extends MangaStream {
    //FOR ALL THE SELECTIONS, PLEASE CHECK THE MangaSteam.ts FILE!!!

    baseUrl: string = LUMINOUSSCANS_DOMAIN;
    languageCode: LanguageCode = LanguageCode.ENGLISH;

    override sourceTraversalPathName = 'series';

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

    override homescreen_PopularToday_enabled = true;
    override homescreen_LatestUpdate_enabled = true;
    override homescreen_NewManga_enabled = false;
    override homescreen_TopAllTime_enabled = true;
    override homescreen_TopMonthly_enabled = true;
    override homescreen_TopWeekly_enabled = true;

    //----TAG SELECTORS
    override tags_SubdirectoryPathName = '/series/';
    override tags_selector_box = 'ul.genrez';
    override tags_selector_item = 'li';
    override tags_selector_label = 'label';

    override parser = new LuminousScansParser();
}
