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

const MANGAGENKI_DOMAIN = 'https://mangagenki.com'

export const MangaGenkiInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaGenki',
    description: 'Extension that pulls manga from MangaGenki',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: MANGAGENKI_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ]
}

export class MangaGenki extends MangaStream {

    baseUrl: string = MANGAGENKI_DOMAIN
    language: string = '🇬🇧'

    override configureSections() {
        this.sections['new_titles']!.selectorFunc = ($: CheerioStatic) => $('li', $('h3:contains(New Titles)')?.parent()?.next())
    }
}