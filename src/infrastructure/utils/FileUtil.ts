import { TEntry } from '../../types/FileManagerTypes';

export enum FileType {
  Unknown,
  Word,
  Video,
  Pdf,
  Csv,
  Audio,
  Archive,
  Excel,
  Powerpoint,
  Image,
  Directory,
}

export const getIcon = (type: FileType) => {
  switch (type) {
    case FileType.Directory:
      return 'far fa-folder';
    case FileType.Video:
      return 'far fa-file-video';
    case FileType.Word:
      return 'far fa-file-word';
    case FileType.Image:
      return 'far fa-file-image';
    case FileType.Pdf:
      return 'far fa-file-pdf';
    case FileType.Csv:
      return 'far fa-file-csv';
    case FileType.Audio:
      return 'far fa-file-audio';
    case FileType.Archive:
      return 'far fa-file-archive';
    case FileType.Excel:
      return 'far fa-file-excel';
    case FileType.Powerpoint:
      return 'far fa-file-powerpoint';
    default:
      return 'far fa-file';
  }
};

export const getFileType = (extension: string): FileType => {
  switch (extension?.toLowerCase()) {
    case 'dir':
      return FileType.Directory;
    case 'webm':
    case 'mpg':
    case 'mpeg':
    case 'mp4':
    case 'avi':
    case 'wmv':
    case 'flv':
    case 'mov':
    case 'swf':
      return FileType.Video;
    case 'doc':
    case 'docm':
    case 'docx':
    case 'dot':
    case 'dotm':
    case 'dotx':
      return FileType.Word;
    case 'jpg':
    case 'jpeg':
    case 'tiff':
    case 'png':
    case 'bmp':
    case 'gif':
    case 'webp':
    case 'svg':
      return FileType.Image;
    case 'pdf':
      return FileType.Pdf;
    case 'csv':
      return FileType.Csv;
    case 'm4a':
    case 'flac':
    case 'mp3':
    case 'wav':
    case 'wma':
    case 'aac':
      return FileType.Audio;
    case '7z':
    case 'tar.bz2':
    case 'bz2':
    case 'tar.gz':
    case 'zip':
    case 'zipx':
    case 'gz':
    case 'rar':
      return FileType.Archive;
    case 'xlsx':
    case 'xlsm':
    case 'xlsb':
    case 'xltx':
    case 'xltm':
    case 'xls':
    case 'xlt':
    case 'xlam':
    case 'xla':
    case 'xlw':
    case 'xlr':
      return FileType.Excel;
    case 'potm':
    case 'ppa':
    case 'ppam':
    case 'pps':
    case 'ppsm':
    case 'ppsx':
    case 'ppt':
    case 'pptm':
    case 'pptx':
      return FileType.Powerpoint;
    default:
      return FileType.Unknown;
  }
};
export const getIconColor = (item: FileType) => {
  switch (item) {
    case FileType.Excel:
      return 'text-green-400';
    case FileType.Word:
      return 'text-blue-400';
    case FileType.Powerpoint:
      return 'text-red-400';
    case FileType.Directory:
      return 'text-yellow-600';
    case FileType.Image:
      return 'text-purple-400';
    case FileType.Pdf:
      return 'text-red-400';
    default:
      return 'text-gray-600';
  }
};

export const getName = (item: TEntry) => {
  if (item.isFolder) {
    return item.name;
  }
  return `${item.name}.${item.extension}`;
};

export const comparerFunction = (a: TEntry, b: TEntry, i: number) => {
  if (!a.isFolder && b.isFolder) return 1;
  if (a.isFolder && !b.isFolder) return -1;

  return a.name.localeCompare(b.name) * i;
};