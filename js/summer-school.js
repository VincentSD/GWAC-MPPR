/**
 * G-WAC Summer School 2025 - Interactive Features
 * Handles schedule navigation, student portal, and dynamic content
 */

class SummerSchoolManager {
    constructor() {
        this.currentWeek = 1;
        this.totalStudents = 0;
        this.init();
    }

                    init() {
                    this.setupScheduleNavigation();
                    this.loadStudentCount();
                    this.setupSmoothScrolling();
                    this.setupMobileMenu();
                    this.setupContactForm();
                    this.setupProgressTracking();
                    this.setupAnimations();
                    this.setupBackToTop();
                    this.setupNavigation();
                    
                    // Debug: Check if week-2 exists at all
                    setTimeout(() => {
                        const week2 = document.getElementById('week-2');
                        console.log('=== INIT DEBUG ===');
                        console.log('week-2 element exists:', !!week2);
                        if (week2) {
                            console.log('week-2 HTML:', week2.outerHTML.substring(0, 200) + '...');
                            console.log('week-2 children count:', week2.children.length);
                        }
                        console.log('All week-content elements:', document.querySelectorAll('.week-content').length);
                        console.log('week-1:', document.getElementById('week-1'));
                        console.log('week-2:', document.getElementById('week-2'));
                        console.log('=== END INIT DEBUG ===');
                    }, 200);
                    
                    // Initialize accordion for the first week only with a delay
                    setTimeout(() => {
                        this.setupScheduleAccordion();
                    }, 100);
                }

    /**
     * Setup schedule week navigation
     */
    setupScheduleNavigation() {
        const navButtons = document.querySelectorAll('.timeline-nav-btn');
        const weekContents = document.querySelectorAll('.week-content');
        
        console.log('Found', navButtons.length, 'navigation buttons');
        navButtons.forEach((button, index) => {
            console.log('Button', index, 'data-week:', button.dataset.week, 'text:', button.textContent.trim());
            
            button.addEventListener('click', () => {
                const targetWeek = button.dataset.week;
                console.log('Button clicked for week:', targetWeek);
                this.switchWeek(targetWeek);
            });
        });
    }

    /**
     * Switch between week 1 and week 2
     */
    switchWeek(weekNumber) {
        console.log('switchWeek called with:', weekNumber);
        
        // Update navigation buttons
        document.querySelectorAll('.timeline-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const targetButton = document.querySelector(`[data-week="${weekNumber}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            console.log('Updated button:', targetButton.textContent.trim());
        } else {
            console.error('Button not found for week:', weekNumber);
        }

        // Update week content
        document.querySelectorAll('.week-content').forEach(content => {
            content.classList.remove('active');
            console.log('Removed active from:', content.id);
        });
        
        const targetWeek = document.getElementById(`week-${weekNumber}`);
        if (targetWeek) {
            targetWeek.classList.add('active');
            console.log('Added active to:', targetWeek.id);
            
            // Debug: Check if the element is actually in the DOM
            console.log('Target week element:', targetWeek);
            console.log('Target week display style:', window.getComputedStyle(targetWeek).display);
            console.log('Target week visibility:', window.getComputedStyle(targetWeek).visibility);
            console.log('Target week height:', window.getComputedStyle(targetWeek).height);
            console.log('Target week has content:', targetWeek.children.length, 'children');
        } else {
            console.error('Week content not found for week:', weekNumber);
        }

        this.currentWeek = parseInt(weekNumber);
        
        // Add smooth transition effect
        const activeContent = document.getElementById(`week-${weekNumber}`);
        if (activeContent) {
            // Force a reflow to ensure the initial state is applied
            activeContent.offsetHeight;
            
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px)';
            
            // Use requestAnimationFrame for smoother transitions
            requestAnimationFrame(() => {
                activeContent.style.transition = 'all 0.5s ease';
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
                
                // Ensure transition completes
                setTimeout(() => {
                    // Reinitialize accordion for the newly active week
                    this.setupScheduleAccordion();
                }, 550); // Wait for transition to complete
            });
        }
    }

    /**
     * Load student count from Excel data (placeholder for now)
     */
    loadStudentCount() {
        // In a real implementation, this would fetch data from the Excel file
        // For now, we'll use a placeholder number
        this.totalStudents = 52; // Based on your Excel file
        
        const studentCountElement = document.getElementById('total-students');
        if (studentCountElement) {
            studentCountElement.textContent = this.totalStudents;
        }

        // Update progress tracking
        this.updateProgressDisplay();
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update active navigation
                    this.updateActiveNavigation(targetId);
                }
            });
        });
    }

    /**
     * Update active navigation state
     */
    updateActiveNavigation(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (mobileMenuToggle && mainNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('mobile-open');
                mobileMenuToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navLinks = mainNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('mobile-open');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
    }

    /**
     * Setup contact form functionality
     */
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });
        }
    }

    /**
     * Handle contact form submission
     */
    handleContactFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (!this.validateContactForm(data)) {
            return;
        }

        // Show success message (in real implementation, this would send to server)
        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
    }

    /**
     * Validate contact form data
     */
    validateContactForm(data) {
        const requiredFields = ['name', 'email', 'subject', 'message'];
        
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showNotification(`Please fill in the ${field} field.`, 'error');
                return false;
            }
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Setup progress tracking for student dashboard
     */
    setupProgressTracking() {
        // Simulate progress based on current date
        this.updateProgressDisplay();
    }

    /**
     * Update progress display
     */
    updateProgressDisplay() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            // Calculate progress based on current date relative to course dates
            const courseStart = new Date('2025-07-14');
            const courseEnd = new Date('2025-07-25');
            const now = new Date();
            
            let progress = 0;
            if (now >= courseStart) {
                if (now >= courseEnd) {
                    progress = 100;
                } else {
                    const totalDuration = courseEnd - courseStart;
                    const elapsed = now - courseStart;
                    progress = Math.min((elapsed / totalDuration) * 100, 100);
                }
            }
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }
    }

    /**
     * Setup animations and interactions
     */
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.course-card, .dashboard-card, .resource-category');
        animateElements.forEach(el => {
            observer.observe(el);
        });

        // Add floating animation to hero cards
        this.setupFloatingCards();
    }

    /**
     * Setup floating cards animation
     */
    setupFloatingCards() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        floatingCards.forEach((card, index) => {
            // Add staggered animation delay
            card.style.animationDelay = `${index * 2}s`;
            
            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) rotate(2deg)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    /**
     * Setup back to top button
     */
    setupBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        
        if (backToTopButton) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('show');
                } else {
                    backToTopButton.classList.remove('show');
                }
            });
            
            // Smooth scroll to top when clicked
            backToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Setup navigation scroll effects and active state
     */
    setupNavigation() {
        const navigation = document.querySelector('.top-navigation');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (navigation) {
            // Add scroll effect
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 100) {
                    navigation.classList.add('scrolled');
                } else {
                    navigation.classList.remove('scrolled');
                }
            });
            
            // Update active navigation based on scroll position
            window.addEventListener('scroll', () => {
                const sections = document.querySelectorAll('section[id]');
                const scrollPos = window.pageYOffset + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            });
        }
    }
    
    /**
     * Setup schedule accordion functionality
     */
    setupScheduleAccordion() {
        // Only set up accordion for the currently active week
        const activeWeek = document.querySelector('.week-content.active');
        if (!activeWeek) {
            console.error('No active week found for accordion setup');
            return;
        }
        
        console.log('Setting up accordion for week:', activeWeek.id);
        
        const accordionHeaders = activeWeek.querySelectorAll('.accordion-header');
        console.log('Found', accordionHeaders.length, 'accordion headers in', activeWeek.id);
        
        // Remove existing event listeners to prevent duplicates
        accordionHeaders.forEach(header => {
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
        });
        
        // Get fresh references after cloning
        const freshHeaders = activeWeek.querySelectorAll('.accordion-header');
        
        freshHeaders.forEach((header, index) => {
            console.log('Setting up header', index, ':', header.textContent.trim());
            
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');
                console.log('Accordion clicked:', header.textContent.trim(), 'isActive:', isActive);
                
                // Close all other accordions in this week
                freshHeaders.forEach(h => {
                    h.classList.remove('active');
                    h.nextElementSibling.classList.remove('active');
                });
                
                // Toggle current accordion
                if (!isActive) {
                    header.classList.add('active');
                    content.classList.add('active');
                    console.log('Opened accordion for:', header.textContent.trim());
                }
            });
        });
        
        // Open first day by default for this week
        const firstHeader = freshHeaders[0];
        if (firstHeader) {
            firstHeader.classList.add('active');
            firstHeader.nextElementSibling.classList.add('active');
            console.log('Opened first accordion by default for week:', activeWeek.id);
        }
    }

    /**
     * Get current course progress
     */
    getCourseProgress() {
        // This would integrate with your actual course completion system
        return {
            mathematicalFoundations: 0,
            epidemiologicalModeling: 0,
            computationalMethods: 0,
            dataAnalysis: 0,
            collaborativeResearch: 0
        };
    }

    /**
     * Update student dashboard with real-time data
     */
    updateDashboard() {
        // Update student count
        this.loadStudentCount();
        
        // Update progress
        this.updateProgressDisplay();
        
        // Update any other dynamic content
        this.updateScheduleStatus();
    }

    /**
     * Update schedule status (current day highlighting)
     */
    updateScheduleStatus() {
        const today = new Date();
        const courseStart = new Date('2025-07-14');
        const courseEnd = new Date('2025-07-25');
        
        if (today >= courseStart && today <= courseEnd) {
            // Highlight current day in schedule
            const currentDay = today.getDay();
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = dayNames[currentDay];
            
            // Find and highlight current day in schedule
            const dayHeaders = document.querySelectorAll('.day-header h3');
            dayHeaders.forEach(header => {
                if (header.textContent.includes(currentDayName)) {
                    header.closest('.day-schedule').classList.add('current-day');
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.summerSchool = new SummerSchoolManager();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .current-day {
            border-left-color: #10b981 !important;
            background: #ecfdf5 !important;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .main-nav.mobile-open {
            display: flex !important;
        }
        
        @media (max-width: 768px) {
            .main-nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }
            
            .nav-list {
                flex-direction: column;
                gap: 16px;
            }
            
            .mobile-menu-toggle.active .fa-bars::before {
                content: "\\f00d";
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SummerSchoolManager;
}
