// fileProcessingWorker.js - Web Worker for background file processing tasks
/* eslint-env worker */

// Import necessary libraries for syntax validation
// Note: In a real implementation, you'd import actual parsers like @babel/parser for JS
// For now, we'll implement basic validation

class FileProcessor {
  constructor() {
    this.cache = new Map();
    this.isProcessing = false;
  }

  // Basic JavaScript syntax validation
  validateJavaScript(code) {
    try {
      // Use Function constructor for basic syntax check
      new Function(code);
      return { isValid: true, errors: [] };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          line: this.extractLineNumber(error.message),
          message: error.message,
          severity: 'error'
        }]
      };
    }
  }

  // Basic TypeScript-like validation
  validateTypeScript(code) {
    // Simple check for common TypeScript syntax
    const errors = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      // Check for basic TypeScript syntax issues
      if (line.includes('interface') && !line.includes('{') && !line.includes(';')) {
        errors.push({
          line: index + 1,
          message: 'Interface declaration incomplete',
          severity: 'warning'
        });
      }
      
      if (line.includes('type') && line.includes('=') && !line.includes(';')) {
        errors.push({
          line: index + 1,
          message: 'Type alias should end with semicolon',
          severity: 'warning'
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Basic Python syntax validation
  validatePython(code) {
    const errors = [];
    const lines = code.split('\n');
    let indentLevel = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      // Check indentation consistency
      const currentIndent = line.search(/\S/);
      if (currentIndent !== -1) {
        if (trimmed.endsWith(':')) {
          indentLevel = currentIndent + 4;
        } else if (currentIndent < indentLevel && !trimmed.startsWith('else') && !trimmed.startsWith('elif') && !trimmed.startsWith('except') && !trimmed.startsWith('finally')) {
          if (currentIndent % 4 !== 0) {
            errors.push({
              line: index + 1,
              message: 'Inconsistent indentation',
              severity: 'error'
            });
          }
        }
      }
      
      // Check for common syntax issues
      if (trimmed.includes('print ') && !trimmed.includes('print(')) {
        errors.push({
          line: index + 1,
          message: 'Use print() function instead of print statement',
          severity: 'warning'
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Basic HTML validation
  validateHTML(code) {
    const errors = [];
    const openTags = [];
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'];
    
    // Simple regex to find tags
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    let match;
    
    while ((match = tagRegex.exec(code)) !== null) {
      const tagName = match[1].toLowerCase();
      const isClosing = match[0].startsWith('</');
      const isSelfClosing = selfClosingTags.includes(tagName) || match[0].endsWith('/>');
      
      if (isClosing) {
        if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
          errors.push({
            line: this.getLineNumber(code, match.index),
            message: `Unexpected closing tag: ${tagName}`,
            severity: 'error'
          });
        } else {
          openTags.pop();
        }
      } else if (!isSelfClosing) {
        openTags.push(tagName);
      }
    }
    
    // Check for unclosed tags
    openTags.forEach(tag => {
      errors.push({
        line: 1,
        message: `Unclosed tag: ${tag}`,
        severity: 'warning'
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Basic CSS validation
  validateCSS(code) {
    const errors = [];
    const lines = code.split('\n');
    let braceLevel = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('/*')) return;
      
      braceLevel += (trimmed.match(/\{/g) || []).length;
      braceLevel -= (trimmed.match(/\}/g) || []).length;
      
      // Check for missing semicolons in property declarations
      if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.endsWith(';') && !trimmed.endsWith('{')) {
        errors.push({
          line: index + 1,
          message: 'Missing semicolon',
          severity: 'warning'
        });
      }
    });
    
    if (braceLevel !== 0) {
      errors.push({
        line: 1,
        message: 'Mismatched braces',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Extract line number from error message
  extractLineNumber(message) {
    const match = message.match(/line (\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  // Get line number from character position
  getLineNumber(text, position) {
    return text.substring(0, position).split('\n').length;
  }

  // Main validation function
  validateCode(code, language, filePath) {
    const cacheKey = `${filePath}:${code.length}:${language}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let result;
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'jsx':
        result = this.validateJavaScript(code);
        break;
      case 'typescript':
      case 'tsx':
        result = this.validateTypeScript(code);
        break;
      case 'python':
        result = this.validatePython(code);
        break;
      case 'html':
        result = this.validateHTML(code);
        break;
      case 'css':
        result = this.validateCSS(code);
        break;
      default:
        result = { isValid: true, errors: [] };
    }

    // Cache the result
    this.cache.set(cacheKey, result);
    
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return result;
  }

  // Process file content for autocomplete suggestions
  extractSymbols(code, language) {
    const symbols = {
      functions: [],
      variables: [],
      classes: [],
      imports: []
    };

    if (language === 'javascript' || language === 'typescript') {
      // Extract function declarations
      const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;
      while ((match = functionRegex.exec(code)) !== null) {
        symbols.functions.push(match[1]);
      }

      // Extract arrow functions
      const arrowFunctionRegex = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\([^)]*\)\s*)?=>/g;
      while ((match = arrowFunctionRegex.exec(code)) !== null) {
        symbols.functions.push(match[1]);
      }

      // Extract variable declarations
      const varRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      while ((match = varRegex.exec(code)) !== null) {
        symbols.variables.push(match[1]);
      }

      // Extract class declarations
      const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      while ((match = classRegex.exec(code)) !== null) {
        symbols.classes.push(match[1]);
      }

      // Extract imports
      const importRegex = /import\s+(?:\{[^}]+\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]+\}|\*\s+as\s+\w+|\w+))?\s+from\s+['"]([^'"]+)['"]/g;
      while ((match = importRegex.exec(code)) !== null) {
        symbols.imports.push(match[1]);
      }
    }

    return symbols;
  }

  // Format code based on language
  formatCode(code, language) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return this.formatJavaScript(code);
      case 'css':
        return this.formatCSS(code);
      case 'html':
        return this.formatHTML(code);
      default:
        return code;
    }
  }

  formatJavaScript(code) {
    // Basic JavaScript formatting
    return code
      .replace(/;(\S)/g, '; $1')
      .replace(/,(\S)/g, ', $1')
      .replace(/\}(\S)/g, '} $1')
      .replace(/\{(\S)/g, '{ $1')
      .replace(/if\(/g, 'if (')
      .replace(/for\(/g, 'for (')
      .replace(/while\(/g, 'while (');
  }

  formatCSS(code) {
    // Basic CSS formatting
    return code
      .replace(/\{/g, ' {\n  ')
      .replace(/\}/g, '\n}\n')
      .replace(/;/g, ';\n  ')
      .replace(/:\s*/g, ': ')
      .replace(/,/g, ',\n  ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  formatHTML(code) {
    // Basic HTML formatting
    let formatted = code;
    let indentLevel = 0;
    const lines = formatted.split('\n');
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indented = '  '.repeat(indentLevel) + trimmed;
      
      if (trimmed.includes('<') && !trimmed.includes('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return indented;
    }).join('\n');
  }
}

// Create processor instance
const processor = new FileProcessor();

// Handle messages from main thread
self.onmessage = function(e) {
  const { type, data, id } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'validate':
        result = processor.validateCode(data.code, data.language, data.filePath);
        break;
        
      case 'extractSymbols':
        result = processor.extractSymbols(data.code, data.language);
        break;
        
      case 'format':
        result = processor.formatCode(data.code, data.language);
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    // Send result back to main thread
    self.postMessage({
      type: 'success',
      id,
      data: result
    });
    
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'error',
      id,
      error: error.message
    });
  }
};