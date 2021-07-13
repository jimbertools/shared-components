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
  SelectedChanged = 'selected-changed',
  OpenItem = 'open-item',
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

export enum FileManagerViews {
  List = 'list',
  Grid = 'grid',
}

export interface IMoveItems {
  source: TEntry[];
  destination: TEntry;
}
