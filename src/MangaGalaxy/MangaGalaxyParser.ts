import { Chapter } from '@paperback/types'
import { MangaStreamParser } from '../MangaStreamParser'
import { convertDate } from '../LanguageUtils'

export class MangaGalaxyParser extends MangaStreamParser {
    override parseChapterList($: CheerioSelector, mangaId: string, source: any): Chapter[] {
        const chapters: Chapter[] = []
        let sortingIndex = 0
        let language = source.language

        // Usually for Manhwa sites
        if (mangaId.toUpperCase().endsWith('-RAW') && source.language == '🇬🇧') language = '🇰🇷'

        let lowestNumber = 0
        const unresolvedChapters: {
            metadata: {
                title: string
                date: Date
            },
            belongingIndex: number
        }[] = []

        for (const chapter of $('li', 'div#chapterlist').toArray()) {
            const title = $('span.chapternum', chapter).text().trim()
            const date = convertDate($('span.chapterdate', chapter).text().trim(), source)
            const id = chapter.attribs['data-num'] ?? '' // Set data-num attribute as id
            const chapterNumberRegex = id.match(/(\d+\.?\d?)+/)
            let chapterNumber = 0
            if (chapterNumberRegex && chapterNumberRegex[1]) {
                chapterNumber = Number(chapterNumberRegex[1])
                if (chapterNumber < lowestNumber) {
                    lowestNumber = chapterNumber
                }
            } else {
                unresolvedChapters.push({
                    metadata: {
                        title: title,
                        date: date
                    },
                    belongingIndex: sortingIndex
                })
                sortingIndex--
                continue
            }

            if (!id || typeof id === 'undefined') {
                throw new Error(`Could not parse out ID when getting chapters for postId:${mangaId}`)
            }

            chapters.push({
                id: id, // Store chapterNumber as id
                langCode: language,
                chapNum: chapterNumber,
                name: title,
                time: date,
                sortingIndex,
                volume: 0,
                group: ''
            })
            sortingIndex--
        }

        // If there are unresolved chapters, attempt to resolve them
        if (unresolvedChapters.length > 0) {
            for (const unresolvedChapter of unresolvedChapters) {
                chapters.push({
                    // Should be unique enough
                    id: lowestNumber.toString(),
                    langCode: language,
                    chapNum: lowestNumber,
                    name: unresolvedChapter.metadata.title,
                    time: unresolvedChapter.metadata.date,
                    sortingIndex: unresolvedChapter.belongingIndex,
                    volume: 0,
                    group: ''
                })

                lowestNumber--
            }
        }

        // If there are no chapters, throw error to avoid losing progress
        if (chapters.length == 0) {
            throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
        }

        return chapters.map((chapter) => {
            chapter.sortingIndex += chapters.length
            return App.createChapter(chapter)
        })
    }
}