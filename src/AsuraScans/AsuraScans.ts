import {
    BadgeColor,
    ContentRating,
    SourceInfo,
    SourceIntents,
    Request
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'

const DOMAIN = 'https://asuracomics.com'

export const AsuraScansInfo: SourceInfo = {
    version: getExportVersion('0.0.4'),
    name: 'AsuraScans',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class AsuraScans extends MangaStream {

    baseUrl: string = DOMAIN

    override configureSections(): void {
        this.homescreen_sections['new_titles'].enabled = false
    }

    override async getCloudflareBypassRequestAsync(): Promise<Request> {

        // Delete cookies
        this.requestManager?.cookieStore?.getAllCookies().forEach(x => { this.requestManager?.cookieStore?.removeCookie(x) })

        return App.createRequest({
            url: `${this.bypassPage || this.baseUrl}/`,
            method: 'GET',
            headers: {
                'referer': `${this.baseUrl}/`,
                'origin': `${this.baseUrl}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        })
    }
}
