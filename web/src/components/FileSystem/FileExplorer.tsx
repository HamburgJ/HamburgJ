import React from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { Folder, FolderOpen, InsertDriveFile, KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import { useFileSystem } from '../../context/FileSystemContext';
import { FileSystemItem } from '../../types/FileSystem';

const FileSystemNode: React.FC<{ item: FileSystemItem; depth: number }> = ({ item, depth }) => {
  const { expandedFolders, activeFileId, toggleFolder, openFile } = useFileSystem();
  const isExpanded = expandedFolders.has(item.id);
  const isActive = activeFileId === item.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder') {
      toggleFolder(item.id);
    } else {
      openFile(item.id);
    }
  };

  return (
    <Box sx={{ pl: depth > 0 ? 2 : 0 }}>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          py: 0.5,
          px: 1,
          backgroundColor: isActive ? 'rgba(0, 0, 128, 0.1)' : 'transparent',
          border: isActive ? '1px dotted #000000' : '1px solid transparent',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
          userSelect: 'none',
        }}
      >
        {item.type === 'folder' && (
          <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
            {isExpanded ? (
              <KeyboardArrowDown sx={{ fontSize: 16 }} />
            ) : (
              <KeyboardArrowRight sx={{ fontSize: 16 }} />
            )}
          </Box>
        )}
        
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: item.type === 'folder' ? '#FBC02D' : '#757575' }}>
          {item.type === 'folder' ? (
            isExpanded ? <FolderOpen fontSize="small" /> : <Folder fontSize="small" />
          ) : (
            <InsertDriveFile fontSize="small" />
          )}
        </Box>
        
        <Typography
          variant="body2"
          sx={{
            fontWeight: isActive ? 700 : 400,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {item.name}
        </Typography>
      </Box>

      {item.type === 'folder' && item.children && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box>
            {item.children.map((child) => (
              <FileSystemNode key={child.id} item={child} depth={depth + 1} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const FileExplorer: React.FC = () => {
  const { fileSystem } = useFileSystem();

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {fileSystem.map((item) => (
        <FileSystemNode key={item.id} item={item} depth={0} />
      ))}
    </Box>
  );
};

export default FileExplorer;
