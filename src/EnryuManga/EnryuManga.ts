
import {
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

const DOMAIN = 'https://enryumanga.com'

export const EnryuMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'EnryuManga',
    description: `Extension that pulls manga from ${DOMAIN} - A website that primarily hosts webtoons fastpass chapters`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class EnryuManga extends MangaStream {

    baseUrl: string = DOMAIN

    override usePostIds = false

    override configureSections(): void {
        this.homescreen_sections['popular_today'].selectorFunc = ($: CheerioStatic) => $('div.bsx', $('h2:contains(Popular Today)')?.parent()?.next())
        this.homescreen_sections['new_titles'].enabled = false
        this.homescreen_sections['top_alltime'].enabled = false
        this.homescreen_sections['top_monthly'].enabled = false
        this.homescreen_sections['top_weekly'].enabled = false

        //@ts-ignore
        this.homescreen_sections['project_updates'] = {
            ...DefaultHomeSectionData,
            section: createHomeSection('project_updates', 'Project Updates', false),
            selectorFunc: ($: CheerioStatic) => $('div.bsx', $('h2:contains(Project Update)')?.parent()?.next()),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('a', element).attr('title'),
            subtitleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('span.fivchap', element).first().text().trim(),
            sortIndex: 2
        }

        this.homescreen_sections['latest_update'] = {
            ...DefaultHomeSectionData,
            section: createHomeSection('latest_update', 'Latest Update', true),
            selectorFunc: ($: CheerioStatic) => $('div.bs.styletere.stylefiv', $('h2:contains(Latest Update)')?.parent()?.next()),
            titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('a', element).attr('title'),
            subtitleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('span.fivchap', element).first().text().trim(),
            getViewMoreItemsFunc: (page: string) => `${this.directoryPath}/?page=${page}&order=update`,
            sortIndex: 3
        }
    }

}