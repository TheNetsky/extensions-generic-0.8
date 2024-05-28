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
    getImageFunc: Function;
    getIdFunc: Function;
    section: HomeSection;
    enabled: boolean;
    sortIndex: number;
}

export const DefaultHomeSectionData = {
    titleSelectorFunc: ($: CheerioStatic, element: CheerioElement) => $('h2', element).text().trim(),
    getImageFunc:() => undefined,
    getIdFunc:() => undefined,
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
        const id: string = x.id.replace(`${section}:`, '')
        return id
    })
}

export interface SearchData {
    list:   SearchList[];
}

export interface SearchList {
    cover:       string;
    name:        string;
    url:         string;
    description: string;
    genres:      string;
    last:        string;
    update:      string;
}

export class URLBuilder {
    parameters: Record<string, any | any[]> = {}
    pathComponents: string[] = []
    baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/(^\/)?(?=.*)(\/$)?/gim, '')
    }

    addPathComponent(component: string): URLBuilder {
        this.pathComponents.push(component.replace(/(^\/)?(?=.*)(\/$)?/gim, ''))
        return this
    }

    addQueryParameter(key: string, value: any | any[]): URLBuilder {
        if (Array.isArray(value) && !value.length) {
            return this
        }

        const array = (this.parameters[key] as any[])
        if (array?.length) {
            array.push(value)
        } else {
            this.parameters[key] = value
        }
        return this
    }

    buildUrl({ addTrailingSlash, includeUndefinedParameters } = {
        addTrailingSlash: false,
        includeUndefinedParameters: false
    }): string {
        let finalUrl = this.baseUrl + '/'

        finalUrl += this.pathComponents.join('/')
        finalUrl += addTrailingSlash
            ? '/'
            : ''
        finalUrl += Object.values(this.parameters).length > 0
            ? '?'
            : ''
        finalUrl += Object.entries(this.parameters).map(entry => {
            if (entry[1] == null && !includeUndefinedParameters) {
                return undefined
            }

            if (Array.isArray(entry[1]) && entry[1].length) {
                return entry[1].map(value => value || includeUndefinedParameters
                    ? `${entry[0]}=${value}`
                    : undefined)
                    .filter(x => x !== undefined)
                    .join('&')
            }

            if (typeof entry[1] === 'object') {
                return Object.keys(entry[1]).map(key => `${entry[0]}[${key}]=${entry[1][key]}`)
                    .join('&')
            }

            return `${entry[0]}=${entry[1]}`
        }).filter(x => x !== undefined).join('&')

        return finalUrl
    }
}