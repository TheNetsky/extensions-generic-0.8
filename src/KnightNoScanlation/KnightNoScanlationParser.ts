import {
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'

import {
    Parser
} from '../MadaraParser'

export class KnightNoScanlationParser extends Parser {

    override async parseMangaDetails($: CheerioStatic, mangaId: string, source: any): Promise<SourceManga> {
        const image: string = encodeURI(await this.getImageSrc($('div.summary_image img').first(), source))
        const titles: string[] = []
        titles.push(this.decodeHTMLEntity($('div.post-title h1, div#manga-title h1').children().remove().end().text().trim()))

        let parsedStatus = ''
        let description = ''

        for (const obj of $('div.post-content_item').toArray()) {
            switch (this.decodeHTMLEntity($('h5', obj).first().text()).trim().toUpperCase()) {
                case 'ALTERNATIVE':
                    titles.push(this.decodeHTMLEntity($('div.summary-content', obj).text().trim()))
                    break
                case 'STATUS':
                    parsedStatus = $('div.summary-content', obj).text().trim()
                    break
                case 'SUMMARY':
                    description = this.decodeHTMLEntity($('p', obj).text().trim())
                    break
            }
        }

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
                titles: titles,
                image: image,
                tags: tagSections,
                desc: description,
                status: status
            })
        })
    }
}