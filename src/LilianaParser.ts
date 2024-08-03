import {
    Chapter,
    ChapterDetails,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'

import entities = require('entities')
import { HomeSectionData, SearchData } from './LilianaHelper'

export class Parser {

    parseHomeSection($: CheerioStatic, section: HomeSectionData, source: any): PartialSourceManga[] {
        const items: PartialSourceManga[] = []

        const mangas = section.selectorFunc($)
        if (!mangas.length) {
            return items
        }

        for (const manga of mangas.toArray()) {
            const title = this.decodeHTMLEntity(section.titleSelectorFunc($, manga)) ?? ''
            const image = this.getImageSrc(section.getImageFunc($, manga)) ?? ''
            const subtitle = section.subtitleSelectorFunc($, manga) ?? ''
            const mangaId: string = this.idCleaner(section.getIdFunc($, manga) ?? '')

            if (!mangaId || !title) {
                continue
            }
            items.push(App.createPartialSourceManga({
                mangaId,
                image: image,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            }))
        }

        return items
    }

    parseSearchResults($: CheerioSelector, source: any): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        for (const manga of $('div#main div.grid > div').toArray()) {

            const title = $('.text-center a', manga)?.text()?.trim() ?? ''
            const subtitle = $('a.clamp.toe.oh', manga).last()?.text()?.trim() ?? ''
            const image = this.getImageSrc($('img', manga)) ?? ''
            const mangaId: string = this.idCleaner($('a', manga).attr('href') ?? '')

            if (!mangaId || !title) {
                continue
            }

            results.push(App.createPartialSourceManga({
                mangaId,
                image: image.includes('https://') ? image : `${source.baseUrl}/${image}`,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            }))
        }

        return results
    }

    parseJSONSearchResults(data: SearchData, source: any): PartialSourceManga[] {
        const results: PartialSourceManga[] = []

        for (const obj of data.list) {
            const title = obj?.name ?? ''
            const mangaId = this.idCleaner(obj?.url) ?? ''
            const image = source?.baseUrl + obj?.cover
            const subtitle = obj?.last ?? ''

            results.push(App.createPartialSourceManga({
                mangaId,
                image,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            }))
        }

        return results
    }

    parseMangaDetails = ($: CheerioStatic, mangaId: string, source: any): SourceManga => {
        const image = this.getImageSrc($('.a1 > figure img'))
        const title = this.decodeHTMLEntity($('.a2 header h1').text().trim())
        const description = this.decodeHTMLEntity($('div#syn-target').text().trim())
        const status = $('div.y6x11p i.fas.fa-rss + span.dt').text().trim()

        const authors = []
        for (const author of $('div.y6x11p i.fas.fa-user + span.dt a').toArray()) {
            authors.push($(author).text().trim())
        }

        const arrayTags: Tag[] = []
        for (const tag of $(`.a2 div > a[rel='tag'].label`).toArray()) {
            const label = $(tag)?.text()?.trim()
            const id = this.idCleaner($(tag)?.attr('href') ?? '') ?? ''

            if (!id || !label) continue
            arrayTags.push({ id: `manga_genres:${id}`, label: label })
        }

        const tagSections: TagSection[] = [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: arrayTags.map((x) => App.createTag(x))
            })
        ]

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image.includes('https://') ? image : `${source.baseUrl}/${image}`,
                status,
                author: authors.join(', '),
                desc: description,
                tags: tagSections,
            })
        })
    }

    parseChapters = ($: CheerioStatic, mangaId: string, source: any): Chapter[] => {
        const chapters: Chapter[] = []
        let sortingIndex = 0

        for (const chapter of $('ul > li.chapter').toArray()) {
            const id: string = this.idCleaner($('a', chapter).attr('href') ?? '')

            const chapNumRegex = id.match(/(\d+\.?\d?)+/)

            let chapNum = 0
            if (chapNumRegex && chapNumRegex[1]) chapNum = Number(chapNumRegex[1])

            let time: Date = new Date()
            const dateTimeStamps = $('.timeago', chapter).attr('datetime') ?? ''
            if (dateTimeStamps) {
                time = new Date(Number(dateTimeStamps) * 1000)
            }

            if (!id || typeof id === 'undefined') {
                continue
            }

            chapters.push({
                id: id,
                langCode: source.language,
                chapNum: chapNum,
                name: 'Chapter ' + chapNum,
                time,
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
        const pages: any[] = []

        if ($('div.separator[data-index]').length === 0) {
            let index = 0
            for (const img of $('div.separator').toArray()) {
                const url = $('a', img)?.attr('href') ?? ''
                if (url !== '') {
                    pages.push({ index, url: `https://intercept.me/${url}` })
                    index++
                }
            }

        } else {
            for (const img of $('div.separator[data-index]').toArray()) {
                const index = Number($(img).attr('data-index'))
                const url = $('a', img)?.attr('href') ?? ''
                if (url !== '') {
                    pages.push({ index, url: `https://intercept.me/${url}` })
                }
            }
        }

        const sortedPages: string[] = []

        const data = pages.sort((a, b) => a.index - b.index)

        for (const img of data) {
            sortedPages.push(img.url)
        }

        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: sortedPages
        })

        return chapterDetails
    }

    parseTags($: CheerioSelector): TagSection[] {
        const tagSections: any[] = [
            { id: '0', label: 'genres', tags: [] },
            { id: '1', label: 'type', tags: [] },
            { id: '2', label: 'count', tags: [] },
            { id: '3', label: 'status', tags: [] },
            { id: '4', label: 'gender', tags: [] },
            { id: '5', label: 'sort', tags: [] }
        ]

        for (const genre of $('div.advanced-genres .advance-item').toArray()) {
            const label = $('label', genre).text().trim()
            const id = `${tagSections[0].label}:${$('span', genre).attr('data-genre')?.trim()}`

            if (!id || !label) {
                continue
            }

            tagSections[0].tags.push(App.createTag({ id, label }))
        }

        for (const genre of $('div.advanced-select #select-type option').toArray()) {
            const label = $(genre).text().trim()
            const id = `${tagSections[1].label}:${$(genre).attr('value')?.trim()}`

            if (!id || !label) {
                continue
            }

            tagSections[1].tags.push(App.createTag({ id, label }))
        }

        for (const genre of $('div.advanced-select #select-count option').toArray()) {
            const label = $(genre).text().trim()
            const id = `${tagSections[2].label}:${$(genre).attr('value')?.trim()}`

            if (!id || !label) {
                continue
            }

            tagSections[2].tags.push(App.createTag({ id, label }))
        }

        for (const genre of $('div.advanced-select #select-status option').toArray()) {
            const label = $(genre).text().trim()
            const id = `${tagSections[3].label}:${$(genre).attr('value')?.trim()}`

            if (!id || !label) {
                continue
            }

            tagSections[3].tags.push(App.createTag({ id, label }))
        }

        for (const genre of $('div.advanced-select #select-gender option').toArray()) {
            const label = $(genre).text().trim()
            const id = `${tagSections[4].label}:${$(genre).attr('value')?.trim()}`

            if (!id || !label) {
                continue
            }

            tagSections[4].tags.push(App.createTag({ id, label }))
        }

        for (const genre of $('div.advanced-select #select-sort option').toArray()) {
            const label = $(genre).text().trim()
            const id = `${tagSections[5].label}:${$(genre).attr('value')?.trim()}`

            if (!id || !label) {
                continue
            }

            tagSections[5].tags.push(App.createTag({ id, label }))
        }

        return tagSections.map((x) => App.createTagSection(x))
    }

    getImageSrc(imageObj: Cheerio | undefined): string {
        let image: string | undefined
        if ((typeof imageObj?.attr('data-src')) != 'undefined') {
            image = imageObj?.attr('data-src')
        }
        else if ((typeof imageObj?.attr('data-lazy-src')) != 'undefined') {
            image = imageObj?.attr('data-lazy-src')
        }
        else if ((typeof imageObj?.attr('srcset')) != 'undefined') {
            image = imageObj?.attr('srcset')?.split(' ')[0] ?? ''
        }
        else if ((typeof imageObj?.attr('src')) != 'undefined') {
            image = imageObj?.attr('src')
        }
        else if ((typeof imageObj?.attr('data-cfsrc')) != 'undefined') {
            image = imageObj?.attr('data-cfsrc')
        } else {
            image = ''
        }

        image = image?.split('?resize')[0] ?? ''


        return encodeURI(decodeURI(this.decodeHTMLEntity(image?.trim() ?? '')))
    }

    protected decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str)
    }

    protected idCleaner(str: string): string {
        let cleanId: string = str
        cleanId = cleanId.replace(/\/$/, '')
        cleanId = cleanId.split('/').pop() ?? ''

        return cleanId
    }

    isLastPage = ($: CheerioStatic): boolean => {
        let isLast = true

        const hasNext = Boolean($('.blog-pager > span.pagecurrent + span')[0])
        if (hasNext) {
            isLast = false
        }

        return isLast
    }
}