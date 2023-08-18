import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'
import { RealmScansParser } from './RealmScansParser'
import { Months } from '../MangaStreamInterfaces'

const DOMAIN = 'https://realmscans.to'

export const RealmScansInfo: SourceInfo = {
    version: getExportVersion('1.0.2'),
    name: 'RealmScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'IvanMatthew',
    authorWebsite: 'http://github.com/Ivanmatthew',
    icon: 'icon.webp',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class RealmScans extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'm050523/series'

    override filterPath = 'series'

    override usePostIds = false

    override parser: RealmScansParser = new RealmScansParser()

    override configureSections(): void {
        this.homescreen_sections['new_titles'].enabled = false
    }

    override dateMonths: Months = {
        january: 'Jan',
        february: 'Feb',
        march: 'Mar',
        april: 'Apr',
        may: 'May',
        june: 'Jun',
        july: 'Jul',
        august: 'Aug',
        september: 'Sep',
        october: 'Oct',
        november: 'Nov',
        december: 'Dec'
    }
}
