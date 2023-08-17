import {Parser} from '../MadaraParser'
import {ChapterDetails} from '@paperback/types'

import CryptoJS from 'crypto-js'

type CipherParams = CryptoJS.lib.CipherParams

const CryptoJSFormatter = {
    stringify: function (cipherParams: CipherParams) {
        const jsonObj = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64), iv: '',
            s: ''
        }
        if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString()
        }

        if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString()
        }
        return JSON.stringify(jsonObj)
    },
    parse: function (jsonStr: string) {
        const jsonObj = JSON.parse(jsonStr)
        const cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)})
        if (jsonObj.iv) {
            cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
        }

        if (jsonObj.s) {
            cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
        }

        return cipherParams
    }
}

export class MangaCultivatorParser extends Parser {
    decryptData(cipherText: string, key: string) {
        return JSON.parse(JSON.parse(CryptoJS.AES.decrypt(cipherText, key, {format: CryptoJSFormatter}).toString(CryptoJS.enc.Utf8)))
    }

    extractVariableValues(chapterData: string) : Record<string, string> {
        const variableRegex = /var\s+(\w+)\s*=\s*'([^']*)';/g
        const variables: Record<string, string> = {}
        let match

        while ((match = variableRegex.exec(chapterData)) !== null) {
            const [, variableName, variableValue] = match as unknown as [string, string, string]
            variables[variableName] = variableValue
        }

        return variables
    }

    override async parseChapterDetails($: CheerioSelector, mangaId: string, chapterId: string, selector: string, source: any): Promise<ChapterDetails> {
        if (!$(selector).length) {
            return super.parseChapterDetails($, mangaId, chapterId, selector, source)
        }

        // under no circumstances directly eval (or Function), as they might go hardy harr-harr sneaky and pull an RCE

        const variables = this.extractVariableValues($(selector).get()[0].children[0].data)
        if (!('chapter_data' in variables) || !('wpmangaprotectornonce' in variables)) {
            throw new Error(`Could not parse page for postId:${mangaId} chapterId:${chapterId}. Reason: Lacks sufficient data`)
        }

        const chapterList = this.decryptData(<string>variables['chapter_data'], <string>variables['wpmangaprotectornonce'])
        const pages: string[] = []

        chapterList.forEach((page: string) => {
            pages.push(encodeURI(page))
        })

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages
        })
    }
}