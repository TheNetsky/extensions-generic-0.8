import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'

const DOMAIN = 'https://asurascanstr.com'

export const AsuraScansTRInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AsuraScansTR',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: 'Turkish',
            type: BadgeColor.GREY
        }
    ]
}

export class AsuraScansTR extends MangaStream {

    baseUrl: string = DOMAIN

    override language = '🇹🇷'

    //----DATE SETTINGS
    override dateMonths = {
        january: 'ocak',
        february: 'şubat',
        march: 'mart',
        april: 'nisan',
        may: 'mayıs',
        june: 'Haziran',
        july: 'Temmuz',
        august: 'Ağustos',
        september: 'eylül',
        october: 'ekim',
        november: 'kasım',
        december: 'aralık'
    }

    //----MANGA DETAILS SELECTORS
    override manga_selector_author = 'Yazar'
    override manga_selector_artist = 'Seri Yayını'
    override manga_selector_status = 'Durum'

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false

        this.homescreen_sections['popular_today'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Popüler Seriler)')?.parent()?.next())
        this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioStatic) => $('div.uta', $('h2:contains(Son Yüklenen Bölümler)')?.parent()?.next())
    }
}