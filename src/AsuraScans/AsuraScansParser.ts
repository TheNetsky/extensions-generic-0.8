import { MangaStreamParser } from '../MangaStreamParser'

export class AsuraScansParser extends MangaStreamParser {

    override renderChapterImage(path: string): boolean {
        // Asura has a dead link at the start of each of their chapters (Thanks to pandeynmn for noticing)
        return path != 'https://www.asurascans.com/wp-content/uploads/2021/04/page100-10.jpg'
    }

}