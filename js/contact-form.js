/**
 * G-WAC Contact Form Handler
 * Handles form submission and email protection for coordinators
 */

class ContactFormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupEmailProtection();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    async handleFormSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('form-status');
        
        // Get form data
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form data
        if (!name || !email || !subject || !message) {
            this.showFormStatus('Please fill in all required fields.', 'error');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        this.showFormStatus('Sending your message...', 'info');
        
        try {
            // Create email content
            const emailContent = this.createEmailContent(name, email, subject, message);
            
            // Send email using mailto link (fallback method)
            // In production, this would be replaced with a server-side email service
            const mailtoLink = `mailto:info@g-wac.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
            
            // Try to open email client
            const emailWindow = window.open(mailtoLink);
            
            if (emailWindow) {
                // Success - email client opened
                this.showFormStatus('Email client opened successfully! Please send the email manually.', 'success');
                form.reset();
                
                // Close the email window after a delay
                setTimeout(() => {
                    if (emailWindow && !emailWindow.closed) {
                        emailWindow.close();
                    }
                }, 3000);
            } else {
                // Fallback - show email content for manual copy
                this.showFormStatus('Email client could not be opened. Please copy the message below and send it manually to info@g-wac.org', 'info');
                this.showEmailContent(name, email, subject, message);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormStatus('An error occurred. Please try again or contact us directly at info@g-wac.org', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    }

    createEmailContent(name, email, subject, message) {
        return `Hello G-WAC Team,

I'm contacting you through the G-WAC website contact form.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the G-WAC website contact form.
Please respond to: ${email}

Best regards,
${name}`;
    }

    showEmailContent(name, email, subject, message) {
        const statusDiv = document.getElementById('form-status');
        const emailContent = this.createEmailContent(name, email, subject, message);
        
        statusDiv.innerHTML = `
            <div class="email-content-display">
                <h4>Email Content to Copy:</h4>
                <div class="email-details">
                    <p><strong>To:</strong> info@g-wac.org</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                </div>
                <div class="email-body">
                    <pre>${emailContent}</pre>
                </div>
                <button class="btn btn-outline" onclick="navigator.clipboard.writeText('${emailContent.replace(/'/g, "\\'")}')">
                    <i class="fas fa-copy"></i> Copy to Clipboard
                </button>
            </div>
        `;
        
        statusDiv.style.display = 'block';
        statusDiv.className = 'form-status info';
    }

    showFormStatus(message, type) {
        const statusDiv = document.getElementById('form-status');
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        statusDiv.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }

    setupEmailProtection() {
        const protectedEmails = document.querySelectorAll('.protected-email');
        
        protectedEmails.forEach(element => {
            element.addEventListener('click', (e) => this.revealEmail(e));
        });
    }

    revealEmail(event) {
        const element = event.currentTarget;
        const email = element.dataset.email;
        
        if (element.classList.contains('revealed')) {
            return; // Already revealed
        }
        
        // Reveal the email
        element.innerHTML = `<i class="fas fa-envelope"></i> ${email}`;
        element.classList.add('revealed');
        
        // Add copy functionality
        element.addEventListener('click', () => {
            navigator.clipboard.writeText(email).then(() => {
                const originalText = element.innerHTML;
                element.innerHTML = '<i class="fas fa-check"></i> Copied!';
                element.style.background = 'var(--success-color)';
                element.style.borderColor = 'var(--success-color)';
                
                setTimeout(() => {
                    element.innerHTML = originalText;
                    element.style.background = '';
                    element.style.borderColor = '';
                }, 2000);
            });
        });
        
        // Show success message
        this.showNotification(`Email address revealed: ${email}`, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactFormHandler = new ContactFormHandler();
    
    // Newsletter functionality
    const newsletterBtn = document.querySelector('.newsletter-btn');
    const newsletterInput = document.querySelector('.newsletter-input');
    
    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', () => {
            const email = newsletterInput.value.trim();
            if (email && isValidEmail(email)) {
                // Show success message
                showNewsletterMessage('Thank you! You\'ll be notified about future courses and events.', 'success');
                newsletterInput.value = '';
            } else {
                showNewsletterMessage('Please enter a valid email address.', 'error');
            }
        });
        
        newsletterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                newsletterBtn.click();
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNewsletterMessage(message, type) {
        const existingMessage = document.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `newsletter-message ${type}`;
        messageDiv.textContent = message;
        
        const newsletterSection = document.querySelector('.footer-newsletter');
        newsletterSection.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});
