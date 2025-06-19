// components/AuthDebugger.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function AuthDebugger() {
  const { user, loading, error } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      borderRadius: '5px',
      zIndex: 9999
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <strong>Auth Debug</strong>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer' 
          }}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      
      {isOpen && (
        <>
          <div style={{ marginBottom: '5px' }}>
            <strong>Status:</strong> {loading ? '🔄 Loading' : user ? '✅ Authenticated' : '❌ Not authenticated'}
          </div>
          
          {error && (
            <div style={{ color: '#ff6b6b', marginBottom: '5px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {user && (
            <div>
              <strong>User:</strong>
              <pre style={{ margin: '5px 0', fontSize: '11px' }}>
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
          
          <div style={{ marginTop: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <strong>Local Storage:</strong>
            <div style={{ fontSize: '11px', marginTop: '5px' }}>
              {typeof window !== 'undefined' && (
                <>
                  <div>Token: {localStorage.getItem('rijig_access_token') ? '✅' : '❌'}</div>
                  <div>Refresh: {localStorage.getItem('rijig_refresh_token') ? '✅' : '❌'}</div>
                  <div>Role: {localStorage.getItem('rijig_role') || 'none'}</div>
                  <div>Status: {localStorage.getItem('rijig_registration_status') || 'none'}</div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}