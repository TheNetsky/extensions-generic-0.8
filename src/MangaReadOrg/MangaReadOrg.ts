import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

import {
    MangaReadOrgParser
} from './MangaReadOrgParser'

const DOMAIN = 'https://www.mangaread.org'

export const MangaReadOrgInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaReadOrg',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class MangaReadOrg extends Madara {

    baseUrl: string = DOMAIN

    override alternativeChapterAjaxEndpoint = true

    override parser: MangaReadOrgParser = new MangaReadOrgParser()
}
