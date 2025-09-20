// IntegratedTerminal.jsx - Integrated terminal component
import React, { useState, useRef, useEffect } from 'react';

// Icons
const TerminalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V7h18v12zM6.5 10.5L9 13l-2.5 2.5L5 14l1.5-1.5zm4.5 3h6v1H11v-1z"/>
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const IconButton = ({ icon, onClick, className = "", "aria-label": ariaLabel, title }) => {
  return (
    <button
      className={`p-1 rounded text-monaco-text-secondary hover:text-monaco-text hover:bg-monaco-hover transition-colors ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
    </button>
  );
};

const IntegratedTerminal = ({ isOpen, onToggle }) => {
  const [history, setHistory] = useState([
    { type: 'info', content: 'Monaco IDE Terminal v1.0.0' },
    { type: 'info', content: 'Type "help" for available commands.' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Built-in commands
  const commands = {
    help: {
      description: 'Show available commands',
      execute: () => {
        const commandList = Object.keys(commands).map(cmd => 
          `  ${cmd.padEnd(12)} - ${commands[cmd].description}`
        ).join('\n');
        return {
          type: 'success',
          content: `Available commands:\n${commandList}`
        };
      }
    },
    clear: {
      description: 'Clear terminal',
      execute: () => {
        setHistory([]);
        return null;
      }
    },
    pwd: {
      description: 'Show current directory',
      execute: () => ({
        type: 'info',
        content: '/workspace'
      })
    },
    ls: {
      description: 'List files in current directory',
      execute: (args) => ({
        type: 'info',
        content: 'package.json  src/  public/  node_modules/  README.md'
      })
    },
    echo: {
      description: 'Echo text',
      execute: (args) => ({
        type: 'info',
        content: args.join(' ')
      })
    },
    date: {
      description: 'Show current date and time',
      execute: () => ({
        type: 'info',
        content: new Date().toString()
      })
    },
    whoami: {
      description: 'Show current user',
      execute: () => ({
        type: 'info',
        content: 'developer'
      })
    },
    node: {
      description: 'Execute JavaScript (simulated)',
      execute: (args) => {
        try {
          if (args.length === 0) {
            return {
              type: 'info',
              content: 'Node.js REPL simulation. Try: node -e "console.log(\'Hello World\')"'
            };
          }
          if (args[0] === '-e' && args[1]) {
            // Simple JavaScript evaluation (be careful in real apps)
            const code = args.slice(1).join(' ').replace(/['"]/g, '');
            if (code.includes('console.log')) {
              const match = code.match(/console\.log\((.+)\)/);
              if (match) {
                return {
                  type: 'success',
                  content: match[1].replace(/['"]/g, '')
                };
              }
            }
            return {
              type: 'success',
              content: `Executed: ${code}`
            };
          }
          return {
            type: 'error',
            content: 'Invalid node command. Try: node -e "console.log(\'Hello\')"'
          };
        } catch (error) {
          return {
            type: 'error',
            content: `Error: ${error.message}`
          };
        }
      }
    },
    npm: {
      description: 'NPM commands (simulated)',
      execute: (args) => {
        if (args[0] === 'install') {
          return {
            type: 'success',
            content: `Installing ${args.slice(1).join(' ')}...\nPackage installed successfully!`
          };
        }
        if (args[0] === 'run') {
          return {
            type: 'success',
            content: `Running script: ${args[1] || 'default'}`
          };
        }
        if (args[0] === 'version' || args[0] === '-v') {
          return {
            type: 'info',
            content: 'npm version 8.19.2'
          };
        }
        return {
          type: 'info',
          content: 'NPM command simulated. Available: install, run, version'
        };
      }
    },
    git: {
      description: 'Git commands (simulated)',
      execute: (args) => {
        if (args[0] === 'status') {
          return {
            type: 'info',
            content: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean'
          };
        }
        if (args[0] === 'branch') {
          return {
            type: 'info',
            content: '* main\n  develop\n  feature/new-ui'
          };
        }
        if (args[0] === 'log') {
          return {
            type: 'info',
            content: 'commit abc123 (HEAD -> main)\nAuthor: Developer <dev@example.com>\nDate: ' + new Date().toDateString() + '\n\n    Latest changes'
          };
        }
        return {
          type: 'info',
          content: 'Git command simulated. Available: status, branch, log'
        };
      }
    }
  };

  // Execute command
  const executeCommand = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add to history
    setHistory(prev => [...prev, { type: 'command', content: `$ ${trimmed}` }]);

    // Parse command
    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    // Execute command
    if (commands[command]) {
      const result = commands[command].execute(commandArgs);
      if (result) {
        setHistory(prev => [...prev, result]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Command not found: ${command}. Type "help" for available commands.`
      }]);
    }

    // Update command history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  // Handle input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : -1;
        setHistoryIndex(newIndex);
        setCurrentInput(newIndex === -1 ? '' : commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const availableCommands = Object.keys(commands).filter(cmd => 
        cmd.startsWith(currentInput.toLowerCase())
      );
      if (availableCommands.length === 1) {
        setCurrentInput(availableCommands[0]);
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="h-80 bg-black border-t border-monaco-border flex flex-col">
      {/* Terminal Header */}
      <div className="h-10 bg-monaco-sidebar border-b border-monaco-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <TerminalIcon />
          <span className="text-sm font-medium text-monaco-text">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <IconButton
            icon={<ClearIcon />}
            onClick={() => setHistory([])}
            aria-label="clear-terminal"
            title="Clear Terminal"
          />
          <IconButton
            icon={<span>×</span>}
            onClick={onToggle}
            aria-label="close-terminal"
            title="Close Terminal"
          />
        </div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 font-mono text-sm">
        {history.map((entry, index) => (
          <div key={index} className="mb-1">
            <pre className={`whitespace-pre-wrap ${
              entry.type === 'command' ? 'text-cyan-400' :
              entry.type === 'error' ? 'text-red-400' :
              entry.type === 'success' ? 'text-green-400' :
              'text-gray-300'
            }`}>
              {entry.content}
            </pre>
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center text-cyan-400">
          <span className="mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default IntegratedTerminal;