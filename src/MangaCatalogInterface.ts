import { PartialSourceManga } from '@paperback/types'

export interface SourceBase {
    title: string;
    url: string;
}

export interface SourceBaseData {
    items: PartialSourceManga;
    data: SourceBase;
}