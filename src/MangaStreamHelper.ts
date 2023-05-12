/* eslint-disable @typescript-eslint/ban-types */
import {
    HomeSection,
    HomeSectionType,
    Tag
} from '@paperback/types'

export interface HomeSectionData {
    selectorFunc: Function;
    titleSelectorFunc: Function;
    subtitleSelectorFunc: Function;
    getViewMoreItemsFunc: Function;
    section: HomeSection;
    enabled: boolean;
    sortIndex: number;
}

export const DefaultHomeSectionData = {
    titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('h2', element).text().trim(),
    subtitleSelectorFunc: () => undefined,
    getViewMoreItemsFunc: () => undefined,
    enabled: true
}

export function createHomeSection(id: string, title: string, containsMoreItems = true, type: string = HomeSectionType.singleRowNormal): HomeSection {
    return App.createHomeSection({
        id,
        title,
        type,
        containsMoreItems
    })
}

export function getIncludedTagBySection(section: string, tags: Tag[]): any {
    return (tags?.find((x: Tag) => x.id.startsWith(`${section}:`))?.id.replace(`${section}:`, '') ?? '').replace(' ', '+')
}

export function getFilterTagsBySection(section: string, tags: Tag[], included: boolean, supportsExclusion = false): string[] {
    if (!included && !supportsExclusion) {
        return []
    }

    return tags?.filter((x: Tag) => x.id.startsWith(`${section}:`)).map((x: Tag) => {
        let id: string = x.id.replace(`${section}:`, '')
        if (!included) {
            id = encodeURI(`-${id}`)
        }
        return id
    })
}