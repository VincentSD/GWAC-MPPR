/**
 * Content Loader for Main Site
 * Loads content from JSON files and applies it to the HTML
 */

class MainSiteContentLoader {
    constructor() {
        this.contentPath = 'content';
        this.baseUrl = 'https://api.github.com/repos/VincentSD/GWAC-MPPR/contents';
        this.loadedContent = {};
    }

    /**
     * Initialize content loading
     */
    async init() {
        try {
            await this.loadAllContent();
            this.applyContentToSite();
        } catch (error) {
            console.error('Error initializing content loader:', error);
        }
    }

    /**
     * Load all content from JSON files
     */
    async loadAllContent() {
        try {
            // Load hero content
            this.loadedContent.hero = await this.loadHeroContent();
            
            // Load other content as needed
            // this.loadedContent.schedule = await this.loadScheduleContent();
            // this.loadedContent.facilitators = await this.loadFacilitatorsContent();
            
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    /**
     * Load hero content from JSON
     */
    async loadHeroContent() {
        try {
            // First try to load from the content directory
            const response = await fetch(`${this.baseUrl}/${this.contentPath}/hero.json`);
            if (response.ok) {
                const data = await response.json();
                // Decode content from GitHub API response
                const content = atob(data.content);
                return JSON.parse(content);
            }
        } catch (error) {
            console.log('Content directory not found, using default content');
        }
        
        // Return default content if loading fails
        return {
            title: "G-WAC Summer School 2025",
            subtitle: "Join the German-West African Centre for Global Health and Pandemic Prevention for an intensive 9-day program featuring hands-on disease modeling, R programming, and practical training for pandemic preparedness in Africa.",
            dates: "September 1-10, 2025",
            location: "KNUST, Kumasi, Ghana",
            stats: {
                days: 9,
                hours: 72,
                modules: 5,
                experts: 10
            }
        };
    }

    /**
     * Apply loaded content to the site
     */
    applyContentToSite() {
        this.applyHeroContent();
    }

    /**
     * Apply hero content to the site
     */
    applyHeroContent() {
        const hero = this.loadedContent.hero;
        if (!hero) return;

        // Update hero title
        const heroTitle = document.querySelector('.hero-title .highlight');
        if (heroTitle && hero.title) {
            heroTitle.textContent = hero.title;
        }

        // Update hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && hero.subtitle) {
            heroSubtitle.textContent = hero.subtitle;
        }

        // Update hero dates (if there's a dates element)
        const heroDates = document.querySelector('.hero-dates');
        if (heroDates && hero.dates) {
            heroDates.textContent = hero.dates;
        }

        // Update hero location (if there's a location element)
        const heroLocation = document.querySelector('.hero-location');
        if (heroLocation && hero.location) {
            heroLocation.textContent = hero.location;
        }

        // Update statistics
        if (hero.stats) {
            this.updateHeroStats(hero.stats);
        }
    }

    /**
     * Update hero statistics
     */
    updateHeroStats(stats) {
        // Update days
        const daysElement = document.querySelector('.stat-item:nth-child(1) .stat-number');
        if (daysElement && stats.days) {
            daysElement.textContent = stats.days;
        }

        // Update hours
        const hoursElement = document.querySelector('.stat-item:nth-child(2) .stat-number');
        if (hoursElement && stats.hours) {
            hoursElement.textContent = stats.hours;
        }

        // Update learning modules
        const modulesElement = document.querySelector('.stat-item:nth-child(3) .stat-number');
        if (modulesElement && stats.modules) {
            modulesElement.textContent = stats.modules;
        }

        // Update experts - preserve the "+" if it exists in the original text
        const expertsElement = document.querySelector('.stat-item:nth-child(4) .stat-number');
        if (expertsElement && stats.experts) {
            const originalText = expertsElement.textContent;
            const hasPlus = originalText.includes('+');
            expertsElement.textContent = hasPlus ? `${stats.experts}+` : stats.experts;
        }
    }

    /**
     * Refresh content from server
     */
    async refreshContent() {
        await this.loadAllContent();
        this.applyContentToSite();
    }

    /**
     * Get loaded content
     */
    getContent(type) {
        return this.loadedContent[type];
    }
}

// Initialize content loader when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.contentLoader = new MainSiteContentLoader();
    await contentLoader.init();
});
