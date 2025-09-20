// TabManager.jsx - Advanced tab management for multiple files
import React, { useState, useCallback } from 'react';

const TabManager = ({ 
  openTabs = [], 
  activeTab, 
  onTabChange, 
  onTabClose, 
  onTabNew,
  maxTabs = 10 
}) => {
  const [draggedTab, setDraggedTab] = useState(null);

  // Get file icon based on extension
  const getFileIcon = (filename) => {
    if (!filename) return '📄';
    
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap = {
      'js': '🟨',
      'jsx': '⚛️',
      'ts': '🔷',
      'tsx': '⚛️',
      'html': '🌐',
      'css': '🎨',
      'scss': '🎨',
      'json': '📋',
      'md': '📝',
      'py': '🐍',
      'java': '☕',
      'cpp': '⚡',
      'c': '⚡',
      'php': '🐘',
      'rb': '💎',
      'go': '🐹',
      'rs': '🦀',
      'swift': '🐦',
      'kt': '🎯',
      'dart': '🎯',
      'vue': '💚',
      'svelte': '🧡',
      'sql': '🗄️',
      'xml': '📰',
      'yaml': '📄',
      'yml': '📄',
      'toml': '📄',
      'ini': '⚙️',
      'cfg': '⚙️',
      'conf': '⚙️',
      'sh': '🐚',
      'bat': '🦇',
      'ps1': '💙',
      'dockerfile': '🐳',
      'gitignore': '🚫',
      'license': '📜'
    };
    
    return iconMap[ext] || '📄';
  };

  // Get filename from path
  const getFilename = (path) => {
    if (!path) return 'Untitled';
    return path.split('/').pop() || path;
  };

  // Handle tab drag start
  const handleDragStart = (e, tabId) => {
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle tab drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle tab drop
  const handleDrop = (e, targetTabId) => {
    e.preventDefault();
    if (draggedTab && draggedTab !== targetTabId) {
      // Reorder tabs logic would go here
      console.log(`Moving tab ${draggedTab} to position of ${targetTabId}`);
    }
    setDraggedTab(null);
  };

  // Handle tab close with middle click
  const handleMouseDown = (e, tabId) => {
    if (e.button === 1) { // Middle click
      e.preventDefault();
      onTabClose(tabId);
    }
  };

  return (
    <div className="h-10 bg-monaco-sidebar border-b border-monaco-border flex items-center overflow-x-auto scrollbar-thin">
      {/* Tabs */}
      <div className="flex items-center min-w-0">
        {openTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const filename = getFilename(tab.path);
          const icon = getFileIcon(filename);
          
          return (
            <div
              key={tab.id}
              className={`
                group flex items-center space-x-2 px-3 py-2 min-w-0 max-w-48 cursor-pointer
                border-r border-monaco-border transition-colors relative
                ${isActive 
                  ? 'bg-monaco-bg text-monaco-text border-b-2 border-monaco-accent' 
                  : 'bg-monaco-sidebar text-monaco-text-secondary hover:bg-monaco-hover hover:text-monaco-text'
                }
              `}
              onClick={() => onTabChange(tab.id)}
              onMouseDown={(e) => handleMouseDown(e, tab.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tab.id)}
              title={tab.path || filename}
            >
              {/* File Icon */}
              <span className="text-sm shrink-0">{icon}</span>
              
              {/* Filename */}
              <span className="text-sm truncate min-w-0">
                {filename}
              </span>
              
              {/* Modified Indicator */}
              {tab.modified && (
                <span className="w-2 h-2 bg-orange-400 rounded-full shrink-0"></span>
              )}
              
              {/* Close Button */}
              <button
                className={`
                  w-4 h-4 rounded shrink-0 flex items-center justify-center
                  transition-opacity hover:bg-monaco-border
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                title="Close tab (Ctrl+W)"
              >
                <span className="text-xs">×</span>
              </button>
            </div>
          );
        })}
      </div>
      
      {/* New Tab Button */}
      {openTabs.length < maxTabs && (
        <button
          className="flex items-center justify-center w-10 h-10 text-monaco-text-secondary hover:text-monaco-text hover:bg-monaco-hover transition-colors"
          onClick={onTabNew}
          title="New tab (Ctrl+T)"
        >
          <span className="text-lg">+</span>
        </button>
      )}
      
      {/* Tab Actions */}
      <div className="ml-auto flex items-center space-x-1 px-2">
        {openTabs.length > 1 && (
          <button
            className="text-xs text-monaco-text-secondary hover:text-monaco-text px-2 py-1 rounded hover:bg-monaco-hover transition-colors"
            onClick={() => {
              // Close all tabs except active
              openTabs.forEach(tab => {
                if (tab.id !== activeTab) {
                  onTabClose(tab.id);
                }
              });
            }}
            title="Close other tabs"
          >
            Close Others
          </button>
        )}
        
        {openTabs.length > 0 && (
          <button
            className="text-xs text-monaco-text-secondary hover:text-monaco-text px-2 py-1 rounded hover:bg-monaco-hover transition-colors"
            onClick={() => {
              // Close all tabs
              openTabs.forEach(tab => onTabClose(tab.id));
            }}
            title="Close all tabs"
          >
            Close All
          </button>
        )}
      </div>
    </div>
  );
};

export default TabManager;