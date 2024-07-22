import {
    Chapter,
    ChapterDetails,
    Tag,
    TagSection,
    SourceManga,
    PartialSourceManga,
    HomeSection
} from '@paperback/types'

import { decode as decodeHTML } from 'html-entities'

export interface UpdatedManga {
    ids: string[];
}

export class BuddyComplexParser {

    parseMangaDetails($: CheerioSelector, mangaId: string): SourceManga {
        const titles: string[] = []
        titles.push(this.decodeHTMLEntity($('div.name.box > h1').text().trim()))

        const altTitles = $('div.name.box > h2').text().split(/, |; |\| |\/ /)
        for (const title of altTitles) {
            if (title == '') continue
            titles.push(this.decodeHTMLEntity(title.trim()))
        }

        const authors = []
        for (const authorRaw of $('p:contains(Authors) > a', 'div.detail').toArray()) {
            authors.push($(authorRaw).attr('title')?.trim())
        }

        const image = this.getImageSrc($('img', 'div.img-cover'))
        const description = this.decodeHTMLEntity($('div.section-body > p.content').text().trim())

        const arrayTags: Tag[] = []
        for (const tag of $('p:contains(Genres) > a', 'div.detail').toArray()) {
            const label = $(tag).text().replace(',', '').trim()
            const id = encodeURI(this.idCleaner($(tag).attr('href') ?? ''))
            if (!id || !label) continue
            arrayTags.push({ id: id, label: label })
        }
        const tagSections: TagSection[] = [App.createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => App.createTag(x)) })]

        const rawStatus = $('p:contains(Status) > a', 'div.detail').first().text().trim()
        let status: string
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

        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: titles,
                image: image,
                status: status,
                author: authors.length > 0 ? authors.join(', ') : 'Unknown',
                artist: authors.length > 0 ? authors.join(', ') : 'Unknown',
                tags: tagSections,
                desc: description
            })
        })
    }

    parseChapterList($: CheerioSelector, mangaId: string): Chapter[] {
        const chapters: Chapter[] = []
        let sortingIndex = 0

        for (const chapter of $('li', 'ul.chapter-list').toArray()) {
            const title = $('strong.chapter-title', chapter).text().trim()
            const id = this.idCleaner($('a', chapter).attr('href') ?? '')
            const date = this.parseDate($('time.chapter-update', chapter)?.text() ?? '')
            if (!id) continue

            // Check chapter/ch-* regex first
            const byChapter = id.match(/(?:chapter|ch)-((\d+)(?:[-.]\d+)?)/)
            const byNumber = (id.split('-').pop() ?? '').match(/(\d+)(?:[-.]\d+)?/)
            const chapterNumberRegex = (byChapter && byChapter[1]) ? byChapter[1] : byNumber ? byNumber[0] : '0'

            let chapterNumber = Number(chapterNumberRegex.replace('-', '.'))
            chapterNumber = isNaN(chapterNumber) ? 0 : chapterNumber

            chapters.push({
                id: id,
                name: title,
                chapNum: chapterNumber,
                time: date,
                volume: 0,
                sortingIndex,
                langCode: '🇬🇧',
                group: ''
            })
            sortingIndex--
        }

        // If there are no chapters, throw error to avoid losing progress
        if (chapters.length == 0) {
            throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
        }

        return chapters.map(chapter => {
            // Inverts the sortingIndex to have the chapters in the correct order
            chapter.sortingIndex += chapters.length
            return App.createChapter(chapter)
        })
    }

    parseChapterDetails($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails {
        const pages: string[] = []

        const imageRegex = $.html().match(/chapImages\s=\s(.+)(?=')/)
        let imageScript = null
        if (imageRegex && imageRegex[1]) imageScript = imageRegex[1]

        // If script has a match, use the script
        if (imageScript) {
            imageScript = imageScript.replace(/'/g, '')

            const images = imageScript.split(',')
            for (const image of images) {
                let img = image
                if (!img.startsWith('https')) {
                    img = 'https://s1.mbbcdnv1.xyz/manga/' + image
                }
                pages.push(image)
            }
        } else {
            // Else parse the manual way
            for (const image of $('div.chapter-image', 'div#chapter-images.container').toArray()) {
                pages.push(this.getImageSrc($('img', image)))
            }
        }

        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })

        return chapterDetails
    }

    parseTags($: CheerioSelector): TagSection[] {
        const arrayTags: Tag[] = []

        for (const tag of $('li', $('a:contains(GENRES)', 'ul.header__links-list').next()).toArray()) {
            const label = $(tag).text().replace(',', '').trim()
            const id = encodeURI(this.idCleaner($('a', tag).attr('href') ?? ''))

            if (!id || !label) continue
            arrayTags.push({ id: id, label: label })
        }
        const tagSections: TagSection[] = [App.createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => App.createTag(x)) })]
        return tagSections
    }

    parseHomeSections($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void): void {
        for (const section of sections) {
            // Hot Updates
            if (section.id == 'hot_updates') {
                const HotUpdates: PartialSourceManga[] = []
                for (const manga of $('div.trending-item', 'div.main-carousel').toArray()) {
                    const id = this.idCleaner($('a', manga).attr('href') ?? '')
                    const title = $('a', manga).attr('title')
                    const image = this.getImageSrc($('img', manga))
                    const subtitle = $('span.latest-chapter', manga).text().trim()

                    if (!id || !title) continue
                    HotUpdates.push(App.createPartialSourceManga({
                        mangaId: id,
                        image: image,
                        title: this.decodeHTMLEntity(title),
                        subtitle: this.decodeHTMLEntity(subtitle)
                    }))
                }
                section.items = HotUpdates
                sectionCallback(section)
            }

            // Latest Update
            if (section.id == 'latest_update') {
                const latestUpdate: PartialSourceManga[] = []

                for (const manga of $('div.book-item.latest-item', 'div.section.box.grid-items').toArray()) {
                    const id = this.idCleaner($('a', manga).attr('href') ?? '')
                    const title = $('div.title > h3 > a', manga).text().trim()
                    const image = this.getImageSrc($('img', manga))
                    const subtitle = $('a', $('div.chap-item', manga).first()).text().trim()

                    if (!id || !title) continue
                    latestUpdate.push(App.createPartialSourceManga({
                        mangaId: id,
                        image: image,
                        title: this.decodeHTMLEntity(title),
                        subtitle: this.decodeHTMLEntity(subtitle)
                    }))
                }
                section.items = latestUpdate
                sectionCallback(section)
            }

            // Top Today
            if (section.id == 'top_today') {
                const TopTodayManga: PartialSourceManga[] = []
                for (const manga of $('div.top-item', $('div.tab-panel').get(0)).toArray()) {
                    const id = this.idCleaner($('a', manga).attr('href') ?? '')
                    const title = $('h3.title', manga).text().trim()
                    const image = this.getImageSrc($('img', manga))
                    const subtitle = $('h4.chap-item', manga).text().trim()

                    if (!id || !title) continue
                    TopTodayManga.push(App.createPartialSourceManga({
                        mangaId: id,
                        image: image,
                        title: this.decodeHTMLEntity(title),
                        subtitle: this.decodeHTMLEntity(subtitle)
                    }))
                }
                section.items = TopTodayManga
                sectionCallback(section)
            }

            // Top Weekly
            if (section.id == 'top_weekly') {
                const TopWeeklyManga: PartialSourceManga[] = []
                for (const manga of $('div.top-item', $('div.tab-panel').get(1)).toArray()) {
                    const id = this.idCleaner($('a', manga).attr('href') ?? '')
                    const title = $('h3.title', manga).text().trim()
                    const image = this.getImageSrc($('img', manga))
                    const subtitle = $('h4.chap-item', manga).text().trim()

                    if (!id || !title) continue
                    TopWeeklyManga.push(App.createPartialSourceManga({
                        mangaId: id,
                        image: image,
                        title: this.decodeHTMLEntity(title),
                        subtitle: this.decodeHTMLEntity(subtitle)
                    }))
                }
                section.items = TopWeeklyManga
                sectionCallback(section)
            }

            // Top Monthly
            if (section.id == 'top_monthly') {
                const TopMonthlyManga: PartialSourceManga[] = []
                for (const manga of $('div.top-item', $('div.tab-panel').get(2)).toArray()) {
                    const id = this.idCleaner($('a', manga).attr('href') ?? '')
                    const title = $('h3.title', manga).text().trim()
                    const image = this.getImageSrc($('img', manga))
                    const subtitle = $('h4.chap-item', manga).text().trim()

                    if (!id || !title) continue
                    TopMonthlyManga.push(App.createPartialSourceManga({
                        mangaId: id,
                        image: image,
                        title: this.decodeHTMLEntity(title),
                        subtitle: this.decodeHTMLEntity(subtitle)
                    }))
                }
                section.items = TopMonthlyManga
                sectionCallback(section)
            }

        }
    }

    parseViewMore = ($: CheerioStatic): PartialSourceManga[] => {
        const mangas: PartialSourceManga[] = []
        const collectedIds: string[] = []

        for (const manga of $('div.book-item', 'div.list').toArray()) {
            const id = this.idCleaner($('a', manga).attr('href') ?? '')
            const title = $('div.title', manga).text().trim()
            const image = this.getImageSrc($('img', manga))
            const subtitle = $('span.latest-chapter', manga).text().trim()

            if (!id || !title || collectedIds.includes(id)) continue
            mangas.push(App.createPartialSourceManga({
                mangaId: id,
                image: image,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            }))
            collectedIds.push(id)
        }
        return mangas
    }

    isLastPage = ($: CheerioStatic): boolean => {
        let isLast = false

        const currentPage = Number($('a.link.active', 'div.paginator').text().trim())

        const pages = []
        for (const page of $('a.link', 'div.paginator').toArray()) {
            const p = Number($(page).text().trim())
            if (isNaN(p)) continue
            pages.push(p)
        }
        const lastPage = Math.max(...pages)

        if (currentPage >= lastPage) isLast = true
        return isLast
    }

    protected getImageSrc(imageObj: Cheerio | undefined): string {
        let image: string | undefined
        const dataLazy = imageObj?.attr('data-lazy-src')
        const srcset = imageObj?.attr('srcset')
        const dataSRC = imageObj?.attr('data-src')

        if ((typeof dataLazy != 'undefined') && !dataLazy?.startsWith('data')) {
            image = imageObj?.attr('data-lazy-src')
        } else if ((typeof srcset != 'undefined') && !srcset?.startsWith('data')) {
            image = imageObj?.attr('srcset')?.split(' ')[0] ?? ''
        } else if ((typeof dataSRC != 'undefined') && !dataSRC?.startsWith('data')) {
            image = imageObj?.attr('data-src')
        } else {
            image = undefined
        }

        const wpRegex = image?.match(/(https:\/\/i\d.wp.com\/)/)
        if (wpRegex) image = image?.replace(wpRegex[0], '')
        if (image?.startsWith('//')) image = `https:${image}`
        if (!image?.startsWith('http')) image = `https://${image}`


        return encodeURI(decodeURI(this.decodeHTMLEntity(image?.trim() ?? '')))
    }

    protected decodeHTMLEntity(str: string): string {
        return decodeHTML(str)
    }

    protected parseDate = (date: string): Date => {
        date = date.toUpperCase()
        let time: Date
        const extractedNumber = (/\d*/.exec(date) ?? [])[0]
        let number = 0
        if (extractedNumber == '') {
            if (date.startsWith('AN') || date.startsWith('A ')) {
                number = 1
            }
        } else {
            number = isNaN(Number(extractedNumber)) ? 0 : Number(extractedNumber)
        }
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