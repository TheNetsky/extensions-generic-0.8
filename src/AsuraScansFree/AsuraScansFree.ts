import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'
import {
    BasicAcceptedElems,
    CheerioAPI
} from 'cheerio'
import { AnyNode } from 'domhandler'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'

const DOMAIN = 'https://asurascansfree.com'

export const AsuraScansFreeInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AsuraScansFree',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class AsuraScansFree extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'serie'

    override configureSections() {
        this.homescreen_sections['latest_update'].selectorFunc = ($: CheerioAPI) => $('div.bsx', $('h2:contains(Latest Update)')?.parent()?.next())
        this.homescreen_sections['latest_update'].subtitleSelectorFunc = ($: CheerioAPI, element: BasicAcceptedElems<AnyNode>) => $('.fivchap', element).first().text().trim()
        this.homescreen_sections['new_titles'].selectorFunc = ($: CheerioAPI) => $('li', $('h3:contains(Newest additions)')?.parent()?.next())
    }
}