import {
    CloudflareBypassRequestProviding,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

const BASE_URL = 'https://templescan.net'
const API_URL = 'https://templescan.net/apiv1'
const SOURCE_NAME = 'TempleScan'
const VERSION = '0.0.0'

import { 
    BaseSourceInfo, 
    HeanCms, 
    getExportDesciption, 
    getExportVersion
} from '../HeanCms'

export const TempleScanInfo: SourceInfo = {
    ...BaseSourceInfo,
    name: SOURCE_NAME,
    version: getExportVersion(VERSION),
    description: getExportDesciption(BASE_URL),
    websiteBaseURL: BASE_URL,
    contentRating: ContentRating.ADULT,
    intents: BaseSourceInfo.intents | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
}

export abstract class TempleScan extends HeanCms implements CloudflareBypassRequestProviding {
    constructor() {
        super(BASE_URL, false)
        this.apiUrl = API_URL
        this.rateLimit = 2
        this.useChapterQuery = false

        this.init()
    }
    
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: BASE_URL,
            method: 'GET',
            headers: {
                'referer': `${BASE_URL}/`,
                'origin': `${BASE_URL}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        })
    }

}