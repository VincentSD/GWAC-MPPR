// Enhanced Error Handling System for G-WAC Short Course
class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10;
        this.errorLog = [];
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupUnhandledRejectionHandling();
        this.setupConsoleErrorInterception();
        this.setupPerformanceMonitoring();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                type: 'runtime'
            });
        });
    }

    setupUnhandledRejectionHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, {
                type: 'promise',
                stack: event.reason?.stack
            });
        });
    }

    setupConsoleErrorInterception() {
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        console.error = (...args) => {
            this.handleError(args.join(' '), {
                type: 'console',
                stack: new Error().stack
            });
            originalConsoleError.apply(console, args);
        };

        console.warn = (...args) => {
            this.handleWarning(args.join(' '), {
                type: 'console',
                stack: new Error().stack
            });
            originalConsoleWarn.apply(console, args);
        };
    }

    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.handlePerformanceIssue('Long task detected', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                type: 'performance'
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('Performance monitoring not supported');
            }
        }

        // EMERGENCY: Memory monitoring disabled to prevent crashes
        console.log('EMERGENCY: Memory monitoring disabled to prevent crashes');
        /*
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    this.handlePerformanceIssue('High memory usage detected', {
                        used: memory.usedJSHeapSize,
                        limit: memory.jsHeapSizeLimit,
                        type: 'memory'
                    });
                }
            }, 30000); // Check every 30 seconds
        }
        */
    }

    handleError(error, context = {}) {
        this.errorCount++;
        
        const errorInfo = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            message: error?.message || error?.toString() || error,
            stack: error?.stack || context.stack,
            context: {
                ...context,
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: document.referrer,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: Date.now()
            }
        };

        this.errorLog.push(errorInfo);
        this.logError(errorInfo);
        this.showUserFriendlyError(errorInfo);
        this.reportError(errorInfo);

        // Prevent error spam
        if (this.errorCount > this.maxErrors) {
            this.showErrorLimitReached();
        }
    }

    handleWarning(warning, context = {}) {
        const warningInfo = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            message: warning,
            type: 'warning',
            context: {
                ...context,
                userAgent: navigator.userAgent,
                url: window.location.href
            }
        };

        this.errorLog.push(warningInfo);
        this.logWarning(warningInfo);
    }

    handlePerformanceIssue(issue, context = {}) {
        const performanceInfo = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            message: issue,
            type: 'performance',
            context: {
                ...context,
                url: window.location.href
            }
        };

        this.errorLog.push(performanceInfo);
        this.logPerformanceIssue(performanceInfo);
    }

    generateErrorId() {
        return 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logError(errorInfo) {
        console.group(`🚨 Error ${errorInfo.id}`);
        console.error('Message:', errorInfo.message);
        console.error('Context:', errorInfo.context);
        if (errorInfo.stack) {
            console.error('Stack:', errorInfo.stack);
        }
        console.groupEnd();
    }

    logWarning(warningInfo) {
        console.group(`⚠️ Warning ${warningInfo.id}`);
        console.warn('Message:', warningInfo.message);
        console.warn('Context:', warningInfo.context);
        console.groupEnd();
    }

    logPerformanceIssue(performanceInfo) {
        console.group(`🐌 Performance Issue ${performanceInfo.id}`);
        console.warn('Message:', performanceInfo.message);
        console.warn('Context:', performanceInfo.context);
        console.groupEnd();
    }

    showUserFriendlyError(errorInfo) {
        // Don't show too many errors to avoid spam
        if (this.errorCount > 3) return;

        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-notification';
        errorContainer.innerHTML = `
            <div class="error-content">
                <span class="error-icon">🚨</span>
                <span class="error-text">Something went wrong. Our team has been notified.</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="error-details" style="display: none;">
                <small>Error ID: ${errorInfo.id}</small>
                <small>Time: ${new Date(errorInfo.timestamp).toLocaleTimeString()}</small>
            </div>
        `;

        // Add click to expand details
        errorContainer.querySelector('.error-content').addEventListener('click', () => {
            const details = errorContainer.querySelector('.error-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(errorContainer);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.remove();
            }
        }, 10000);
    }

    showErrorLimitReached() {
        const limitContainer = document.createElement('div');
        limitContainer.className = 'error-limit-notification';
        limitContainer.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">Too many errors occurred. Please refresh the page.</span>
                <button class="error-refresh" onclick="window.location.reload()">🔄 Refresh</button>
            </div>
        `;

        document.body.appendChild(limitContainer);
    }

    reportError(errorInfo) {
        // Send error to analytics or error reporting service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: errorInfo.message,
                fatal: false,
                custom_map: {
                    error_id: errorInfo.id,
                    error_type: errorInfo.context.type
                }
            });
        }

        // Store in localStorage for debugging
        try {
            const storedErrors = JSON.parse(localStorage.getItem('g-wac-errors') || '[]');
            storedErrors.push(errorInfo);
            // Keep only last 50 errors
            if (storedErrors.length > 50) {
                storedErrors.splice(0, storedErrors.length - 50);
            }
            localStorage.setItem('g-wac-errors', JSON.stringify(storedErrors));
        } catch (error) {
            console.warn('Failed to store error in localStorage:', error);
        }
    }

    // Get error statistics
    getErrorStats() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const oneDayAgo = now - (24 * 60 * 60 * 1000);

        const recentErrors = this.errorLog.filter(error => 
            new Date(error.timestamp).getTime() > oneHourAgo
        );

        const dailyErrors = this.errorLog.filter(error => 
            new Date(error.timestamp).getTime() > oneDayAgo
        );

        return {
            total: this.errorLog.length,
            recent: recentErrors.length,
            daily: dailyErrors.length,
            byType: this.groupErrorsByType(),
            byTime: this.groupErrorsByTime()
        };
    }

    groupErrorsByType() {
        const groups = {};
        this.errorLog.forEach(error => {
            const type = error.context.type || 'unknown';
            groups[type] = (groups[type] || 0) + 1;
        });
        return groups;
    }

    groupErrorsByTime() {
        const groups = {};
        this.errorLog.forEach(error => {
            const hour = new Date(error.timestamp).getHours();
            groups[hour] = (groups[hour] || 0) + 1;
        });
        return groups;
    }

    // Clear error log
    clearErrorLog() {
        this.errorLog = [];
        this.errorCount = 0;
        localStorage.removeItem('g-wac-errors');
    }

    // Export error log for debugging
    exportErrorLog() {
        const dataStr = JSON.stringify(this.errorLog, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `g-wac-errors-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Test error handling
    testErrorHandling() {
        console.log('Testing error handling...');
        
        // Test runtime error
        setTimeout(() => {
            throw new Error('Test runtime error');
        }, 100);

        // Test promise rejection
        setTimeout(() => {
            Promise.reject(new Error('Test promise rejection'));
        }, 200);

        // Test console error
        setTimeout(() => {
            console.error('Test console error');
        }, 300);
    }
}

// Initialize error handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.errorHandler = new ErrorHandler();
    
    // Expose error handler methods globally for debugging
    window.testErrorHandling = () => window.errorHandler.testErrorHandling();
    window.getErrorStats = () => window.errorHandler.getErrorStats();
    window.clearErrorLog = () => window.errorHandler.clearErrorLog();
    window.exportErrorLog = () => window.errorHandler.exportErrorLog();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
