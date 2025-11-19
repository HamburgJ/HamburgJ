export type FileType = 'file' | 'folder';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  children?: FileSystemItem[];
  componentKey?: string;
  icon?: string;
  isOpen?: boolean; // For initial state
}

export interface FileSystemContextType {
  expandedFolders: Set<string>;
  activeFileId: string | null;
  toggleFolder: (folderId: string) => void;
  openFile: (fileId: string) => void;
  fileSystem: FileSystemItem[];
}

