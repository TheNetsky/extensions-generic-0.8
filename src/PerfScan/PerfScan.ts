import {
    BadgeColor,
    ContentRating,
    SourceInfo
} from '@paperback/types'

const BASE_URL = 'https://perf-scan.fr'
const SOURCE_NAME = 'PerfScan'
const VERSION = '0.0.0'
const SOURCE_TAGS= [{text: 'French', type: BadgeColor.GREY}]

import { 
    BaseSourceInfo, 
    HeanCms, 
    getExportDesciption, 
    getExportVersion
} from '../HeanCms'

export const PerfScanInfo: SourceInfo = {
    ...BaseSourceInfo,
    name: SOURCE_NAME,
    version: getExportVersion(VERSION),
    description: getExportDesciption(BASE_URL),
    websiteBaseURL: BASE_URL,
    contentRating: ContentRating.ADULT,
    sourceTags: SOURCE_TAGS
}

export abstract class PerfScan extends HeanCms {
    constructor() {
        super(BASE_URL)
        this.useGenres = false
    }
}