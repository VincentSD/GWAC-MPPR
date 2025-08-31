/**
 * Notification System for Admin Panel
 * Handles displaying success, error, warning, and info messages
 */

class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = [];
        this.maxNotifications = 5;
        this.autoHideDelay = 5000; // 5 seconds
    }

    /**
     * Show a notification
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - Auto-hide duration in ms (optional)
     */
    show(type, title, message, duration = this.autoHideDelay) {
        const notification = this.createNotification(type, title, message);
        
        // Add to container
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Limit number of notifications
        if (this.notifications.length > this.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            if (oldestNotification.parentNode) {
                oldestNotification.parentNode.removeChild(oldestNotification);
            }
        }
        
        // Auto-hide after specified duration
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        return notification;
    }

    /**
     * Hide a specific notification
     * @param {HTMLElement} notification - Notification element to hide
     */
    hide(notification) {
        if (!notification || !notification.parentNode) return;
        
        // Animate out
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from notifications array
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Hide all notifications
     */
    hideAll() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }

    /**
     * Create notification element
     * @param {string} type - Notification type
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @returns {HTMLElement} - Created notification element
     */
    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Get icon for type
        const icon = this.getIconForType(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="adminManager.notificationSystem.hide(this.closest('.notification'))">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Set initial styles for animation
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        
        return notification;
    }

    /**
     * Get icon class for notification type
     * @param {string} type - Notification type
     * @returns {string} - FontAwesome icon class
     */
    getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            case 'info':
                return 'fas fa-info-circle';
            default:
                return 'fas fa-bell';
        }
    }

    /**
     * Show success notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - Auto-hide duration
     */
    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }

    /**
     * Show error notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - Auto-hide duration
     */
    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }

    /**
     * Show warning notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - Auto-hide duration
     */
    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }

    /**
     * Show info notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - Auto-hide duration
     */
    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }

    /**
     * Show loading notification (doesn't auto-hide)
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @returns {HTMLElement} - Created notification element
     */
    loading(title, message) {
        return this.show('info', title, message, 0); // No auto-hide
    }

    /**
     * Update loading notification with new message
     * @param {HTMLElement} notification - Loading notification element
     * @param {string} message - New message
     */
    updateLoading(notification, message) {
        if (notification && notification.querySelector('.notification-message')) {
            notification.querySelector('.notification-message').textContent = message;
        }
    }

    /**
     * Convert loading notification to success/error
     * @param {HTMLElement} notification - Loading notification element
     * @param {string} type - New type ('success', 'error', etc.)
     * @param {string} title - New title
     * @param {string} message - New message
     * @param {number} duration - Auto-hide duration
     */
    convertLoading(notification, type, title, message, duration) {
        if (!notification) return;
        
        // Update classes and content
        notification.className = `notification ${type}`;
        notification.querySelector('.notification-icon i').className = this.getIconForType(type);
        notification.querySelector('.notification-title').textContent = title;
        notification.querySelector('.notification-message').textContent = message;
        
        // Auto-hide after specified duration
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
    }

    /**
     * Show toast notification (shorter, less intrusive)
     * @param {string} type - Notification type
     * @param {string} message - Short message
     * @param {number} duration - Auto-hide duration
     */
    toast(type, message, duration = 3000) {
        const notification = this.createNotification(type, '', message);
        notification.classList.add('toast');
        
        // Add to container
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Limit number of notifications
        if (this.notifications.length > this.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            if (oldestNotification.parentNode) {
                oldestNotification.parentNode.removeChild(oldestNotification);
            }
        }
        
        // Auto-hide after specified duration
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        return notification;
    }

    /**
     * Show confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} confirmText - Confirm button text
     * @param {string} cancelText - Cancel button text
     * @returns {Promise<boolean>} - Promise that resolves to true if confirmed
     */
    confirm(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); resolve(false);">
                                ${cancelText}
                            </button>
                            <button class="btn btn-primary" onclick="this.closest('.modal').remove(); resolve(true);">
                                ${confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Auto-remove if user clicks outside modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
        });
    }

    /**
     * Show input dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {string} placeholder - Input placeholder
     * @param {string} defaultValue - Default input value
     * @param {string} confirmText - Confirm button text
     * @param {string} cancelText - Cancel button text
     * @returns {Promise<string|null>} - Promise that resolves to input value or null if cancelled
     */
    prompt(title, message, placeholder = '', defaultValue = '', confirmText = 'OK', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                        <div class="form-group">
                            <input type="text" id="prompt-input" placeholder="${placeholder}" value="${defaultValue}">
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); resolve(null);">
                                ${cancelText}
                            </button>
                            <button class="btn btn-primary" onclick="
                                const input = document.getElementById('prompt-input');
                                this.closest('.modal').remove();
                                resolve(input.value);
                            ">
                                ${confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Focus input and handle Enter key
            const input = modal.querySelector('#prompt-input');
            input.focus();
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    modal.remove();
                    resolve(input.value);
                } else if (e.key === 'Escape') {
                    modal.remove();
                    resolve(null);
                }
            });
            
            // Auto-remove if user clicks outside modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(null);
                }
            });
        });
    }
}
// Make NotificationSystem available globally
window.NotificationSystem = NotificationSystem;
