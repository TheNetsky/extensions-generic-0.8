import { ChapterDetails, PartialSourceManga, SourceManga, Tag, TagSection } from '@paperback/types'
import { MangaStreamParser } from '../MangaStreamParser'
import { extractVariableValues } from './RealmScansHelper'

import { DOMAIN as baseUrl } from './RealmScans'
import { HomeSectionData } from '../MangaStreamHelper'

export class RealmScansParser extends MangaStreamParser {
    override parseChapterDetails($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails {
        const pages: string[] = []

        $('#readerarea > img').toArray().forEach(page => {
            const selectorPage = $(page)
            pages.push(selectorPage.attr('src') ?? selectorPage.attr('data-cfsrc') ?? selectorPage.attr('data-src') ?? '')
        })

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }

    override async parseSearchResults($: CheerioSelector, source: any): Promise<any[]> {
        const results: any[] = []

        for (const obj of $('div.bs', 'div.listupd').toArray()) {
            const slug: string = ($('a', obj).attr('href') ?? '').replace(/\/$/, '').split('/').pop() ?? ''
            const path: string = ($('a', obj).attr('href') ?? '').replace(/\/$/, '').split('/').slice(-2).shift() ?? ''
            if (!slug || !path) {
                throw new Error(`Unable to parse slug (${slug}) or path (${path})!`)
            }

            const title: string = $('a', obj).attr('title') ?? ''
            const image = this.getImageSrc($('img', obj)) ?? ''
            const subtitle = $('div.epxs', obj).text().trim()

            results.push({
                slug,
                path,
                image: image || source.fallbackImage,
                title: this.decodeHTMLEntity(title),
                subtitle: this.decodeHTMLEntity(subtitle)
            })
        }

        return results
    }

    override parseMangaDetails($: CheerioStatic, mangaId: string, source: any): SourceManga {
        const titles: string[] = []
        titles.push(this.decodeHTMLEntity($('h1.entry-title').text().trim()))

        const altTitles = $(`span:contains(${source.manga_selector_AlternativeTitles}), b:contains(${source.manga_selector_AlternativeTitles})+span, .imptdt:contains(${source.manga_selector_AlternativeTitles}) i, h1.entry-title+span`).contents().remove().last().text().split(',') // Language dependant
        for (const title of altTitles) {
            if (title == '') {
                continue
            }
            titles.push(this.decodeHTMLEntity(title.trim()))
        }

        const author = $(`span:contains(${source.manga_selector_author}), .fmed b:contains(${source.manga_selector_author})+span, .imptdt:contains(${source.manga_selector_author}) i, .tsinfo > div:nth-child(4) > i`).contents().remove().last().text().trim() // Language dependant
        const artist = $(`span:contains(${source.manga_selector_artist}), .fmed b:contains(${source.manga_selector_artist})+span, .imptdt:contains(${source.manga_selector_artist}) i, .tsinfo > div:nth-child(5) > i`).contents().remove().last().text().trim() // Language dependant
        const image = this.getImageSrc($('img', 'div[itemprop="image"]'))

        const descriptionScriptContent = $('div[itemprop="description"] script').get()[0].children[0].data
        const description = extractVariableValues(descriptionScriptContent)?.description ?? 'N/A'

        // RealmScans uses markdown to create their descriptions, the following code is meant to disassemble the markdown and create a clean description
        const cleanedDescription = description
            // remove first character of string (it'll be matched as "content")
            .slice(1, -1)
            .replace(/\\r/g, "")
            .replace(/> /g, "")
            .replace(/\\n/g, "\n")
            .replace(/\\u[\dA - F]{ 4} /gi, match => String.fromCharCode(parseInt(match.slice(2), 16)));

        const arrayTags: Tag[] = []
        for (const tag of $('a', source.manga_tag_selector_box).toArray()) {
            const label = $(tag).text().trim()
            const id = this.idCleaner($(tag).attr('href') ?? '')
            if (!id || !label) {
                continue
            }
            arrayTags.push({ id, label })
        }

        const rawStatus = $(`span:contains(${source.manga_selector_status}), .fmed b:contains(${source.manga_selector_status})+span, .imptdt:contains(${source.manga_selector_status}) i`).contents().remove().last().text().trim()
        let status
        switch (rawStatus.toLowerCase()) {
            case source.manga_StatusTypes.ONGOING.toLowerCase():
                status = 'Ongoing'
                break
            case source.manga_StatusTypes.COMPLETED.toLowerCase():
                status = 'Completed'
                break
            default:
                status = 'Ongoing'
                break
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
                titles,
                image: image,
                status,
                author: author == '' ? 'Unknown' : author,
                artist: artist == '' ? 'Unknown' : artist,
                tags: tagSections,
                desc: cleanedDescription
            })
        })
    }

    override async parseHomeSection($: CheerioStatic, section: HomeSectionData, source: any): Promise<PartialSourceManga[]> {
        const items: PartialSourceManga[] = []

        const mangas = section.selectorFunc($)
        if (!mangas.length) {
            console.log(`Unable to parse valid ${section.section.title} section!`)
            return items
        }

        for (const manga of mangas.toArray()) {
            const title = section.titleSelectorFunc($, manga)

            const image = this.getImageSrc($('img', manga)) ?? ''
            const subtitle = section.subtitleSelectorFunc($, manga) ?? ''

            const slug: string = this.idCleaner($('a', manga).attr('href') ?? '')
            const path: string = ($('a', manga).attr('href') ?? '').replace(/\/$/, '').split('/').slice(-2).shift() ?? ''
            const postId = $('a', manga).attr('rel')
            const mangaId: string = await source.getUsePostIds() ? (isNaN(Number(postId)) ? await source.slugToPostId(slug, path) : postId) : slug

            if (!mangaId || !title) {
                console.log(`Failed to parse homepage sections for ${source.baseUrl} title (${title}) mangaId (${mangaId})`)
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

    override getImageSrc(imageObj: Cheerio | undefined): string {
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

        if (!image?.startsWith('http')) {
            if (!baseUrl) {
                throw new Error(`Unable to parse image source, image src does not have full address, and base url is not supplied!\nImage url: ${image}`)
            }

            image = `${baseUrl}${image}` // in this form, it is expected the baseUrl has NO trailing slash, and the image DOES have a leading slash
        } else {
            image = image.replace(/^\/\//, 'https://')
            image = image.replace(/^\//, 'https:/')
        }

        return encodeURI(decodeURI(this.decodeHTMLEntity(image?.trim() ?? '')))
    }
}