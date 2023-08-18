import {
    ChapterDetails,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    Madara
} from '../Madara'

const DOMAIN = 'https://aquamanga.com'

export const AquaMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'AquaManga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    sourceTags: [],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI
}

export class AquaManga extends Madara {

    baseUrl: string = DOMAIN

    override alternativeChapterAjaxEndpoint = true

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {

        let url: string
        if (this.usePostIds) {
            const slugData: any = await this.convertPostIdToSlug(Number(mangaId))
            url = `${this.baseUrl}/${slugData.path}/${slugData.slug}/${chapterId}/`
        } else {
            url = `${this.baseUrl}/${this.directoryPath}/${mangaId}/${chapterId}/`
        }

        const request = App.createRequest({
            url: url,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        return this.parser.parseChapterDetails($, mangaId, chapterId, this.chapterDetailsSelector, this)
    }
}