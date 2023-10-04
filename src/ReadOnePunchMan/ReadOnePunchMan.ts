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

const DOMAIN = 'https://ww3.readopm.com'

export const ReadOnePunchManInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadOnePunchMan',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedace',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadOnePunchMan extends MangaCatalog {

    baseUrl: string = DOMAIN

    override mangaTitleSelector = 'h2 > span'
    override mangaImageSelector = '.card-img-right'
    override mangaDescriptionSelector = 'div.card.flex-md-row.mb-4.box-shadow.h-md-250 > div > p:nth-child(3)'

    override chaptersArraySelector = 'tbody.no-border-x > tr'
    override chapterIdSelector = 'div.d-flex > a'
    override chapterTitleSelector = 'td:nth-child(1)'
    override chapterDateSelector = 'td:nth-child(2)'

    override chapterImagesArraySelector = 'div.img_container.mb-2'
    override chapterImageSelector = 'img.pages__img'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadOnePunchMan (One Punch Man)',
            url: DOMAIN + '/manga/one-punch-man'
        },
        {
            title: 'ReadOnePunchMan (OnePunch-Man ONE)',
            url: DOMAIN + '/manga/onepunch-man-one'
        },
        {
            title: 'ReadOnePunchMan (One Punch Man: Colored)',
            url: DOMAIN + '/manga/one-punch-man-colored'
        },
        {
            title: 'ReadOnePunchMan (Mob Psycho 100)',
            url: DOMAIN + '/manga/mob-psycho-100'
        },
        {
            title: 'ReadOnePunchMan (Reigen)',
            url: DOMAIN + '/manga/reigen'
        },
        {
            title: 'ReadOnePunchMan (Eyeshield 21)',
            url: DOMAIN + '/manga/eyeshield-21'
        }
    ]
}