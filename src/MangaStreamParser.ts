import {
    Chapter,
    ChapterDetails,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    Tag,
    TagSection,
    HomeSection,
    SearchRequest
} from "paperback-extensions-common";

export interface UpdatedManga {
    ids: string[];
    loadMore: boolean;
}

const entities = require("entities");

export class Parser {

    parseMangaDetails($: CheerioSelector, mangaId: string, source: any): Manga {
        const titles = [];
        titles.push(this.decodeHTMLEntity($("h1.entry-title").text().trim()));

        const altTitles = $(source.mangaAlternativeTitlesSelector).next().text().split(","); //Langauage dependant
        for (const title of altTitles) { titles.push(this.decodeHTMLEntity(title.trim())); }

        const author = $(source.mangaAuthorSelector).next().text().trim(); //Langauage dependant
        const image = this.getImageSrc($("img", "div.thumb"));
        const description = this.decodeHTMLEntity($('div[itemprop="description"]').text().trim());

        const arrayTags: Tag[] = [];
        for (const tag of $("a", "span.mgen").toArray()) {
            const label = $(tag).text().trim();
            const id = encodeURI($(tag).attr("href")?.replace(`${source.baseUrl}/genres/`, "").replace(/\//g, "") ?? "");
            if (!id || !label) continue;
            arrayTags.push({ id: id, label: label });
        }
        const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];

        const rawStatus = $("i", "div.imptdt").text().trim();
        let status = MangaStatus.ONGOING;
        switch (rawStatus.toUpperCase()) {
            case 'ONGOING':
                status = MangaStatus.ONGOING;
                break;
            case 'COMPLETED':
                status = MangaStatus.COMPLETED;
                break;
            default:
                status = MangaStatus.ONGOING;
                break;
        }

        return createManga({
            id: mangaId,
            titles: titles,
            image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
            rating: 0,
            status: status,
            author: author,
            tags: tagSections,
            desc: description,
            //hentai: true
            hentai: false //MangaDex down
        });
    }

    parseChapterList($: CheerioSelector, mangaId: string, source: any): Chapter[] {
        const chapters: Chapter[] = [];

        let langCode = source.languageCode;
        if (mangaId.toUpperCase().endsWith("-RAW") && source.languageCode == "gb") langCode = LanguageCode.KOREAN;

        for (const chapter of $(source.chapterElementSelector, source.chapterBoxSelector).toArray()) {
            const title = $("span.chapternum", chapter).text().trim();
            const id = $("a", chapter).attr('href')?.replace(`${source.baseUrl}/`, "")?.replace(/.$/, "") ?? "";
            const date = new Date($("span.chapterdate", chapter).text().trim());
            const getNumber = chapter.attribs["data-num"]
            const chapterNumber = /(\d*\.?\d+)/.test(getNumber) ? Number(getNumber.match(/(\d*\.?\d+)/)![1]) : 0;

            if (!id) continue;
            chapters.push(createChapter({
                id: id,
                mangaId,
                name: title,
                langCode: langCode,
                chapNum: isNaN(chapterNumber) ? 0 : chapterNumber,
                time: date,
            }));
        }
        return chapters;
    }

    parseChapterDetails(data: any, mangaId: string, chapterId: string): ChapterDetails {
        let pages: string[] = [];

        let obj: any = /ts_reader.run\((.*)\);/.exec(data)?.[1] ?? ""; //Get the data else return null.
        if (obj == "") throw new Error("Unable to parse chapter details!"); //If null, throw error, else parse data to json.
        obj = JSON.parse(obj);

        for (const index of obj.sources) { //Check all sources, if empty continue.
            if (index?.images.length == 0) continue;
            index.images.map((p: string) => pages.push(p));
        }

        const chapterDetails = createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
            longStrip: false
        });

        return chapterDetails;
    }

    parseTags($: CheerioSelector, source: any): TagSection[] {
        const arrayTags: Tag[] = [];
        for (const tag of $(source.tagsElementSelector, source.tagsBoxSelector).toArray()) {
            const label = source.tagsLabelSelector ? $(source.tagsLabelSelector, tag).text().trim() : $(tag).text().trim();
            const id = encodeURI($("a", tag).attr("href")?.replace(`${source.baseUrl}/genres/`, "").replace(/\//g, "") ?? "");
            if (!id || !label) continue;
            arrayTags.push({ id: id, label: label });
        }
        const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];
        return tagSections;
    }

    generateSearch = (query: SearchRequest): string => {
        let search: string = query.title ?? "";
        return encodeURI(search);
    }

    parseSearchResults($: CheerioSelector, source: any): MangaTile[] {
        const mangas: MangaTile[] = [];
        const collectedIds: string[] = [];

        for (const manga of $("div.bs", "div.listupd").toArray()) {
            const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
            const title = $("a", manga).attr('title');
            const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
            const subtitle = $("div.epxs", manga).text().trim();
            if (collectedIds.includes(id) || !id || !title) continue;
            mangas.push(createMangaTile({
                id,
                image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                title: createIconText({ text: this.decodeHTMLEntity(title) }),
                subtitleText: createIconText({ text: subtitle }),
            }));
            collectedIds.push(id);
        }
        return mangas;
    }

    parseUpdatedManga($: CheerioSelector, time: Date, ids: string[], source: any): UpdatedManga {
        const updatedManga: string[] = [];
        let loadMore = true;

        for (const manga of $(source.updateElementSelector, $(source.updateBoxSelector).parent().next()).toArray()) {
            const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
            const mangaDate = this.parseDate($("li > span", "div.luf").first().text().trim());

            if (mangaDate > time) {
                if (ids.includes(id)) {
                    updatedManga.push(id);
                }
            } else {
                loadMore = false;
            }
        }
        return {
            ids: updatedManga,
            loadMore,
        }
    }

    parseHomeSections($: CheerioStatic, sections: HomeSection[], sectionCallback: (section: HomeSection) => void, source: any) {
        for (const section of sections) {
            //Popular Today
            if (section.id == "popular_today") {
                const popularToday: MangaTile[] = [];
                for (const manga of $("div.bsx", $(source.homescreenPopularTodaySelector).parent().next()).toArray()) {
                    const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
                    const title = $("a", manga).attr('title');
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    popularToday.push(createMangaTile({
                        id: id,
                        image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = popularToday;
                sectionCallback(section);
            }

            //Latest Update
            if (section.id == "latest_update") {
                const latestUpdate: MangaTile[] = [];
                for (const manga of $(source.homescreenLatestUpdateElementSelector, $(source.homescreenLatestUpdateBoxSelector).parent().next()).toArray()) {
                    const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
                    const title = $("a", manga).attr('title');
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    latestUpdate.push(createMangaTile({
                        id: id,
                        image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = latestUpdate;
                sectionCallback(section);
            }

            //New Titles
            if (section.id == "new_titles") {
                const NewTitles: MangaTile[] = [];
                for (const manga of $("li", $(source.homescreenNewMangaSelector).parent().next()).toArray()) {
                    const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    NewTitles.push(createMangaTile({
                        id: id,
                        image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = NewTitles;
                sectionCallback(section);
            }

            //Top All Time
            if (section.id == "top_alltime") {
                const TopAllTime: MangaTile[] = [];
                for (const manga of $("li", source.homescreenTopAllTimeSelector).toArray()) {
                    const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    TopAllTime.push(createMangaTile({
                        id: id,
                        image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = TopAllTime;
                sectionCallback(section);
            }


            //Top Monthly
            if (section.id == "top_monthly") {
                const TopMonthly: MangaTile[] = [];
                for (const manga of $("li", source.homescreenTopMonthlySelector).toArray()) {
                    const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    TopMonthly.push(createMangaTile({
                        id: id,
                        image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = TopMonthly;
                sectionCallback(section);
            }
        }
    }

    parseViewMore = ($: CheerioStatic, source: any): MangaTile[] => {
        const mangas: MangaTile[] = [];
        const collectedIds: string[] = [];

        for (const manga of $("div.bs", "div.listupd").toArray()) {
            const id = $("a", manga).attr('href')?.replace(`${source.baseUrl}/${source.sourceTraversalPathName}/`, "")?.replace(/.$/, "") ?? "";
            const title = $("a", manga).attr('title');
            const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
            const subtitle = $("div.epxs", manga).text().trim();
            if (collectedIds.includes(id) || !id || !title) continue;
            mangas.push(createMangaTile({
                id,
                image: image == "" ? "https://i.imgur.com/GYUxEX8.png" : image,
                title: createIconText({ text: this.decodeHTMLEntity(title) }),
                subtitleText: createIconText({ text: subtitle }),
            }));
            collectedIds.push(id);
        }
        return mangas;
    }

    isLastPage = ($: CheerioStatic, id: String): boolean => {
        let isLast = true;
        if (id == "view_more") {
            let hasNext = Boolean($("a.r")[0]);
            if (hasNext) isLast = false;
        }

        if (id == "search_request") {
            let hasNext = Boolean($("a.next.page-numbers")[0]);
            if (hasNext) isLast = false;
        }
        return isLast;
    }

    protected getImageSrc(imageObj: Cheerio | undefined): string {
        let image;
        if (typeof imageObj?.attr('data-src') != 'undefined') {
            image = imageObj?.attr('data-src');
        }
        else if (typeof imageObj?.attr('data-lazy-src') != 'undefined') {
            image = imageObj?.attr('data-lazy-src')
        }
        else if (typeof imageObj?.attr('srcset') != 'undefined') {
            image = imageObj?.attr('srcset')?.split(' ')[0] ?? '';
        }
        else {
            image = imageObj?.attr('src');
        }
        return encodeURI(decodeURI(this.decodeHTMLEntity(image?.trim() ?? '')));
    }

    protected parseDate = (date: string): Date => {
        date = date.toUpperCase();
        let time: Date;
        let number: number = Number((/\d*/.exec(date) ?? [])[0]);
        if (date.includes("LESS THAN AN HOUR") || date.includes("JUST NOW")) {
            time = new Date(Date.now());
        } else if (date.includes("YEAR") || date.includes("YEARS")) {
            time = new Date(Date.now() - (number * 31556952000));
        } else if (date.includes("MONTH") || date.includes("MONTHS")) {
            time = new Date(Date.now() - (number * 2592000000));
        } else if (date.includes("WEEK") || date.includes("WEEKS")) {
            time = new Date(Date.now() - (number * 604800000));
        } else if (date.includes("YESTERDAY")) {
            time = new Date(Date.now() - 86400000);
        } else if (date.includes("DAY") || date.includes("DAYS")) {
            time = new Date(Date.now() - (number * 86400000));
        } else if (date.includes("HOUR") || date.includes("HOURS")) {
            time = new Date(Date.now() - (number * 3600000));
        } else if (date.includes("MINUTE") || date.includes("MINUTES")) {
            time = new Date(Date.now() - (number * 60000));
        } else if (date.includes("SECOND") || date.includes("SECONDS")) {
            time = new Date(Date.now() - (number * 1000));
        } else {
            time = new Date(date);
        }
        return time;
    }

    protected decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str);
    }
}
