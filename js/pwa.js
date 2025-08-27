// Progressive Web App (PWA) Registration for G-WAC Short Course
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.checkInstallationStatus();
        // Temporarily disabled update notifications during development
        // this.setupUpdateNotification();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);

                // Handle service worker updates - temporarily disabled during development
                // registration.addEventListener('updatefound', () => {
                //     const newWorker = registration.installing;
                //     newWorker.addEventListener('statechange', () => {
                //         if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                //             this.showUpdateNotification();
                //             });
                //     });
                // });

                // Handle service worker messages - temporarily disabled during development
                // navigator.serviceWorker.addEventListener('message', (event) => {
                //     if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                //             this.showUpdateNotification();
                //     }
                // });

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        // Capture the install prompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            this.deferredPrompt = null;
            
            // Track installation
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_install', {
                    event_category: 'engagement',
                    event_label: 'G-WAC Course'
                });
            }
        });
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('pwa-install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-btn btn btn-primary';
            installBtn.innerHTML = `
                <span class="install-icon">📱</span>
                <span class="install-text">Install App</span>
            `;
            installBtn.addEventListener('click', () => this.installApp());

            // Insert into header
            const header = document.querySelector('.header-container');
            if (header) {
                header.appendChild(installBtn);
            }
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
        }
    }

    checkInstallationStatus() {
        // Check if app is running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            this.hideInstallButton();
        }
    }

    setupUpdateNotification() {
        // Create update notification
        if (!document.getElementById('pwa-update-notification')) {
            const updateNotification = document.createElement('div');
            updateNotification.id = 'pwa-update-notification';
            updateNotification.className = 'pwa-update-notification';
            updateNotification.innerHTML = `
                <div class="update-content">
                    <span class="update-icon">🔄</span>
                    <span class="update-text">New version available</span>
                    <button class="update-btn btn btn-primary" onclick="pwaManager.updateApp()">Update</button>
                    <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

            document.body.appendChild(updateNotification);
        }
    }

    async updateApp() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration && registration.waiting) {
                    // Send message to service worker to skip waiting
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    
                    // Reload the page to activate the new service worker
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to update app:', error);
            }
        }
    }

    // Check if app is online
    isOnline() {
        return navigator.onLine;
    }

    // Setup offline/online event listeners
    setupConnectivityListeners() {
        window.addEventListener('online', () => {
            this.showOnlineStatus();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showOfflineStatus();
        });
    }

    showOnlineStatus() {
        this.showStatusMessage('🟢 Back online', 'success');
    }

    showOfflineStatus() {
        this.showStatusMessage('🔴 You are offline', 'warning');
    }

    showStatusMessage(message, type = 'info') {
        const statusMessage = document.createElement('div');
        statusMessage.className = `status-message status-${type}`;
        statusMessage.textContent = message;

        document.body.appendChild(statusMessage);

        // Remove after 3 seconds
        setTimeout(() => {
            statusMessage.remove();
        }, 3000);
    }

    async syncOfflineData() {
        // Sync any offline data when coming back online
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.sync.register('background-sync');
                }
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    return true;
                }
            } catch (error) {
                console.error('Failed to request notification permission:', error);
            }
        }
        return false;
    }

    // Send local notification
    sendNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/images/g-wac-favicon.jpg',
                badge: '/images/g-wac-favicon.jpg',
                ...options
            });

            notification.addEventListener('click', () => {
                window.focus();
                notification.close();
            });

            return notification;
        }
    }

    // Get app info
    getAppInfo() {
        return {
            isInstalled: this.isInstalled,
            isOnline: this.isOnline(),
            hasNotifications: 'Notification' in window,
            hasServiceWorker: 'serviceWorker' in navigator,
            hasPushManager: 'PushManager' in window
        };
    }
}

// Initialize PWA Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
    
    // Setup connectivity listeners
    window.pwaManager.setupConnectivityListeners();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}
