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
        this.loadStudentCount();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupProgressTracking();
        this.setupAnimations();
        this.setupBackToTop();
        this.setupNavigation();
        this.setupSIRGraph();
        
        // Initialize accordion for all schedule parts
        setTimeout(() => {
            this.setupScheduleAccordion();
        }, 100);
        
        // Update session counts dynamically
        setTimeout(() => {
            this.updateSessionCounts();
        }, 200);
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
        // Set up accordion for all schedule parts (no more tabs)
        const scheduleContainer = document.querySelector('.schedule-container');
        if (!scheduleContainer) {
            console.log('Schedule container not found');
            return;
        }
        
        const accordionHeaders = scheduleContainer.querySelectorAll('.accordion-header');
        // Found accordion headers
        
        // Remove existing event listeners to prevent duplicates
        accordionHeaders.forEach(header => {
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
        });
        
        // Get fresh references after cloning
        const freshHeaders = scheduleContainer.querySelectorAll('.accordion-header');
        
        freshHeaders.forEach((header, index) => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');
                
                // Close all other accordions
                freshHeaders.forEach(h => {
                    h.classList.remove('active');
                    const hContent = h.nextElementSibling;
                    if (hContent && hContent.classList.contains('accordion-content')) {
                        hContent.classList.remove('active');
                    }
                });
                
                // Toggle current accordion
                if (!isActive) {
                    header.classList.add('active');
                    if (content && content.classList.contains('accordion-content')) {
                        content.classList.add('active');
                    }
                }
            });
        });
        
        // Open first day by default
        const firstHeader = freshHeaders[0];
        if (firstHeader) {
            firstHeader.classList.add('active');
            const firstContent = firstHeader.nextElementSibling;
            if (firstContent && firstContent.classList.contains('accordion-content')) {
                firstContent.classList.add('active');
            }
        }
        
        // Setup accordions successfully
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
        
        /**
         * Setup animated SIR model graph
         */
        setupSIRGraph() {
            const canvas = document.getElementById('sirCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Make canvas responsive
            function resizeCanvas() {
                const container = canvas.parentElement;
                const containerWidth = container.clientWidth;
                const maxWidth = Math.min(containerWidth - 40, 400); // 40px for padding
                
                canvas.style.width = maxWidth + 'px';
                canvas.style.height = (maxWidth * 0.75) + 'px'; // 4:3 aspect ratio
                
                // Set actual canvas dimensions for high DPI displays
                const scale = window.devicePixelRatio || 1;
                canvas.width = maxWidth * scale;
                canvas.height = (maxWidth * 0.75) * scale;
                
                // Scale the context to ensure correct drawing
                ctx.scale(scale, scale);
            }
            
            // Initial resize
            resizeCanvas();
            
            // Resize on window resize
            window.addEventListener('resize', resizeCanvas);
            
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            // SIR model parameters
            const beta = 0.3;  // Transmission rate
            const gamma = 0.1; // Recovery rate
            const N = 1000;    // Total population
            const I0 = 10;     // Initial infected
            const S0 = N - I0; // Initial susceptible
            const R0 = 0;      // Initial recovered
            
            let time = 0;
            let S = S0, I = I0, R = R0;
            
            function animate() {
                // Clear canvas
                ctx.clearRect(0, 0, width, height);
                
                // Update SIR values
                const dS = -beta * S * I / N;
                const dI = beta * S * I / N - gamma * I;
                const dR = gamma * I;
                
                S += dS;
                I += dI;
                R += dR;
                time += 0.1;
                
                // Draw grid
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                for (let i = 0; i < width; i += 40) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, height);
                    ctx.stroke();
                }
                for (let i = 0; i < height; i += 40) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(i, height);
                    ctx.stroke();
                }
                
                // Draw SIR curves
                const scaleX = width / 100;
                const scaleY = height / N;
                
                // Susceptible (Blue)
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, height - S0 * scaleY);
                for (let t = 0; t <= time; t += 0.1) {
                    const St = S0 * Math.exp(-beta * t);
                    const x = t * scaleX;
                    const y = height - St * scaleY;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Infected (Red)
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, height - I0 * scaleY);
                for (let t = 0; t <= time; t += 0.1) {
                    const It = I0 * Math.exp((beta - gamma) * t);
                    const x = t * scaleX;
                    const y = height - It * scaleY;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Recovered (Green)
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, height - R0 * scaleY);
                for (let t = 0; t <= time; t += 0.1) {
                    const Rt = N - S0 * Math.exp(-beta * t) - I0 * Math.exp((beta - gamma) * t);
                    const x = t * scaleX;
                    const y = height - Rt * scaleY;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Draw SIR model equations in the top-right corner of canvas
                ctx.font = '10px Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                
                // Background for equations
                const eqX = width - 120;
                const eqY = 20;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(eqX - 5, eqY - 15, 125, 80);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.strokeRect(eqX - 5, eqY - 15, 125, 80);
                
                // Equations
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = 'bold 10px Arial';
                ctx.fillText('SIR Model', eqX, eqY);
                ctx.font = '9px Arial';
                ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
                ctx.fillText('dS/dt = -βSI/N', eqX, eqY + 15);
                ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
                ctx.fillText('dI/dt = βSI/N - γI', eqX, eqY + 30);
                ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
                ctx.fillText('dR/dt = γI', eqX, eqY + 45);
                
                // Parameters
                ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                ctx.fillText('β = 0.3, γ = 0.1, R₀ = 3.0', eqX, eqY + 60);
                
                // Reset animation when complete
                if (time > 100) {
                    time = 0;
                    S = S0, I = I0, R = R0;
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();
        }
        
        /**
         * Update session counts dynamically by counting actual session cards
         * Excludes lunch breaks and dinner socials from the count
         */
        updateSessionCounts() {
            try {
                const dayAccordions = document.querySelectorAll('.day-accordion');
                // Found day accordions total
                
                dayAccordions.forEach((accordion, index) => {
                    // Processing accordion
                    const sessionCountElement = accordion.querySelector('.session-count');
                    if (!sessionCountElement) return;
                    
                    const dayName = accordion.querySelector('.day-name')?.textContent;
                    
                    // Debug: Log all session cards first
                    const scheduleGrid = accordion.querySelector('.schedule-grid');
                    if (!scheduleGrid) {
                        // No schedule-grid found
                        return;
                    }
                    
                    const allSessionCards = scheduleGrid.querySelectorAll('.session-card');
                    // Found session cards in schedule-grid
                    
                    // Log each card with its classes
                    allSessionCards.forEach((card, index) => {
                        const classes = Array.from(card.classList).join(', ');
                        const title = card.querySelector('h4')?.textContent || 'No title';
                        // Session card details
                    });
                    
                    // Count only actual learning sessions (exclude lunch, dinner, breaks)
                    let actualSessionCount = 0;
                    allSessionCards.forEach(card => {
                        const hasLunchClass = card.classList.contains('lunch');
                        const hasDinnerClass = card.classList.contains('dinner');
                        const hasSpecialEventClass = card.classList.contains('special-event');
                        
                        if (!hasLunchClass && !hasDinnerClass && !hasSpecialEventClass) {
                            actualSessionCount++;
                        }
                    });
                    
                    // Update the display
                    if (actualSessionCount === 1) {
                        sessionCountElement.textContent = '1 Session';
                    } else {
                        sessionCountElement.textContent = `${actualSessionCount} Sessions`;
                    }
                    
                    // Final session count
                });
                
                // Session counts updated successfully
            } catch (error) {
                console.error('Error updating session counts:', error);
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
