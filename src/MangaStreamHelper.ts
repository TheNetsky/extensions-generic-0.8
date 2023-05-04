import {
    HomeSection,
    HomeSectionType,
    Tag
} from '@paperback/types'

export interface HomeSectionData {
    id: string
    title: string
    containsMoreItems: boolean
    type: string
    selectorFunc: Function
    titleSelectorFunc: Function
    subtitleSelectorFunc: Function
    enabled: boolean
}

export const DefaultHomeSectionData = {
    containsMoreItems: true,
    type: HomeSectionType.singleRowNormal,
    titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('h2', element).text().trim(),
    subtitleSelectorFunc: () => undefined,
    enabled: true
}

export function addHomeSection(sections: any[], homeSectionData: HomeSectionData): void {
    if (homeSectionData.enabled) {
        sections.push({
            selectorFunc: homeSectionData.selectorFunc,
            titleSelectorFunc: homeSectionData.titleSelectorFunc,
            subtitleSelectorFunc: homeSectionData.subtitleSelectorFunc,
            sectionData: createHomeSection(homeSectionData)
        })
    }
}

export function createHomeSection(homeSectionData: HomeSectionData): HomeSection {
    return App.createHomeSection({
        id: homeSectionData.id,
        title: homeSectionData.title,
        type: homeSectionData.type,
        containsMoreItems: homeSectionData.containsMoreItems
    })
}

export function getIncludedTagBySection(section: string, tags: Tag[]): any {
    return (tags?.find((x: Tag) => x.id.startsWith(`${section}:`))?.id.replace(`${section}:`, '') ?? '').replace(' ', '+')
}

export function getFilterTagsBySection(section: string, tags: Tag[], included: boolean, supportsExclusion: boolean = false): string[] {

    if (!included && !supportsExclusion) {
        return []
    }

    return tags?.filter((x: Tag) => x.id.startsWith(`${section}:`)).map((x: Tag) => {
        let id: string = x.id.replace(`${section}:`, '')
        if (!included) {
            id = `-${id}`
        }
        return id
    })
}