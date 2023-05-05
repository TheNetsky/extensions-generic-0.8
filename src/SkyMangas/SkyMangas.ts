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
import {
    createHomeSection,
    DefaultHomeSectionData
} from '../MangaStreamHelper'
import { SkyMangasParser } from './SkyMangasParser'

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

    override parser = new SkyMangasParser()

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
        this.sections['popular_today']!.selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Popular Today)')?.parent()?.next())
        this.sections['latest_update']!.selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Latest Update)')?.parent()?.next())
        this.sections['new_titles']!.enabled = false
        this.sections['top_alltime']!.enabled = false
        this.sections['top_monthly']!.enabled = false
        this.sections['top_weekly']!.enabled = false

        this.sections['project_updates'] = {
            ...DefaultHomeSectionData,
            section: createHomeSection('project_updates', 'Project Updates', true),
            selectorFunc: ($: CheerioStatic) => $('div.bsx', $('h2:contains(Project Update)')?.parent()?.next()),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('a', element).attr('title'),
            subtitleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('div.epxs', element).text().trim(),
            getViewMoreItemsFunc: (page: string) => `project/page/${page}`,
            sortIndex: 11,
        }
    }
}