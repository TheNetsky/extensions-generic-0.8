import {
    Chapter,
    ChapterDetails,
    Tag,
    TagSection,
    SourceManga,
    PartialSourceManga
} from '@paperback/types'

import entities = require('entities')

import {
    extractVariableValues,
    decryptData
} from './MadaraDecrypter'


export class Parser {
    async parseMangaDetails($: CheerioStatic, mangaId: string, source: any): Promise<SourceManga> {
        const title: string = this.decodeHTMLEntity($('div.post-title h1, div#manga-title h1').children().remove().end().text().trim())
        const author: string = this.decodeHTMLEntity($('div.author-content').first().text().replace('\\n', '').trim()).replace('Updating', '')
        const artist: string = this.decodeHTMLEntity($('div.artist-content').first().text().replace('\\n', '').trim()).replace('Updating', '')
        const description: string = this.decodeHTMLEntity($('div.description-summary').first().text()).replace('Show more', '').trim()

        const image: string = encodeURI(await this.getImageSrc($('div.summary_image img').first(), source))
        const parsedStatus: string = $('div.summary-content', $('div.post-content_item').last()).text().trim()

        let status: string
        switch (parsedStatus.toUpperCase()) {
            case 'COMPLETED':
                status = 'Completed'
                break
            default:
                status = 'Ongoing'
                break
        }

        const genres: Tag[] = []
        for (const obj of $('div.genres-content a').toArray()) {
            const label = $(obj).text()
            const id = $(obj).attr('href')?.split('/')[4] ?? label

            if (!label || !id) continue
            genres.push(App.createTag({ label: label, id: id }))
        }
        const tagSections: TagSection[] = [App.createTagSection({ id: '0', label: 'genres', tags: genres })]

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: [title],
                image: image,
                author: author,
                artist: artist,
                tags: tagSections,
                desc: description,
                status: status
            })
        })
    }


    parseChapterList($: CheerioSelector, mangaId: string, source: any): Chapter[] {
        const chapters: Chapter[] = []
        let sortingIndex = 0

        // For each available chapter..
        for (const obj of $('li.wp-manga-chapter  ').toArray()) {
            const id = this.idCleaner($('a', obj).first().attr('href') ?? '')

            const chapName = $('a', obj).first().text().trim() ?? ''
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

    async parseChapterDetails($: CheerioSelector, mangaId: string, chapterId: string, selector: string, source: any): Promise<ChapterDetails> {
        const pages: string[] = []

        for (const obj of $(selector).toArray()) {
            const page = await this.getImageSrc($(obj), source)
            if (!page) {
                throw new Error(`Could not parse page for postId:${mangaId} chapterId:${chapterId}`)
            }
            pages.push(encodeURI(page))
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }

    async parseProtectedChapterDetails($: CheerioSelector, mangaId: string, chapterId: string, selector: string, source: any): Promise<ChapterDetails> {
        if (!$(selector).length) {
            return this.parseChapterDetails($, mangaId, chapterId, selector, source)
        }

        const variables = extractVariableValues($(selector).get()[0].children[0].data)
        if (!('chapter_data' in variables) || !('wpmangaprotectornonce' in variables)) {
            throw new Error(`Could not parse page for postId:${mangaId} chapterId:${chapterId}. Reason: Lacks sufficient data`)
        }

        const chapterList = decryptData(<string>variables['chapter_data'], <string>variables['wpmangaprotectornonce'])
        const pages: string[] = []

        chapterList.forEach((page: string) => {
            pages.push(encodeURI(page))
        })

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }

    parseTags($: CheerioSelector, advancedSearch: boolean): TagSection[] {
        const genres: Tag[] = []
        if (advancedSearch) {
            for (const obj of $('.checkbox-group div label').toArray()) {
                const label = $(obj).text().trim()
                const id = $(obj).attr('for') ?? label
                genres.push(App.createTag({ label: label, id: id }))
            }
        } else {
            for (const obj of $('.menu-item-object-wp-manga-genre a', $('.second-menu')).toArray()) {
                const label = $(obj).text().trim()
                const id = $(obj).attr('href')?.split('/')[4] ?? label
                genres.push(App.createTag({ label: label, id: id }))
            }
        }
        return [App.createTagSection({ id: '0', label: 'genres', tags: genres })]
    }

    async parseSearchResults($: CheerioSelector, source: any): Promise<any[]> {
        const results: any[] = []

        for (const obj of $(source.searchMangaSelector).toArray()) {
            const slug: string = ($('a', obj).attr('href') ?? '').replace(/\/$/, '').split('/').pop() ?? ''
            const path: string = ($('a', obj).attr('href') ?? '').replace(/\/$/, '').split('/').slice(-2).shift() ?? ''
            if (!slug || !path) {
                throw new Error(`Unable to parse slug (${slug}) or path (${path})!`)
            }

            const title: string = $('a', obj).attr('title') ?? ''
            const image: string = encodeURI(await this.getImageSrc($('img', obj), source))
            const subtitle: string = $('span.font-meta.chapter', obj).text().trim()

            results.push({
                slug: slug,
                path: path,
                image: image,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            })
        }

        return results
    }

    async parseHomeSection($: CheerioStatic, source: any): Promise<PartialSourceManga[]> {
        const items: PartialSourceManga[] = []

        for (const obj of $('div.page-item-detail').toArray()) {
            const image = encodeURI(await this.getImageSrc($('img', obj), source) ?? '')
            const title = $('a', $('h3.h5', obj)).last().text()

            const slug = this.idCleaner($('a', $('h3.h5', obj)).attr('href') ?? '')
            const postId = $('div', obj).attr('data-post-id')
            const subtitle = $('span.font-meta.chapter', obj).first().text().trim()

            if (isNaN(Number(postId)) || !title) {
                console.log(`Failed to parse homepage sections for ${source.baseUrl}`)
                continue
            }

            items.push(App.createPartialSourceManga({
                mangaId: String(source.usePostIds ? postId : slug),
                image: image,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            }))
        }
        return items
    }

    // UTILITY METHODS
    protected decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str)
    }

    async getImageSrc(imageObj: Cheerio | undefined, source: any): Promise<string> {
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

        if (source?.stateManager) {
            const HQthumb = await source.stateManager.retrieve('HQthumb') ?? false
            if (HQthumb) {
                image = image?.replace('-110x150', '')
                    .replace('-175x238', '')
                    .replace('-193x278', '')
                    .replace('-350x476', '')
            }
        }

        if (image?.startsWith('/')) {
            image = source.baseUrl + image
        }

        image = image
            ?.trim()
            .replace(/(\s{2,})/gi, '')

        image = image?.replace(/http:\/\/\//g, 'http://') // only changes urls with http protocol
        image = image?.replace(/http:\/\//g, 'https://')
        // Malforumed url fix (Turns https:///example.com into https://example.com (or the http:// equivalent))
        image = image?.replace(/https:\/\/\//g, 'https://') // only changes urls with https protocol

        return decodeURI(this.decodeHTMLEntity(image ?? ''))
    }

    parseDate = (date: string): Date => {
        date = date.toUpperCase()
        let time: Date
        const number = Number((/\d*/.exec(date) ?? [])[0])
        if (date.includes('LESS THAN AN HOUR') || date.includes('JUST NOW')) {
            time = new Date(Date.now())
        } else if (date.includes('YEAR') || date.includes('YEARS')) {
            time = new Date(Date.now() - (number * 31556952000))
        } else if (date.includes('MONTH') || date.includes('MONTHS')) {
            time = new Date(Date.now() - (number * 2592000000))
        } else if (date.includes('WEEK') || date.includes('WEEKS')) {
            time = new Date(Date.now() - (number * 604800000))
        } else if (date.includes('YESTERDAY')) {
            time = new Date(Date.now() - 86400000)
        } else if (date.includes('DAY') || date.includes('DAYS')) {
            time = new Date(Date.now() - (number * 86400000))
        } else if (date.includes('HOUR') || date.includes('HOURS')) {
            time = new Date(Date.now() - (number * 3600000))
        } else if (date.includes('MINUTE') || date.includes('MINUTES')) {
            time = new Date(Date.now() - (number * 60000))
        } else if (date.includes('SECOND') || date.includes('SECONDS')) {
            time = new Date(Date.now() - (number * 1000))
        } else {
            time = new Date(date)
        }
        return time
    }

    idCleaner(str: string): string {
        let cleanId: string | null = str
        cleanId = cleanId.replace(/\/$/, '')
        cleanId = cleanId.split('/').pop() ?? null

        if (!cleanId) throw new Error(`Unable to parse id for ${str}`) // Log to logger
        return cleanId
    }

}