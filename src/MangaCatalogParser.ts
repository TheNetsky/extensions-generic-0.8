import {
    Chapter,
    ChapterDetails,
    SourceManga} from '@paperback/types'

import { decodeHTMLEntity } from './MangaCatalogUtil';


export const parseMangaDetails = ($: CheerioStatic, mangaId: string, mangaImageSelector: string, mangaTitleSelector: string, mangaDescriptionSelector: string): SourceManga => {
    const image = $(mangaImageSelector).attr('src') ?? ""
    const title = decodeHTMLEntity($(mangaTitleSelector).text().trim());
    const description = decodeHTMLEntity($(mangaDescriptionSelector).text().trim());
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles: [title],
            image: image,
            status: "",
            desc: description
        })
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string, chaptersArraySelector: string, chapterTitleSelector: string, chapterIdSelector: string, chapterDateSelector: string): Chapter[] => {

    const chapters: Chapter[] = []
    for(const chapter of $(chaptersArraySelector).toArray()){
        const title: string = $(chapterTitleSelector, chapter).text()
        const chapterId: string = $(chapterIdSelector, chapter).attr('href').split('/')[4]
        const chapNumRegex = chapterId.match(/(\d+\.?\d?)+/)
        const dateTimeStamps = Date.parse($(chapterDateSelector, chapter).text().trim())
        let date = new Date()
        if(!isNaN(dateTimeStamps)){
            date = new Date(dateTimeStamps)
        }
        let chapNum = 0
        if (chapNumRegex && chapNumRegex[1]) chapNum = Number(chapNumRegex[1])

        chapters.push(
            App.createChapter({
            id: chapterId,
            name: title,
            time: date,
            langCode: '🇬🇧',
            chapNum: chapNum,
        }))
    }

    if (chapters.length == 0) {
        throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`)
    }

    return chapters
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string, chapterImagesArraySelector: string, chapterImageSelector: string): ChapterDetails => {
        const pages: string[] = []
    
        for (const img of $(chapterImageSelector, chapterImagesArraySelector).toArray()) {
            const image = img.attribs['src']
            if (!image) continue
            pages.push(image)
        }
    
        const chapterDetails = App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    
        return chapterDetails
}