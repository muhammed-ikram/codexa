// CommandPalette.jsx - VS Code-like command palette
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

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

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
  </svg>
);

// Command categories and definitions
const COMMANDS = [
  // File operations
  {
    id: 'file.new',
    label: 'New File',
    description: 'Create a new file',
    category: 'File',
    icon: AddIcon,
    keywords: ['new', 'create', 'file'],
    shortcut: 'Ctrl+N'
  },
  {
    id: 'file.open',
    label: 'Open File',
    description: 'Open an existing file',
    category: 'File',
    icon: ExternalLinkIcon,
    keywords: ['open', 'file'],
    shortcut: 'Ctrl+O'
  },
  {
    id: 'file.save',
    label: 'Save',
    description: 'Save current file',
    category: 'File',
    icon: EditIcon,
    keywords: ['save', 'file'],
    shortcut: 'Ctrl+S'
  },
  {
    id: 'file.saveAll',
    label: 'Save All',
    description: 'Save all open files',
    category: 'File',
    icon: EditIcon,
    keywords: ['save', 'all'],
    shortcut: 'Ctrl+Shift+S'
  },
  
  // Edit operations
  {
    id: 'edit.find',
    label: 'Find',
    description: 'Find in current file',
    category: 'Edit',
    icon: SearchIcon,
    keywords: ['find', 'search'],
    shortcut: 'Ctrl+F'
  },
  {
    id: 'edit.replace',
    label: 'Find and Replace',
    description: 'Find and replace in current file',
    category: 'Edit',
    icon: RepeatIcon,
    keywords: ['replace', 'find'],
    shortcut: 'Ctrl+H'
  },
  {
    id: 'edit.format',
    label: 'Format Document',
    description: 'Format the current document',
    category: 'Edit',
    icon: EditIcon,
    keywords: ['format', 'beautify', 'indent'],
    shortcut: 'Shift+Alt+F'
  },
  {
    id: 'edit.toggleComment',
    label: 'Toggle Comment',
    description: 'Toggle line comment',
    category: 'Edit',
    icon: EditIcon,
    keywords: ['comment', 'toggle'],
    shortcut: 'Ctrl+/'
  },
  
  // View operations
  {
    id: 'view.togglePreview',
    label: 'Toggle Preview',
    description: 'Show/hide preview panel',
    category: 'View',
    icon: ViewIcon,
    keywords: ['preview', 'toggle'],
    shortcut: 'Ctrl+P'
  },
  {
    id: 'view.toggleSidebar',
    label: 'Toggle Sidebar',
    description: 'Show/hide file explorer',
    category: 'View',
    icon: ViewIcon,
    keywords: ['sidebar', 'explorer'],
    shortcut: 'Ctrl+B'
  },
  
  // Selection operations
  {
    id: 'selection.selectAll',
    label: 'Select All',
    description: 'Select all text',
    category: 'Selection',
    icon: EditIcon,
    keywords: ['select', 'all'],
    shortcut: 'Ctrl+A'
  },
  {
    id: 'selection.addCursorAbove',
    label: 'Add Cursor Above',
    description: 'Add cursor to the line above',
    category: 'Selection',
    icon: EditIcon,
    keywords: ['cursor', 'multi', 'above'],
    shortcut: 'Ctrl+Alt+↑'
  },
  {
    id: 'selection.addCursorBelow',
    label: 'Add Cursor Below',
    description: 'Add cursor to the line below',
    category: 'Selection',
    icon: EditIcon,
    keywords: ['cursor', 'multi', 'below'],
    shortcut: 'Ctrl+Alt+↓'
  },
  
  // Project operations
  {
    id: 'project.newFolder',
    label: 'New Folder',
    description: 'Create a new folder',
    category: 'Project',
    icon: AddIcon,
    keywords: ['folder', 'new', 'directory'],
    shortcut: ''
  },
  {
    id: 'project.openFolder',
    label: 'Open Folder',
    description: 'Open folder from file system',
    category: 'Project',
    icon: ExternalLinkIcon,
    keywords: ['folder', 'open', 'project'],
    shortcut: 'Ctrl+Shift+O'
  },
  
  // Settings
  {
    id: 'settings.preferences',
    label: 'Preferences',
    description: 'Open user preferences',
    category: 'Settings',
    icon: SettingsIcon,
    keywords: ['settings', 'preferences', 'config'],
    shortcut: 'Ctrl+,'
  }
];

// Command palette item component
const CommandItem = React.memo(({ 
  command, 
  isSelected, 
  onClick 
}) => {
  const { label, description, category, icon: IconComponent, shortcut } = command;
  
  return (
    <div
      className={`p-3 cursor-pointer rounded-lg transition-colors ${
        isSelected ? 'bg-blue-600' : 'hover:bg-monaco-hover'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <IconComponent className="text-monaco-text-secondary" />
        <div className="flex-1 flex flex-col items-start">
          <span className="font-medium text-sm text-monaco-text">
            {label}
          </span>
          <span className="text-xs text-monaco-text-secondary">
            {description}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-300">
            {category}
          </span>
          {shortcut && (
            <span className="text-xs text-monaco-text-secondary">
              {shortcut}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Main command palette component
const CommandPalette = ({ 
  isOpen, 
  onClose, 
  onExecuteCommand 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef();
  
  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    
    const queryLower = query.toLowerCase();
    
    return COMMANDS.filter(command => {
      const searchText = [
        command.label,
        command.description,
        command.category,
        ...command.keywords
      ].join(' ').toLowerCase();
      
      return searchText.includes(queryLower);
    }).sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.label.toLowerCase().startsWith(queryLower);
      const bExact = b.label.toLowerCase().startsWith(queryLower);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by category
      return a.category.localeCompare(b.category);
    });
  }, [query]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleExecuteCommand(filteredCommands[selectedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
        
      default:
        break;
    }
  }, [filteredCommands, selectedIndex, onClose]);
  
  // Execute command
  const handleExecuteCommand = useCallback((command) => {
    onExecuteCommand(command);
    onClose();
  }, [onExecuteCommand, onClose]);
  
  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Update selected index when filtered commands change
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex]);
  
  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-[10vh] ${isOpen ? '' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-monaco-sidebar text-white rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] overflow-hidden">
        <div className="flex flex-col">
          {/* Search input */}
          <div className="p-4 border-b border-monaco-border">
            <input
              ref={inputRef}
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-lg placeholder-monaco-text-secondary focus:outline-none"
            />
          </div>
          
          {/* Commands list */}
          <div className="max-h-[50vh] overflow-y-auto scrollbar-thin">
            {filteredCommands.length > 0 ? (
              <div className="p-2 space-y-0">
                {filteredCommands.map((command, index) => (
                  <CommandItem
                    key={command.id}
                    command={command}
                    isSelected={index === selectedIndex}
                    onClick={() => handleExecuteCommand(command)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-monaco-text-secondary">
                <p>No commands found</p>
                <p className="text-sm mt-1">
                  Try searching for "file", "edit", or "view"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;