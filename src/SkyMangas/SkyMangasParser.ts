import { MangaStreamParser } from '../MangaStreamParser'
import { ChapterDetails } from '@paperback/types'

export class SkyMangasParser extends MangaStreamParser {

    override parseChapterDetails($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails {
        const pages: string[] = []
        let obj: any

        for (const script of $('script[src*="data:text/javascript"]').toArray()) {
            const scriptContent: string = script.attribs['src'] ?? ''
            if (!scriptContent) {
                continue
            }

            const encodedContent: string = Buffer.from(scriptContent.replace('data:text/javascript;base64,', ''), 'base64').toString()
            // To avoid our regex capturing more scrips, we stop at the first match of ";", also known as the first ending the matching script
            const scriptObj = /ts_reader.run\((.[^;]+)\)/.exec(encodedContent)?.[1] ?? '' // Get the data else return null.
            if (!scriptObj) {
                continue
            }

            obj = scriptObj // Get the data else return null.
        }

        if (obj == '') {
            throw new Error(`Failed to find page details script for manga ${mangaId}`)
        } // If null, throw error, else parse data to json.

        obj = JSON.parse(obj)

        if (!obj?.sources) {
            throw new Error(`Failed for find sources property for manga ${mangaId}`)
        }

        for (const index of obj.sources) { // Check all sources, if empty continue.
            if (index?.images.length == 0) continue
            index.images.map((p: string) => pages.push(encodeURI(p)))
        }

        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })

        return chapterDetails
    }

}