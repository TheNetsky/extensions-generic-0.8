import { ChapterDetails } from "@paperback/types";
import { Parser } from "../MangaCatalogParser";

export class ReadBerserkParser extends Parser{
    override parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string, source: any): ChapterDetails => {
        const pages: string[] = []
        for (const img of $(source.chapterImageSelector, source.chapterImagesArraySelector).toArray()) {
            let image = img.attribs['data-src']
            if (!image) {
                image = img.attribs['src']
            }
            if (!image) continue
            // Sometimes random url param strings end up getting appended, so we are making 
            // sure that this is an image link
            const match = image.match(/(https?:\/\/[^\s]+?\.(?:jpe?g|png|webp|gif|svg))/i);
            if (match) {
                pages.push(match[0])
            }
        }

        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })

        return chapterDetails
    }
}