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

const DOMAIN = 'https://readonepiece.com'

export const ReadOnePieceInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadOnePiece',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'EmZedH',
    authorWebsite: 'http://github.com/EmZedH',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadOnePiece extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/NKmkkq1.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadOnePiece (One Piece)',
            url: DOMAIN + '/manga/one-piece'
        },
        {
            title: 'ReadOnePiece (One Piece: Digital Colored Comics)',
            url: DOMAIN + '/manga/one-piece-digital-colored-comics'
        },
        {
            title: 'ReadOnePiece (Shokugeki no Sanji: One Shot)',
            url: DOMAIN + '/manga/shokugeki-no-sanji-one-shot'
        },
        {
            title: 'ReadOnePiece (One Piece x Toriko)',
            url: DOMAIN + '/manga/one-piece-x-toriko'
        },
        {
            title: 'ReadOnePiece (One Piece Party)',
            url: DOMAIN + '/manga/one-piece-party'
        },
        {
            title: 'ReadOnePiece (Dragon Ball x One Piece)',
            url: DOMAIN + '/manga/dragon-ball-x-one-piece'
        },
        {
            title: 'ReadOnePiece (Wanted: One Piece)',
            url: DOMAIN + '/manga/wanted-one-piece'
        },
        {
            title: 'ReadOnePiece (One Piece: Ace\'s Story)',
            url: DOMAIN + '/manga/one-piece-ace-s-story'
        },
        {
            title: 'ReadOnePiece (One Piece: Omake)',
            url: DOMAIN + '/manga/one-piece-omake'
        },
        {
            title: 'ReadOnePiece (Vivre Card Databook)',
            url: DOMAIN + '/manga/vivre-card-databook'
        },
        {
            title: 'ReadOnePiece (One Piece Databook)',
            url: DOMAIN + '/manga/one-piece-databook'
        },
        {
            title: 'ReadOnePiece (One Piece: Ace\'s Story Manga)',
            url: DOMAIN + '/manga/one-piece-ace-story-manga'
        }
    ]
}