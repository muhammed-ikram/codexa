import React, { useState } from "react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-monaco-text whitespace-nowrap">
        Language:
      </span>
      <div className="relative">
        <button
          className="monaco-button monaco-button-secondary flex items-center justify-between min-w-32"
          onClick={() => setIsOpen(!isOpen)}
        >
          {language}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-monaco-sidebar border border-monaco-border rounded-lg shadow-lg py-1 min-w-48 max-h-64 overflow-y-auto scrollbar-thin z-50">
            {languages.map(([lang, version]) => (
              <button
                key={lang}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  lang === language 
                    ? 'text-monaco-accent bg-monaco-selection' 
                    : 'text-monaco-text hover:text-monaco-accent hover:bg-monaco-hover'
                }`}
                onClick={() => {
                  onSelect(lang);
                  setIsOpen(false);
                }}
              >
                {lang}
                <span className="text-monaco-text-secondary text-xs ml-2">
                  ({version})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;