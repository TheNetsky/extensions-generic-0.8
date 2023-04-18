import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'

import { decodeHTML } from 'entities'

import { MangaBox } from './MangaBox'

export const parseManga = ($: CheerioStatic, source: MangaBox): PartialSourceManga[] => {
    const mangaItems: PartialSourceManga[] = []
    const collecedIds: string[] = []

    for (const manga of $(source.mangaListSelector).toArray()) {
        const mangaId = $('a', manga).first().attr('href')
        const image = $('img', manga).first().attr('src') ?? ''
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

export const parseMangaDetails = ($: CheerioStatic, mangaId: string, source: MangaBox): SourceManga => {
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

    const author = $(source.mangaAuthorSelector, mangaRootSelector)
        .toArray()
        .map(x => $(x).text().trim())
        .join(', ') ?? ''

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

export const parseChapters = ($: CheerioStatic, source: MangaBox): Chapter[] => {
    const chapters: Chapter[] = []

    for (const chapter of $(source.chapterListSelector).toArray()) {
        const id = $('a', chapter).attr('href') ?? ''
        if (!id) continue

        const name = decodeHTML($('a', chapter).text().trim())
        const time = parseDate($(source.chapterTimeSelector, chapter).last().text().trim() ?? '')

        let chapNum = 0
        const chapRegex = id.match(/(?:chap.*)[-_](\d+\.?\d?)/)
        if (chapRegex && chapRegex[1]) chapNum = Number(chapRegex[1].replace(/\\/g, '.'))

        chapters.push(App.createChapter({
            id: id,
            chapNum: isNaN(chapNum) ? 0 : chapNum,
            name: name,
            group: '',
            time: time,
            langCode: source.languageCode
        }))
    }
    return chapters
}

export const parseChapterDetails = async ($: CheerioStatic, mangaId: string, chapterId: string, source: MangaBox): Promise<ChapterDetails> => {
    const pages: string[] = []

    for (const img of $(source.chapterImagesSelector).toArray()) {
        let image = $(img).attr('src') ?? ''
        if (!image) image = $(img).attr('data-src') ?? ''
        if (!image) throw new Error(`Unable to parse image(s) for Chapter ID: ${chapterId}`)
        pages.push(image)
    }

    const chapterDetails = App.createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages: pages
    })

    return chapterDetails
}

export const parseTags = ($: CheerioStatic, source: MangaBox): TagSection[] => {
    const genres: Tag[] = []
    for (const genre of $(source.genreListSelector).toArray()) {
        const id = $(genre).attr('data-i')
        const label = $(genre).text().trim()
        if (!id || !label) continue
        genres.push({ id: id, label: label })
    }

    const TagSection: TagSection[] = [
        App.createTagSection({
            id: '0',
            label: 'genres',
            tags: genres.map(t => App.createTag(t))
        })
    ]
    return TagSection
}

const parseDate = (date: string): Date => {
    let time: Date
    let number = Number((/\d*/.exec(date) ?? [])[0])
    number = (number == 0 && date.includes('a')) ? 1 : number
    date = date.toUpperCase()
    if (date.includes('MINUTE') || date.includes('MINUTES') || date.includes('MINS')) {
        time = new Date(Date.now() - (number * 60000))
    } else if (date.includes('HOUR') || date.includes('HOURS')) {
        time = new Date(Date.now() - (number * 3600000))
    } else if (date.includes('DAY') || date.includes('DAYS')) {
        time = new Date(Date.now() - (number * 86400000))
    } else if (date.includes('YEAR') || date.includes('YEARS')) {
        time = new Date(Date.now() - (number * 31556952000))
    } else {
        time = new Date(date)
    }

    return time
}

export const isLastPage = ($: CheerioStatic): boolean => {
    const currentPage = $('.page-select, .page_select').text()
    let totalPages = $('.page-last, .page_last').text()

    if (currentPage) {
        totalPages = (/(\d+)/g.exec(totalPages) ?? [''])[0]
        return (+totalPages) == (+currentPage)
    }

    return true
}
