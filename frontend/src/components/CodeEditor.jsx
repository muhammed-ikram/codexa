// CodeEditor.jsx
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { enhanceMonacoEditor } from "../utils/monacoEnhancements";
import VirtualizedTree from "./VirtualizedTree";
import CommandPalette from "./CommandPalette";
import AdvancedSearch from "./AdvancedSearch";
import PerformanceDashboard from "./PerformanceDashboard";
import IntegratedTerminal from "./IntegratedTerminal";
import TabManager from "./TabManager";
import { MemoryMonitor, CleanupManager, scheduleGC } from "../utils/memoryOptimization";

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

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const RepeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4 4-4H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
  </svg>
);

const UnlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

// Custom UI Components for Tailwind
const Button = ({ children, onClick, className = "", variant = "primary", size = "sm", disabled = false, ...props }) => {
  const baseClasses = "monaco-button inline-flex items-center justify-center";
  const variantClasses = {
    primary: "monaco-button-primary",
    secondary: "monaco-button-secondary",
    ghost: "monaco-button-ghost"
  };
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const IconButton = ({ icon, onClick, className = "", variant = "ghost", size = "sm", "aria-label": ariaLabel, title, disabled = false }) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={`p-2 ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
    </Button>
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

const Menu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const MenuButton = ({ children, isOpen, setIsOpen }) => {
  return (
    <Button
      onClick={() => setIsOpen(!isOpen)}
      variant="ghost"
      size="sm"
      className="relative"
    >
      {children}
    </Button>
  );
};

const MenuList = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-1 bg-monaco-sidebar border border-monaco-border rounded-lg shadow-lg py-1 min-w-48 z-50">
      {children}
    </div>
  );
};

const MenuItem = ({ children, onClick }) => {
  return (
    <button
      className="block w-full text-left px-4 py-2 text-sm text-monaco-text hover:bg-monaco-hover transition-colors"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const useToast = () => {
  return (options) => {
    // Simple toast implementation or integrate with a toast library
    console.log('Toast:', options.title, options.description);
    alert(`${options.title}: ${options.description}`);
  };
};

/**
 * Enhanced CodeEditor
 *
 * Features added / upgraded:
 * - Open folder (replace project) and Import folder into a selected folder (merge)
 * - Recursively read folder structure using File System Access API and preserve file handles
 * - New file / New folder / Rename / Delete / Save (single file) / Save All
 * - Keyboard shortcuts: Ctrl/Cmd+S = Save, Ctrl/Cmd+Shift+S = Save All, Ctrl/Cmd+P = Toggle Preview
 * - Live preview that intelligently inlines/combines HTML, CSS and JS:
 *    - If index.html exists it will inline linked CSS and JS (by filename match)
 *    - If not, a single-file .js will be wrapped into an HTML template
 *    - Any unreferenced CSS/JS files in the project will be combined and injected
 * - Uses localStorage as fallback when File System Access API / handles are not available
 *
 * NOTE: This component intentionally keeps the `Output` usage unchanged so your execution flow
 * remains the same.
 */

/* ----------------------------- Utilities ----------------------------- */

// Debounce utility for performance optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Advanced Monaco Editor configuration for VS Code-like performance
const getEditorOptions = (language) => ({
  // Performance optimizations
  minimap: { enabled: true, scale: 1, renderCharacters: false },
  fontSize: 14,
  fontFamily: "'Cascadia Code', 'Fira Code', 'Monaco', 'Consolas', monospace",
  lineHeight: 22,
  wordWrap: "on",
  automaticLayout: true,
  
  // Advanced editing features
  multiCursorModifier: "ctrlCmd",
  selectOnLineNumbers: true,
  matchBrackets: "always",
  folding: true,
  foldingStrategy: "auto",
  showFoldingControls: "always",
  
  // IntelliSense and suggestions
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on",
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  parameterHints: { enabled: true },
  
  // Code formatting
  formatOnPaste: true,
  formatOnType: true,
  autoIndent: "full",
  tabSize: 2,
  insertSpaces: true,
  
  // Visual enhancements
  renderLineHighlight: "gutter",
  renderWhitespace: "selection",
  renderControlCharacters: true,
  renderIndentGuides: true,
  highlightActiveIndentGuide: true,
  bracketPairColorization: { enabled: true },
  
  // Performance settings
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",
  
  // Language-specific optimizations
  ...(language === 'javascript' || language === 'typescript' ? {
    semanticHighlighting: { enabled: true },
    hover: { enabled: true },
    colorDecorators: true,
  } : {}),
  
  // Memory optimization
  wordBasedSuggestions: "currentDocument",
  wordBasedSuggestionsOnlySameLanguage: true,
});

const defaultProject = [];

const buildPath = (parentPath, name) => (parentPath ? `${parentPath}/${name}` : name);

const extToLanguage = (filename = "") => {
  const ext = filename.split(".").pop().toLowerCase();
  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    py2: "python2",
    java: "java",
    cs: "csharp",
    cpp: "c++",
    c: "c",
    rs: "rust",
    go: "go",
    kt: "kotlin",
    kts: "kotlin",
    swift: "swift",
    rb: "ruby",
    php: "php",
    dart: "dart",
    scala: "scala",
    r: "rscript",
    jl: "julia",
    lua: "lua",
    hs: "haskell",
    pl: "perl",
    sh: "bash",
    bash: "bash",
    sql: "sqlite3",
    html: "html",
    htm: "html",
    css: "css",
    json: "json",
    xml: "xml",
    txt: "text",
  };
  return map[ext] || "javascript";
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const findNode = (nodes, path) => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.type === "folder" && node.children) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

const findFiles = (nodes, predicate, out = []) => {
  for (const n of nodes) {
    if (n.type === "file" && predicate(n)) out.push(n);
    if (n.type === "folder" && n.children) findFiles(n.children, predicate, out);
  }
  return out;
};

const collectAllFiles = (nodes, out = []) => {
  for (const n of nodes) {
    if (n.type === "file") out.push(n);
    if (n.type === "folder" && n.children) collectAllFiles(n.children, out);
  }
  return out;
};

const updateNodeContent = (nodes, path, cb) => {
  return nodes.map((n) => {
    if (n.path === path) return cb(n);
    if (n.type === "folder" && n.children) return { ...n, children: updateNodeContent(n.children, path, cb) };
    return n;
  });
};

const removeNodeByPath = (nodes, path) => {
  const out = [];
  for (const n of nodes) {
    if (n.path === path) continue;
    if (n.type === "folder") {
      out.push({ ...n, children: removeNodeByPath(n.children || [], path) });
    } else out.push(n);
  }
  return out;
};

const insertNodeAtParent = (nodes, parentPath, newNode) => {
  if (!parentPath) return [...nodes, newNode];
  return nodes.map((n) => {
    if (n.path === parentPath && n.type === "folder") {
      return { ...n, children: [...(n.children || []), newNode] };
    }
    if (n.type === "folder" && n.children) {
      return { ...n, children: insertNodeAtParent(n.children, parentPath, newNode) };
    }
    return n;
  });
};

/* ----------------------------- Component ----------------------------- */

const CodeEditor = ({ project: currentProject = null, onProjectChange = () => {}, onActiveFileChange = null }) => {
  const editorRef = useRef();
  const monacoRef = useRef();
  const toast = useToast();
  const memoryMonitor = useRef(new MemoryMonitor());
  const cleanupManager = useRef(new CleanupManager());

  const storageKey = useMemo(() => {
    const pid = currentProject?._id || currentProject?.id || 'default';
    return `ide_project_v2_${pid}`;
  }, [currentProject]);

  const [project, setProject] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem("ide_project_v2");
      return saved ? JSON.parse(saved) : defaultProject;
    } catch (e) {
      return defaultProject;
    }
  });

  const [selectedPath, setSelectedPath] = useState(() => {
    // choose first file
    const files = collectAllFiles(project);
    return files.length ? files[0].path : project[0]?.path;
  });

  const [value, setValue] = useState(() => {
    const f = findNode(project, selectedPath);
    return (f && f.content) || "";
  });

  const [language, setLanguage] = useState(() => {
    const f = findNode(project, selectedPath);
    return f ? extToLanguage(f.name) : "javascript";
  });

  const [dirHandle, setDirHandle] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [outputOpen, setOutputOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('general'); // Simple general panel
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [openTabs, setOpenTabs] = useState(() => {
    const files = collectAllFiles(project);
    return files.length > 0 ? [{ path: files[0].path, name: files[0].name, content: files[0].content }] : [];
  });
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Debounced update functions for performance
  const debouncedProjectUpdate = useCallback(
    debounce((newProject) => {
      try {
        const serializable = JSON.parse(JSON.stringify(newProject, (k, v) => (k === "handle" ? undefined : v)));
        localStorage.setItem(storageKey, JSON.stringify(serializable));
      } catch (e) {
        console.warn('Failed to save project to localStorage:', e);
      }
    }, 500),
    [storageKey]
  );

  const debouncedContentUpdate = useCallback(
    debounce((path, content) => {
      setProject((prev) => updateNodeContent(prev, path, (n) => ({ ...n, content })));
    }, 200),
    []
  );

  /* --------------------------- Persistence --------------------------- */
  useEffect(() => {
    debouncedProjectUpdate(project);
  }, [project, debouncedProjectUpdate]);

  // Auto-open bottom panel whenever either Output or Preview is enabled
  useEffect(() => {
    if ((outputOpen || previewOpen) && !bottomPanelOpen) {
      setBottomPanelOpen(true);
    }
  }, [outputOpen, previewOpen]);

  // Reload per-project workspace when currentProject changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      let nextTree = saved ? JSON.parse(saved) : defaultProject;
      // If no files exist for this project, scaffold defaults
      if (!nextTree || nextTree.length === 0) {
        const scaffold = [
          { name: 'index.html', type: 'file', path: 'index.html', content: `<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\"/>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>\n    <title>New Project</title>\n    <link rel=\"stylesheet\" href=\"style.css\"/>\n  </head>\n  <body>\n    <h1>Hello Codexa 👋</h1>\n    <p>Edit <code>script.js</code> and see changes live.</p>\n    <script src=\"script.js\"></script>\n  </body>\n</html>` },
          { name: 'style.css', type: 'file', path: 'style.css', content: `body{font-family:ui-sans-serif,system-ui;line-height:1.5;margin:2rem;background:#0b1220;color:#e5e7eb}h1{color:#60a5fa}` },
          { name: 'script.js', type: 'file', path: 'script.js', content: `document.addEventListener('DOMContentLoaded',()=>{console.log('🚀 Project ready!')});` }
        ];
        nextTree = scaffold;
        try { localStorage.setItem(storageKey, JSON.stringify(scaffold)); } catch(_) {}
      }
      setProject(nextTree);
      const files = collectAllFiles(nextTree);
      const firstPath = files.length ? files[0].path : nextTree[0]?.path || "";
      setSelectedPath(firstPath || "");
      const firstNode = firstPath ? findNode(nextTree, firstPath) : null;
      setValue(firstNode?.content || "");
      setLanguage(firstNode ? extToLanguage(firstNode.name) : "javascript");
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  /* ------------------------- Memory Management ------------------------ */
  useEffect(() => {
    // Start memory monitoring
    memoryMonitor.current.startMonitoring(10000); // Every 10 seconds
    
    // Setup automatic cleanup
    const removeAutoCleanup = cleanupManager.current.setupAutoCleanup();
    
    // Register cleanup tasks
    const unregisterEditor = cleanupManager.current.register(() => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
      if (monacoRef.current) {
        monacoRef.current.editor?.getModels()?.forEach(model => model.dispose());
      }
    }, 'Monaco Editor cleanup');
    
    const unregisterMemoryMonitor = cleanupManager.current.register(() => {
      memoryMonitor.current.stopMonitoring();
    }, 'Memory monitor cleanup');
    
    // Cleanup on component unmount
    return () => {
      memoryMonitor.current.stopMonitoring();
      removeAutoCleanup();
      unregisterEditor();
      unregisterMemoryMonitor();
      cleanupManager.current.executeAll();
    };
  }, []);
  
  // Trigger garbage collection after large operations
  useEffect(() => {
    if (project.length > 50) { // For large projects
      scheduleGC(3000);
    }
  }, [project]);

  /* ------------------------ Update when select changes ------------------------ */
  useEffect(() => {
    const node = findNode(project, selectedPath);
    if (node) {
      setValue(node.content ?? CODE_SNIPPETS[extToLanguage(node.name)] ?? "");
      setLanguage(extToLanguage(node.name));
    }
  }, [selectedPath, project]);

  // Notify parent about currently active file (path, language, content)
  useEffect(() => {
    if (typeof onActiveFileChange === 'function') {
      const node = findNode(project, selectedPath);
      onActiveFileChange({
        path: selectedPath || '',
        language: node ? extToLanguage(node.name) : language,
        content: value || ''
      });
    }
    // Do NOT include `project` as a dependency to avoid deep reference changes
    // that can trigger unnecessary parent updates.
  }, [onActiveFileChange, selectedPath, value, language]);

  /* ----------------------------- Editor mount ----------------------------- */
  const beforeMount = useCallback((monaco) => {
    // Configure Monaco editor for VS Code-like performance
    monacoRef.current = monaco;
    
    // Setup all Monaco enhancements
    enhanceMonacoEditor(monaco, null);
    
    // Add useful keybindings for VS Code-like experience
    monaco.editor.addKeybindingRules([
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP,
        command: 'workbench.action.quickOpen'
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
        command: 'workbench.action.showCommands'
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
        command: 'actions.find'
      }
    ]);
  }, []);

  const onMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);
    
    // Configure editor instance for optimal performance
    editor.updateOptions(getEditorOptions(language));
    
    // Apply all Monaco enhancements to the editor instance
    enhanceMonacoEditor(monaco, editor);
    
    // Add advanced actions
    editor.addAction({
      id: 'format-document',
      label: 'Format Document',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI
      ],
      run: () => {
        editor.getAction('editor.action.formatDocument')?.run();
      }
    });
    
    editor.addAction({
      id: 'toggle-comment',
      label: 'Toggle Comment',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash
      ],
      run: () => {
        editor.getAction('editor.action.commentLine')?.run();
      }
    });
    
    // Add multi-cursor support
    editor.addAction({
      id: 'add-cursor-above',
      label: 'Add Cursor Above',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.UpArrow
      ],
      run: () => {
        editor.getAction('editor.action.insertCursorAbove')?.run();
      }
    });
    
    editor.addAction({
      id: 'add-cursor-below',
      label: 'Add Cursor Below',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.DownArrow
      ],
      run: () => {
        editor.getAction('editor.action.insertCursorBelow')?.run();
      }
    });
    
    // Focus the editor
    editor.focus();
  }, [language]);

  const onSelectLanguage = (lang) => {
    setLanguage(lang);
    // if file empty, populate snippet
    if (!value || value.trim() === "") {
      const snippet = CODE_SNIPPETS[lang] || "";
      setValue(snippet);
      setProject((p) => updateNodeContent(p, selectedPath, (n) => ({ ...n, content: snippet })));
    }
  };

  /* ------------------------------- File I/O ------------------------------ */

  // Recursively read directory and return nodes. basePath is used to prefix paths (useful for importing into a folder)
  const readDir = async (dirHandleParam, basePath = "") => {
    const children = [];
    for await (const [name, entry] of dirHandleParam.entries()) {
      const path = buildPath(basePath, name);
      if (entry.kind === "file") {
        try {
          const file = await entry.getFile();
          const text = await file.text();
          children.push({ name, type: "file", path, content: text, handle: entry });
        } catch (e) {
          children.push({ name, type: "file", path, content: "", handle: entry });
        }
      } else if (entry.kind === "directory") {
        const inner = await readDir(entry, path);
        children.push({ name, type: "folder", path, children: inner, handle: entry });
      }
    }
    return children;
  };

  // Open folder and replace project, or import into selected folder (merge)
  const handleOpenFolder = async (options = { importIntoSelected: false }) => {
    if (!window.showDirectoryPicker) {
      toast({ title: "File System Access API not supported", status: "warning", isClosable: true });
      return;
    }
    try {
      const handle = await window.showDirectoryPicker();
      if (!handle) return;
      setDirHandle(handle);

      const basePath = options.importIntoSelected ? selectedPath && findNode(project, selectedPath)?.type === "folder" ? selectedPath : "" : "";
      const treeChildren = await readDir(handle, basePath);

      if (!options.importIntoSelected) {
        // replace project
        setProject(treeChildren.length ? treeChildren : []);
        if (treeChildren.length) setSelectedPath(treeChildren[0].path);
        toast({ title: "Folder opened (replaced project)", status: "success", isClosable: true });
      } else {
        // import: merge treeChildren into selected folder
        if (!basePath) {
          // no selected folder -> append to root
          setProject((prev) => [...prev, ...treeChildren]);
          toast({ title: "Folder imported at root", status: "success", isClosable: true });
        } else {
          // insert under parent path
          setProject((prev) => {
            // find selectedPath node, ensure it's a folder; if it's a file replace with a folder
            const node = findNode(prev, basePath);
            if (!node) {
              // fallback append
              return [...prev, ...treeChildren];
            }
            // if selected is a file, create a folder with that filename? better to insert into its parent
            if (node.type === "file") {
              // put under parent folder
              const parentPath = basePath.includes("/") ? basePath.replace(/\/[^/]*$/, "") : "";
              return insertNodeAtParent(prev, parentPath, { name: "imported", type: "folder", path: buildPath(parentPath, "imported"), children: treeChildren });
            }
            // selected is folder -> merge children into it
            return prev.map((n) => {
              if (n.path === basePath && n.type === "folder") {
                return { ...n, children: [...(n.children || []), ...treeChildren] };
              }
              if (n.type === "folder" && n.children) {
                return { ...n, children: insertNodeAtParent(n.children, basePath, treeChildren).children || insertNodeAtParent(n.children, basePath, treeChildren) };
              }
              return n;
            });
          });
          toast({ title: `Folder imported into "${basePath}"`, status: "success", isClosable: true });
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Folder open canceled or failed", status: "error", isClosable: true });
    }
  };

  // Save current file (writes to disk if handle exists)
  const handleSave = async () => {
    // update in-memory first
    setProject((prev) => updateNodeContent(prev, selectedPath, (n) => ({ ...n, content: value })));
    const node = findNode(project, selectedPath);
    if (node && node.handle && node.handle.createWritable) {
      try {
        const writable = await node.handle.createWritable();
        await writable.write(value);
        await writable.close();
        toast({ title: "Saved to disk", status: "success", isClosable: true });
      } catch (e) {
        console.error(e);
        toast({ title: "Failed to save to disk", status: "error", isClosable: true });
      }
    } else {
      toast({ title: "Saved (localStorage)", status: "success", isClosable: true });
    }
  };

  // Save all files that have handles (and update in-memory for the rest)
  const handleSaveAll = async () => {
    // update in-memory from current editor
    setProject((prev) => updateNodeContent(prev, selectedPath, (n) => ({ ...n, content: value })));
    const files = collectAllFiles(project);
    let savedCount = 0;
    for (const f of files) {
      if (f.handle && f.handle.createWritable) {
        try {
          const writable = await f.handle.createWritable();
          await writable.write(f.content ?? "");
          await writable.close();
          savedCount++;
        } catch (e) {
          console.warn("Failed to save", f.path, e);
        }
      }
    }
    toast({ title: `Saved ${savedCount} files to disk (others saved to localStorage)`, status: "success", isClosable: true });
  };

  const handleNewFile = async (parentPath = "") => {
    const name = prompt("Enter new file name (example: index.html):");
    if (!name) return;
    const path = buildPath(parentPath, name);
    const content = CODE_SNIPPETS[extToLanguage(name)] || "";
    const newNode = { name, type: "file", path, content, handle: null };
    setProject((prev) => insertNodeAtParent(prev, parentPath, newNode));
    
    // Add to tabs and switch to it
    const newTab = { path, name, content };
    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabIndex(openTabs.length);
    
    setSelectedPath(path);
    setValue(content);
    setLanguage(extToLanguage(name));
  };

  const handleNewFolder = async (parentPath = "") => {
    const name = prompt("Enter new folder name:");
    if (!name) return;
    const path = buildPath(parentPath, name);
    const newNode = { name, type: "folder", path, children: [], handle: null };
    setProject((prev) => insertNodeAtParent(prev, parentPath, newNode));
    toast({ title: `Folder "${name}" created`, status: "success", isClosable: true });
  };

  const handleDelete = (path) => {
    if (!confirm(`Delete "${path}" ? This can't be undone.`)) return;
    setProject((prev) => {
      const newp = removeNodeByPath(prev, path);
      if (selectedPath === path) {
        const next = collectAllFiles(newp)[0];
        setSelectedPath(next ? next.path : "");
      }
      return newp;
    });
    toast({ title: "Deleted", status: "info", isClosable: true });
  };

  const handleRename = (path) => {
    const node = findNode(project, path);
    if (!node) return;
    const newName = prompt("New name:", node.name);
    if (!newName || newName === node.name) return;
    const newPath = path.includes("/") ? path.replace(/[^/]*$/, newName) : newName;

    const rewrite = (nodes) =>
      nodes.map((n) => {
        if (n.path === path) {
          const updated = { ...n, name: newName, path: newPath };
          if (n.type === "folder" && n.children) {
            const updateChildrenPaths = (children, oldPrefix, newPrefix) =>
              children.map((c) => {
                const childNewPath = c.path.replace(oldPrefix, newPrefix);
                const updatedChild = { ...c, path: childNewPath };
                if (c.type === "folder") updatedChild.children = updateChildrenPaths(c.children || [], oldPrefix, newPrefix);
                return updatedChild;
              });
            updated.children = updateChildrenPaths(n.children || [], path + "/", newPath + "/");
          }
          return updated;
        }
        if (n.type === "folder" && n.children) {
          return { ...n, children: rewrite(n.children) };
        }
        return n;
      });

    setProject((prev) => rewrite(prev));
    if (selectedPath === path) setSelectedPath(newPath);
    toast({ title: "Renamed", status: "success", isClosable: true });
  };

  const handleFileSelect = (path) => {
    const node = findNode(project, path);
    if (!node) return;
    addOrSwitchToTab(path);
    setSelectedPath(path);
    setValue(node.content ?? CODE_SNIPPETS[extToLanguage(node.name)] ?? "");
    setLanguage(extToLanguage(node.name));
  };

  const handleEditorChange = useCallback((val) => {
    setValue(val);
    // Use debounced update to avoid excessive state updates
    debouncedContentUpdate(selectedPath, val);
    
    // Update current tab content
    setOpenTabs(prev => prev.map((tab, index) => 
      index === activeTabIndex ? { ...tab, content: val } : tab
    ));
  }, [selectedPath, debouncedContentUpdate, activeTabIndex]);

  /* ------------------------------- Command Execution ----------------------------- */
  const executeCommand = useCallback((command) => {
    switch (command.id) {
      case 'file.new':
        handleNewFile("");
        break;
      case 'file.save':
        handleSave();
        break;
      case 'file.saveAll':
        handleSaveAll();
        break;
      case 'file.open':
      case 'project.openFolder':
        handleOpenFolder({ importIntoSelected: false });
        break;
      case 'project.newFolder':
        handleNewFolder("");
        break;
      case 'edit.find':
        setIsSearchOpen(true);
        break;
      case 'edit.replace':
        setIsSearchOpen(true);
        break;
      case 'edit.format':
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.formatDocument')?.run();
        }
        break;
      case 'edit.toggleComment':
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.commentLine')?.run();
        }
        break;
      case 'view.togglePreview':
        setPreviewOpen(prev => !prev);
        break;
      case 'view.toggleOutput':
        setOutputOpen(prev => !prev);
        break;
      case 'view.toggleTerminal':
        setIsTerminalOpen(prev => !prev);
        break;
      case 'selection.selectAll':
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.selectAll')?.run();
        }
        break;
      case 'selection.addCursorAbove':
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.insertCursorAbove')?.run();
        }
        break;
      case 'selection.addCursorBelow':
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.insertCursorBelow')?.run();
        }
        break;
      default:
        console.log('Command not implemented:', command.id);
    }
  }, [handleNewFile, handleSave, handleSaveAll, handleOpenFolder, handleNewFolder]);

  /* ------------------------------- Tab Management -------------------------------- */
  const handleTabChange = useCallback((index) => {
    setActiveTabIndex(index);
    const tab = openTabs[index];
    if (tab) {
      setSelectedPath(tab.path);
      setValue(tab.content || "");
      setLanguage(extToLanguage(tab.name));
    }
  }, [openTabs]);

  const handleTabClose = useCallback((index) => {
    const newTabs = openTabs.filter((_, i) => i !== index);
    setOpenTabs(newTabs);
    
    if (newTabs.length === 0) {
      setSelectedPath("");
      setValue("");
      setActiveTabIndex(0);
    } else {
      const newActiveIndex = Math.min(activeTabIndex, newTabs.length - 1);
      setActiveTabIndex(newActiveIndex);
      const tab = newTabs[newActiveIndex];
      if (tab) {
        setSelectedPath(tab.path);
        setValue(tab.content || "");
        setLanguage(extToLanguage(tab.name));
      }
    }
  }, [openTabs, activeTabIndex]);

  const handleNewTab = useCallback(() => {
    handleNewFile("");
  }, []);

  const addOrSwitchToTab = useCallback((filePath) => {
    const node = findNode(project, filePath);
    if (!node || node.type !== 'file') return;

    const existingIndex = openTabs.findIndex(tab => tab.path === filePath);
    if (existingIndex !== -1) {
      // Tab already exists, switch to it
      setActiveTabIndex(existingIndex);
    } else {
      // Add new tab
      const newTab = {
        path: filePath,
        name: node.name,
        content: node.content || ""
      };
      setOpenTabs(prev => [...prev, newTab]);
      setActiveTabIndex(openTabs.length);
    }
  }, [project, openTabs]);

  /* ------------------------------- File Operations Update -------------------------------- */
  const handleNavigateToResult = useCallback((filePath, range) => {
    // Switch to the file
    const node = findNode(project, filePath);
    if (node) {
      setSelectedPath(filePath);
      setValue(node.content || "");
      setLanguage(extToLanguage(node.name));
      
      // After editor updates, navigate to the range
      setTimeout(() => {
        if (editorRef.current && range) {
          editorRef.current.setPosition({
            lineNumber: range.startLineNumber,
            column: range.startColumn
          });
          editorRef.current.revealLineInCenter(range.startLineNumber);
          editorRef.current.setSelection(range);
          editorRef.current.focus();
        }
      }, 100);
    }
  }, [project]);
  
  /* ------------------------------- Performance Optimization -------------------------------- */
  const handleOptimizePerformance = useCallback(() => {
    // Clear Monaco editor caches
    if (monacoRef.current) {
      const models = monacoRef.current.editor.getModels();
      models.forEach(model => {
        // Clear markers
        monacoRef.current.editor.setModelMarkers(model, 'optimization', []);
      });
    }
    
    // Clear project content cache for unused files
    const unusedFiles = collectAllFiles(project).filter(file => file.path !== selectedPath);
    if (unusedFiles.length > 20) {
      // Clear content for files not accessed recently
      setProject(prev => {
        return prev.map(node => {
          if (node.type === 'file' && node.path !== selectedPath) {
            return { ...node, content: node.content ? '' : node.content };
          }
          return node;
        });
      });
    }
    
    // Trigger garbage collection
    scheduleGC(1000);
    
    toast({
      title: "Performance Optimized",
      description: "Memory and caches have been cleared",
      status: "success",
      duration: 3000,
      isClosable: true
    });
  }, [project, selectedPath, toast]);

  /* --------------------------- Live preview building --------------------------- */

  const findFileByBasename = useCallback((basename) => {
    const all = collectAllFiles(project);
    return all.find((f) => f.name === basename || f.path.endsWith("/" + basename) || f.path === basename);
  }, [project]);

  const allFiles = useMemo(() => collectAllFiles(project), [project]);
  const allCssFiles = useMemo(() => allFiles.filter((f) => f.name.toLowerCase().endsWith(".css")), [allFiles]);
  const allJsFiles = useMemo(() => allFiles.filter((f) => f.name.toLowerCase().endsWith(".js")), [allFiles]);
  const allHtmlFiles = useMemo(() => allFiles.filter((f) => f.name.toLowerCase().endsWith(".html") || f.name.toLowerCase().endsWith(".htm")), [allFiles]);

  const inlineAssetsInHtml = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Inline <link rel="stylesheet" href="...">
      const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      const inlinedCssNames = new Set();
      for (const link of links) {
        const href = link.getAttribute("href") || "";
        const basename = href.split("/").pop();
        const match = findFileByBasename(basename);
        if (match) {
          const styleEl = doc.createElement("style");
          styleEl.textContent = match.content || "";
          link.replaceWith(styleEl);
          inlinedCssNames.add(match.path);
        }
      }

      // Inline <script src="...">
      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      const inlinedJsNames = new Set();
      for (const scr of scripts) {
        const src = scr.getAttribute("src") || "";
        const basename = src.split("/").pop();
        const match = findFileByBasename(basename);
        if (match) {
          const inlineScript = doc.createElement("script");
          inlineScript.textContent = match.content || "";
          scr.replaceWith(inlineScript);
          inlinedJsNames.add(match.path);
        }
      }

      // After inlining, append any unreferenced CSS files into head
      const allCssFiles = collectAllFiles(project).filter((f) => f.name.toLowerCase().endsWith(".css"));
      const extraCss = allCssFiles.filter((f) => !inlinedCssNames.has(f.path)).map((f) => f.content || "").join("\n\n");
      if (extraCss.trim().length > 0) {
        const styleEl = doc.createElement("style");
        styleEl.textContent = extraCss;
        doc.head.appendChild(styleEl);
      }

      // Append any unreferenced JS files at the end of body
      const allJsFiles = collectAllFiles(project).filter((f) => f.name.toLowerCase().endsWith(".js"));
      const extraJs = allJsFiles.filter((f) => !inlinedJsNames.has(f.path)).map((f) => f.content || "").join("\n\n");
      if (extraJs.trim().length > 0) {
        const scriptEl = doc.createElement("script");
        scriptEl.textContent = extraJs;
        doc.body.appendChild(scriptEl);
      }

      return "<!doctype html>\n" + doc.documentElement.outerHTML;
    } catch (e) {
      // fallback: return original html
      console.warn("Inlining failed", e);
      return html;
    }
  };

  const buildFallbackFromJs = useCallback((jsContent) => {
    const cssContent = allCssFiles.map((f) => f.content || "").join("\n\n");
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JS Preview</title>
    <style>${cssContent}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${jsContent}
    </script>
  </body>
</html>`;
  }, [allCssFiles]);

  const previewSrcDoc = useMemo(() => {
    // 1) If the currently selected file is an HTML file, prioritize it
    const selectedNode = findNode(project, selectedPath);
    if (selectedNode && selectedNode.name && selectedNode.name.toLowerCase().endsWith(".html")) {
      return inlineAssetsInHtml(selectedNode.content || "");
    }

    // 2) Otherwise, if there's an index.html anywhere, use it as the main preview
    const indexFile = allHtmlFiles.find((f) => f.name.toLowerCase() === "index.html") || 
                     allHtmlFiles.find((f) => f.name.toLowerCase() === "index.htm");
    if (indexFile && indexFile.content) {
      return inlineAssetsInHtml(indexFile.content);
    }

    // 3) Otherwise, fallback to the first HTML file found in the tree
    const anyHtml = allHtmlFiles[0];
    if (anyHtml) return inlineAssetsInHtml(anyHtml.content || "");

    // If selected js -> wrap
    if (selectedNode && selectedNode.name && selectedNode.name.toLowerCase().endsWith(".js")) {
      return buildFallbackFromJs(selectedNode.content || "");
    }

    // Else if there's any js file, combine with css
    const jsFile = allJsFiles[0];
    if (jsFile) return buildFallbackFromJs(jsFile.content || "");

    // No preview available
    return "";
  }, [project, selectedPath, allHtmlFiles, allJsFiles, buildFallbackFromJs]);

  // Function to open standalone preview
  const openStandalonePreview = () => {
    // Save the preview content to localStorage
    try {
      localStorage.setItem('ide_preview_content', previewSrcDoc);
    } catch (e) {
      console.warn('Failed to save preview content to localStorage:', e);
    }
    
    // Navigate to the preview page
    window.open(`/preview`, '_blank');
  };

  /* --------------------------- Keyboard shortcuts -------------------------- */

  useEffect(() => {
    const handler = (e) => {
      const metaKey = e.ctrlKey || e.metaKey;
      if (!metaKey) return;
      
      // Command Palette (Ctrl/Cmd+Shift+P)
      if (e.key.toLowerCase() === "p" && e.shiftKey) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }
      
      // Find (Ctrl/Cmd+F)
      if (e.key.toLowerCase() === "f" && !e.shiftKey) {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }
      
      // Save (Ctrl/Cmd+S)
      if (e.key.toLowerCase() === "s" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
        return;
      }
      
      // Save All (Ctrl+Shift+S)
      if (e.key.toLowerCase() === "s" && e.shiftKey) {
        e.preventDefault();
        handleSaveAll();
        return;
      }
      
      // Toggle preview (Ctrl/Cmd+P)
      if (e.key.toLowerCase() === "p" && !e.shiftKey) {
        e.preventDefault();
        setPreviewOpen((v) => !v);
        return;
      }
      
      // Quick Open File (Ctrl/Cmd+O)
      if (e.key.toLowerCase() === "o" && !e.shiftKey) {
        e.preventDefault();
        handleOpenFolder({ importIntoSelected: false });
        return;
      }
      
      // New File (Ctrl/Cmd+N)
      if (e.key.toLowerCase() === "n" && !e.shiftKey) {
        e.preventDefault();
        handleNewFile("");
        return;
      }
      
      // Toggle Terminal (Ctrl+`)
      if (e.key === "`" && !e.shiftKey) {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
        return;
      }
      
      // Toggle Output (Ctrl+Shift+O)
      if (e.key.toLowerCase() === "o" && e.shiftKey) {
        e.preventDefault();
        setOutputOpen(prev => !prev);
        return;
      }
      
      // Open Standalone Preview (Ctrl/Cmd+Shift+P)
      if (e.key.toLowerCase() === "v" && e.shiftKey) {
        e.preventDefault();
        openStandalonePreview();
        return;
      }
    };
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave, handleSaveAll, handleOpenFolder, handleNewFile, openStandalonePreview]);

  /* ------------------------------- Tree UI -------------------------------- */
  // Using VirtualizedTree component for better performance

  /* ----------------------------- Render UI ------------------------------ */

  return (
    <div className="h-full bg-monaco-bg text-monaco-text flex flex-col">
      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onExecuteCommand={executeCommand}
      />

      {/* Advanced Search */}
      <AdvancedSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        editorRef={editorRef}
        project={project}
        onNavigateToResult={handleNavigateToResult}
      />

      {/* Top Toolbar - Made responsive */}
      <div className="h-12 bg-monaco-sidebar border-b border-monaco-border flex items-center justify-between px-4 flex-wrap gap-2">
        <div className="flex items-center space-x-4 flex-wrap">
          <h1 className="text-lg font-semibold text-monaco-text">Codexa IDE</h1>
          <LanguageSelector language={language} onSelect={onSelectLanguage} />
        </div>
        <div className="flex items-center flex-wrap gap-1">
          <Tooltip label="Command Palette (Ctrl+Shift+P)">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<span className="text-lg">⌘</span>}
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="command-palette"
            />
          </Tooltip>
          <Tooltip label="Search (Ctrl+F)">
            <IconButton 
              size="sm" 
              variant="ghost"
              icon={<SearchIcon />} 
              onClick={() => setIsSearchOpen(true)}
              aria-label="search"
            />
          </Tooltip>
          <Button size="sm" onClick={handleSave} variant="primary" className="hidden sm:inline-block">
            Save
          </Button>
          <Button size="sm" onClick={handleSaveAll} variant="secondary" className="hidden sm:inline-block">
            Save All
          </Button>
          <Tooltip label="Toggle Bottom Panel">
            <IconButton 
              size="sm" 
              variant={bottomPanelOpen ? "ghost" : "primary"}
              icon={<span className="text-lg">▾</span>} 
              onClick={() => setBottomPanelOpen(v => !v)}
              aria-label="toggle-bottom-panel"
            />
          </Tooltip>
          <Tooltip label="Toggle Terminal (Ctrl+`)">
            <IconButton 
              size="sm" 
              variant={isTerminalOpen ? "primary" : "ghost"}
              icon={<span className="text-lg">⌨️</span>} 
              onClick={() => setIsTerminalOpen((v) => !v)}
              aria-label="toggle-terminal"
            />
          </Tooltip>
          <PerformanceDashboard
            memoryMonitor={memoryMonitor.current}
            editorRef={editorRef}
            project={project}
            onOptimize={handleOptimizePerformance}
          />
        </div>
      </div>

      {/* Main Content Area - Made responsive */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section - Editor Area with Sidebar and Right Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar - Made responsive */}
          <div className="w-full md:w-80 bg-monaco-sidebar border-r border-monaco-border flex flex-col min-h-0">
            {/* File Explorer Header */}
            <div className="h-12 flex items-center px-4 border-b border-monaco-border flex-shrink-0 bg-monaco-sidebar">
              <h3 className="text-sm font-semibold text-monaco-text">File Explorer</h3>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
              <VirtualizedTree
                project={project}
                selectedPath={selectedPath}
                onFileSelect={handleFileSelect}
                onRename={handleRename}
                onDelete={handleDelete}
                onNewFile={handleNewFile}
                onNewFolder={handleNewFolder}
              />
            </div>
          </div>

          {/* Editor Area - Responsive width */}
          <div className="flex-1 flex flex-col bg-monaco-bg min-h-0">
            {/* TabManager */}
            <div className="flex-shrink-0">
              <TabManager
                tabs={openTabs}
                activeTabIndex={activeTabIndex}
                onTabChange={handleTabChange}
                onTabClose={handleTabClose}
                onNewTab={handleNewTab}
              />
            </div>

            {/* Monaco Editor Container - Responsive height */}
            <div className={`flex-1 flex flex-col min-h-0 ${isTerminalOpen ? 'h-1/2' : 'h-full'}`}>
              <Editor
                beforeMount={beforeMount}
                onMount={onMount}
                options={getEditorOptions(language)}
                height="100%"
                theme="vscode-dark-optimized"
                language={language}
                value={value}
                onChange={handleEditorChange}
                loading={<div className="p-4 flex items-center justify-center h-full"><span className="text-monaco-text">Loading Monaco Editor...</span></div>}
              />
            </div>

            {/* Integrated Terminal - Responsive */}
            {isTerminalOpen && (
              <div className="h-1/3 md:h-1/2 border-t border-monaco-border flex-shrink-0 min-h-0">
                <IntegratedTerminal
                  isOpen={true}
                  onToggle={() => setIsTerminalOpen(false)}
                  fileList={collectAllFiles(project).map(f => f.path)}
                  onFsCommand={({ action, name, oldName, newName }) => {
                    if (action === 'createFile') {
                      const path = name;
                      const content = CODE_SNIPPETS[extToLanguage(name)] || '';
                      const newNode = { name, type: 'file', path, content, handle: null };
                      setProject(prev => insertNodeAtParent(prev, '', newNode));
                    } else if (action === 'createDir') {
                      const path = name;
                      const newNode = { name, type: 'folder', path, children: [], handle: null };
                      setProject(prev => insertNodeAtParent(prev, '', newNode));
                    } else if (action === 'delete') {
                      setProject(prev => removeNodeByPath(prev, name));
                    } else if (action === 'rename') {
                      const path = oldName;
                      const node = findNode(project, path);
                      if (!node) return;
                      const newPath = path.includes('/') ? path.replace(/[^/]*$/, newName) : newName;
                      const rewrite = (nodes) => nodes.map(n => {
                        if (n.path === path) {
                          const updated = { ...n, name: newName, path: newPath };
                          if (n.type === 'folder' && n.children) {
                            const updateChildrenPaths = (children, oldPrefix, newPrefix) => children.map(c => {
                              const childNewPath = c.path.replace(oldPrefix, newPrefix);
                              const updatedChild = { ...c, path: childNewPath };
                              if (c.type === 'folder') updatedChild.children = updateChildrenPaths(c.children || [], oldPrefix, newPrefix);
                              return updatedChild;
                            });
                            updated.children = updateChildrenPaths(n.children || [], path + '/', newPath + '/');
                          }
                          return updated;
                        }
                        if (n.type === 'folder' && n.children) return { ...n, children: rewrite(n.children) };
                        return n;
                      });
                      setProject(prev => rewrite(prev));
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Panel - Output & Preview - Made responsive */}
        {bottomPanelOpen && (
          <div className="h-64 md:h-80 border-t border-monaco-border bg-monaco-sidebar flex flex-col">
            {/* Bottom Panel Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-monaco-border flex-shrink-0">
              <h3 className="text-sm font-semibold text-monaco-text">Output & Preview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-monaco-text-secondary hidden sm:inline">
                  Output: {outputOpen ? "on" : "off"} | Preview: {previewOpen ? "on" : "off"}
                </span>
                <Tooltip label="Toggle Output (Ctrl+Shift+O)">
                  <IconButton 
                    size="sm" 
                    variant={outputOpen ? "primary" : "ghost"}
                    icon={<span className="text-lg">📋</span>}
                    onClick={() => setOutputOpen((v) => !v)}
                    aria-label="toggle-output"
                  />
                </Tooltip>
                <Tooltip label="Toggle Preview">
                  <IconButton 
                    size="sm" 
                    variant={previewOpen ? "primary" : "ghost"}
                    icon={<ViewIcon />}
                    onClick={() => setPreviewOpen((v) => !v)}
                    aria-label="toggle-preview"
                  />
                </Tooltip>
                <Tooltip label="Standalone Preview (Ctrl+Shift+V)">
                  <IconButton 
                    size="sm" 
                    variant="ghost"
                    icon={<ExternalLinkIcon />}
                    onClick={openStandalonePreview}
                    aria-label="standalone-preview"
                  />
                </Tooltip>
                <Tooltip label="Collapse Panel">
                  <IconButton 
                    size="sm" 
                    variant="ghost"
                    icon={<span className="text-lg">—</span>}
                    onClick={() => setBottomPanelOpen(false)}
                    aria-label="collapse-panel"
                  />
                </Tooltip>
              </div>
            </div>

            {/* Bottom Panel Content - Responsive layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Output Section - Responsive */}
              {outputOpen && (
                <div className={`border-r border-monaco-border flex flex-col min-h-0 ${previewOpen ? 'md:w-1/2 h-1/2 md:h-full' : 'flex-1'}`}>
                  <div className="h-10 bg-monaco-bg border-b border-monaco-border flex items-center px-4 flex-shrink-0">
                    <h4 className="text-xs font-medium text-monaco-text uppercase tracking-wider">Console</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin p-4 min-h-0">
                    <Output editorRef={editorRef} language={language} />
                  </div>
                </div>
              )}

              {/* Preview Section - Responsive */}
              {previewOpen && (
                <div className={`flex flex-col min-h-0 ${outputOpen ? 'md:flex-1 h-1/2 md:h-full' : 'flex-1'}`}>
                  <div className="h-10 bg-monaco-bg border-b border-monaco-border flex items-center px-4 flex-shrink-0">
                    <h4 className="text-xs font-medium text-monaco-text uppercase tracking-wider">Live Preview</h4>
                  </div>
                  <div className="flex-1 bg-white min-h-0">
                    {(() => {
                      const srcDoc = previewSrcDoc;
                      if (!srcDoc) {
                        return (
                          <div className="p-4 h-full flex items-center justify-center text-center">
                            <div className="text-monaco-text-secondary">
                              <p className="mb-2">No preview content available</p>
                              <p className="text-xs">Add HTML, CSS, or JS files to preview</p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <iframe
                          title="live-preview"
                          srcDoc={srcDoc}
                          key={srcDoc.length}
                          className="w-full h-full border-0"
                          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-scripts allow-same-origin"
                        />
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Empty State when both are off */}
              {!outputOpen && !previewOpen && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-monaco-text-secondary">
                    <p className="mb-2">Output & Preview panels are hidden</p>
                    <p className="text-xs">Use the toggle buttons above to show them</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsed state bar removed to avoid extra space; panel can be reopened via toolbar button above */}
      </div>
    </div>
  );
};

export default CodeEditor;
