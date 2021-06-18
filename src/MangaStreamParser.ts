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

import { convertDateAgo, convertDate } from "./LanguageUtils"

const entities = require("entities");

export interface UpdatedManga {
    ids: string[];
    loadMore: boolean;
}

export class Parser {

    parseMangaDetails($: CheerioSelector, mangaId: string, source: any): Manga {
        const titles = [];
        titles.push(this.decodeHTMLEntity($("h1.entry-title").text().trim()));

        const altTitles = $(`span:contains(${source.manga_selector_AlternativeTitles}), b:contains(${source.manga_selector_AlternativeTitles})+span, .imptdt:contains(${source.manga_selector_AlternativeTitles}) i`).contents().remove().last().text().split(","); //Language dependant
        for (const title of altTitles) {
            if (title == "") continue;
            titles.push(this.decodeHTMLEntity(title.trim()));
        }

        const author = $(`span:contains(${source.manga_selector_author}), .fmed b:contains(${source.manga_selector_author})+span, .imptdt:contains(${source.manga_selector_author}) i`).contents().remove().last().text().trim(); //Language dependant
        const artist = $(`span:contains(${source.manga_selector_artist}), .fmed b:contains(${source.manga_selector_artist})+span, .imptdt:contains(${source.manga_selector_artist}) i`).contents().remove().last().text().trim(); //Language dependant
        const image = this.getImageSrc($("img", 'div[itemprop="image"]'));
        const description = this.decodeHTMLEntity($('div[itemprop="description"]').text().trim());

        const arrayTags: Tag[] = [];
        for (const tag of $("a", source.manga_tag_selector_box).toArray()) {
            const label = $(tag).text().trim();
            const id = encodeURI($(tag).attr("href")?.replace(`${source.baseUrl}/${source.manga_tag_TraversalPathName}/`, "").replace(/\//g, "") ?? "");
            if (!id || !label) continue;
            arrayTags.push({ id: id, label: label });
        }
        const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })];

        const rawStatus = $(`span:contains(${source.manga_selector_status}), .fmed b:contains(${source.manga_selector_status})+span, .imptdt:contains(${source.manga_selector_status}) i`).contents().remove().last().text().trim();
        let status = MangaStatus.ONGOING;
        switch (rawStatus.toLowerCase()) {
            case source.manga_StatusTypes.ONGOING.toLowerCase():
                status = MangaStatus.ONGOING;
                break;
            case source.manga_StatusTypes.COMPLETED.toLowerCase():
                status = MangaStatus.COMPLETED;
                break;
            default:
                status = MangaStatus.ONGOING;
                break;
        }
        return createManga({
            id: mangaId,
            titles: titles,
            image: image ? image : source.fallbackImage,
            rating: 0,
            status: status,
            author: author == "" ? "Unknown" : author,
            artist: artist == "" ? "Unknown" : artist,
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
        for (const chapter of $(source.chapter_selector_item, source.chapter_selector_box).toArray()) {
            const title = $("span.chapternum", chapter).text().trim();
            const id = this.idCleaner($("a", chapter).attr('href') ?? "", source);
            const date = convertDate($("span.chapterdate", chapter).text().trim(), source);
            const getNumber = chapter.attribs["data-num"];
            const chapterNumberRegex = getNumber.match(/(\d+\.?\d?)/);
            let chapterNumber: number = 0;
            if (chapterNumberRegex && chapterNumberRegex[1]) chapterNumber = Number(chapterNumberRegex[1]);

            if (!id) continue;
            chapters.push(createChapter({
                id: id,
                mangaId,
                name: title,
                langCode: langCode,
                chapNum: chapterNumber,
                time: date,
            }));
        }
        return chapters;
    }

    parseChapterDetails(data: any, mangaId: string, chapterId: string): ChapterDetails {
        let pages: string[] = [];

        let obj: any = /ts_reader.run\((.*)\);/.exec(data)?.[1] ?? ""; //Get the data else return null.
        if (obj == "") throw new Error(`Failed to find page details script for manga ${mangaId}`); //If null, throw error, else parse data to json.
        obj = JSON.parse(obj);

        if (!obj?.sources) throw new Error(`Failed for find sources property for manga ${mangaId}`);
        for (const index of obj.sources) { //Check all sources, if empty continue.
            if (index?.images.length == 0) continue;
            index.images.map((p: string) => pages.push(encodeURI(p)));
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
        for (const tag of $(source.tags_selector_item, source.tags_selector_box).toArray()) {
            const label = source.tags_selector_label ? $(source.tags_selector_label, tag).text().trim() : $(tag).text().trim();
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
            const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
            const title = $("a", manga).attr('title');
            const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
            const subtitle = $("div.epxs", manga).text().trim();
            if (collectedIds.includes(id) || !id || !title) continue;
            mangas.push(createMangaTile({
                id,
                image: image ? image : source.fallbackImage,
                title: createIconText({ text: this.decodeHTMLEntity(title) }),
                subtitleText: createIconText({ text: subtitle }),
            }));
            collectedIds.push(id);
        }
        return mangas;
    }

    parseUpdatedManga($: CheerioStatic, time: Date, ids: string[], source: any): UpdatedManga {
        const updatedManga: string[] = [];
        let loadMore = true;
        const isLast = this.isLastPage($, "view_more"); //Check if it's the last page or not, needed for some sites!
        if (!$(source.homescreen_LatestUpdate_selector_item, $(source.homescreen_LatestUpdate_selector_box)?.parent()?.next()).length) throw new Error("Unable to parse valid update sectiond!");
        for (const manga of $(source.homescreen_LatestUpdate_selector_item, $(source.homescreen_LatestUpdate_selector_box).parent().next()).toArray()) {
            const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
            const mangaDate = convertDateAgo($("li > span", $("div.luf", manga)).first().text().trim(), source);
            //Check if manga time is older than the time porvided, is this manga has an update. Return this.
            if (!id) continue;
            if (mangaDate > time) {
                if (ids.includes(id)) {
                    updatedManga.push(id);
                }
                // If there is an id but no mangadate, this means the site forgot to list the chapters on the front page. However this doesn't mean our search is over! (rare)
            } else if (id && mangaDate == null) {
                loadMore = true;
                // If the latest mangaDate isn't older than our current time, we're done!
            } else {
                loadMore = false;
            }
            //If the site does not have any more pages, we're done!
            if (isLast) loadMore = false;
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
                if (!$("div.bsx", $(source.homescreen_PopularToday_selector)?.parent()?.next()).length) throw new Error("Unable to parse valid Popular Today section!");
                for (const manga of $("div.bsx", $(source.homescreen_PopularToday_selector).parent().next()).toArray()) {
                    const id = this.idCleaner($("a", manga).attr('href') ?? "", source); const title = $("a", manga).attr('title');
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    const subtitle = $("div.epxs", manga).text().trim();
                    if (!id || !title) continue;
                    popularToday.push(createMangaTile({
                        id: id,
                        image: image ? image : source.fallbackImage,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                        subtitleText: createIconText({ text: subtitle }),
                    }));
                }
                section.items = popularToday;
                sectionCallback(section);
            }

            //Latest Update
            if (section.id == "latest_update") {
                const latestUpdate: MangaTile[] = [];
                if (!$(source.homescreen_LatestUpdate_selector_item, $(source.homescreen_LatestUpdate_selector_box)?.parent()?.next()).length) throw new Error("Unable to parse valid Latest Update section!");
                for (const manga of $(source.homescreen_LatestUpdate_selector_item, $(source.homescreen_LatestUpdate_selector_box).parent().next()).toArray()) {
                    const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
                    const title = $("a", manga).attr('title');
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    const subtitle = $("li > span", $("div.luf", manga)).first().text().trim()
                    if (!id || !title) continue;
                    latestUpdate.push(createMangaTile({
                        id: id,
                        image: image ? image : source.fallbackImage,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                        subtitleText: createIconText({ text: subtitle }),
                    }));
                }
                section.items = latestUpdate;
                sectionCallback(section);
            }

            //New Titles
            if (section.id == "new_titles") {
                const NewTitles: MangaTile[] = [];
                if (!$("li", $(source.homescreen_NewManga_selector)?.parent()?.next()).length) throw new Error("Unable to parse valid New Titles section!");
                for (const manga of $("li", $(source.homescreen_NewManga_selector).parent().next()).toArray()) {
                    const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    NewTitles.push(createMangaTile({
                        id: id,
                        image: image ? image : source.fallbackImage,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = NewTitles;
                sectionCallback(section);
            }

            //Top All Time
            if (section.id == "top_alltime") {
                const TopAllTime: MangaTile[] = [];
                for (const manga of $("li", source.homescreen_TopAllTime_selector).toArray()) {
                    const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    TopAllTime.push(createMangaTile({
                        id: id,
                        image: image ? image : source.fallbackImage,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = TopAllTime;
                sectionCallback(section);
            }

            //Top Monthly
            if (section.id == "top_monthly") {
                const TopMonthly: MangaTile[] = [];
                for (const manga of $("li", source.homescreen_TopMonthly_selector).toArray()) {
                    const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    TopMonthly.push(createMangaTile({
                        id: id,
                        image: image ? image : source.fallbackImage,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = TopMonthly;
                sectionCallback(section);
            }

            //Top Weekly
            if (section.id == "top_weekly") {
                const TopWeekly: MangaTile[] = [];
                for (const manga of $("li", source.homescreen_TopWeekly_selector).toArray()) {
                    const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
                    const title = $("h2", manga).text().trim();
                    const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
                    if (!id || !title) continue;
                    TopWeekly.push(createMangaTile({
                        id: id,
                        image: image ? image : source.fallbackImage,
                        title: createIconText({ text: this.decodeHTMLEntity(title) }),
                    }));
                }
                section.items = TopWeekly;
                sectionCallback(section);
            }
        }
    }

    parseViewMore = ($: CheerioStatic, source: any): MangaTile[] => {
        const mangas: MangaTile[] = [];
        const collectedIds: string[] = [];

        for (const manga of $("div.bs", "div.listupd").toArray()) {
            const id = this.idCleaner($("a", manga).attr('href') ?? "", source);
            const title = $("a", manga).attr('title');
            const image = this.getImageSrc($("img", manga))?.split("?resize")[0] ?? "";
            const subtitle = $("div.epxs", manga).text().trim();
            if (collectedIds.includes(id) || !id || !title) continue;
            mangas.push(createMangaTile({
                id,
                image: image ? image : source.fallbackImage,
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

        if (typeof imageObj?.attr('src') != 'undefined') {
            image = imageObj?.attr('src');
        }
        else if (typeof imageObj?.attr('data-lazy-src') != 'undefined') {
            image = imageObj?.attr('data-lazy-src')
        }
        else if (typeof imageObj?.attr('srcset') != 'undefined') {
            image = imageObj?.attr('srcset')?.split(' ')[0] ?? '';
        }
        else {
            image = imageObj?.attr('data-src');
        }
        return encodeURI(decodeURI(this.decodeHTMLEntity(image?.trim() ?? '')));
    }

    protected decodeHTMLEntity(str: string): string {
        return entities.decodeHTML(str);
    }

    protected idCleaner(str: string, source: any): string {
        const base = source.baseUrl.split("://").pop();
        str = str.replace(/(https:\/\/|http:\/\/)/, "");
        str = str.replace(/\/$/, "");
        str = str.replace(`${base}/`, "");
        str = str.replace(`${source.sourceTraversalPathName}/`, "");
        return str
    }
}
