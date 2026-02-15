import React from 'react';

interface ErrorBoundaryOverlayProps {
  visible: boolean;
  style?: React.CSSProperties;
}

/**
 * Fake React-style "Unhandled Runtime Error" overlay.
 * Dark VS Code theme with stack trace — used in the narrative loading sequence.
 */
export const ErrorBoundaryOverlay: React.FC<ErrorBoundaryOverlayProps> = ({ visible, style }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1e1e1e',
        color: '#f44747',
        fontFamily: 'monospace',
        padding: '40px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'auto',
        animation: 'vcFadeIn 0.3s ease-out',
        ...style,
      }}
    >
      <h1 style={{ color: '#f44747', fontSize: '2rem', marginBottom: '1rem' }}>
        Unhandled Runtime Error
      </h1>
      <div style={{
        backgroundColor: '#2d2020',
        border: '1px solid #f44747',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '1rem',
      }}>
        <p style={{ color: '#f44747', fontSize: '1.1rem', margin: '0 0 12px 0' }}>
          TypeError: Cannot read properties of undefined (reading &apos;map&apos;)
        </p>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: 0, lineHeight: 1.7 }}>
          at Portfolio (Portfolio.jsx:42:15)<br/>
          at PortfolioGrid (PortfolioGrid.tsx:18:9)<br/>
          at MainContent (MainContent.tsx:27:5)<br/>
          at ErrorBoundary (ErrorBoundary.tsx:8:3)<br/>
          at App (App.tsx:18:5)
        </p>
      </div>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        This error occurred during rendering and was not recovered.
      </p>
    </div>
  );
};
