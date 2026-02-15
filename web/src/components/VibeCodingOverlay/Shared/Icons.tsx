import React from 'react';

export const CopilotSparkle: React.FC<{ size?: number; id?: string }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="#888" />
  </svg>
);

export const TerminalIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
    <path d="M6 9l3-3-3-3-.7.7L7.6 6 5.3 8.3zm4 1H7v1h3z" />
    <path d="M1 2.5A1.5 1.5 0 012.5 1h11A1.5 1.5 0 0115 2.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5zm1.5-.5a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5z" />
  </svg>
);

export const FileIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="#cccccc" aria-hidden="true">
    <path d="M13.71 4.29l-3-3A1 1 0 0010 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-.29-.71zM12 14H4V2h5v3a1 1 0 001 1h3v8z" />
  </svg>
);

export const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="#4ec9b0" aria-hidden="true">
    <path d="M6.27 10.87h.01l4.49-4.49-.7-.71-3.78 3.78L4.41 7.6l-.71.71 2.56 2.56z" />
  </svg>
);

export const SpinnerIcon: React.FC = () => (
  <span style={{
    display: 'inline-block',
    width: '12px',
    height: '12px',
    border: '1.5px solid #555',
    borderTop: '1.5px solid #d4d4d4',
    borderRadius: '50%',
    animation: 'vcSpin 0.8s linear infinite',
    flexShrink: 0,
  }} />
);

export const PencilIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="#888" aria-hidden="true">
    <path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l6-6 1.77 1.77-6 6z" />
  </svg>
);
