import {
    ContentRating,
    SourceInfo,
    SourceIntents
} from '@paperback/types'

import {
    MangaCatalog,
    getExportVersion
} from '../MangaCatalog'

import { SourceBase } from '../MangaCatalogInterface'

const DOMAIN = 'https://readberserk.com'

export const ReadBerserkInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadBerserk',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.MATURE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadBerserk extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i0.wp.com/readberserk.com/wp-content/uploads/2017/06/berserk-1.jpg'

    override mangaTitleSelector = 'h2 > span'
    override mangaDescriptionSelector = 'div.card.flex-md-row.mb-4.box-shadow.h-md-250 > div > p:nth-child(3)'

    override chaptersArraySelector = 'tbody.no-border-x > tr'
    override chapterIdSelector = 'div.d-flex > a'
    override chapterTitleSelector = 'td:nth-child(1)'
    override chapterDateSelector = 'td:nth-child(2)'

    override chapterImagesArraySelector = 'div.img_container.mb-2'
    override chapterImageSelector = 'img.pages__img'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadBerserk (Berserk)',
            url: DOMAIN + '/manga/berserk'
        },
        {
            title: 'ReadBerserk (Berserk Official Guidebook)',
            url: DOMAIN + '/manga/berserk-official-guidebook'
        },
        {
            title: 'ReadBerserk (Berserk Colored)',
            url: DOMAIN + '/manga/berserk-colored'
        },
        {
            title: 'ReadBerserk (Berserk the Motion Comic)',
            url: DOMAIN + '/manga/berserk-the-motion-comic'
        },
        {
            title: 'ReadBerserk (Duranki)',
            url: DOMAIN + '/manga/duranki'
        },
        {
            title: 'ReadBerserk (Gigantomakhia)',
            url: DOMAIN + '/manga/gigantomakhia'
        },
        {
            title: 'ReadBerserk (Berserk Spoilers Raw)',
            url: DOMAIN + '/manga/berserk-spoilers-raw'
        }
    ]
}