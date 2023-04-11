/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */

import {
    BadgeColor,
    ContentRating,
    PagedResults,
    PartialSourceManga,
    SearchRequest,
    SourceInfo,
    SourceIntents,
    Tag,
    TagSection,
} from '@paperback/types'

import { decodeHTML } from 'entities'

import {
    MangaBox,
    getExportVersion,
} from '../MangaBox'

import { URLBuilder } from '../MangaBoxHelpers'

import {
    isLastPage,
    parseManga,
} from '../MangaBoxParser'

const SITE_DOMAIN = 'https://mangakakalot.com'

export const MangakakalotInfo: SourceInfo = {
    version: getExportVersion('0.0.0'),
    name: 'Mangakakalot',
    icon: 'icon.png',
    author: 'Batmeow',
    authorWebsite: 'https://github.com/Batmeow',
    description: `Extension that pulls manga from ${SITE_DOMAIN}.`,
    contentRating: ContentRating.MATURE,
    websiteBaseURL: SITE_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: BadgeColor.GREEN
        }
    ],
    intents: SourceIntents.SETTINGS_UI | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.MANGA_CHAPTERS
}

export class Mangakakalot extends MangaBox {
    // Website base URL.
    baseURL = SITE_DOMAIN

    // Language code supported by the source.
    languageCode = '🇬🇧'

    // Path for manga list.
    mangaListPath = 'manga_list'

    // Selector for manga in manga list.
    mangaListSelector = 'div.truyen-list div.list-truyen-item-wrap'

    // Selector for subtitle in manga list.
    mangaSubtitleSelector = 'a.list-story-item-wrap-chapter'

    override async supportsTagExclusion(): Promise<boolean> {
        return false
    }

    override async getViewMoreItems(homePageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1

        const request = App.createRequest({
            url: new URLBuilder(this.baseURL)
                .addPathComponent(this.mangaListPath)
                .addQueryParameter('type', homePageSectionId)
                .addQueryParameter('page', page)
                .buildUrl(),
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)
        const results = parseManga($, this)

        metadata = !isLastPage($) ? { page: page + 1 } : undefined
        return App.createPagedResults({
            results: results,
            metadata: metadata
        })
    }

    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let results: PartialSourceManga[] = []

        if (query.includedTags && query.includedTags?.length != 0) {
            const request = App.createRequest({
                url: new URLBuilder(this.baseURL)
                    .addPathComponent('manga_list')
                    .addQueryParameter('category', query.includedTags[0]?.id)
                    .addQueryParameter('page', page)
                    .buildUrl(),
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data as string)

            results = parseManga($, this)
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
        } else {
            const request = App.createRequest({
                url: new URLBuilder(this.baseURL)
                    .addPathComponent('search')
                    .addPathComponent('story')
                    .addPathComponent(query.title?.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ +/g, '_').toLowerCase() ?? '')
                    .addQueryParameter('page', page)
                    .buildUrl(),
                method: 'GET'
            })

            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data as string)

            const collecedIds: string[] = []

            for (const manga of $('div.panel_story_list div.story_item').toArray()) {
                const mangaId = $('a', manga).first().attr('href')
                const image = $('img', manga).first().attr('src') ?? ''
                const title = decodeHTML($('h3.story_name a', manga).first().text().trim() ?? '')
                const subtitle = decodeHTML($('h3.story_name + em.story_chapter a', manga).text().trim() ?? '')

                if (!mangaId || !title || collecedIds.includes(mangaId)) continue
                results.push(App.createPartialSourceManga({
                    mangaId: mangaId,
                    image: image,
                    title: title,
                    subtitle: subtitle ? subtitle : 'No Chapters'
                }))
                collecedIds.push(mangaId)
            }
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
        }

        return App.createPagedResults({
            results: results,
            metadata: metadata
        })
    }
    /* eslint-enable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */

    parseTagId(url: string): string | undefined {
        return url.split('category=').pop()?.split('&')[0]?.replace(/[^0-9]/g, '')
    }

    override async getSearchTags(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: this.baseURL,
            method: 'GET'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data as string)

        const tags: Tag[] = []

        for (const tag of $('div.panel-category tbody a').toArray()) {
            const id = this.parseTagId($(tag).attr('href') ?? '')
            const label = $(tag).text().trim()
            if (!id || !label) continue
            tags.push({ id: id, label: label })
        }

        const TagSection: TagSection[] = [
            App.createTagSection({
                id: '0',
                label: 'genres',
                tags: tags.map(t => App.createTag(t)),
            }),
        ]
        return TagSection
    }
}
