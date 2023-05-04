/* eslint-disable linebreak-style */
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

const SKYMANGAS_DOMAIN = 'https://skymangas.com'

export const SkyMangasInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'SkyMangas',
    description: 'Extension that pulls manga from SkyMangas',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SKYMANGAS_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
        {
            text: 'Spanish',
            type: BadgeColor.GREY
        }
    ]
}

export class SkyMangas extends MangaStream {

    baseUrl: string = SKYMANGAS_DOMAIN
    language: string = '🇪🇸'

    //----DATE SETTINGS
    override dateMonths = {
        january: 'enero',
        february: 'febrero',
        march: 'marzo',
        april: 'abril',
        may: 'mayo',
        june: 'junio',
        july: 'julio',
        august: 'agosto',
        september: 'septiembre',
        october: 'octubre',
        november: 'noviembre',
        december: 'diciembre'
    }

    override dateTimeAgo = {
        now: [
            'less than an hour',
            'just now'
        ],
        yesterday: ['ayer'],
        years: [
            'año',
            'ano'
        ],
        months: [
            'mes',
            'meses'
        ],
        weeks: [
            'semana',
            'semanas'
        ],
        days: [
            'día',
            'dia',
            'dias'
        ],
        hours: ['hora'],
        minutes: ['minutre'],
        seconds: ['segundo']
    }

    //----MANGA DETAILS SELECTORS
    override manga_selector_author = 'Autor'
    override manga_selector_artist = 'Artista'
    override manga_selector_status = 'Estado'

    override configureSections() {
        //this.popularTodaySection.selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Popular Today)')?.parent()?.next())
        this.latestUpdateSection.selectorFunc = ($: CheerioStatic) => $('div.uta', $('h2:contains(Latest Updates)')?.parent()?.next())
        this.newMangaSection.enabled = false
        this.topMonthlySection.enabled
        this.topWeeklySection.enabled
        this.topAllTimeSection.enabled
    }

}