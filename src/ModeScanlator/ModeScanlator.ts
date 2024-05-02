import {
    BadgeColor,
    ContentRating,
    SourceInfo
} from '@paperback/types'

const BASE_URL = 'https://modescanlator.com'
const SOURCE_NAME = 'ModeScanlator'
const VERSION = '0.0.0'
const SOURCE_TAGS= [{text: 'Portuguese (Brazil)', type: BadgeColor.GREY}]

import { 
    BaseSourceInfo, 
    HeanCms, 
    getExportDesciption, 
    getExportVersion
} from '../HeanCms'

export const ModeScanlatorInfo: SourceInfo = {
    ...BaseSourceInfo,
    name: SOURCE_NAME,
    version: getExportVersion(VERSION),
    description: getExportDesciption(BASE_URL),
    websiteBaseURL: BASE_URL,
    contentRating: ContentRating.EVERYONE,
    sourceTags: SOURCE_TAGS
}

export abstract class ModeScanlator extends HeanCms {
    constructor() {
        super(BASE_URL)
        this.useGenres = false
    }
}