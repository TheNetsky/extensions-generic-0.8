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

const EDOUJIN_DOMAIN = 'https://edoujin.net'

export const eDoujinInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'eDoujin',
    description: 'Extension that pulls manga from eDoujin',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: EDOUJIN_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ]
}

export class eDoujin extends MangaStream {

    baseUrl: string = EDOUJIN_DOMAIN
    language: string = '🇬🇧'

    override configureSections() {
        this.latestUpdateSection.selectorFunc = ($: CheerioStatic) => $('div.utao', $('h2:contains(Latest Update)')?.parent()?.next())
        this.newMangaSection.enabled = false
        this.topAllTimeSection.enabled = false
        this.topMonthlySection.enabled = false
        this.topWeeklySection.enabled = false
    }

}