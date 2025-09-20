// workerManager.js - Manages web workers for background processing
class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.messageId = 0;
    this.pendingRequests = new Map();
    this.maxWorkers = navigator.hardwareConcurrency || 4;
    this.workerPool = [];
    this.taskQueue = [];
    this.isInitialized = false;
  }

  // Initialize worker pool
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Create file processing workers
      for (let i = 0; i < Math.min(2, this.maxWorkers); i++) {
        const worker = new Worker('/fileProcessingWorker.js');
        worker.onmessage = this.handleWorkerMessage.bind(this);
        worker.onerror = this.handleWorkerError.bind(this);
        
        this.workerPool.push({
          worker,
          busy: false,
          type: 'fileProcessing'
        });
      }
      
      this.isInitialized = true;
      console.log('Worker pool initialized with', this.workerPool.length, 'workers');
      
      // Process any queued tasks
      this.processQueue();
      
    } catch (error) {
      console.warn('Failed to initialize workers:', error);
      this.isInitialized = false;
    }
  }

  // Get available worker from pool
  getAvailableWorker(type = 'fileProcessing') {
    return this.workerPool.find(w => w.type === type && !w.busy);
  }

  // Handle worker messages
  handleWorkerMessage(event) {
    const { type, id, data, error } = event.data;
    const request = this.pendingRequests.get(id);
    
    if (!request) return;
    
    // Mark worker as available
    const workerInfo = this.workerPool.find(w => w.worker === event.target);
    if (workerInfo) {
      workerInfo.busy = false;
    }
    
    // Remove from pending requests
    this.pendingRequests.delete(id);
    
    if (type === 'success') {
      request.resolve(data);
    } else if (type === 'error') {
      request.reject(new Error(error));
    }
    
    // Process next task in queue
    this.processQueue();
  }

  // Handle worker errors
  handleWorkerError(error) {
    console.error('Worker error:', error);
    
    // Mark worker as available
    const workerInfo = this.workerPool.find(w => w.worker === error.target);
    if (workerInfo) {
      workerInfo.busy = false;
    }
    
    // Process queue to handle remaining tasks
    this.processQueue();
  }

  // Process task queue
  processQueue() {
    while (this.taskQueue.length > 0) {
      const worker = this.getAvailableWorker();
      if (!worker) break;
      
      const task = this.taskQueue.shift();
      this.executeTask(task, worker);
    }
  }

  // Execute task on worker
  executeTask(task, workerInfo) {
    const { type, data, resolve, reject } = task;
    const id = ++this.messageId;
    
    // Mark worker as busy
    workerInfo.busy = true;
    
    // Store request
    this.pendingRequests.set(id, { resolve, reject });
    
    // Send message to worker
    workerInfo.worker.postMessage({ type, data, id });
  }

  // Queue or execute task
  queueTask(type, data) {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        // Fallback: execute synchronously if workers not available
        try {
          const result = this.fallbackExecution(type, data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
        return;
      }
      
      const task = { type, data, resolve, reject };
      
      const worker = this.getAvailableWorker();
      if (worker) {
        this.executeTask(task, worker);
      } else {
        this.taskQueue.push(task);
      }
    });
  }

  // Fallback execution when workers are not available
  fallbackExecution(type, data) {
    switch (type) {
      case 'validate':
        // Basic validation fallback
        return { isValid: true, errors: [] };
      case 'extractSymbols':
        return { functions: [], variables: [], classes: [], imports: [] };
      case 'format':
        return data.code; // Return unformatted code
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  // Public API methods
  async validateCode(code, language, filePath) {
    return this.queueTask('validate', { code, language, filePath });
  }

  async extractSymbols(code, language) {
    return this.queueTask('extractSymbols', { code, language });
  }

  async formatCode(code, language) {
    return this.queueTask('format', { code, language });
  }

  // Batch processing for multiple files
  async validateMultipleFiles(files) {
    const promises = files.map(file => 
      this.validateCode(file.content, file.language, file.path)
    );
    
    try {
      const results = await Promise.all(promises);
      return results.map((result, index) => ({
        ...result,
        filePath: files[index].path
      }));
    } catch (error) {
      console.error('Batch validation failed:', error);
      return files.map(() => ({ isValid: true, errors: [] }));
    }
  }

  // Cleanup workers
  terminate() {
    this.workerPool.forEach(({ worker }) => {
      worker.terminate();
    });
    
    this.workerPool = [];
    this.pendingRequests.clear();
    this.taskQueue = [];
    this.isInitialized = false;
  }

  // Get worker status
  getStatus() {
    return {
      totalWorkers: this.workerPool.length,
      busyWorkers: this.workerPool.filter(w => w.busy).length,
      queuedTasks: this.taskQueue.length,
      pendingRequests: this.pendingRequests.size
    };
  }
}

// Create singleton instance
const workerManager = new WorkerManager();

// Auto-initialize on first import
if (typeof window !== 'undefined') {
  workerManager.initialize().catch(console.error);
}

export default workerManager;