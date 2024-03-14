import {
    Chapter,
    ChapterDetails,
    SourceManga
} from '@paperback/types'

import entities = require('entities')

export class Parser {

    parseMangaDetails = ($: CheerioStatic, mangaId: string, source: any): SourceManga => {
        const image = source.iconUrl
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
            const id: string = this.idCleaner($('a', chapter).attr('href') ?? '')

            const chapNumRegex = id.match(/(\d+\.?\d?)+/)

            let chapNum = 0
            if (chapNumRegex && chapNumRegex[1]) chapNum = Number(chapNumRegex[1])

            let date = new Date()
            const dateTimeStamps = Date.parse($(source.chapterDateSelector, chapter).text().trim())

            if (!isNaN(dateTimeStamps)) {
                date = new Date(dateTimeStamps)
            }

            if (!id || typeof id === 'undefined') {
                continue
            }

            chapters.push({
                id: id,
                langCode: source.language,
                chapNum: chapNum,
                name: 'Chapter ' + chapNum,
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
            pages.push(image.trim())
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

    idCleaner(str: string): string {
        let cleanId: string | null = str
        cleanId = cleanId.replace(/\/$/, '')
        cleanId = cleanId.split('/').pop() ?? null

        if (!cleanId) throw new Error(`Unable to parse id for ${str}`) // Log to logger
        return cleanId
    }
}