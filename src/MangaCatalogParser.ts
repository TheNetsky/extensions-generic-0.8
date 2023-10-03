import {
    Chapter,
    ChapterDetails,
    SourceManga
} from '@paperback/types'

import entities = require('entities')

export class Parser {

    parseMangaDetails = ($: CheerioStatic, mangaId: string, source: any): SourceManga => {
        const image = $(source.mangaImageSelector).attr('src') ?? ''
        const title = this.decodeHTMLEntity($(source.mangaTitleSelector).text().trim())
        const description = this.decodeHTMLEntity($(source.mangaDescriptionSelector).text().trim())

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                status: 'Ongoing',
                desc: description
            })
        })
    }

    parseChapters = ($: CheerioStatic, mangaId: string, source: any): Chapter[] => {
        const chapters: Chapter[] = []
        let sortingIndex = 0

        for (const chapter of $(source.chaptersArraySelector).toArray()) {
            const title: string = $(source.chapterTitleSelector, chapter).text()
            const id: string = $(source.chapterIdSelector, chapter).attr('href')?.split('/')[4] ?? ''

            const chapNumRegex = id.match(/(\d+\.?\d?)+/)

            let chapNum = 0
            if (chapNumRegex && chapNumRegex[1]) chapNum = Number(chapNumRegex[1])

            let date = new Date()
            const dateTimeStamps = Date.parse($(source.chapterDateSelector, chapter).text().trim())

            if (!isNaN(dateTimeStamps)) {
                date = new Date(dateTimeStamps)
            }

            if (!id || typeof id === 'undefined') {
                throw new Error(`Could not parse out ID when getting chapters for postId:${mangaId}`)
            }

            chapters.push({
                id: id,
                langCode: source.language,
                chapNum: chapNum,
                name: title,
                time: date,
                sortingIndex,
                volume: 0,
                group: ''
            })
            sortingIndex--
        }

        if (chapters.length == 0) {
            throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
        }

        return chapters.map(chapter => {
            chapter.sortingIndex += chapters.length
            return App.createChapter(chapter)
        })
    }

    parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string, source: any): ChapterDetails => {
        const pages: string[] = []

        for (const img of $(source.chapterImageSelector, source.chapterImagesArraySelector).toArray()) {
            const image = img.attribs['src']
            if (!image) continue
            pages.push(image)
        }

        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })

        return chapterDetails
    }

    // UTILITY METHODS
    decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str)
    }
}