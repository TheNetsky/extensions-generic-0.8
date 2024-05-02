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
    ChapterDetailDto,
    ChapterListItemDto,
    ChapterListDto,
    MangaDetailDto,
    TagDto,
    BannerDto, 
    SearchItemDto, 
    SearchDto
} from './HeanCmsDto'

import * as cheerio from 'cheerio'

export class HeanCmsParser {
    static parseDetails(data: MangaDetailDto): SourceManga {
        return App.createSourceManga({
            id: this.convertIdSlugToMangaId(data.id, data.series_slug),
            mangaInfo: App.createMangaInfo({
                image: data.thumbnail,
                titles: [data.title],
                author: data.author,
                artist: data.studio ?? '',
                desc: cheerio.load(data.description).text().trim(),
                tags: this.parseTagList(data.tags),
                status: data.status
            })
        })
    }

    static parseChapterFromMangaDetails(data: MangaDetailDto): Chapter[] {
        return data.seasons
            ?.map(a => a.chapters
                .map(chap => this.parseChapter(chap)))
            .reduce((acc, val) => acc.concat(val), [])
        ?? []
    }

    static parseTagList(tags: TagDto[]) : TagSection[] | undefined{
        if(!tags || tags.length === 0) return undefined
        return [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags.map(tag => App.createTag({ id: tag.id.toString(), label: tag.name }))
            })
        ]
    }

    static parseChaptersList(data: ChapterListDto, pageNumber: number): {chapters: Chapter[], hasMore: boolean} {
        const chapters = data.data
            .filter(chapter => chapter.price === 0)
            .map(chapter => this.parseChapter(chapter))
        return { chapters: chapters, hasMore: pageNumber !== data.meta.last_page }
    }

    static parseChapter(chapter: ChapterListItemDto): Chapter {
        return App.createChapter({
            id: chapter.chapter_slug,
            chapNum: this.parseNum(chapter.chapter_name),
            name: chapter.chapter_title ?? '',
            time: new Date(chapter.created_at)
        })
    }

    static parseNum(chapter_name: string) : number{
        const numTab = chapter_name.trim().split(' ')
        return Number(numTab[1])
    }
  
    static parseChapterDetails(data: ChapterDetailDto, mangaId: string, chapterId: string): ChapterDetails {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: data.chapter.chapter_data?.images ?? data.data ?? []
        })
    }

    static parseCarouselTitles(data: BannerDto[]): PagedResults {
        const items = data.map(elem => this.parseMangaFromCarouselElement(elem))
        return App.createPagedResults({
            results: items
        })
    }

    static parseMangaFromCarouselElement(elem: BannerDto): PartialSourceManga {
        return App.createPartialSourceManga({
            mangaId: this.convertIdSlugToMangaId(elem.series.id, elem.series.series_slug),
            title: elem.series.title,
            image: elem.banner
        })
    }

    static parseSearchResults(data: SearchDto): PagedResults {
        const items = data.data.map(item => this.parseSearchListItem(item))
        return App.createPagedResults({
            results: items,
            metadata: data.meta
        })
    }
    
    static parseSearchListItem(item: SearchItemDto): PartialSourceManga {
        return App.createPartialSourceManga({
            mangaId: this.convertIdSlugToMangaId(item.id, item.series_slug),
            title: item.title,
            image: item.thumbnail
        })
    }

    static parseGenres(data: TagDto[]): Tag[]{
        return data
            .sort((a, b) => a.id - b.id)
            .map(tag => App.createTag({ id: tag.id.toString(), label: tag.name }))
    }
        
    static convertMangaIdToId (mangaId: string): string {
        const tab = mangaId.split('$$')
        return tab.length === 2 && tab[0] ? tab[0] : mangaId
    }

    static convertMangaIdToSlug (mangaId: string): string {
        const tab = mangaId.split('$$')
        return tab.length === 2 && tab[1] ? tab[1] : mangaId
    }

    static convertIdSlugToMangaId (id: number, slug: string): string {
        return `${id}$$${slug}`
    }
}
