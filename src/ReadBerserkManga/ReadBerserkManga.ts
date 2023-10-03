import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog, 
    getExportVersion
} from '../MangaCatalog'

const DOMAIN = 'https://readberserk.com'

export const ReadBerserkMangaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadBerserkManga',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadBerserkManga extends MangaCatalog {
    
    baseUrl: string = DOMAIN

    override mangaTitleSelector: string = "h2 > span"
    override mangaImageSelector: string = ".card-img-right"
    override mangaDescriptionSelector: string = "div.card.flex-md-row.mb-4.box-shadow.h-md-250 > div > p:nth-child(3)"

    override chaptersArraySelector: string = "tbody.no-border-x > tr"
    override chapterIdSelector: string = "div.d-flex > a"
    override chapterTitleSelector: string = "td:nth-child(1)"
    override chapterDateSelector: string = "td:nth-child(2)"

    override chapterImagesArraySelector: string = "div.img_container.mb-2"
    override chapterImageSelector: string = "img.pages__img"

    
    sourceUrlList: string[] = [
        DOMAIN+"/manga/berserk/",
        DOMAIN+"/manga/berserk-official-guidebook/",
        DOMAIN+"/manga/berserk-colored/",
        DOMAIN+"/manga/berserk-the-motion-comic/",
        DOMAIN+"/manga/duranki/",
        DOMAIN+"/manga/gigantomakhia/",
        DOMAIN+"/manga/berserk-spoilers-raw/",
    ]
}