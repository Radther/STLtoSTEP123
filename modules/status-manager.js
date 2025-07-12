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
        
        this.statusIcon.innerHTML = '';
        this.statusIcon.className = 'w-5 h-5';
        
        const lowerMessage = message.toLowerCase();
        
        // Loading/Processing states
        if (lowerMessage.includes('loading') || lowerMessage.includes('converting') || lowerMessage.includes('installing') || 
            lowerMessage.includes('setting up') || lowerMessage.includes('starting') || 
            message.includes('🔄') || message.includes('⚙️') || message.includes('📦')) {
            this.statusIcon.innerHTML = `
                <svg class="animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
            `;
        // Success states
        } else if (lowerMessage.includes('success') || lowerMessage.includes('complete') || lowerMessage.includes('ready') || 
                   lowerMessage.includes('downloaded') || lowerMessage.includes('installed') || 
                   message.includes('✅') || message.includes('🚀')) {
            this.statusIcon.innerHTML = `
                <svg class="text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
        // Error states
        } else if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('not ready') || 
                   lowerMessage.includes('too large') || lowerMessage.includes('invalid') || 
                   message.includes('❌')) {
            this.statusIcon.innerHTML = `
                <svg class="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `;
        // Warning states
        } else if (lowerMessage.includes('please') || lowerMessage.includes('select') || lowerMessage.includes('wait') || 
                   lowerMessage.includes('no converted') || lowerMessage.includes('not available')) {
            this.statusIcon.innerHTML = `
                <svg class="text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            `;
        // Default info icon for any other messages
        } else {
            this.statusIcon.innerHTML = `
                <svg class="text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `;
        }
    }
    
    hideStatus() {
        if (this.statusBar) {
            this.statusBar.classList.add('hidden');
        }
    }
} 