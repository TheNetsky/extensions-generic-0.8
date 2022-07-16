import {
    TagSection,
    Tag
} from 'paperback-extensions-common'
import {
    MangaStreamParser
} from '../MangaStreamParser'

export class SushiScanParser extends MangaStreamParser {
    parseTags($: CheerioSelector, source: any): TagSection[] {
        const arrayTags: Tag[] = []
        for (const tag of $('li', $('.dropdown-menu.c4.genrez')).toArray()) {
            const label = $('label', tag).text().trim()
            const id = $('label', tag).text().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-').trim()
            if (!id || !label) continue
            arrayTags.push({ id: id, label: label })
        }
        const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]
        return tagSections
    }
}