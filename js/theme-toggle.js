// Theme Toggle System for G-WAC Short Course
class ThemeToggle {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.createThemeToggle();
        this.applyTheme();
        this.setupEventListeners();
    }

    createThemeToggle() {
        // Create theme toggle button
        const header = document.querySelector('.header-container');
        if (header) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle-btn';
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.innerHTML = `
                <span class="theme-icon light-icon">☀️</span>
                <span class="theme-icon dark-icon">🌙</span>
            `;
            
            // Insert after the course-info div
            const courseInfo = header.querySelector('.course-info');
            if (courseInfo) {
                courseInfo.parentNode.insertBefore(themeToggle, courseInfo.nextSibling);
            }
        }
    }

    setupEventListeners() {
        // Theme toggle button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle-btn')) {
                this.toggleTheme();
            }
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    }

    getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('g-wac-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('g-wac-theme', theme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setStoredTheme(this.currentTheme);
        this.applyTheme();
        this.animateToggle();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme toggle button appearance
        const themeToggle = document.querySelector('.theme-toggle-btn');
        if (themeToggle) {
            themeToggle.setAttribute('data-theme', this.currentTheme);
        }

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = this.currentTheme === 'dark' 
            ? '#2c2c2c' 
            : '#1a5f7a';
    }

    animateToggle() {
        const themeToggle = document.querySelector('.theme-toggle-btn');
        if (themeToggle) {
            themeToggle.classList.add('theme-toggle-animate');
            setTimeout(() => {
                themeToggle.classList.remove('theme-toggle-animate');
            }, 300);
        }
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.currentTheme = theme;
            this.setStoredTheme(theme);
            this.applyTheme();
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeToggle = new ThemeToggle();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}
