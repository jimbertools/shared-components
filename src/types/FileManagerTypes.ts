import { FileType } from '../infrastructure/utils/FileUtil';

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
}

export enum FileManagerEmits {
  SearchChanged = 'search-changed',
  SortChanged = 'sort-changed',
  SelectedChanged = 'changeSelected',
}

export enum FileManagerViews {
  List = 'list',
  Grid = 'grid',
}
export interface IMoveItems {
    source: string[];
    destination: string;
}
