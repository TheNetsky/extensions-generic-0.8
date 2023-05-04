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

const RAWKUMA_DOMAIN = 'https://rawkuma.com'

export const RawKumaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'RawKuma',
    description: 'Extension that pulls manga from RawKuma',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: RAWKUMA_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
        {
            text: 'Japanese',
            type: BadgeColor.GREY
        }
    ]
}

export class RawKuma extends MangaStream {

    baseUrl: string = RAWKUMA_DOMAIN
    language: string = '🇯🇵'

}