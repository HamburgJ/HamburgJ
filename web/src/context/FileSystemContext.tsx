import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileSystemItem, FileSystemContextType } from '../types/FileSystem';
import { fileSystemData } from '../data/fileSystem';

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};

interface FileSystemProviderProps {
  children: ReactNode;
}

export const FileSystemProvider: React.FC<FileSystemProviderProps> = ({ children }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [activeFileId, setActiveFileId] = useState<string | null>('readme');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const openFile = (fileId: string) => {
    setActiveFileId(fileId);
  };

  return (
    <FileSystemContext.Provider
      value={{
        expandedFolders,
        activeFileId,
        toggleFolder,
        openFile,
        fileSystem: fileSystemData,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

