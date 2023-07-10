/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    SourceManga,
    PartialSourceManga,
    SearchField,
    SearchRequest,
    TagSection
} from '@paperback/types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const entities = require('entities')
let NEPNEP_IMAGE_DOMAIN = 'https://cover.mangabeast01.com/cover'
export type RegexIdMatch = {
    [id: string]: RegExp;
};
export const regex: RegexIdMatch = {
    'top_ten': /vm\.TopTenJSON = (.*);/,
    'hot_update': /vm\.HotUpdateJSON = (.*);/,
    'latest': /vm\.LatestJSON = (.*);/,
    'recommended': /vm\.RecommendationJSON = (.*);/,
    'new_titles': /vm\.NewSeriesJSON = (.*);/,
    'chapters': /vm\.Chapters = (.*);/,
    'directory': /MainFunction\(\$http\).*vm\.Directory = (.*)vm\.GetIntValue/,
    'directory_image_host': /<img ng-src="(.*)\//
}

export class NepNepParser {
    parseMangaDetails($: any, mangaId: string): SourceManga {
        const json = $('[type=application\\/ld\\+json]').html()?.replace(/\n*/g, '') ?? ''
        // This is only because they added some really jank alternate titles and didn't properly string escape
        const jsonWithoutAlternateName = json.replace(/"alternateName".*?],/g, '')
        const alternateNames = /"alternateName": \[(.*?)]/.exec(json)?.[1]
            ?.replace(/"/g, '')
            .split(',')
        const parsedJson = JSON.parse(jsonWithoutAlternateName)
        const entity = parsedJson.mainEntity
        const info = $('.row')
        const imgSource = $('.ImgHolder').html()?.match(/src="(.*)\//)?.[1] ?? NEPNEP_IMAGE_DOMAIN
        if (imgSource !== NEPNEP_IMAGE_DOMAIN)
            NEPNEP_IMAGE_DOMAIN = imgSource
        const image = `${NEPNEP_IMAGE_DOMAIN}/${mangaId}.jpg`
        const title = this.decodeHTMLEntity($('h1', info).first().text() ?? '')
        let titles = [title]
        const author = this.decodeHTMLEntity(entity.author[0])
        titles = titles.concat(alternateNames ?? '')
        const tagSections: TagSection[] = [App.createTagSection({
            id: '0',
            label: 'Genres',
            tags: []
        }), App.createTagSection({id: '1', label: 'Format', tags: []})]
        tagSections[0]!.tags = entity.genre.map((elem: string) => App.createTag({id: elem.toLowerCase(), label: elem}))
        let desc = ''
        const hentai = entity.genre.includes('Hentai') || entity.genre.includes('Adult')
        const details = $('.list-group', info)
        for (const row of $('li', details).toArray()) {
            const text = $('.mlabel', row).text()
            switch (text) {
                case 'Type:': {
                    const type = $('a', row).text()
                    tagSections[1]!.tags.push(App.createTag({id: 'type_' + type.trim().toLowerCase(), label: type.trim()}))
                    break
                }
                case 'Description:': {
                    desc = this.decodeHTMLEntity($('div', row).text().trim())
                    break
                }
            }
        }
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles,
                image,
                rating: 0,
                status,
                author,
                tags: tagSections,
                desc,
                hentai
            })
        })
    }

    parseChapters($: any, mangaId: string): Chapter[] {
        const chapterJS: any[] = JSON.parse($.root().html()?.match(regex['chapters'])?.[1] ?? '').reverse()
        const chapters: Chapter[] = []
        // Following the url encoding that the website uses, same variables too
        for (const elem of chapterJS) {
            const chapterCode: string = elem.Chapter
            const volume = Number(chapterCode.substring(0, 1))
            const index = volume != 1 ? '-index-' + volume : ''
            const n = parseInt(chapterCode.slice(1, -1))
            const a = Number(chapterCode[chapterCode.length - 1])
            const m = a != 0 ? '.' + a : ''
            const id = mangaId + '-chapter-' + n + m + index + '.html'
            const chapNum = n + a * 0.1
            const name = elem.ChapterName ? elem.ChapterName : '' // can be null
            const timeStr = elem.Date.replace(/-/g, '/')
            const time = new Date(timeStr)
            chapters.push(App.createChapter({
                id,
                name,
                chapNum,
                volume,
                langCode: '🇬🇧',
                time
            }))
        }
        return chapters
    }

    parseChapterDetails(data: any, mangaId: string, chapterId: string): ChapterDetails {
        const pages: string[] = []
        const variableName = data.match(/ng-src="https:\/\/{{([a-zA-Z0-9.]+)}}\/manga\/.+\.png/)?.[1]
        const matchedPath = data.match(new RegExp(`${variableName} = "(.*)";`))?.[1]
        const chapterInfo = JSON.parse(data.match(/vm.CurChapter = (.*);/)?.[1])
        const pageNum = Number(chapterInfo.Page)
        const chapter = chapterInfo.Chapter.slice(1, -1)
        const odd = chapterInfo.Chapter[chapterInfo.Chapter.length - 1]
        const chapterImage = odd == 0 ? chapter : chapter + '.' + odd
        for (let i = 0; i < pageNum; i++) {
            const s = '000' + (i + 1)
            const page = s.substr(s.length - 3)
            pages.push(`https://${matchedPath}/manga/${mangaId}/${chapterInfo.Directory == '' ? '' : chapterInfo.Directory + '/'}${chapterImage}-${page}.png`)
        }
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages
        })
    }

    searchMetadata(query: SearchRequest): {
        [key: string]: any;
    } {
        const author = query.parameters?.['author']?.[0]
        const year = query.parameters?.['year']?.[0]
        const type = query.includedTags
            ?.filter(type => type.id.includes('type_'))
            .map(type => type.id.replace('type_', ''))
        const scanStatus = query.includedTags
            ?.filter(type => type.id.includes('scan_status_'))
            .map(type => type.id.replace('scan_status_', ''))
        const publishStatus = query.includedTags
            ?.filter(type => type.id.includes('publish_status_'))
            .map(type => type.id.replace('publish_status_', ''))
        const translation = query.includedTags
            ?.filter(type => type.id.includes('translation_'))
            .map(type => type.id.replace('translation_', ''))
        const includedGenres = query.includedTags
            ?.filter(tag => tag.id.includes('genre_'))
            .map(genre => genre.id.replace('genre_', ''))
        const excludedGenres = query.excludedTags
            ?.filter(tag => tag.id.includes('genre_'))
            .map(genre => genre.id.replace('genre_', ''))
        return {
            'keyword': query.title?.toLowerCase(),
            'author': author?.toLowerCase() ?? '',
            'year': year?.toLowerCase() ?? '',
            'scanStatus': scanStatus,
            'publishStatus': publishStatus,
            'translation': translation,
            'type': type,
            'genre': includedGenres,
            'genreNo': excludedGenres
        }
    }

    getDirectory(data: any): any {
        return JSON.parse(data?.replace(/(\r\n|\n|\r)/gm, '')
            .match(regex['directory'])?.[1].trim().replace(/;$/, '') ?? '')
    }

    parseSearch(data: any, metadata: any): PartialSourceManga[] {
        const manga: PartialSourceManga[] = []
        const directory: any[] = this.getDirectory(data)
        const imgSource = data.match(regex['directory_image_host'])?.[1] ?? NEPNEP_IMAGE_DOMAIN
        if (imgSource !== NEPNEP_IMAGE_DOMAIN)
            NEPNEP_IMAGE_DOMAIN = imgSource
        for (const elem of directory) {
            let mKeyword: boolean = typeof metadata.keyword === 'undefined'
            let mAuthor: boolean = metadata.author === ''
            let mYear: boolean = metadata.year === ''
            let mScanStatus: boolean = !(typeof metadata.scanStatus !== 'undefined' && metadata.scanStatus.length > 0)
            let mPublishStatus: boolean = !(typeof metadata.publishStatus !== 'undefined' && metadata.publishStatus.length > 0)
            let mTranslation: boolean = !(typeof metadata.translation !== 'undefined' && metadata.translation.length > 0)
            let mType: boolean = !(typeof metadata.type !== 'undefined' && metadata.type.length > 0)
            let mGenre: boolean = !(typeof metadata.genre !== 'undefined' && metadata.genre.length > 0)
            let mGenreNo: boolean = typeof metadata.genreNo !== 'undefined' && metadata.genreNo.length > 0
            if (!mKeyword) {
                const allWords: string = [...(elem.al ?? []), elem.s ?? ''].join('||').toLowerCase()
                mKeyword = allWords.includes(metadata.keyword)
            }
            if (!mAuthor) {
                const flatA: string = elem.a?.join('||').toLowerCase() ?? ''
                mAuthor = (flatA.includes(metadata.author))
            }
            if (!mYear) {
                if (metadata.year.includes('-')) {
                    const startYear = parseInt(metadata.year?.split('-')?.[0]) || 0
                    const endYear = parseInt(metadata.year?.split('-')?.[1]) || (new Date).getFullYear()
                    mYear = parseInt(elem.y) >= startYear && parseInt(elem.y) <= endYear
                } else {
                    mYear = metadata.year == elem.y
                }
            }
            if (!mType)
                mType = metadata.type.every((i: string) => elem.t?.toLowerCase()?.includes(i))
            if (!mScanStatus)
                mScanStatus = metadata.scanStatus.every((i: string) => elem.ss?.toLowerCase()?.includes(i))
            if (!mPublishStatus)
                mPublishStatus = metadata.publishStatus.every((i: string) => elem.ps?.toLowerCase()?.includes(i))
            if (!mTranslation)
                mTranslation = metadata.translation.every((i: string) => elem.o?.toLowerCase()?.includes(i))
            if (!mGenre)
                mGenre = metadata.genre.every((i: string) => elem.g?.map((genre: string) => genre.toLowerCase())?.includes(i))
            if (mGenreNo)
                mGenreNo = metadata.genreNo.every((i: string) => elem.g?.map((genre: string) => genre.toLowerCase())?.includes(i))
            let time = (new Date(elem.ls)).toDateString()
            time = time.slice(0, time.length - 5)
            time = time.slice(4, time.length)
            if (mKeyword && mAuthor && mYear && mType && mScanStatus && mPublishStatus && mTranslation && mGenre && !mGenreNo) {
                manga.push(App.createPartialSourceManga({
                    title: elem.s,
                    image: `${NEPNEP_IMAGE_DOMAIN}/${elem.i}.jpg`,
                    mangaId: elem.i,
                    subtitle: undefined
                }))
            }
        }
        return manga
    }

    parseSearchTags(data: any): TagSection[] {
        const tagSections: TagSection[] = [
            App.createTagSection({id: 'genres', label: 'Genres', tags: []}),
            App.createTagSection({id: 'format', label: 'Format', tags: []}),
            App.createTagSection({id: 'scan_status', label: 'Scan Status', tags: []}),
            App.createTagSection({id: 'publish_status', label: 'Publish Status', tags: []}),
            App.createTagSection({id: 'translation', label: 'Translation', tags: []})
        ]
        const genres = JSON.parse(data.match(/"Genre"\s*: (.*)/)?.[1].replace(/'/g, '"'))
        tagSections[0]!.tags = genres.map((tag: any) => App.createTag({id: `genre_${tag.toLowerCase()}`, label: tag}))
        const typesHTML = data.match(/"Type"\s*: (.*),/g)?.[1]
        const types = JSON.parse(typesHTML.match(/(\[.*])/)?.[1].replace(/'/g, '"'))
        tagSections[1]!.tags = types.map((tag: any) => App.createTag({id: `type_${tag.toLowerCase()}`, label: tag}))
        const scanStatusHTML = data.match(/"ScanStatus"\s*: (.*),/g)?.[1]
        const scanStatus = JSON.parse(scanStatusHTML.match(/(\[.*])/)?.[1].replace(/'/g, '"'))
        tagSections[2]!.tags = scanStatus.map((tag: any) => App.createTag({
            id: `scan_status_${tag.toLowerCase()}`,
            label: tag
        }))
        const publishStatusHTML = data.match(/"PublishStatus"\s*: (.*),/g)?.[1]
        const publishStatus = JSON.parse(publishStatusHTML.match(/(\[.*])/)?.[1].replace(/'/g, '"'))
        tagSections[3]!.tags = publishStatus.map((tag: any) => App.createTag({
            id: `publish_status_${tag.toLowerCase()}`,
            label: tag
        }))
        tagSections[4]!.tags = [
            App.createTag({id: 'translation_yes', label: 'Official'}),
            App.createTag({id: 'translation_no', label: 'Non-Official'})
        ]
        return tagSections
    }

    parseSearchFields(): SearchField[] {
        const searchFields: SearchField[] = [
            App.createSearchField({id: 'author', name: 'Author', placeholder: 'Miyazaki'}),
            App.createSearchField({id: 'year', name: 'Year', placeholder: '2000-2010'})
        ]
        return searchFields
    }

    parseHomeSections($: any, data: any, sectionCallback: (section: HomeSection) => void): void {
        const topTenSection = App.createHomeSection({
            id: 'top_ten',
            title: 'Top Ten',
            containsMoreItems: false,
            type: HomeSectionType.featured
        })
        const hotSection = App.createHomeSection({
            id: 'hot_update',
            title: 'Hot Updates',
            containsMoreItems: true,
            type: 'singleRowNormal'
        })
        const latestSection = App.createHomeSection({
            id: 'latest',
            title: 'Latest Updates',
            containsMoreItems: true,
            type: 'singleRowNormal'
        })
        const newTitlesSection = App.createHomeSection({
            id: 'new_titles',
            title: 'New Titles',
            containsMoreItems: true,
            type: 'singleRowNormal'
        })
        const recommendedSection = App.createHomeSection({
            id: 'recommended',
            title: 'Recommendations',
            containsMoreItems: true,
            type: 'singleRowNormal'
        })
        const topTen = JSON.parse((data.match(regex[topTenSection.id])?.[1])).slice(0, 15)
        const hot = JSON.parse((data.match(regex[hotSection.id])?.[1])).slice(0, 15)
        const latest = JSON.parse((data.match(regex[latestSection.id])?.[1])).slice(0, 15)
        const newTitles = JSON.parse((data.match(regex[newTitlesSection.id]))?.[1]).slice(0, 15)
        const recommended = JSON.parse((data.match(regex[recommendedSection.id])?.[1])).slice(0, 15)
        const sections = [topTenSection, hotSection, latestSection, newTitlesSection, recommendedSection]
        const sectionData = [topTen, hot, latest, newTitles, recommended]
        const imgSource = $('.ImageHolder').html()?.match(/ng-src="(.*)\//)?.[1] ?? NEPNEP_IMAGE_DOMAIN
        if (imgSource !== NEPNEP_IMAGE_DOMAIN)
            NEPNEP_IMAGE_DOMAIN = imgSource
        for (const [i, section] of sections.entries()) {
            sectionCallback(section)
            const manga: PartialSourceManga[] = []
            for (const elem of sectionData[i]) {
                const id = elem.IndexName
                const title = elem.SeriesName
                const image = `${NEPNEP_IMAGE_DOMAIN}/${id}.jpg`
                let time = (new Date(elem.Date ?? 0)).toDateString()
                time = time.slice(0, time.length - 5)
                time = time.slice(4, time.length)
                manga.push(App.createPartialSourceManga({
                    image,
                    title: title,
                    mangaId: id,
                    subtitle: undefined
                }))
            }
            section.items = manga
            sectionCallback(section)
        }
    }

    parseViewMore(data: any, homepageSectionId: string): PartialSourceManga[] {
        const manga: PartialSourceManga[] = []
        const mangaIds: Set<string> = new Set<string>()
        if (!regex[homepageSectionId])
            App.createPagedResults({results: []})
        const items = JSON.parse((data.match(regex[homepageSectionId]))?.[1])
        for (const item of items) {
            const id = item.IndexName
            if (!mangaIds.has(id)) {
                const title = item.SeriesName
                const image = `${NEPNEP_IMAGE_DOMAIN}/${id}.jpg`
                let time = (new Date(item.Date)).toDateString()
                time = time.slice(0, time.length - 5)
                time = time.slice(4, time.length)
                manga.push(App.createPartialSourceManga({
                    image,
                    title: title,
                    mangaId: id,
                    subtitle: undefined
                }))
                mangaIds.add(id)
            }
        }
        return manga
    }

    decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str)
    }
}
