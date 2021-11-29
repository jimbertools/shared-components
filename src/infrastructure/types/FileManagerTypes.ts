import { FileType } from '@/infrastructure/utils/FileUtil';

export enum ScreenWidth {
    All = 0,
    Mobile = 320,
    Tablet = 481,
    Screen = 769,
    Desktop = 1025
}

export interface IHeader<T extends Record<string, any>> {
    key: string;
    // key: keyof T;
    displayName?: string;
    enableSorting?: boolean;
    // sortValue?: (t: T) => any;
    comparer?: (t1: T, t2: T, i: number) => any;
    formatter?: (dataToFormat: T) => string;
    customTemplate?: boolean;
    width?: number;
    displayWidth?: ScreenWidth;
}

export interface ISort {
    prop: string;
    order: 'ascending' | 'descending';
}

export interface TEntry {
    id: string;
    name: string;
    modified?: string;
    created?: Date;
    size?: number;
    extension?: string;
    isFolder: boolean;
    fileType: FileType;
    deleted?: boolean
}

export interface ISelectedChange {
    selectedItems: TEntry[];
    selectionAction: SelectionAction;
}

export enum SelectionAction {
    SIMPLE_SELECTION,
    ADDING_SELECTION,
    RANGE_SELECTION,
}

export interface IMoveItems {
    source: TEntry[];
    destination: TEntry;
}
