import {
    ChapterDetails,
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    getExportVersion,
    MangaStream
} from '../MangaStream'
import { MangaStreamParser } from '../MangaStreamParser'
import { MangaGalaxyParser } from './MangaGalaxyParser'

const DOMAIN = 'https://mangagalaxy.me'

export const MangaGalaxyInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'MangaGalaxy',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED | SourceIntents.SETTINGS_UI,
    sourceTags: []
}

export class MangaGalaxy extends MangaStream {

    baseUrl: string = DOMAIN

    override directoryPath = 'series'

    override configureSections() {
        this.homescreen_sections['new_titles'].enabled = false
    }

    override parser: MangaStreamParser = new MangaGalaxyParser()

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        // Request the manga page
        const request = App.createRequest({
            url: await this.getUsePostIds() ? `${this.baseUrl}/?p=${mangaId}/` : `${this.baseUrl}/${this.directoryPath}/${mangaId}/`,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        this.checkResponseError(response)
        const $ = this.cheerio.load(response.data as string)

        let chapter = $('div#chapterlist').find('li[data-num="' + chapterId + '"]')
        if (chapter.length === 0) {
            // final attempt is to search for the chapter number in the chapter title, and also only list the ones wi thout data-num
            const chapters = $('div#chapterlist li:not([data-num]),li[data-num=""]').toArray()

            for (let i = 0; i < chapters.length; i++) {
                // @ts-expect-error Always defined.
                const matches = $('a', chapters[i])
                if (matches.length === 0) {
                    continue
                }

                if (matches.attr('href')?.includes(chapterId)) {
                    chapter = $(chapters[i])
                    break
                }
            }

            if (chapter.length === 0) {
                throw new Error(`Unable to fetch a chapter for chapter number: ${chapterId}`)
            }
        }

        // Fetch the ID (URL) of the chapter
        const id = $('a', chapter).attr('href') ?? ''
        if (!id) {
            throw new Error(`Unable to fetch id for chapter number: ${chapterId}`)
        }
        // Request the chapter page
        const _request = App.createRequest({
            url: id,
            method: 'GET'
        })

        const _response = await this.requestManager.schedule(_request, 1)
        this.checkResponseError(_response)
        const _$ = this.cheerio.load(_response.data as string)

        return this.parser.parseChapterDetails(_$, mangaId, chapterId)
    }
}