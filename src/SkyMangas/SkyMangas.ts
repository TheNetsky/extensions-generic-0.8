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

const DOMAIN = 'https://skymangas.com'

export const SkyMangasInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'SkyMangas',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: [
        {
            text: 'Spanish',
            type: BadgeColor.GREY
        }
    ]
}

export class SkyMangas extends MangaStream {

    baseUrl: string = DOMAIN
    override language = '🇪🇸'

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

    //----MANGA DETAILS SELECTORS
    override manga_selector_author = 'Autor'
    override manga_selector_artist = 'Artista'
    override manga_selector_status = 'Estado'

    override configureSections() {
        this.homescreen_sections['popular_today'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Popular Today)')?.parent()?.next())
        this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Latest Update)')?.parent()?.next())
        this.homescreen_sections['new_titles'].enabled = false
        this.homescreen_sections['top_alltime'].enabled = false
        this.homescreen_sections['top_monthly'].enabled = false
        this.homescreen_sections['top_weekly'].enabled = false

        //@ts-ignore
        this.homescreen_sections['project_updates'] = {
            ...DefaultHomeSectionData,
            section: createHomeSection('project_updates', 'Project Updates', true),
            selectorFunc: ($: CheerioStatic) => $('div.bsx', $('h2:contains(Project Update)')?.parent()?.next()),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('a', element).attr('title'),
            subtitleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('div.epxs', element).text().trim(),
            getViewMoreItemsFunc: (page: string) => `project/page/${page}`,
            sortIndex: 11
        }
    }
}