import * as entities from 'entities';

export const decodeHTMLEntity = (str: string): string => {
    return entities.decode(str);
};