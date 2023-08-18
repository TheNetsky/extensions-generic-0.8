import { ChapterDetails } from "@paperback/types";
import { MangaStreamParser } from "../MangaStreamParser";

export class RealmScansParser extends MangaStreamParser {
    override parseChapterDetails($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails {
        const pages: string[] = []

        for (const page of $('#readerarea > img').toArray()) {
            pages.push($(page).attr('src') ?? '')
        }

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }
}