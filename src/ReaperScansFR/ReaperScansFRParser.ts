import { Chapter } from '@paperback/types'
import {
    Parser
} from '../MadaraParser'

export class ReaperScansFRParser extends Parser {

    override parseChapterList($: CheerioSelector, mangaId: string, source: any): Chapter[] {
        const chapters: Chapter[] = []
        let sortingIndex = 0

        // For each available chapter..
        for (const obj of $('li.wp-manga-chapter  ').toArray()) {
            const id = this.idCleaner($('a', obj).first().attr('href') ?? '')

            const chapName = $('a > p', obj).first().text().trim() ?? ''
            const chapNumRegex = id.match(/(?:chapter|ch.*?)(\d+\.?\d?(?:[-_]\d+)?)|(\d+\.?\d?(?:[-_]\d+)?)$/)
            let chapNum: string | number = chapNumRegex && chapNumRegex[1] ? chapNumRegex[1].replace(/[-_]/gm, '.') : chapNumRegex?.[2] ?? '0'

            // make sure the chapter number is a number and not NaN
            chapNum = parseFloat(chapNum) ?? 0

            let mangaTime: Date
            const timeSelector = $('span.chapter-release-date > a, span.chapter-release-date > span.c-new-tag > a', obj).attr('title')
            if (typeof timeSelector !== 'undefined') {
                // Firstly check if there is a NEW tag, if so parse the time from this
                mangaTime = this.parseDate(timeSelector ?? '')
            } else {
                // Else get the date from the info box
                mangaTime = this.parseDate($('span.chapter-release-date > i', obj).text().trim())
            }

            // Check if the date is a valid date, else return the current date
            if (!mangaTime.getTime()) mangaTime = new Date()

            if (!id || typeof id === 'undefined') {
                throw new Error(`Could not parse out ID when getting chapters for postId:${mangaId}`)
            }

            chapters.push({
                id: id,
                langCode: source.language,
                chapNum: chapNum,
                name: chapName ? this.decodeHTMLEntity(chapName) : '',
                time: mangaTime,
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

}