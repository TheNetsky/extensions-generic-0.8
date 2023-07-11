import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import { NepNep, getExportVersion } from '../NepNep'

const DOMAIN = 'https://manga4life.com'

export const MangaLifeInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'Manga4Life',
    icon: 'icon.png',
    author: 'GameFuzzy',
    authorWebsite: 'https://github.com/gamefuzzy',
    description: `Extension that pulls manga from ${DOMAIN}`,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class MangaLife extends NepNep {

    baseUrl = DOMAIN
}
