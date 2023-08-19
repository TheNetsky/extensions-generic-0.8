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
        const titles: string[] = []
        titles.push(this.decodeHTMLEntity($('div.post-title h1, div#manga-title h1').children().remove().end().text().trim()))
        const description: string = this.decodeHTMLEntity($('div.post-content_item > div > p').first().text()).replace('Show more', '').trim()

        const image: string = encodeURI(await this.getImageSrc($('div.summary_image img').first(), source))

        let parsedStatus = ''

        for (const obj of $('div.post-content_item').toArray()) {
            switch (this.decodeHTMLEntity($('h5', obj).first().text()).trim()) {
                case 'Alternative':
                    titles.push($('div.summary-content', obj).text().trim())
                    break
                case 'Status':
                    parsedStatus = $('div.summary-content', obj).text().trim()
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