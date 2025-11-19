import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import RetroLayout from './layout/RetroLayout';
import { FileSystemProvider, useFileSystem } from './context/FileSystemContext';
import WindowFrame from './components/WindowFrame';
import { ContentRegistry } from './components/ContentRegistry';
import { fileSystemData } from './data/fileSystem';
import { FileSystemItem } from './types/FileSystem';

// Helper to find file name by ID
const findFileName = (items: FileSystemItem[], id: string): string => {
  for (const item of items) {
    if (item.id === id) return item.name;
    if (item.children) {
      const found = findFileName(item.children, id);
      if (found) return found;
    }
  }
  return 'Unknown';
};

const AppContent: React.FC = () => {
  const { activeFileId, openFile } = useFileSystem();

  const ActiveComponent = activeFileId && ContentRegistry[activeFileId] 
    ? ContentRegistry[activeFileId] 
    : null;

  const activeFileName = activeFileId ? findFileName(fileSystemData, activeFileId) : '';

  return (
    <RetroLayout>
      {ActiveComponent ? (
        <WindowFrame 
          title={activeFileName} 
          onClose={() => openFile('readme')} // Default to readme on close
        >
          <ActiveComponent />
        </WindowFrame>
      ) : (
        <WindowFrame title="System">
          <div style={{ padding: 20 }}>Select a file to view content.</div>
        </WindowFrame>
      )}
    </RetroLayout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FileSystemProvider>
        <AppContent />
      </FileSystemProvider>
    </ThemeProvider>
  );
};

export default App;
