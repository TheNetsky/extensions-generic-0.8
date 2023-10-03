import * as he from 'he';

export const decodeHTMLEntity = (str: string): string => {
    return he.decode(str);
};