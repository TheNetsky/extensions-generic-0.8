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

const DOMAIN = 'https://readjojos.com'

export const ReadJoJosInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'ReadJoJos',
    description: `Extension that pulls manga from ${DOMAIN}`,
    author: 'Netsky',
    authorWebsite: 'http://github.com/TheNetsky',
    icon: 'icon.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
    sourceTags: []
}

export class ReadJoJos extends MangaCatalog {

    baseUrl: string = DOMAIN

    iconUrl = 'https://i.imgur.com/qMtAT45.png'

    baseSourceList: SourceBase[] = [
        {
            title: 'ReadJoJos (JoJo\'s Bizarre Adventure Part 9: The JoJoLands)',
            url: DOMAIN + '/manga/jojos-bizarre-adventure-part-9-the-jojolands'
        },
        {
            title: 'ReadJoJos (JoJo\'s Bizarre Adventure Part 8: Jojolion Colored)',
            url: DOMAIN + '/manga/jojos-bizarre-adventure-part-8-jojolion-colored'
        },
        {
            title: 'ReadJoJos (Thus Spoke Rohan Kishibe Digital Colored Comics)',
            url: DOMAIN + '/manga/thus-spoke-rohan-kishibe-digital-colored-comics'
        },
        {
            title: 'ReadJoJos (JoJo\'s Bizarre Adventure Part 1: Phantom Blood Colored)',
            url: DOMAIN + '/manga/jojos-bizarre-adventure-part-1-phantom-blood-colored'
        },
        {
            title: 'ReadJoJos (JoJo\'s Bizarre Adventure Light Novel: The Genesis of Universe)',
            url: DOMAIN + '/manga/jojo-no-kimyou-na-bouken'
        },
        {
            title: 'ReadJoJos (Under Execution Under Jailbreak)',
            url: DOMAIN + '/manga/under-execution-under-jailbreak'
        },
        {
            title: 'ReadJoJos (Fujiko\'s Bizarre Worldly Wisdom: Whitesnake\'s Miscalculation)',
            url: DOMAIN + '/manga/fujikos-bizarre-worldly-wisdom-whitesnakes-miscalculation'
        },
        {
            title: 'ReadJoJos (Rohan at the Louvre)',
            url: DOMAIN + '/manga/rohan-at-the-louvre'
        },
        {
            title: 'ReadJoJos (Outlaw Man)',
            url: DOMAIN + '/manga/outlaw-man'
        }
    ]
}