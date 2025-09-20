// monacoEnhancements.js - Advanced Monaco Editor features for VS Code-like experience
import workerManager from './workerManager';
export const configureMonacoThemes = (monaco) => {
  monaco.editor.defineTheme('vscode-dark-optimized', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
    ],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#2d2d30',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41',
    }
  });
};

// Enhanced syntax highlighting and error detection
export const setupLanguageFeatures = (monaco) => {
  // JavaScript/TypeScript enhanced features
  if (monaco.languages?.typescript) {
    // Configure JavaScript/TypeScript compiler options
    const jsOptions = {
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      checkJs: true,
      strict: false,
      noImplicitAny: false,
      typeRoots: ['node_modules/@types']
    };

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(jsOptions);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...jsOptions,
      strict: true,
      noImplicitAny: true,
    });

    // Enable semantic highlighting
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    // Configure diagnostics
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      onlyVisible: false,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      onlyVisible: false,
    });
  }

  // Enhanced HTML features
  if (monaco.languages?.html) {
    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        indentHandlebars: true,
        wrapLineLength: 120,
        unformatted: 'default"',
        contentUnformatted: 'pre,code,textarea',
        indentInnerHtml: false,
        preserveNewLines: true,
        maxPreserveNewLines: undefined,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        wrapAttributes: 'auto'
      },
      suggest: { html5: true },
      validate: true
    });
  }

  // Enhanced CSS features
  if (monaco.languages?.css) {
    monaco.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'warning',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'warning',
        boxModel: 'warning',
        universalSelector: 'warning',
        zeroUnits: 'warning',
        fontFaceProperties: 'warning',
        hexColorLength: 'warning',
        argumentsInColorFunction: 'warning',
        unknownProperties: 'warning',
        validProperties: []
      },
      completion: {
        triggerPropertyValueCompletion: true,
        completePropertyWithSemicolon: true
      }
    });
  }

  // Python syntax highlighting improvements
  if (monaco.languages?.register) {
    monaco.languages.setMonarchTokensProvider('python', {
      defaultToken: 'invalid',
      tokenPostfix: '.python',
      keywords: [
        'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else',
        'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
        'is', 'lambda', 'not', 'or', 'pass', 'print', 'raise', 'return', 'try', 'while',
        'with', 'yield', 'async', 'await', 'nonlocal'
      ],
      builtins: [
        'True', 'False', 'None', 'NotImplemented', 'Ellipsis', '__debug__',
        'quit', 'exit', 'copyright', 'license', 'credits'
      ],
      operators: [
        '+', '-', '*', '/', '//', '%', '**', '<<', '>>', '&', '|', '^', '~',
        '<', '>', '<=', '>=', '==', '!=', '<>', '=', '+=', '-=', '*=', '/=',
        '//=', '%=', '**=', '&=', '|=', '^=', '>>=', '<<='
      ],
      brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
      ],
      tokenizer: {
        root: [
          { include: '@whitespace' },
          { include: '@numbers' },
          { include: '@strings' },
          [/[,:;]/, 'delimiter'],
          [/[{}\[\]()]/, '@brackets'],
          [/@[a-zA-Z_]\w*/, 'tag'],
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@builtins': 'type.identifier',
              '@default': 'identifier'
            }
          }]
        ],
        whitespace: [
          [/\s+/, 'white'],
          [/(^#.*$)/, 'comment'],
        ],
        numbers: [
          [/0[xX][0-9a-fA-F]*/, 'number.hex'],
          [/0[oO]?[0-7]*/, 'number.octal'],
          [/0[bB][01]*/, 'number.binary'],
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/\d+[eE][\-+]?\d+/, 'number.float'],
          [/\d+/, 'number'],
        ],
        strings: [
          [/u?r?"""/, 'string', '@stringTriple'],
          [/u?r?"/, 'string', '@stringDouble'],
          [/u?r?'/, 'string', '@stringSingle']
        ],
        stringTriple: [
          [/[^"\\]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"""/, 'string', '@pop']
        ],
        stringDouble: [
          [/[^"\\]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop']
        ],
        stringSingle: [
          [/[^'\\]+/, 'string'],
          [/\\./, 'string.escape'],
          [/'/, 'string', '@pop']
        ]
      }
    });
  }
};

// Custom completion providers for enhanced IntelliSense
export const setupCompletionProviders = (monaco) => {
  // JavaScript/React completion provider
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      return {
        suggestions: [
          {
            label: 'console.log',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'console.log(${1:object});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Log output to console',
            range: range
          },
          {
            label: 'function',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'function ${1:name}(${2:params}) {\n\t${3:// body}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function declaration',
            range: range
          },
          {
            label: 'arrow function',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '(${1:params}) => {\n\t${2:// body}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Arrow function',
            range: range
          },
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useState hook',
            range: range
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'useEffect(() => {\n\t${1:// effect}\n\treturn () => {\n\t\t${2:// cleanup}\n\t};\n}, [${3:dependencies}]);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useEffect hook',
            range: range
          }
        ]
      };
    }
  });

  // HTML completion provider
  monaco.languages.registerCompletionItemProvider('html', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      return {
        suggestions: [
          {
            label: 'html5',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Document}</title>\n</head>\n<body>\n\t${2:content}\n</body>\n</html>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'HTML5 boilerplate',
            range: range
          },
          {
            label: 'div',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<div${1: class="${2:className}"}>\n\t${3:content}\n</div>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Div element with class',
            range: range
          }
        ]
      };
    }
  });

  // CSS completion provider
  monaco.languages.registerCompletionItemProvider('css', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      return {
        suggestions: [
          {
            label: 'flexbox',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Flexbox layout',
            range: range
          },
          {
            label: 'grid',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'display: grid;\ngrid-template-columns: ${1:repeat(auto-fit, minmax(250px, 1fr))};\ngap: ${2:1rem};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'CSS Grid layout',
            range: range
          }
        ]
      };
    }
  });
};

// Code formatting providers with web worker support
export const setupFormatProviders = (monaco) => {
  // JavaScript/TypeScript formatter
  monaco.languages.registerDocumentFormattingEditProvider('javascript', {
    provideDocumentFormattingEdits: async (model) => {
      const text = model.getValue();
      
      try {
        // Use worker for formatting
        const formatted = await workerManager.formatCode(text, 'javascript');
        
        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      } catch (error) {
        console.warn('Worker formatting failed, using fallback:', error);
        
        // Fallback formatting
        const formatted = text
          .replace(/;(\S)/g, '; $1')
          .replace(/,(\S)/g, ', $1')
          .replace(/\}(\S)/g, '} $1')
          .replace(/\{(\S)/g, '{ $1');

        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      }
    }
  });
  
  // TypeScript formatter (same as JavaScript)
  monaco.languages.registerDocumentFormattingEditProvider('typescript', {
    provideDocumentFormattingEdits: async (model) => {
      const text = model.getValue();
      
      try {
        const formatted = await workerManager.formatCode(text, 'typescript');
        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      } catch (error) {
        // Fallback
        const formatted = text
          .replace(/;(\S)/g, '; $1')
          .replace(/,(\S)/g, ', $1')
          .replace(/\}(\S)/g, '} $1')
          .replace(/\{(\S)/g, '{ $1');

        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      }
    }
  });

  // CSS formatter
  monaco.languages.registerDocumentFormattingEditProvider('css', {
    provideDocumentFormattingEdits: async (model) => {
      const text = model.getValue();
      
      try {
        const formatted = await workerManager.formatCode(text, 'css');
        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      } catch (error) {
        // Fallback formatting
        const formatted = text
          .replace(/\{/g, ' {\n  ')
          .replace(/\}/g, '\n}\n')
          .replace(/;/g, ';\n  ')
          .replace(/:\s*/g, ': ')
          .replace(/,/g, ',\n  ')
          .replace(/\n\s*\n/g, '\n')
          .trim();

        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      }
    }
  });
  
  // HTML formatter
  monaco.languages.registerDocumentFormattingEditProvider('html', {
    provideDocumentFormattingEdits: async (model) => {
      const text = model.getValue();
      
      try {
        const formatted = await workerManager.formatCode(text, 'html');
        return [{
          range: model.getFullModelRange(),
          text: formatted
        }];
      } catch (error) {
        // Return original text if formatting fails
        return [];
      }
    }
  });
};

// Error markers and diagnostics with web worker support
export const setupErrorDetection = (monaco, editor) => {
  if (!editor || !editor.getModel) return;
  
  let validationTimeout;
  
  // Debounced validation function
  const validateCode = async (model) => {
    const code = model.getValue();
    const language = model.getLanguageId();
    const uri = model.uri.toString();
    
    try {
      // Use worker for validation
      const result = await workerManager.validateCode(code, language, uri);
      
      // Convert worker results to Monaco markers
      const markers = result.errors.map(error => ({
        severity: error.severity === 'error' ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
        startLineNumber: error.line || 1,
        startColumn: 1,
        endLineNumber: error.line || 1,
        endColumn: 1000,
        message: error.message
      }));
      
      // Set markers on the model
      monaco.editor.setModelMarkers(model, 'worker-validation', markers);
      
    } catch (error) {
      console.warn('Worker validation failed, falling back to basic validation:', error);
      
      // Fallback to basic JavaScript validation
      if (language === 'javascript' || language === 'typescript') {
        try {
          new Function(code);
          monaco.editor.setModelMarkers(model, 'worker-validation', []);
        } catch (syntaxError) {
          const markers = [{
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1000,
            message: syntaxError.message
          }];
          monaco.editor.setModelMarkers(model, 'worker-validation', markers);
        }
      }
    }
  };
  
  // Set up model change listener with debouncing
  const model = editor.getModel();
  if (model) {
    model.onDidChangeContent(() => {
      clearTimeout(validationTimeout);
      validationTimeout = setTimeout(() => {
        validateCode(model);
      }, 500); // Debounce validation for 500ms
    });
    
    // Initial validation
    validateCode(model);
  }
};

// Performance monitoring for large files
export const setupPerformanceMonitoring = (monaco, editor) => {
  let lastPerformanceCheck = Date.now();
  
  const checkPerformance = () => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastPerformanceCheck;
    
    if (timeSinceLastCheck > 100) { // If operations are taking too long
      console.warn('Monaco Editor performance warning: Operations taking longer than expected');
    }
    
    lastPerformanceCheck = now;
  };

  if (editor) {
    editor.onDidChangeModelContent(checkPerformance);
    editor.onDidChangeCursorPosition(checkPerformance);
  }
};

// Export all enhancement functions
export const enhanceMonacoEditor = (monaco, editor) => {
  // Setup themes first
  configureMonacoThemes(monaco);
  setupLanguageFeatures(monaco);
  setupCompletionProviders(monaco);
  setupFormatProviders(monaco);
  
  // Only setup editor-specific features if editor is provided
  if (editor) {
    setupErrorDetection(monaco, editor);
    setupPerformanceMonitoring(monaco, editor);
  }
};