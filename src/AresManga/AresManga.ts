import {
    BadgeColor,
    Chapter,
    ChapterDetails,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'

const DOMAIN = 'https://aresmanga.org'

export const AresMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AresManga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Ali Mohamed',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: 'Arabic',
            type: BadgeColor.GREY
        }
    ]
}
export class AresManga extends MangaStream {
    override baseUrl = DOMAIN
    override language ='AR'
    override directoryPath = 'series'
    override manga_selector_author = 'المؤلف'
    override manga_selector_artist = 'الرسام'
    override manga_selector_status = 'الحالة'

     //----DATE SETTINGS
     override dateMonths = {
        january: 'يناير',
        february: 'فبراير',
        march: 'مارس',
        april: 'أبريل',
        may: 'مايو',
        june: 'يونيو',
        july: 'يوليو',
        august: 'أغسطس',
        september: 'سبتمبر',
        october: 'أكتوبر',
        november: 'نوفمبر',
        december: 'ديسمبر'
    }

 override configureSections() {
    this.homescreen_sections['new_titles'].enabled = false
    this.homescreen_sections['popular_today'].enabled = false
    this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(جديد إصداراتنا)')?.parent()?.next())
    }
}