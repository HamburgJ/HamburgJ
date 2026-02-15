import React from 'react';
import { FileIcon, CheckIcon, SpinnerIcon } from './Icons';

const MONO_STACK = '"Cascadia Code", Consolas, "Courier New", monospace';
const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export interface FileEditData {
  fileName: string;
  lines: string[];
}

export const FileEditBlock: React.FC<{ fileEdit: FileEditData; done: boolean }> = ({ fileEdit, done }) => {
  const addCount = fileEdit.lines.filter(l => l.startsWith('+')).length;
  const removeCount = fileEdit.lines.filter(l => l.startsWith('-')).length;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 10px',
      background: '#1a1a2e',
      border: '1px solid #2a2a3e',
      borderRadius: '6px',
      marginTop: '6px',
      fontFamily: MONO_STACK,
      fontSize: '12px',
      animation: 'vcFadeIn 0.3s ease-out',
      maxWidth: '100%',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {done ? <CheckIcon /> : <SpinnerIcon />}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <FileIcon />
      </span>
      <span style={{ color: '#ccc', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {fileEdit.fileName}
      </span>
      {addCount > 0 && (
        <span style={{ color: '#4ec9b0', fontSize: '11px', fontWeight: 600 }}>+{addCount}</span>
      )}
      {removeCount > 0 && (
        <span style={{ color: '#f44747', fontSize: '11px', fontWeight: 600 }}>-{removeCount}</span>
      )}
      <span style={{
        fontSize: '9px',
        color: done ? '#4ec9b0' : '#888',
        background: done ? 'rgba(78, 201, 176, 0.1)' : 'rgba(136, 136, 136, 0.1)',
        padding: '2px 6px',
        borderRadius: '3px',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.5px',
        flexShrink: 0,
      }}>{done ? 'Saved' : 'Editing'}</span>
    </div>
  );
};

export const ActionIndicator: React.FC<{ label: string; spinning: boolean }> = ({ label, spinning }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    fontSize: '12px',
    color: '#888',
    fontFamily: FONT_STACK,
    animation: 'vcFadeIn 0.25s ease-out',
  }}>
    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {spinning ? <SpinnerIcon /> : <CheckIcon />}
    </span>
    <span>{label}</span>
  </div>
);
