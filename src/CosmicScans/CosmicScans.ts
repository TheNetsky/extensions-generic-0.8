/* eslint-disable linebreak-style */
import {
    BadgeColor,
    ContentRating,
    Response,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'

const COSMICSCANS_DOMAIN = 'https://cosmicscans.com'

export const CosmicScansInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'CosmicScans',
    description: 'Extension that pulls manga from CosmicScans',
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: COSMICSCANS_DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ]
}

export class CosmicScans extends MangaStream {

    baseUrl: string = COSMICSCANS_DOMAIN
    language: string = '🇬🇧'

    override interceptResponse(response: Response) {
        console.log(`Response Status ${response.status} with location ${response.headers.location}`)
        if (response.status != 301) {
            return
        }

        response.headers.location = response.headers.location.replace('http://', 'https://')
    }

    override configureSections() {
        this.sections['new_titles']!.enabled = false
    }

}