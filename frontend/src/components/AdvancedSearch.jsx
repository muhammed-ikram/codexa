// AdvancedSearch.jsx - Advanced search and replace functionality
import React, { useState, useRef, useCallback, useEffect } from 'react';

// Custom UI Components
const Button = ({ children, onClick, className = "", variant = "primary", size = "sm", disabled = false, leftIcon, title, ...props }) => {
  const baseClasses = "monaco-button inline-flex items-center justify-center gap-2";
  const variantClasses = {
    primary: "monaco-button-primary",
    secondary: "monaco-button-secondary", 
    ghost: "monaco-button-ghost"
  };
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {leftIcon && <span className="w-4 h-4">{leftIcon}</span>}
      {children}
    </button>
  );
};

const IconButton = ({ icon, onClick, className = "", variant = "ghost", size = "sm", disabled = false, "aria-label": ariaLabel, title, ...props }) => {
  const baseClasses = "monaco-button inline-flex items-center justify-center";
  const variantClasses = {
    primary: "monaco-button-primary",
    secondary: "monaco-button-secondary", 
    ghost: "monaco-button-ghost",
    solid: "monaco-button-primary"
  };
  const sizeClasses = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-2"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      <span className="w-4 h-4">{icon}</span>
    </button>
  );
};

const Badge = ({ children, colorScheme = "gray", size = "sm", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-600 text-white",
    gray: "bg-gray-600 text-white"
  };
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs"
  };
  
  return (
    <span className={`${colorClasses[colorScheme]} ${sizeClasses[size]} rounded font-medium ${className}`}>
      {children}
    </span>
  );
};

const Tooltip = ({ children, label }) => {
  return (
    <div className="relative group">
      {children}
      {label && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
};

// Icons
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
  </svg>
);

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const AdvancedSearch = ({ 
  isOpen, 
  onClose, 
  editorRef, 
  project,
  onNavigateToResult 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
    searchInFiles: false
  });
  
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  
  // Search in current editor
  const searchInEditor = useCallback((query, options = {}) => {
    if (!editorRef.current || !query) {
      setResults([]);
      return;
    }
    
    const editor = editorRef.current;
    const model = editor.getModel();
    
    if (!model) return;
    
    const searchOptions = {
      matchCase: options.caseSensitive || false,
      wholeWord: options.wholeWord || false,
      isRegex: options.regex || false
    };
    
    // Find all matches
    const matches = model.findMatches(
      query,
      true, // search entire model
      searchOptions.isRegex,
      searchOptions.matchCase,
      searchOptions.wholeWord ? '\\b' : null,
      true // capture matches
    );
    
    const searchResults = matches.map((match, index) => ({
      id: index,
      range: match.range,
      text: model.getValueInRange(match.range),
      lineNumber: match.range.startLineNumber,
      column: match.range.startColumn,
      lineText: model.getLineContent(match.range.startLineNumber).trim(),
      file: 'current' // For current file
    }));
    
    setResults(searchResults);
    
    if (searchResults.length > 0) {
      setCurrentResultIndex(0);
      navigateToResult(searchResults[0]);
    } else {
      setCurrentResultIndex(-1);
    }
  }, [editorRef]);
  
  // Navigate to a specific search result
  const navigateToResult = useCallback((result) => {
    if (!result) return;
    
    if (result.file === 'current' && editorRef.current) {
      // Navigate in current editor
      const editor = editorRef.current;
      editor.setPosition({
        lineNumber: result.range.startLineNumber,
        column: result.range.startColumn
      });
      editor.revealLineInCenter(result.range.startLineNumber);
      editor.setSelection(result.range);
      editor.focus();
    } else if (result.filePath && onNavigateToResult) {
      // Navigate to file in project
      onNavigateToResult(result.filePath, result.range);
    }
  }, [editorRef, onNavigateToResult]);
  
  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    searchInEditor(searchQuery, searchOptions);
  }, [searchQuery, searchOptions, searchInEditor]);
  
  // Navigate between results
  const navigateNext = useCallback(() => {
    if (results.length === 0) return;
    
    const nextIndex = (currentResultIndex + 1) % results.length;
    setCurrentResultIndex(nextIndex);
    navigateToResult(results[nextIndex]);
  }, [results, currentResultIndex, navigateToResult]);
  
  const navigatePrevious = useCallback(() => {
    if (results.length === 0) return;
    
    const prevIndex = currentResultIndex > 0 ? currentResultIndex - 1 : results.length - 1;
    setCurrentResultIndex(prevIndex);
    navigateToResult(results[prevIndex]);
  }, [results, currentResultIndex, navigateToResult]);
  
  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        navigatePrevious();
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'F3') {
      e.preventDefault();
      if (e.shiftKey) {
        navigatePrevious();
      } else {
        navigateNext();
      }
    }
  }, [handleSearch, navigateNext, navigatePrevious, onClose]);
  
  // Auto-search as user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, searchOptions, handleSearch]);
  
  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-0 right-0 w-96 bg-monaco-sidebar border border-monaco-border rounded-lg p-4 z-50 shadow-lg">
      <div className="flex flex-col space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SearchIcon />
            <span className="font-bold text-sm text-monaco-text">
              Find
            </span>
            {results.length > 0 && (
              <Badge colorScheme="blue" size="sm">
                {currentResultIndex + 1} of {results.length}
              </Badge>
            )}
          </div>
          <IconButton
            icon={<CloseIcon />}
            onClick={onClose}
            aria-label="Close search"
          />
        </div>
        
        {/* Search Input */}
        <input
          ref={searchInputRef}
          className="monaco-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {/* Replace Input */}
        <div className={`transition-all duration-200 ${isReplaceMode ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <input
            className="monaco-input"
            placeholder="Replace..."
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            leftIcon={<ChevronUpIcon />}
            onClick={navigatePrevious}
            disabled={results.length === 0}
            title="Previous (Shift+F3)"
          >
            Previous
          </Button>
          
          <Button
            variant="ghost"
            leftIcon={<ChevronDownIcon />}
            onClick={navigateNext}
            disabled={results.length === 0}
            title="Next (F3)"
          >
            Next
          </Button>
          
          <Tooltip label="Toggle replace mode">
            <IconButton
              variant={isReplaceMode ? "solid" : "ghost"}
              icon={<RepeatIcon />}
              onClick={() => setIsReplaceMode(!isReplaceMode)}
              aria-label="Toggle replace"
            />
          </Tooltip>
          
          <Tooltip label="Search options">
            <IconButton
              variant={isOptionsOpen ? "solid" : "ghost"}
              icon={<ViewIcon />}
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              aria-label="Search options"
            />
          </Tooltip>
        </div>
        
        {/* Search Options */}
        <div className={`transition-all duration-200 ${isOptionsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="bg-monaco-bg p-3 rounded-lg space-y-2">
            <label className="flex items-center space-x-2 text-sm text-monaco-text cursor-pointer">
              <input
                type="checkbox"
                checked={searchOptions.caseSensitive}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                className="rounded border-monaco-border"
              />
              <span>Case sensitive</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm text-monaco-text cursor-pointer">
              <input
                type="checkbox"
                checked={searchOptions.wholeWord}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, wholeWord: e.target.checked }))}
                className="rounded border-monaco-border"
              />
              <span>Whole word</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm text-monaco-text cursor-pointer">
              <input
                type="checkbox"
                checked={searchOptions.regex}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, regex: e.target.checked }))}
                className="rounded border-monaco-border"
              />
              <span>Regular expression</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;