import {
    Chapter,
    LanguageCode,
    TagSection,
    Tag 
} from 'paperback-extensions-common'

import {
    convertDate
} from '../LanguageUtils'

import { 
    MangaStreamParser
} from '../MangaStreamParser'

export class LuminousScansParser extends MangaStreamParser {
    override parseTags($: CheerioSelector, source: any): TagSection[] {
        const arrayTags: Tag[] = []
        for (const tag of $(source.tags_selector_item, source.tags_selector_box).toArray()) {
            const label = source.tags_selector_label ? $(source.tags_selector_label, tag).text().trim() : $(tag).text().trim()
            const id = label.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/(\/|\s)/g, '-').trim()
            if (!id || !label) continue
            arrayTags.push({ id: id, label: label })
        }
        const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]
        return tagSections
    }
}
