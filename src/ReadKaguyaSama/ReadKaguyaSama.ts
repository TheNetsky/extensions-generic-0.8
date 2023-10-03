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

const DOMAIN = 'https://ww2.readkaguyasama.com'

export const ReadKaguyaSamaInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadKaguyaSama',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'MuhamedZ1',
    authorWebsite: 'http://github.com/MuhamedZ1',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS,
    sourceTags: []
}

export class ReadKaguyaSama extends MangaCatalog {

    baseUrl: string = DOMAIN

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadKaguyaSama (Kaguya-sama: Love Is War)',
            url: DOMAIN + '/manga/kaguya-sama-love-is-war'
        },
        {
            title: 'ReadKaguyaSama (Kaguya Wants to Be Confessed To: Official Doujin)',
            url: DOMAIN + '/manga/kaguya-wants-to-be-confessed-to-official-doujin'
        },
        {
            title: 'ReadKaguyaSama (We Want to Talk About Kaguya)',
            url: DOMAIN + '/manga/we-want-to-talk-about-kaguya'
        },
        {
            title: 'ReadKaguyaSama (Kaguya-sama Light Novel)',
            url: DOMAIN + '/manga/kaguya-sama-light-novel'
        },
        {
            title: 'ReadKaguyaSama (IB: Instant Bullet)',
            url: DOMAIN + '/manga/ib-instant-bullet'
        },
        {
            title: 'ReadKaguyaSama (Oshi no Ko)',
            url: DOMAIN + '/manga/oshi-no-ko'
        },
        {
            title: 'ReadKaguyaSama (Sayonara, Piano Sonata)',
            url: DOMAIN + '/manga/sayonara-piano-sonata'
        },
        {
            title: 'ReadKaguyaSama (Original Hinatazaka)',
            url: DOMAIN + '/manga/original-hinatazaka'
        }
    ]
}