import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import { NepNep, getExportVersion } from '../NepNep'

const DOMAIN = 'https://mangasee123.com'

export const MangaseeInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaSee',
    icon: 'icon.png',
    author: 'GameFuzzy',
    authorWebsite: 'https://github.com/gamefuzzy',
    description: `Extension that pulls manga from ${DOMAIN}`,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export class Mangasee extends NepNep {

    baseUrl = DOMAIN
}
