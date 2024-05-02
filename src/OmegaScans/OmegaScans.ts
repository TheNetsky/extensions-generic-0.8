import {
    ContentRating,
    SourceInfo
} from '@paperback/types'

const BASE_URL = 'https://omegascans.org'
const SOURCE_NAME = 'OmegaScans'
const VERSION = '0.0.0'

import { 
    BaseSourceInfo, 
    HeanCms, 
    getExportDesciption, 
    getExportVersion
} from '../HeanCms'

export const OmegaScansInfo: SourceInfo = {
    ...BaseSourceInfo,
    name: SOURCE_NAME,
    version: getExportVersion(VERSION),
    description: getExportDesciption(BASE_URL),
    contentRating: ContentRating.ADULT,
    websiteBaseURL: BASE_URL
}

export abstract class OmegaScans extends HeanCms {
    constructor() {
        super(BASE_URL)
    }
}