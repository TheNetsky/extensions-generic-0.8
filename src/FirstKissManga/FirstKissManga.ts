import {
    ContentRating,
    SourceIntents,
    SourceInfo
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://1st-kissmanga.net'

export const FirstKissMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: '1st Kiss Manga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'ifacodes',
    authorWebsite: 'http://github.com/ifacodes',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class FirstKissManga extends Madara {
    baseUrl: string = DOMAIN
    //override alternativeChapterAjaxEndpoint = true
}