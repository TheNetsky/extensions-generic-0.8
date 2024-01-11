import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://gourmetsupremacy.com'

export const GourmetScansInfo: SourceInfo = {
    version: getExportVersion('0.0.1'),
    name: 'GourmetScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class GourmetScans extends Madara {
    baseUrl: string = DOMAIN

    override chapterEndpoint = 1

    override hasProtectedChapters = true

    override useListParameter = false
}
