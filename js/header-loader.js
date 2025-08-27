// Universal Header Loader - Dynamically loads the G-WAC header into all pages
class HeaderLoader {
    constructor() {
        this.headerLoaded = false;
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.isLabPage = this.currentPage.startsWith('lab_');
        this.isCoursePage = this.currentPage.includes('.html') && !this.isLabPage && this.currentPage !== 'index.html';
        this.init();
    }

    async init() {
        try {
            // Load header for all pages except index.html
            if (this.currentPage !== 'index.html') {
                await this.loadHeader();
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    async loadHeader() {
        if (this.headerLoaded) return;

        try {
            // Load the header HTML
            const response = await fetch('../header.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const headerHtml = await response.text();
            
            // Insert header at the beginning of the body
            const body = document.body;
            const firstChild = body.firstChild;
            
            // Create a temporary container to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = headerHtml;
            
            // Insert header elements before the first child
            while (tempDiv.firstChild) {
                body.insertBefore(tempDiv.firstChild, firstChild);
            }
            
            this.headerLoaded = true;
            console.log('G-WAC header loaded successfully');
            
            // Update active navigation state
            this.updateActiveNavigation();
            
        } catch (error) {
            console.error('Failed to load header:', error);
            // Fallback: create a simple header
            this.createFallbackHeader();
        }
    }

    updateActiveNavigation() {
        // Update active state in lab navigation
        const labLinks = document.querySelectorAll('#menu nav ol li a');
        labLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === this.currentPage) {
                link.classList.add('active');
            }
        });

        // Update main navigation active state
        const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            // Determine which section this page belongs to
            if (this.isLabPage) {
                // Lab pages are part of Git & GitHub section
                if (link.textContent.includes('Part 1: Git & GitHub')) {
                    link.classList.add('active');
                }
            } else if (this.isCoursePage) {
                // Course pages are part of Modeling section
                if (link.textContent.includes('Part 2: Modeling')) {
                    link.classList.add('active');
                }
            }
        });
    }

    createFallbackHeader() {
        const fallbackHeader = document.createElement('header');
        fallbackHeader.className = 'main-header fallback-header';
        fallbackHeader.innerHTML = `
            <div class="header-container">
                <div class="logo-section">
                    <img src="../images/g-wac-logo.jpeg" alt="G-WAC Logo" class="g-wac-logo">
                    <div class="title-section">
                        <h1 class="main-title">G-WAC Short Course</h1>
                        <p class="header-subtitle">Git, GitHub & Infectious Disease Modeling</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertBefore(fallbackHeader, document.body.firstChild);
        console.log('Fallback header created');
    }
}

// Initialize header loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HeaderLoader();
});
