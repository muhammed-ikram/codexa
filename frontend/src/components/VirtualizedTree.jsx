// VirtualizedTree.jsx - High-performance virtualized file tree for large projects
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// Icons
const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
  </svg>
);

// Custom UI Components
const IconButton = ({ icon, onClick, className = "", "aria-label": ariaLabel, title, size = "xs" }) => {
  return (
    <button
      className={`p-1 rounded text-monaco-text hover:bg-monaco-hover transition-colors flex items-center justify-center ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      style={{ width: '24px', height: '24px' }}
    >
      {icon}
    </button>
  );
};

const Tooltip = ({ children, label }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
};

// Virtual scrolling configuration
const ITEM_HEIGHT = 28; // Height of each tree item in pixels
const BUFFER_SIZE = 5; // Number of items to render outside visible area
const SCROLL_DEBOUNCE = 16; // Debounce scroll events (60fps)

// Flatten tree structure for virtualization
const flattenTree = (nodes, level = 0, expanded = new Set()) => {
  const result = [];
  
  for (const node of nodes) {
    result.push({ ...node, level, id: node.path });
    
    if (node.type === 'folder' && expanded.has(node.path) && node.children) {
      result.push(...flattenTree(node.children, level + 1, expanded));
    }
  }
  
  return result;
};

// Debounce utility
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

// Virtual scrolling hook
const useVirtualScrolling = (items, containerHeight, itemHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const debouncedSetScrollTop = useDebounce(setScrollTop, SCROLL_DEBOUNCE);
  
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = start + visibleCount;
    
    return {
      start: Math.max(0, start - BUFFER_SIZE),
      end: Math.min(items.length, end + BUFFER_SIZE)
    };
  }, [scrollTop, containerHeight, itemHeight, items.length]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      virtualIndex: visibleRange.start + index
    }));
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e) => debouncedSetScrollTop(e.target.scrollTop)
  };
};

// Tree item component with lazy rendering
const VirtualTreeItem = React.memo(({ 
  item, 
  selectedPath, 
  expandedFolders,
  onFileSelect,
  onToggleFolder,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder 
}) => {
  const { name, type, path, level } = item;
  const isSelected = selectedPath === path;
  const isExpanded = expandedFolders.has(path);
  const indent = level * 16;
  
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    onToggleFolder(path);
  }, [path, onToggleFolder]);
  
  const handleSelect = useCallback(() => {
    if (type === 'file') {
      onFileSelect(path);
    } else {
      onToggleFolder(path);
    }
  }, [type, path, onFileSelect, onToggleFolder]);
  
  const handleRename = useCallback((e) => {
    e.stopPropagation();
    onRename(path);
  }, [path, onRename]);
  
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(path);
  }, [path, onDelete]);
  
  const handleNewFile = useCallback((e) => {
    e.stopPropagation();
    onNewFile(path);
  }, [path, onNewFile]);
  
  const handleNewFolder = useCallback((e) => {
    e.stopPropagation();
    onNewFolder(path);
  }, [path, onNewFolder]);
  
  return (
    <div
      className="px-2 py-1 hover:bg-monaco-hover rounded cursor-pointer transition-colors group flex items-center"
      onClick={handleSelect}
      style={{
        height: `${ITEM_HEIGHT}px`,
        backgroundColor: isSelected ? '#094771' : 'transparent'
      }}
    >
      <div className="flex items-center gap-1 w-full h-full">
        <div style={{ width: `${indent}px`, flexShrink: 0 }}></div>
        {type === 'folder' && (
          <IconButton
            icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            onClick={handleToggle}
            aria-label="toggle folder"
            className="flex-shrink-0"
          />
        )}
        
        <span
          className={`text-sm flex-1 truncate ${
            isSelected ? 'text-white' : 'text-monaco-text'
          } ${type === 'folder' ? 'font-bold' : 'font-normal'}`}
        >
          {name}{type === 'folder' ? '/' : ''}
        </span>
        
        {/* Action buttons - only show on hover or selection */}
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 flex-shrink-0">
          {type === 'folder' && (
            <>
              <Tooltip label="New file">
                <IconButton
                  icon={<AddIcon />}
                  onClick={handleNewFile}
                  aria-label="new file"
                />
              </Tooltip>
              <Tooltip label="New folder">
                <IconButton
                  icon={<RepeatIcon />}
                  onClick={handleNewFolder}
                  aria-label="new folder"
                />
              </Tooltip>
            </>
          )}
          
          <Tooltip label="Rename">
            <IconButton
              icon={<EditIcon />}
              onClick={handleRename}
              aria-label="rename"
            />
          </Tooltip>
          
          <Tooltip label="Delete">
            <IconButton
              icon={<DeleteIcon />}
              onClick={handleDelete}
              aria-label="delete"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
});

// Main virtualized tree component
const VirtualizedTree = ({
  project,
  selectedPath,
  onFileSelect,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder,
  height = 400
}) => {
  const [expandedFolders, setExpandedFolders] = useState(() => {
    // Initially expand the first level
    const initialExpanded = new Set();
    project.forEach(node => {
      if (node.type === 'folder') {
        initialExpanded.add(node.path);
      }
    });
    return initialExpanded;
  });
  
  const scrollContainerRef = useRef();
  
  const toggleFolder = useCallback((path) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  }, []);
  
  const flatItems = useMemo(() => {
    return flattenTree(project, 0, expandedFolders);
  }, [project, expandedFolders]);
  
  // Calculate height based on container if not explicitly provided
  const calculatedHeight = useMemo(() => {
    if (scrollContainerRef.current) {
      return scrollContainerRef.current.clientHeight || height;
    }
    return height;
  }, [height]);
  
  const {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  } = useVirtualScrolling(flatItems, calculatedHeight, ITEM_HEIGHT);
  
  // Auto-expand parent folders when a file is selected
  useEffect(() => {
    if (selectedPath) {
      const pathParts = selectedPath.split('/');
      const newExpanded = new Set(expandedFolders);
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderPath = pathParts.slice(0, i + 1).join('/');
        if (folderPath) {
          newExpanded.add(folderPath);
        }
      }
      
      setExpandedFolders(newExpanded);
    }
  }, [selectedPath]);
  
  if (flatItems.length === 0) {
    return (
      <div className="p-4 text-center text-monaco-text-secondary">
        <span>No files in project</span>
      </div>
    );
  }
  
  return (
    <div
      ref={scrollContainerRef}
      className="virtualized-tree scrollbar-thin overflow-y-auto h-full"
      onScroll={onScroll}
    >
      <div className="relative" style={{ height: `${totalHeight}px` }}>
        <div
          className="absolute left-0 right-0"
          style={{ top: `${offsetY}px` }}
        >
          {visibleItems.map((item) => (
            <VirtualTreeItem
              key={item.path}
              item={item}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              onFileSelect={onFileSelect}
              onToggleFolder={toggleFolder}
              onRename={onRename}
              onDelete={onDelete}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedTree;