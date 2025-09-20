// PerformanceDashboard.jsx - Performance monitoring and optimization dashboard
import React, { useState, useEffect, useRef } from 'react';

// Custom UI Components
const Button = ({ children, onClick, className = "", variant = "primary", size = "sm", colorScheme = "gray", leftIcon, ...props }) => {
  const baseClasses = "monaco-button inline-flex items-center justify-center gap-2";
  const variantClasses = {
    primary: "monaco-button-primary",
    ghost: "monaco-button-ghost"
  };
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    orange: "bg-orange-600 hover:bg-orange-700 text-white",
    gray: "monaco-button-ghost"
  };
  const sizeClasses = {
    sm: "px-2 py-1 text-xs"
  };
  
  return (
    <button
      className={`${baseClasses} ${variant === 'ghost' ? colorClasses[colorScheme] : variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {leftIcon && <span className="w-4 h-4">{leftIcon}</span>}
      {children}
    </button>
  );
};

const Badge = ({ children, colorScheme = "gray", size = "sm", className = "" }) => {
  const colorClasses = {
    orange: "bg-orange-600 text-white",
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

const Alert = ({ children, status = "info", className = "" }) => {
  const statusClasses = {
    warning: "bg-orange-900 border-orange-700 text-orange-100",
    error: "bg-red-900 border-red-700 text-red-100",
    info: "bg-blue-900 border-blue-700 text-blue-100"
  };
  
  return (
    <div className={`border rounded-lg p-3 ${statusClasses[status]} ${className}`}>
      {children}
    </div>
  );
};

const AlertIcon = ({ status = "info" }) => {
  const icons = {
    warning: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };
  
  return icons[status] || icons.info;
};

const ViewIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const PerformanceDashboard = ({ 
  memoryMonitor, 
  editorRef, 
  project,
  onOptimize 
}) => {
  const [stats, setStats] = useState(null);
  const [editorMetrics, setEditorMetrics] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const updateInterval = useRef();

  // Format bytes for display
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format percentage
  const formatPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Count files in project
  const countFiles = (nodes, count = 0) => {
    for (const node of nodes) {
      if (node.type === 'file') {
        count++;
      } else if (node.type === 'folder' && node.children) {
        count = countFiles(node.children, count);
      }
    }
    return count;
  };

  // Update performance metrics
  const updateMetrics = () => {
    // Memory stats
    const memoryStats = memoryMonitor?.getStats();
    setStats(memoryStats);

    // Editor performance metrics
    if (editorRef?.current) {
      const editor = editorRef.current;
      const model = editor.getModel();
      
      if (model) {
        const metrics = {
          lineCount: model.getLineCount(),
          characterCount: model.getValueLength(),
          modelSize: model.getValueLength() * 2, // Approximate size in bytes
          language: model.getLanguageId(),
          decorationsCount: model.getAllDecorations().length
        };
        setEditorMetrics(metrics);
        
        // Check for performance warnings
        const newWarnings = [];
        
        if (metrics.lineCount > 5000) {
          newWarnings.push({
            type: 'warning',
            title: 'Large File',
            description: `File has ${metrics.lineCount} lines. Performance may be affected.`
          });
        }
        
        if (metrics.characterCount > 500000) {
          newWarnings.push({
            type: 'error',
            title: 'Very Large File',
            description: `File size is ${formatBytes(metrics.modelSize)}. Performance may be affected.`
          });
        }
        
        setWarnings(newWarnings);
      }
    }

    // Project performance metrics
    if (project) {
      const totalFiles = countFiles(project);
      
      if (totalFiles > 200) {
        setWarnings(prev => [...prev, {
          type: 'warning',
          title: 'Large Project',
          description: `Project contains ${totalFiles} files. Consider using file tree virtualization.`
        }]);
      }
    }
  };

  // Optimize performance
  const handleOptimize = () => {
    onOptimize?.();
    setTimeout(updateMetrics, 1000);
  };

  // Setup automatic updates
  useEffect(() => {
    updateMetrics();
    
    updateInterval.current = setInterval(updateMetrics, 5000);
    
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [memoryMonitor, editorRef, project]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        leftIcon={<ViewIcon />}
        onClick={() => setIsOpen(!isOpen)}
        colorScheme={warnings.length > 0 ? "orange" : "gray"}
        className="flex items-center"
      >
        Performance {warnings.length > 0 && `(${warnings.length})`}
      </Button>
      
      <div className={`transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="mt-2 p-4 bg-monaco-sidebar rounded-lg border border-monaco-border max-w-96 absolute right-0 z-50">
          <div className="flex flex-col space-y-4">
            {/* Performance Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-orange-300">
                  Performance Warnings
                </h3>
                {warnings.map((warning, index) => (
                  <Alert key={index} status={warning.type} className="text-xs">
                    <div className="flex items-start space-x-2">
                      <AlertIcon status={warning.type} />
                      <div>
                        <div className="font-bold text-xs">{warning.title}</div>
                        <div className="text-xs">{warning.description}</div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
            
            {/* Memory Statistics */}
            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-monaco-text-secondary">Memory Used</div>
                  <div className="text-sm font-bold text-monaco-text">
                    {formatBytes(stats.current.heapUsed)}
                  </div>
                  <div className="text-xs text-monaco-text-secondary">
                    {formatPercentage(stats.current.heapUsed, stats.current.heapLimit)}% of limit
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-monaco-text-secondary">Peak Usage</div>
                  <div className="text-sm font-bold text-monaco-text">
                    {formatBytes(stats.peak.heapUsed)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Editor Metrics */}
            {editorMetrics && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-monaco-text">Editor Metrics</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-monaco-text-secondary">Lines:</span>
                    <Badge>{editorMetrics.lineCount.toLocaleString()}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-monaco-text-secondary">Size:</span>
                    <Badge>{formatBytes(editorMetrics.modelSize)}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-monaco-text-secondary">Language:</span>
                    <Badge>{editorMetrics.language}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-monaco-text-secondary">Decorations:</span>
                    <Badge colorScheme={editorMetrics.decorationsCount > 100 ? "orange" : "gray"}>
                      {editorMetrics.decorationsCount}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            
            {/* Optimization Actions */}
            <Button
              colorScheme="blue"
              onClick={handleOptimize}
              className="w-full justify-center"
            >
              Optimize Performance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;