/* eslint-disable linebreak-style */
import {
    MangaStreamParser,
} from '../MangaStreamParser'

import {
    ChapterDetails,
} from 'paperback-extensions-common'


export class AsuraScansParser extends MangaStreamParser {

    override parseChapterDetails($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails {

        const pages: string[] = []

        for (const script of $('p > noscript').toArray()) {
            const imageRegex = $(script).text().match(/src="([^"]+)/)
            let image = 'https://i.imgur.com/GYUxEX8.png'
            if (imageRegex && imageRegex[1]) image = imageRegex[1]
            pages.push(image)
        }

        const chapterDetails = createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
            longStrip: false
        })

        return chapterDetails
    }
}
