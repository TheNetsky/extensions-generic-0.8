import { Chapter } from '@paperback/types'
import { BuddyComplexParser } from '../BuddyComplexParser'

export class MangaBuddyParser extends BuddyComplexParser {
    fullParseChapterList($: CheerioSelector, mangaId: string, mangaPage$: CheerioSelector): Chapter[] {
        const chapters: Chapter[] = super.parseChapterList($, mangaId)
        if (chapters.length === 0) {
            return chapters
        }

        const lastChapters: Chapter[] = super.parseChapterList(mangaPage$, mangaId)
        if (lastChapters.length === 0) {
            return chapters
        }

        const finalChapters = lastChapters.concat(chapters.filter(chapter => !lastChapters.some(chap => chap.id == chapter.id)))
        let sortingIndex = 0
        finalChapters.sort((a, b) => {
            return a.chapNum < b.chapNum ? -1 : 1
        })
        finalChapters.forEach(chapter => {
            chapter.sortingIndex = sortingIndex
            sortingIndex++
        })

        return finalChapters
    }
}