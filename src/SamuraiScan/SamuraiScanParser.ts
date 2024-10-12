import {
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'
import { CheerioAPI } from 'cheerio'
import { decode as decodeHTMLEntity } from 'html-entities'

import {
    Parser
} from '../MadaraParser'

export class SamuraiScanParser extends Parser {

    override async parseMangaDetails($: CheerioAPI, mangaId: string, source: any): Promise<SourceManga> {
        const title: string = decodeHTMLEntity($('div.post-title h1, div#manga-title h1').children().remove().end().text().trim())
        const description: string = decodeHTMLEntity($('div.manga-excerpt').first().text()).replace('Show more', '').trim()

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
                tags: tagSections,
                desc: description,
                status: status
            })
        })
    }
}