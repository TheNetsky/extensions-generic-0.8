import CryptoJS from 'crypto-js'
type CipherParams = CryptoJS.lib.CipherParams

const CryptoJSFormatter = {
    stringify: function (cipherParams: CipherParams) {
        const jsonObj = {
            ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64), iv: '',
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
        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct) })
        if (jsonObj.iv) {
            cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
        }

        if (jsonObj.s) {
            cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
        }

        return cipherParams
    }
}

export function decryptData(cipherText: string, key: string) {
    return JSON.parse(JSON.parse(CryptoJS.AES.decrypt(cipherText, key, { format: CryptoJSFormatter }).toString(CryptoJS.enc.Utf8)))
}

export function extractVariableValues(chapterData: string): Record<string, string> {
    const variableRegex = /var\s+(\w+)\s*=\s*'([^']*)';/g
    const variables: Record<string, string> = {}
    let match

    // Under no circumstances directly eval (or Function), as they might go hardy harr-harr sneaky and pull an RCE
    while ((match = variableRegex.exec(chapterData)) !== null) {
        const [, variableName, variableValue] = match as unknown as [string, string, string]
        variables[variableName] = variableValue
    }

    return variables
}