export interface HeanBanner {
    banner: string
    series:
    {
        series_slug: string
        id: number
        title: string
    }
}

export interface HeanChapterList {
    meta: HeanMetadata
    data: HeanChapterListItem[]
}

export interface HeanChapterListItem {
    chapter_name: string
    chapter_title: string | null
    chapter_slug: string
    created_at: string
    price: number
}

export interface HeanSearch {
    meta: HeanMetadata
    data: HeanSearchItem[]
}

export interface HeanSearchItem {
    id: number;
    title: string;
    description: string;
    alternative_names: string;
    series_type: string;
    series_slug: string;
    thumbnail: string;
    total_views: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    badge: string;
    rating: number;
    paid_chapters: any[];
    free_chapters: Chapter[];
    latest_chapter: null;
}

export interface Chapter {
    id: number;
    chapter_name: string;
    chapter_slug: string;
    created_at: Date;
    series_id: number;
}

export interface HeanMetadata {
    per_page?: number
    current_page: number
    last_page?: number
}

export interface HeanMangaDetail {
    author: string
    description: string
    id: number
    series_slug: string
    status: string
    tags: HeanTag[]
    thumbnail: string
    title: string
    studio: string | undefined
    seasons: {
        chapters: HeanChapterListItem[]
    }[] | undefined
}


export interface HeanTag {
    id: number
    name: string
}

export interface HeanChapterDetail {
    chapter: {
        chapter_data: {
            images: string[]
        } | undefined
    }
    data: string[] | undefined
}