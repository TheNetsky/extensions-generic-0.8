import {
    SourceManga,
    Chapter,
    ChapterDetails,
    PagedResults,
    PartialSourceManga,
    TagSection,
    Tag
} from '@paperback/types'

import {
    HeanSearch,
    HeanSearchItem,
    HeanBanner,
    HeanChapterDetail,
    HeanChapterListItem,
    HeanChapterList,
    HeanMangaDetail,
    HeanTag
} from './HeanInterfaces'

import * as cheerio from 'cheerio'

import entities = require('entities')

export class HeanParser {
    parseDetails(data: HeanMangaDetail): SourceManga {
        const $ = cheerio.load(data.description)
        const description = $('*').text()

        return App.createSourceManga({
            id: this.convertIdSlugToMangaId(data.id, data.series_slug),
            mangaInfo: App.createMangaInfo({
                image: data.thumbnail,
                titles: [this.decodeHTMLEntity(data.title)],
                author: data.author,
                artist: data.studio ?? '',
                desc: this.decodeHTMLEntity(description),
                tags: this.parseTagList(data.tags),
                status: data.status
            })
        })
    }

    parseChapterFromMangaDetails(source: any, data: HeanMangaDetail): Chapter[] {
        return data.seasons
            ?.map(a => a.chapters
                .map(chap => this.parseChapter(source, chap)))
            .reduce((acc, val) => acc.concat(val), [])
            ?? []
    }

    parseTagList(tags: HeanTag[]): TagSection[] | undefined {
        if (!tags || tags.length === 0) return undefined
        return [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags.map(tag => App.createTag({ id: tag.id.toString(), label: tag.name }))
            })
        ]
    }

    parseChaptersList(source: any, data: HeanChapterList, pageNumber: number): { chapters: Chapter[], hasMore: boolean } {
        const chapters = data.data
            .filter(chapter => chapter.price === 0)
            .map(chapter => this.parseChapter(source, chapter))
        return { chapters: chapters, hasMore: pageNumber !== data.meta.last_page }
    }

    parseChapter(source: any, chapter: HeanChapterListItem): Chapter {
        return App.createChapter({
            id: chapter.chapter_slug,
            chapNum: this.parseNum(chapter.chapter_name),
            name: chapter.chapter_title ? this.decodeHTMLEntity(chapter.chapter_title) : 'Chapter ' + this.parseNum(chapter.chapter_name),
            time: new Date(chapter.created_at),
            langCode: source.language
        })
    }

    parseNum(chapter_name: string): number {
        const numTab = chapter_name.trim().split(' ')
        return Number(numTab[1])
    }

    parseChapterDetails(data: HeanChapterDetail, mangaId: string, chapterId: string, api_url: string): ChapterDetails {
        const pages = (data.chapter.chapter_data?.images ?? data.data ?? [])
            .map(a => a.startsWith('https://') ? a : `${api_url}/${a}`)

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }

    parseCarouselTitles(data: HeanBanner[]): PagedResults {
        const items = data.map(elem => this.parseMangaFromCarouselElement(elem))
        return App.createPagedResults({
            results: items
        })
    }

    parseMangaFromCarouselElement(elem: HeanBanner): PartialSourceManga {
        return App.createPartialSourceManga({
            mangaId: this.convertIdSlugToMangaId(elem.series.id, elem.series.series_slug),
            title: this.decodeHTMLEntity(elem.series.title),
            image: elem.banner
        })
    }

    parseSearchResults(data: HeanSearch): PagedResults {
        const items = data.data.map(item => this.parseSearchListItem(item))
        return App.createPagedResults({
            results: items,
            metadata: data.meta
        })
    }

    parseSearchListItem(item: HeanSearchItem): PartialSourceManga {
        return App.createPartialSourceManga({
            mangaId: this.convertIdSlugToMangaId(item.id, item.series_slug),
            title: this.decodeHTMLEntity(item.title),
            subtitle: item.free_chapters 
                ? item.free_chapters
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                    ?.chapter_name 
                : item.status,
            image: item.thumbnail
        })
    }

    parseGenres(data: HeanTag[]): Tag[] {
        return data
            .sort((a, b) => a.id - b.id)
            .map(tag => App.createTag({ id: tag.id.toString(), label: tag.name }))
    }

    convertMangaIdToId(mangaId: string): string {
        const tab = mangaId.split('$$')
        return tab.length === 2 && tab[0] ? tab[0] : mangaId
    }

    convertMangaIdToSlug(mangaId: string): string {
        const tab = mangaId.split('$$')
        return tab.length === 2 && tab[1] ? tab[1] : mangaId
    }

    convertIdSlugToMangaId(id: number, slug: string): string {
        return `${id}$$${slug}`
    }

    protected decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str)
    }
}
