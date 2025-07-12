export class StatusManager {
    constructor(uiElements = {}) {
        // Simple console interface for logging
        this.consoleManager = {
            appendToConsole: (message) => console.log('Console:', message),
            appendToPythonConsole: (message) => console.log('Python:', message),
            clearActiveConsole: () => console.log('Console cleared')
        };
        
        // Store UI elements for status updates
        this.statusBar = uiElements.statusBar;
        this.statusText = uiElements.statusText;
        this.statusIcon = uiElements.statusIcon;
        this.readyTimeoutId = null;
    }

    // Unified status update method
    updateStatus(message, shortMessage, statusClass = 'text-sm') {
        // Log to console
        this.consoleManager.appendToConsole(message);
        
        // Update UI status elements if available
        if (this.statusText) {
            this.statusText.textContent = shortMessage || message;
        }
        
        if (this.statusBar) {
            this.statusBar.classList.remove('hidden');
        }
        
        // Update icon based on message content
        if (this.statusIcon) {
            this.updateStatusIcon(message);
        }
        
        console.log('Status:', shortMessage || message);
    }
    
    updateStatusIcon(message) {
        if (!this.statusIcon) return;
        
        // Clear any existing timeout
        if (this.readyTimeoutId) {
            clearTimeout(this.readyTimeoutId);
            this.readyTimeoutId = null;
        }
        
        this.statusIcon.innerHTML = '';
        this.statusIcon.className = 'w-2 h-2 rounded-full';
        
        const lowerMessage = message.toLowerCase();
        
        // Loading/Processing states - spinning blue dot
        if (lowerMessage.includes('loading') || lowerMessage.includes('converting') || lowerMessage.includes('installing') || 
            lowerMessage.includes('setting up') || lowerMessage.includes('starting') || 
            message.includes('🔄') || message.includes('⚙️') || message.includes('📦')) {
            this.statusIcon.className = 'w-3 h-3';
            this.statusIcon.innerHTML = `
                <svg class="animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
            `;
        // Conversion complete - show tick then revert to ready state after 5 seconds
        } else if (lowerMessage.includes('conversion completed') || lowerMessage.includes('complete!')) {
            this.statusIcon.className = 'w-3 h-3';
            this.statusIcon.innerHTML = `
                <svg class="text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
            
            // After 5 seconds, revert to ready state
            this.readyTimeoutId = setTimeout(() => {
                this.setReadyState();
            }, 5000);
        // Ready state - green dot
        } else if (lowerMessage.includes('ready')) {
            this.statusIcon.className = 'w-2 h-2 bg-green-500 rounded-full';
            this.statusIcon.innerHTML = '';
        // Error states - red dot
        } else if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('not ready') || 
                   lowerMessage.includes('too large') || lowerMessage.includes('invalid') || 
                   message.includes('❌')) {
            this.statusIcon.className = 'w-2 h-2 bg-red-500 rounded-full';
            this.statusIcon.innerHTML = '';
        // Warning states - yellow dot
        } else if (lowerMessage.includes('please') || lowerMessage.includes('select') || lowerMessage.includes('wait') || 
                   lowerMessage.includes('no converted') || lowerMessage.includes('not available')) {
            this.statusIcon.className = 'w-2 h-2 bg-yellow-500 rounded-full';
            this.statusIcon.innerHTML = '';
        // Default initializing state - gray dot
        } else {
            this.statusIcon.className = 'w-2 h-2 bg-gray-500 rounded-full';
            this.statusIcon.innerHTML = '';
        }
    }
    
    hideStatus() {
        // Header status should always remain visible
        // This method is kept for compatibility but does nothing
    }
    
    setReadyState() {
        if (this.statusText) {
            this.statusText.textContent = 'Ready for conversion';
        }
        
        if (this.statusIcon) {
            this.statusIcon.className = 'w-2 h-2 bg-green-500 rounded-full';
            this.statusIcon.innerHTML = '';
        }
        
        console.log('Status: Ready for conversion');
    }
} 