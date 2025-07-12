export class PythonRuntime {
    constructor(statusManager) {
        this.pyodide = null;
        this.isInitialized = false;
        this.statusManager = statusManager;
    }

    async initialize() {
        try {
            this.statusManager.updateStatus('🔄 Loading Python WebAssembly runtime...', 'Loading Python WebAssembly runtime...', 'text-sm status-pulse');
            this.pyodide = await loadPyodide();
            
            // Install packages needed for STL to STEP conversion
            this.statusManager.updateStatus('📦 Installing Python packages for STL conversion...', 'Installing Python packages...');
            await this.pyodide.loadPackage(['numpy', 'micropip', 'typing-extensions']);
            
            // Run the setup script (installs build123d and other packages)
            await this.runSetupScript();
            
            this.isInitialized = true;
            this.statusManager.updateStatus('🚀 Python environment ready!', 'Python environment ready! 🚀', 'text-sm status-success');
            
        } catch (error) {
            console.error('Failed to initialize Pyodide:', error);
            this.statusManager.updateStatus('❌ Failed to initialize Python environment: ' + error.message, 'Failed to initialize Python environment ❌', 'text-sm status-error');
            throw error;
        }
    }

    async runSetupScript() {
        try {
            this.statusManager.updateStatus('⚙️ Setting up Python environment and packages...', 'Setting up Python environment and packages...');
            const response = await fetch('setup.py');
            const setupScript = await response.text();
            
            // Run the setup script
            await this.pyodide.runPythonAsync(setupScript);
            
            this.statusManager.updateStatus('✅ Python packages installed successfully!', 'Python packages installed successfully!');
            
        } catch (error) {
            console.error('Failed to run setup script:', error);
            this.statusManager.updateStatus('❌ Failed to set up Python environment: ' + error.message, 'Setup failed ❌', 'text-sm status-error');
            throw new Error('Failed to set up Python environment: ' + error.message);
        }
    }

    isReady() {
        return this.isInitialized;
    }
} 