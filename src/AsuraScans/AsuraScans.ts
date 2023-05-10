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

import { AsuraScansParser } from './AsuraScansParser'

const ASURASCANS_DOMAIN = 'https://www.asurascans.com'

export const AsuraScansInfo: SourceInfo = {
    version: getExportVersion('0.0.8'),
    name: 'AsuraScans',
    description: 'Extension that pulls manga from AsuraScans',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: ASURASCANS_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        },
        {
            text: 'CloudFlare',
            type: BadgeColor.RED
        }
    ]
}

export class AsuraScans extends MangaStream {

    baseUrl: string = ASURASCANS_DOMAIN
    language: string = '🇬🇧'

    override readonly parser: AsuraScansParser = new AsuraScansParser()

    override requestManager = App.createRequestManager({
        requestsPerSecond: 2,
        requestTimeout: 15000
    })

    override configureSections(): void {
        this.sections['new_titles']!.enabled = false
    }

}