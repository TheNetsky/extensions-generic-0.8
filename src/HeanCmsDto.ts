export interface BannerDto 
{
    banner: string
    series:
    {
        series_slug: string
        id: number
        title: string
    }
}

export interface ChapterListDto
{
    meta: HeanCmsMetadata
    data: ChapterListItemDto[]
}

export interface ChapterListItemDto
{
    chapter_name: string
    chapter_title: string | null
    chapter_slug: string
    created_at: string
    price: number
}

export interface SearchDto {
    meta: HeanCmsMetadata
    data: SearchItemDto[]
}

export interface SearchItemDto {
    id: number
    title: string
    series_slug: string
    thumbnail: string
}

export interface HeanCmsMetadata
{
    per_page?: number
    current_page: number
    last_page?: number
}

export interface MangaDetailDto {
    author: string
    description: string
    id: number
    series_slug: string
    status: string
    tags: TagDto[]
    thumbnail: string
    title: string
    studio: string | undefined
    seasons: {
        chapters: ChapterListItemDto[]
    }[] | undefined
}


export interface TagDto {
    id: number
    name: string
}

export interface ChapterDetailDto {
    chapter: {
        chapter_data: {
            images: string[]
        } | undefined
    }
    data: string[] | undefined
}