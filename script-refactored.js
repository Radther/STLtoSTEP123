// Import only what we need
import { PythonRuntime } from './modules/python-runtime.js';
import { ThreeViewer } from './modules/three-viewer.js';
import { StatusManager } from './modules/status-manager.js';

// STL to STEP Converter Application
class STLToSTEPConverter {
    constructor() {
        this.isInitialized = false;
        this.currentFile = null;
        this.convertedFile = null;
        
        console.log('STL Converter: Initializing...');
        
        this.initializeElements();
        this.initializeModules();
        this.setupEventListeners();
        this.initialize();
    }

    initializeElements() {
        console.log('STL Converter: Finding DOM elements...');
        
        // UI Elements
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeFileBtn = document.getElementById('removeFile');
        this.generateBtn = document.getElementById('generateBtn');
        this.generateIcon = document.getElementById('generateIcon');
        this.generateText = document.getElementById('generateText');
        this.downloadSection = document.getElementById('downloadSection');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.statusBar = document.getElementById('statusBar');
        this.statusIcon = document.getElementById('statusIcon');
        this.statusText = document.getElementById('statusText');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.mainInterface = document.getElementById('mainInterface');
        this.previewSection = document.getElementById('previewSection');
        this.previewContainer = document.getElementById('previewContainer');
        this.previewPlaceholder = document.getElementById('previewPlaceholder');
        this.generateSection = document.getElementById('generateSection');
        
        // Check if critical elements exist
        if (!this.dropZone) {
            console.error('STL Converter: Drop zone element not found!');
        } else {
            console.log('STL Converter: Drop zone found');
        }
        
        if (!this.fileInput) {
            console.error('STL Converter: File input element not found!');
        } else {
            console.log('STL Converter: File input found');
        }
    }

    initializeModules() {
        console.log('STL Converter: Initializing modules...');
        
        // Initialize status manager with UI elements
        this.statusManager = new StatusManager({
            statusBar: this.statusBar,
            statusText: this.statusText,
            statusIcon: this.statusIcon
        });
        
        // Initialize python runtime with status manager
        this.pythonRuntime = new PythonRuntime(this.statusManager);
        
        // Initialize 3D viewer
        this.threeViewer = new ThreeViewer(this.previewContainer, this.previewPlaceholder);
    }

    setupEventListeners() {
        console.log('STL Converter: Setting up event listeners...');
        
        if (!this.dropZone || !this.fileInput) {
            console.error('STL Converter: Cannot set up event listeners - missing DOM elements');
            return;
        }
        
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            console.log('STL Converter: File input changed');
            this.handleFileSelect(e);
        });
        
        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => {
            console.log('STL Converter: Drag over detected');
            this.handleDragOver(e);
        });
        
        this.dropZone.addEventListener('dragenter', (e) => {
            console.log('STL Converter: Drag enter detected');
            e.preventDefault();
            this.dropZone.classList.add('border-primary-500', 'bg-primary-500/5');
        });
        
        this.dropZone.addEventListener('dragleave', (e) => {
            console.log('STL Converter: Drag leave detected');
            this.handleDragLeave(e);
        });
        
        this.dropZone.addEventListener('drop', (e) => {
            console.log('STL Converter: Drop detected');
            this.handleDrop(e);
        });
        
        // Remove file
        if (this.removeFileBtn) {
            this.removeFileBtn.addEventListener('click', () => this.removeFile());
        }
        
        // Generate button
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.convertFile());
        }
        
        // Download button
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadFile());
        }
        
        console.log('STL Converter: Event listeners set up complete');
    }

    async initialize() {
        try {
            console.log('STL Converter: Starting initialization...');
            
            // Ensure loading screen is shown and main interface is hidden
            this.showLoadingScreen();
            
            // Use existing python runtime initialization
            await this.pythonRuntime.initialize();
            
            // Load the conversion script
            await this.loadConversionScript();
            
            this.isInitialized = true;
            
            // Hide loading screen and show main interface
            this.hideLoadingScreen();
            this.showMainInterface();
            
            // Show generate section if file is already loaded
            if (this.currentFile) {
                this.showGenerateSection();
            }
            
            this.statusManager.updateStatus('Ready for STL to STEP conversion!', 'STL Converter ready!');
            console.log('STL Converter: Initialization complete!');
            
        } catch (error) {
            console.error('STL Converter: Failed to initialize:', error);
            this.hideLoadingScreen();
            this.showMainInterface();
            this.statusManager.updateStatus('Failed to initialize Python environment', 'Initialization failed');
        }
    }

    async loadConversionScript() {
        try {
            console.log('STL Converter: Loading conversion script...');
            this.statusManager.updateStatus('Loading conversion script...', 'Loading script...');
            
            // Load the existing generate.py file
            const response = await fetch('./generate.py');
            const generateScript = await response.text();
            
            // Store the script for later use
            this.generateScript = generateScript;
            
            console.log('STL Converter: Conversion script loaded successfully');
            
        } catch (error) {
            console.error('STL Converter: Failed to load conversion script:', error);
            throw error;
        }
    }

    handleDragOver(e) {
        console.log('STL Converter: Handling drag over');
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('border-primary-500', 'bg-primary-500/5');
    }

    handleDragLeave(e) {
        console.log('STL Converter: Handling drag leave');
        e.preventDefault();
        e.stopPropagation();
        
        // Only remove classes if we're actually leaving the drop zone
        if (!this.dropZone.contains(e.relatedTarget)) {
            this.dropZone.classList.remove('border-primary-500', 'bg-primary-500/5');
        }
    }

    handleDrop(e) {
        console.log('STL Converter: Handling drop');
        e.preventDefault();
        e.stopPropagation();
        
        this.dropZone.classList.remove('border-primary-500', 'bg-primary-500/5');
        
        const files = e.dataTransfer.files;
        console.log('STL Converter: Files dropped:', files.length);
        
        if (files.length > 0) {
            console.log('STL Converter: Processing file:', files[0].name);
            this.processFile(files[0]);
        } else {
            console.log('STL Converter: No files in drop event');
        }
    }

    handleFileSelect(e) {
        console.log('STL Converter: File selected via input');
        const file = e.target.files[0];
        if (file) {
            console.log('STL Converter: Processing selected file:', file.name);
            this.processFile(file);
        }
    }

    async processFile(file) {
        console.log('STL Converter: Processing file:', file.name, 'Size:', file.size);
        
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.stl')) {
            console.log('STL Converter: Invalid file type');
            this.statusManager.updateStatus('Please select a valid STL file', 'Invalid file type');
            return;
        }

        // Validate file size (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) {
            console.log('STL Converter: File too large');
            this.statusManager.updateStatus('File size too large. Please select a file smaller than 50MB', 'File too large');
            return;
        }

        console.log('STL Converter: File validation passed');
        this.currentFile = file;
        
        // Show preview section and display file info
        this.displayFileInfo(file);
        this.showPreviewSection();
        
        // Load 3D preview
        await this.load3DPreview(file);
        
        // Show generate section if initialized
        if (this.isInitialized) {
            this.showGenerateSection();
        }
        
        this.statusManager.hideStatus();
    }

    displayFileInfo(file) {
        console.log('STL Converter: Displaying file info');
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.downloadSection.classList.add('hidden');
    }

    removeFile() {
        console.log('STL Converter: Removing file');
        this.currentFile = null;
        this.convertedFile = null;
        this.previewSection.classList.add('hidden');
        this.generateSection.classList.add('hidden');
        this.downloadSection.classList.add('hidden');
        this.fileInput.value = '';
        this.statusManager.hideStatus();
    }

    async convertFile() {
        console.log('STL Converter: Starting conversion');
        
        if (!this.currentFile || !this.isInitialized) {
            this.statusManager.updateStatus('Please select a file and wait for initialization', 'Not ready');
            return;
        }

        if (!this.pythonRuntime.pyodide) {
            this.statusManager.updateStatus('Python runtime not ready', 'Runtime not ready');
            return;
        }

        try {
            // Update UI for conversion process
            if (this.generateBtn) {
                this.generateBtn.disabled = true;
                this.generateText.textContent = 'Converting...';
                this.generateIcon.classList.add('animate-spin');
            }
            this.statusManager.updateStatus('Converting STL to STEP...', 'Converting...');

            // Read file as array buffer
            console.log('STL Converter: Reading STL file...');
            const arrayBuffer = await this.readFileAsArrayBuffer(this.currentFile);
            const uint8Array = new Uint8Array(arrayBuffer);

            // Save the STL file to Pyodide's file system
            console.log('STL Converter: Saving STL file to browser file system...');
            const stlFileName = this.currentFile.name;
            this.pythonRuntime.pyodide.FS.writeFile(stlFileName, uint8Array);

            // Create a modified version of generate.py that works with our file
            const modifiedScript = this.generateScript.replace(
                /stl_filename = Path\(['"].*?['"]\)/,
                `stl_filename = Path('${stlFileName}')`
            );

            console.log('STL Converter: Running conversion script...');
            // Run the modified generate.py script
            await this.pythonRuntime.pyodide.runPythonAsync(modifiedScript);

            // Read the resulting STEP file
            const stepFileName = stlFileName.replace('.stl', '.step');
            console.log('STL Converter: Reading converted STEP file...');
            
            const stepData = this.pythonRuntime.pyodide.FS.readFile(stepFileName);

            // Store converted file data
            this.convertedFile = {
                data: stepData,
                name: stepFileName
            };

            // Clean up the files from Pyodide's file system
            try {
                this.pythonRuntime.pyodide.FS.unlink(stlFileName);
                this.pythonRuntime.pyodide.FS.unlink(stepFileName);
            } catch (cleanupError) {
                console.log('STL Converter: File cleanup error (non-critical):', cleanupError);
            }

            // Show success and enable download
            this.statusManager.updateStatus('Conversion completed successfully!', 'Conversion complete!');
            this.downloadSection.classList.remove('hidden');
            
            // Smooth scroll to the top to show the download section
            setTimeout(() => {
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
            }, 100); // Small delay to ensure element is fully rendered
            
            console.log('STL Converter: Conversion completed successfully');

        } catch (error) {
            console.error('STL Converter: Conversion error:', error);
            this.statusManager.updateStatus(`Conversion failed: ${error.message}`, 'Conversion failed');
        } finally {
            // Reset button state
            if (this.generateBtn) {
                this.generateBtn.disabled = false;
                this.generateText.textContent = 'Convert to STEP';
                this.generateIcon.classList.remove('animate-spin');
            }
        }
    }

    downloadFile() {
        console.log('STL Converter: Downloading file');
        
        if (!this.convertedFile) {
            this.statusManager.updateStatus('No converted file available', 'No file available');
            return;
        }

        try {
            // Create blob and download
            const blob = new Blob([this.convertedFile.data], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = this.convertedFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            this.statusManager.updateStatus('File downloaded successfully!', 'Download complete!');
            console.log('STL Converter: File downloaded successfully');
        } catch (error) {
            console.error('STL Converter: Download error:', error);
            this.statusManager.updateStatus('Download failed', 'Download failed');
        }
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }



    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
        if (this.mainInterface) {
            this.mainInterface.classList.add('hidden');
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }

    showMainInterface() {
        if (this.mainInterface) {
            this.mainInterface.classList.remove('hidden');
        }
    }

    showPreviewSection() {
        if (this.previewSection) {
            this.previewSection.classList.remove('hidden');
        }
    }

    showGenerateSection() {
        if (this.generateSection) {
            this.generateSection.classList.remove('hidden');
        }
        if (this.generateBtn) {
            this.generateBtn.disabled = false;
        }
    }

    async load3DPreview(file) {
        try {
            console.log('STL Converter: Loading 3D preview...');
            
            // Initialize the 3D viewer if not already done
            if (!this.threeViewer.isInitialized) {
                this.threeViewer.init();
            }
            
            // Read the STL file
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const stlData = new Uint8Array(arrayBuffer);
            
            // Create part data for ThreeViewer
            const partData = [{
                name: file.name,
                stl: stlData,
                color: '#4f46e5', // Primary color
                opacity: 1.0
            }];
            
            // Load the part into the 3D viewer
            this.threeViewer.loadParts(partData);
            
            console.log('STL Converter: 3D preview loaded successfully');
            
        } catch (error) {
            console.error('STL Converter: Failed to load 3D preview:', error);
            // Don't show error for preview failure - just log it
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing STL Converter...');
    window.stlConverter = new STLToSTEPConverter();
}); 