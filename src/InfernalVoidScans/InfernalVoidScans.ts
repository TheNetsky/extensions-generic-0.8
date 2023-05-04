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

const INFERNALVOIDSCANS_DOMAIN = 'https://void-scans.com'

export const InfernalVoidScansInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'InfernalVoidScans',
    description: 'Extension that pulls manga from InfernalVoidScans',
    author: 'nicknitewolf',
    authorWebsite: 'http://github.com/nicknitewolf',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: INFERNALVOIDSCANS_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ]
}

export class InfernalVoidScans extends MangaStream {

    baseUrl: string = INFERNALVOIDSCANS_DOMAIN
    language: string = '🇬🇧'

    override configureSections() {
        this.latestUpdateSection.selectorFunc = ($: CheerioStatic) => $('div.uta', $('h2:contains(Project Update)')?.parent()?.next())
        this.newMangaSection.selectorFunc = ($: CheerioStatic) => $('li', $('h3:contains(New series)')?.parent()?.next())
        this.topAllTimeSection.enabled = false
        this.topMonthlySection.enabled = false
        this.topWeeklySection.enabled = false
    }

}