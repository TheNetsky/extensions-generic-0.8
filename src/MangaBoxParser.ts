import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'

import { decodeHTML } from 'entities'

import {
    APIChapter,
    MangaBox
} from './MangaBox'

import { getImageServer } from './MangaBoxSettings'

export class MangaBoxParser {
    parseManga = ($: CheerioStatic, source: MangaBox): PartialSourceManga[] => {
        const mangaItems: PartialSourceManga[] = []
        const collecedIds: string[] = []

        for (const manga of $(source.mangaListSelector).toArray()) {
            const mangaId = this.idCleaner($('a', manga).attr('href') ?? '')
            const image = $('img', manga).first().attr('src')?.trim() ?? ''
            const title = decodeHTML($('a', manga).first().attr('title')?.trim() ?? '')
            const subtitle = $(source.mangaSubtitleSelector, manga).first().text().trim() ?? ''

            if (!mangaId || !title || collecedIds.includes(mangaId)) continue
            mangaItems.push(App.createPartialSourceManga({
                mangaId: mangaId,
                image: image,
                title: title,
                subtitle: subtitle ? subtitle : 'No Chapters'
            }))
            collecedIds.push(mangaId)
        }

        return mangaItems
    }

    parseMangaDetails = ($: CheerioStatic, mangaId: string, source: MangaBox): SourceManga => {
        const mangaRootSelector = $(source.mangaRootSelector)

        const image = $(source.mangaThumbnailSelector).attr('src') ?? ''

        const titles = []
        titles.push(decodeHTML($(source.mangaTitleSelector, mangaRootSelector).text().trim()))

        // Alternative Titles
        for (const altTitle of $(source.mangaAltTitleSelector, mangaRootSelector)
            .text()
            ?.split(/,|;|\//)) {
            if (altTitle == '') continue
            titles.push(decodeHTML(altTitle.trim()))
        }

        const rawStatus = $(source.mangaStatusSelector, mangaRootSelector).text().trim() ?? 'ONGOING'
        let status = 'ONGOING'
        switch (rawStatus.toUpperCase()) {
            case 'ONGOING':
                status = 'Ongoing'
                break
            case 'COMPLETED':
                status = 'Completed'
                break
            default:
                status = 'Ongoing'
                break
        }

        const author = $(source.mangaAuthorSelector, mangaRootSelector).first().text().replace('Author(s) :', '').trim()
        const desc = decodeHTML($(source.mangaDescSelector).first().children().remove().end().text().trim())

        const tags: Tag[] = []
        for (const tag of $(source.mangaGenresSelector, mangaRootSelector).toArray()) {
            const id = $(tag).attr('href')
            const label = $(tag).text().trim()

            if (!id || !label) continue
            tags.push({ id: id, label: label })
        }
        const TagSection: TagSection[] = [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags.map(t => App.createTag(t))
            })
        ]

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                image: image,
                titles: titles,
                status: status,
                author: author ? author : 'Unkown',
                desc: desc,
                tags: TagSection
            })
        })
    }

    parseChapters = (apiChapters: APIChapter[], mangaId: string, source: MangaBox): Chapter[] => {
        const chapters: Chapter[] = []
        let sortingIndex = 0

        for (const chapter of apiChapters) {
            const id = chapter.chapter_slug ?? ''
            if (!id) continue

            const name = decodeHTML(chapter.chapter_name?.trim() ?? '')
            const time = new Date(chapter.updated_at?.trim() ?? '')
            const chapNum = chapter.chapter_num ?? 0

            chapters.push({
                id: id,
                chapNum: isNaN(chapNum) ? 0 : chapNum,
                volume: 0,
                name: name,
                group: '',
                time: time,
                langCode: source.languageCode,
                sortingIndex: sortingIndex
            })
            sortingIndex--
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

    parseChapterDetails = async ($: CheerioStatic, mangaId: string, chapterId: string, source: MangaBox): Promise<ChapterDetails> => {
        const pages: string[] = []
        const imageServer = await getImageServer(source.stateManager)
            .then(server => parseInt((server[0]?.replace('server', '')) ?? '1') - 1)

        const cdnsMatch = ($('head').toString().match(/var cdns.*]/g) ?? [])[0]?.replace('var cdns = ', '')

        for (const img of $(source.chapterImagesSelector).toArray()) {
            let image = $(img).attr('src') ?? ''
            if (!image) image = $(img).attr('data-src') ?? ''
            if (!image) throw new Error(`Unable to parse image(s) for Chapter ID: ${chapterId}`)
            if (cdnsMatch) {
                const cdns = JSON.parse(cdnsMatch)
                if (Array.isArray(cdns) && typeof cdns[imageServer] !== 'undefined') {
                    for (const url of cdns) image = image.replace(url, cdns[imageServer])
                }
            }
            pages.push(image)
        }

        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })

        return chapterDetails
    }

    parseTags = ($: CheerioStatic, source: MangaBox): TagSection[] => {
        const tags: Tag[] = []
        for (const tag of $(source.genreListSelector).toArray()) {
            const id = $(tag).attr('data-i')
            const label = $(tag).text().trim()
            if (!id || !label) continue
            tags.push({ id: id, label: label })
        }

        tags.sort((a, b) => {
            if (a.label > b.label) return 1
            if (a.label < b.label) return -1
            return 0
        })

        const TagSection: TagSection[] = [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags.map(t => App.createTag(t))
            })
        ]
        return TagSection
    }

    isLastPage = ($: CheerioStatic): boolean => {
        const currentPage = $('.page-select, .page_select').text()
        let totalPages = $('.page-last, .page_last').text()

        if (currentPage) {
            totalPages = (/(\d+)/g.exec(totalPages) ?? [''])[0]
            return (+totalPages) == (+currentPage)
        }

        return true
    }

    idCleaner(str: string): string {
        let cleanId: string | null = str
        cleanId = cleanId.replace(/\/$/, '')
        cleanId = cleanId.split('/').pop() ?? null

        if (!cleanId) throw new Error(`Unable to parse id for ${str}`) // Log to logger
        return cleanId
    }
}
