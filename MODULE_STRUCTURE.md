# STL to STEP Converter Module Structure

This document describes the modular structure of the STL to STEP converter application.

## Overview

The application is a streamlined STL to STEP converter that allows users to upload STL files and convert them to STEP format using Python's build123d library running in the browser via WebAssembly.

## Module Architecture

### Core Modules

#### 1. `modules/python-runtime.js` - PythonRuntime Class
- **Purpose**: Manages the Python WebAssembly environment
- **Key Features**:
  - Pyodide initialization and setup
  - Python package installation (build123d, numpy, etc.)
  - Direct access to Python filesystem and runtime
  - Simplified interface focused on STL to STEP conversion

#### 2. `modules/status-manager.js` - StatusManager Class
- **Purpose**: Handles all status updates and UI feedback
- **Key Features**:
  - Unified status messaging system
  - Dynamic status icon updates based on message content
  - Integration with UI status bar elements
  - Console logging for debugging

#### 3. `modules/three-viewer.js` - ThreeViewer Class
- **Purpose**: Provides 3D visualization for STL files
- **Key Features**:
  - Three.js scene initialization and management
  - STL file loading and display
  - Camera controls and lighting
  - Responsive viewport handling
  - Interactive 3D preview

### Main Application

#### `script-refactored.js` - STLToSTEPConverter Class
- **Purpose**: Main application controller and orchestrator
- **Key Features**:
  - File drag-and-drop and selection handling
  - STL file validation and processing
  - Integration with Python runtime for conversion
  - 3D preview management
  - Download functionality for converted files
  - UI state management

## Dependencies

The modules have the following dependency relationships:

```
STLToSTEPConverter
├── StatusManager (manages all status updates)
├── PythonRuntime (depends on StatusManager)
└── ThreeViewer (independent 3D visualization)
```

## Application Flow

1. **Initialization**: 
   - Python runtime is initialized with build123d packages
   - Status manager is set up with UI elements
   - 3D viewer is prepared for STL preview

2. **File Processing**:
   - User drops or selects STL file
   - File is validated and loaded into 3D viewer
   - File information is displayed

3. **Conversion**:
   - STL file is written to Python filesystem
   - Python conversion script is executed
   - STEP file is generated and read back
   - Download option is made available

4. **Preview & Download**:
   - 3D preview shows the STL model
   - User can download the converted STEP file

## File Structure

```
├── script-refactored.js           # Main application class
├── modules/
│   ├── python-runtime.js          # Python/WebAssembly environment
│   ├── status-manager.js           # Status and UI feedback
│   └── three-viewer.js             # 3D visualization
├── generate.py                     # Python conversion script
├── setup.py                        # Python package installation
└── index.html                      # Main HTML interface
```

## Benefits of the Current Structure

1. **Focused Functionality**: Each module has a single, clear responsibility
2. **Minimal Dependencies**: Clean dependency tree with no circular dependencies
3. **Maintainable**: Easy to understand and modify individual components
4. **Performant**: Only necessary modules are loaded and used
5. **Extensible**: New features can be added without affecting existing modules

## Usage

The application runs entirely in the browser with no server-side dependencies for the conversion process:

1. Load the HTML page with the module imports
2. Python environment initializes automatically
3. User can immediately start converting STL files to STEP format

## Technology Stack

- **Frontend**: Vanilla JavaScript ES6 modules, Three.js for 3D rendering
- **Python Runtime**: Pyodide (Python in WebAssembly)
- **CAD Library**: build123d for STL to STEP conversion
- **UI Framework**: Tailwind CSS for styling 