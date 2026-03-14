import {
    ContentRating,
    SourceInfo,
    BadgeColor,
    SourceIntents,
    RequestManager,
    Request,
    Response
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://madaradex.org'

export const MadaraDexInfo: SourceInfo = {
    version: getExportVersion('0.0.3'),
    name: 'MadaraDex',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.ADULT,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: '18+',
            type: BadgeColor.YELLOW
        }
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class MadaraDex extends Madara {

    baseUrl: string = DOMAIN

    override chapterEndpoint = 1

    override searchMangaSelector = 'div.c-tabs-item > div.row'

    override requestManager: RequestManager = App.createRequestManager({
        requestsPerSecond: this.requestsPerSecond,
        requestTimeout: this.requestTimeout,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = ({
                    ...request.headers,
                    'user-agent': 'Paperback-iOS',
                    'referer': `${this.baseUrl}/`,
                    'origin': `${this.baseUrl}/`,
                    ...request.url.includes('wordpress.com') && { 'Accept': 'image/avif,image/webp,*/*' }
                })
                request.cookies = [
                    App.createCookie({ name: 'wpmanga-adault', value: '1', domain: this.baseUrl }),
                    App.createCookie({ name: 'toonily-mature', value: '1', domain: this.baseUrl })
                ]

                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })
}
