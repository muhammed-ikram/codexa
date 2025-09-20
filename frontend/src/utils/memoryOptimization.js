// memoryOptimization.js - Memory optimization utilities for Monaco IDE

// Efficient LRU Cache for file contents and computed values
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      // Update existing entry
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Get memory usage estimate in bytes
  getMemoryUsage() {
    let size = 0;
    for (const [key, value] of this.cache) {
      size += this.estimateSize(key) + this.estimateSize(value);
    }
    return size;
  }

  estimateSize(obj) {
    if (typeof obj === 'string') {
      return obj.length * 2; // Approximate size in bytes (UTF-16)
    }
    if (typeof obj === 'object' && obj !== null) {
      return JSON.stringify(obj).length * 2;
    }
    return 8; // Primitive types
  }
}

// Memory-efficient project tree data structure
class ProjectTree {
  constructor() {
    this.nodes = new Map(); // path -> node mapping for O(1) lookup
    this.children = new Map(); // parentPath -> Set of child paths
    this.content = new LRUCache(50); // Cache for file contents
    this.metadata = new LRUCache(100); // Cache for file metadata
  }

  // Add a node to the tree
  addNode(node) {
    this.nodes.set(node.path, {
      name: node.name,
      type: node.type,
      path: node.path,
      handle: node.handle || null
    });

    // Store content separately to save memory
    if (node.content) {
      this.content.set(node.path, node.content);
    }

    // Update parent-child relationships
    const parentPath = this.getParentPath(node.path);
    if (parentPath !== null) {
      if (!this.children.has(parentPath)) {
        this.children.set(parentPath, new Set());
      }
      this.children.get(parentPath).add(node.path);
    }
  }

  // Get a node by path
  getNode(path) {
    const node = this.nodes.get(path);
    if (!node) return null;

    return {
      ...node,
      content: this.content.get(path) || ''
    };
  }

  // Update node content
  updateContent(path, content) {
    if (this.nodes.has(path)) {
      this.content.set(path, content);
    }
  }

  // Remove a node and its children
  removeNode(path) {
    const node = this.nodes.get(path);
    if (!node) return false;

    // Remove all children recursively
    const childPaths = this.children.get(path);
    if (childPaths) {
      for (const childPath of childPaths) {
        this.removeNode(childPath);
      }
      this.children.delete(path);
    }

    // Remove from parent's children
    const parentPath = this.getParentPath(path);
    if (parentPath !== null && this.children.has(parentPath)) {
      this.children.get(parentPath).delete(path);
    }

    // Remove the node itself
    this.nodes.delete(path);
    this.content.delete(path);
    this.metadata.delete(path);

    return true;
  }

  // Get all children of a node
  getChildren(path) {
    const childPaths = this.children.get(path);
    if (!childPaths) return [];

    return Array.from(childPaths)
      .map(childPath => this.getNode(childPath))
      .filter(Boolean)
      .sort((a, b) => {
        // Folders first, then files, alphabetically
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
  }

  // Convert to legacy format for compatibility
  toLegacyFormat(rootPath = '') {
    const result = [];
    const childPaths = this.children.get(rootPath) || new Set();

    for (const childPath of childPaths) {
      const node = this.getNode(childPath);
      if (!node) continue;

      const legacyNode = {
        ...node,
        content: node.content || ''
      };

      if (node.type === 'folder') {
        legacyNode.children = this.toLegacyFormat(childPath);
      }

      result.push(legacyNode);
    }

    return result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  // Get parent path
  getParentPath(path) {
    if (!path || path === '') return null;
    const lastSlash = path.lastIndexOf('/');
    return lastSlash === -1 ? '' : path.substring(0, lastSlash);
  }

  // Get memory usage statistics
  getMemoryStats() {
    return {
      nodes: this.nodes.size,
      contentCache: this.content.size(),
      metadataCache: this.metadata.size(),
      contentMemory: this.content.getMemoryUsage(),
      metadataMemory: this.metadata.getMemoryUsage(),
      totalMemory: this.content.getMemoryUsage() + this.metadata.getMemoryUsage()
    };
  }

  // Clear memory caches
  clearCaches() {
    this.content.clear();
    this.metadata.clear();
  }
}

// Memory monitor for tracking usage
class MemoryMonitor {
  constructor() {
    this.measurements = [];
    this.maxMeasurements = 100;
    this.isMonitoring = false;
    this.monitorInterval = null;
  }

  // Start monitoring memory usage
  startMonitoring(interval = 5000) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitorInterval = setInterval(() => {
      this.takeMeasurement();
    }, interval);
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.isMonitoring = false;
  }

  // Take a memory measurement
  takeMeasurement() {
    const measurement = {
      timestamp: Date.now(),
      ...this.getMemoryInfo()
    };

    this.measurements.push(measurement);

    // Keep only recent measurements
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift();
    }

    // Warn if memory usage is high
    if (measurement.heapUsed > 100 * 1024 * 1024) { // 100MB
      console.warn('High memory usage detected:', this.formatBytes(measurement.heapUsed));
    }

    return measurement;
  }

  // Get current memory information
  getMemoryInfo() {
    if (performance.memory) {
      return {
        heapUsed: performance.memory.usedJSHeapSize,
        heapTotal: performance.memory.totalJSHeapSize,
        heapLimit: performance.memory.jsHeapSizeLimit
      };
    }

    // Fallback for browsers without performance.memory
    return {
      heapUsed: 0,
      heapTotal: 0,
      heapLimit: 0
    };
  }

  // Get memory usage statistics
  getStats() {
    if (this.measurements.length === 0) {
      return null;
    }

    const latest = this.measurements[this.measurements.length - 1];
    const oldest = this.measurements[0];

    return {
      current: latest,
      trend: {
        heapUsed: latest.heapUsed - oldest.heapUsed,
        duration: latest.timestamp - oldest.timestamp
      },
      average: {
        heapUsed: this.measurements.reduce((sum, m) => sum + m.heapUsed, 0) / this.measurements.length
      },
      peak: {
        heapUsed: Math.max(...this.measurements.map(m => m.heapUsed))
      }
    };
  }

  // Format bytes for display
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Clear measurements
  clear() {
    this.measurements = [];
  }
}

// Cleanup utilities
class CleanupManager {
  constructor() {
    this.cleanupTasks = new Set();
    this.isShuttingDown = false;
  }

  // Register a cleanup task
  register(cleanupFn, description = '') {
    const task = { fn: cleanupFn, description };
    this.cleanupTasks.add(task);
    
    return () => {
      this.cleanupTasks.delete(task);
    };
  }

  // Execute all cleanup tasks
  async executeAll() {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log(`Executing ${this.cleanupTasks.size} cleanup tasks...`);

    const results = [];
    for (const task of this.cleanupTasks) {
      try {
        await task.fn();
        results.push({ success: true, description: task.description });
      } catch (error) {
        console.error(`Cleanup task failed: ${task.description}`, error);
        results.push({ success: false, description: task.description, error });
      }
    }

    this.cleanupTasks.clear();
    console.log('Cleanup completed:', results);
    return results;
  }

  // Automatic cleanup on page unload
  setupAutoCleanup() {
    const handleUnload = () => {
      this.executeAll();
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);

    // Return cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }
}

// Debounced garbage collection hint
const scheduleGC = (() => {
  let timeout;
  return (delay = 5000) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (window.gc) {
        console.log('Triggering garbage collection...');
        window.gc();
      }
    }, delay);
  };
})();

// Export utilities
export {
  LRUCache,
  ProjectTree,
  MemoryMonitor,
  CleanupManager,
  scheduleGC
};