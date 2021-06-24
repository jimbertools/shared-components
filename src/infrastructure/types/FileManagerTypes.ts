
export interface IHeader {

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
    id: string,
    name:string,
    modified?: Date,
    created?: Date,
    size?:number,
    extension?:string,
    isFolder: boolean
}

// export  type TEntry = IFile | IBaseFolder