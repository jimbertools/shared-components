import { FileType } from '../utils/FileUtil';

export interface IHeader<T extends Record<string, any>> {
  key: keyof T;
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

// export  interface IFile {
//   fileUuid: string;
//   name: string;
//   parentUuid: string;
//   deleted: boolean;
//   lastAccessed?: Date;
//   note?: string;
//   extension?: string;
// }

// export interface IBaseFolder {
//   folderUuid: string;
//   name: string;
//   parentUuid: string;
//   fileAmount?: number;
// }

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

// export  type TEntry = IFile | IBaseFolder
