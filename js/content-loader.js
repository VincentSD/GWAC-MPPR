/**
 * Main Site Content Loader
 * Loads content from JSON files and applies it to the main site
 */

class MainSiteContentLoader {
    constructor() {
        this.contentPath = 'content';
        this.baseUrl = 'https://api.github.com/repos/VincentSD/GWAC-MPPR/contents';
        this.loadedContent = {};
    }

    async init() {
        try {
            console.log('Initializing main site content loader...');
            await this.loadAllContent();
            this.applyContentToSite();
            console.log('Main site content loaded and applied successfully');
        } catch (error) {
            console.error('Error initializing content loader:', error);
        }
    }

    async loadAllContent() {
        try {
            // Load hero content first
            await this.loadHeroContent();
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async loadHeroContent() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.contentPath}/hero.json`);
            if (response.ok) {
                const data = await response.json();
                // Decode content from GitHub API response
                const content = atob(data.content);
                this.loadedContent.hero = JSON.parse(content);
                console.log('Hero content loaded:', this.loadedContent.hero);
            } else if (response.status === 404) {
                console.log('Hero content file not found yet, using default content');
                this.loadedContent.hero = null;
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading hero content:', error);
            this.loadedContent.hero = null;
        }
    }

    applyContentToSite() {
        try {
            this.applyHeroContent();
        } catch (error) {
            console.error('Error applying content to site:', error);
        }
    }

    applyHeroContent() {
        if (!this.loadedContent.hero) {
            console.log('No hero content to apply, using default HTML content');
            return;
        }

        const heroData = this.loadedContent.hero;
        console.log('Applying hero content:', heroData);

        // Update hero title
        const heroTitle = document.querySelector('.hero-title .highlight');
        if (heroTitle && heroData.title) {
            heroTitle.textContent = heroData.title;
        }

        // Update hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle && heroData.subtitle) {
            heroSubtitle.textContent = heroData.subtitle;
        }

        // Update hero dates
        const heroDates = document.querySelector('.hero-dates');
        if (heroDates && heroData.dates) {
            heroDates.textContent = heroData.dates;
        }

        // Update hero location
        const heroLocation = document.querySelector('.hero-location');
        if (heroLocation && heroData.location) {
            heroLocation.textContent = heroLocation.textContent.replace(/KNUST, Kumasi, Ghana/, heroData.location);
        }

        // Update hero statistics
        if (heroData.stats) {
            this.updateHeroStats(heroData.stats);
        }

        console.log('Hero content applied successfully');
    }

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

        // Update experts
        const expertsElement = document.querySelector('.stat-item:nth-child(4) .stat-number');
        if (expertsElement && stats.experts) {
            expertsElement.textContent = stats.experts;
        }
    }

    async refreshContent() {
        try {
            console.log('Refreshing content...');
            await this.loadAllContent();
            this.applyContentToSite();
            console.log('Content refreshed successfully');
        } catch (error) {
            console.error('Error refreshing content:', error);
        }
    }

    getContent(type) {
        return this.loadedContent[type] || null;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.contentLoader = new MainSiteContentLoader();
    await contentLoader.init();
});
