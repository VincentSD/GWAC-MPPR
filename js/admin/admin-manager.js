/**
 * G-WAC Admin Manager
 * Main class for managing the admin panel and content management system
 */

class AdminManager {
    constructor() {
        this.isAuthenticated = false;
        this.githubToken = null;
        this.currentSection = 'dashboard';
        this.contentData = {};
        this.unsavedChanges = new Set();
        
        // Initialize managers
        this.contentLoader = null;
        this.scheduleManager = null;
        this.facilitatorsManager = null;
        this.materialsManager = null;
        this.navigationManager = null;
        this.contactManager = null;
        this.resourcesManager = null;
        this.githubIntegration = null;
        this.notificationSystem = null;
    }

    async init() {
        try {
            // Initialize notification system first
            this.notificationSystem = new NotificationSystem();
            
            // Check authentication
            await this.checkAuthentication();
            
            if (!this.isAuthenticated) {
                this.showAuthModal();
                return;
            }
            
            // Initialize all managers
            await this.initializeManagers();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial content
            await this.loadDashboardData();
            
            this.notificationSystem.show('success', 'Admin Panel Ready', 'Welcome to the G-WAC Content Management System');
            
        } catch (error) {
            console.error('Error initializing admin manager:', error);
            this.notificationSystem.show('error', 'Initialization Error', 'Failed to initialize admin panel');
        }
    }

    async checkAuthentication() {
        // Check for stored GitHub token
        const storedToken = localStorage.getItem('github-token');
        if (storedToken) {
            this.githubToken = storedToken;
            this.isAuthenticated = true;
            return;
        }
        
        // Check if user has a token in the main site
        const mainSiteToken = localStorage.getItem('github-token');
        if (mainSiteToken) {
            this.githubToken = mainSiteToken;
            this.isAuthenticated = true;
            return;
        }
        
        this.isAuthenticated = false;
    }

    async initializeManagers() {
        // Initialize content loader
        this.contentLoader = new ContentLoader(this.githubToken);
        
        // Initialize GitHub integration
        this.githubIntegration = new GitHubIntegration(this.githubToken);
        
        // Initialize specialized managers
        this.scheduleManager = new ScheduleManager(this.githubIntegration);
        this.facilitatorsManager = new FacilitatorsManager(this.githubIntegration);
        this.materialsManager = new MaterialsManager(this.githubIntegration);
        this.navigationManager = new NavigationManager(this.githubIntegration);
        this.contactManager = new ContactManager(this.githubIntegration);
        this.resourcesManager = new ResourcesManager(this.githubIntegration);
        
        // Initialize all managers
        await Promise.all([
            this.scheduleManager.init(),
            this.facilitatorsManager.init(),
            this.materialsManager.init(),
            this.navigationManager.init(),
            this.contactManager.init(),
            this.resourcesManager.init()
        ]);
    }

    setupEventListeners() {
        // Navigation event listeners
        const navLinks = document.querySelectorAll('.admin-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Form change tracking
        this.setupFormChangeTracking();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupFormChangeTracking() {
        // Track changes in all form inputs
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.markAsChanged(input.id);
            });
            
            input.addEventListener('input', () => {
                this.markAsChanged(input.id);
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save all changes
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveAllChanges();
            }
            
            // Ctrl/Cmd + K to go to dashboard
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.switchSection('dashboard');
            }
            
            // Ctrl/Cmd + F to search in current section
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                this.focusSearchInCurrentSection();
            }
            
            // Esc to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    focusSearchInCurrentSection() {
        const activeSection = document.querySelector('.admin-section.active');
        if (!activeSection) return;
        
        const searchInput = activeSection.querySelector('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
    }

    switchSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.admin-nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Activate corresponding nav link
        const targetNavLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        
        this.currentSection = sectionName;
        
        // Load section-specific content
        this.loadSectionContent(sectionName);
    }

    async loadSectionContent(sectionName) {
        try {
            switch (sectionName) {
                case 'dashboard':
                    await this.loadDashboardData();
                    break;
                case 'hero-content':
                    await this.loadHeroContent();
                    break;
                case 'schedule':
                    await this.scheduleManager.loadSchedule();
                    break;
                case 'facilitators':
                    await this.facilitatorsManager.loadFacilitators();
                    this.facilitatorsManager.renderFacilitators();
                    break;
                case 'course-materials':
                    await this.materialsManager.loadCategories();
                    break;
                case 'navigation':
                    await this.navigationManager.loadMenuItems();
                    break;
                case 'contact-info':
                    await this.contactManager.loadContactInfo();
                    break;
                case 'resources':
                    await this.resourcesManager.loadResources();
                    break;
            }
        } catch (error) {
            console.error(`Error loading section ${sectionName}:`, error);
            this.notificationSystem.show('error', 'Loading Error', `Failed to load ${sectionName} content`);
        }
    }

    async loadDashboardData() {
        try {
            // Load counts for dashboard cards
            const facilitatorsCount = this.facilitatorsManager ? await this.facilitatorsManager.getCount() : 0;
            const sessionsCount = this.scheduleManager ? await this.scheduleManager.getCount() : 0;
            const materialsCount = this.materialsManager ? await this.materialsManager.getCount() : 0;
            const resourcesCount = this.resourcesManager ? await this.resourcesManager.getCount() : 0;
            
            // Update dashboard cards
            document.getElementById('facilitators-count').textContent = facilitatorsCount;
            document.getElementById('sessions-count').textContent = sessionsCount;
            document.getElementById('materials-count').textContent = materialsCount;
            document.getElementById('resources-count').textContent = resourcesCount;
            
            // Load additional analytics
            await this.loadDashboardAnalytics();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadDashboardAnalytics() {
        try {
            // Load facilitators by country
            const facilitatorsByCountry = this.facilitatorsManager ? await this.facilitatorsManager.getFacilitatorsByCountry() : {};
            
            // Load schedule statistics
            const scheduleStats = this.scheduleManager ? await this.scheduleManager.getScheduleStats() : {};
            
            // Update analytics sections
            this.updateAnalyticsCharts(facilitatorsByCountry, scheduleStats);
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    updateAnalyticsCharts(facilitatorsByCountry, scheduleStats) {
        // Update facilitators by country chart
        const countryChart = document.getElementById('facilitators-country-chart');
        if (countryChart && facilitatorsByCountry) {
            this.createCountryChart(countryChart, facilitatorsByCountry);
        }
        
        // Update schedule statistics
        const scheduleChart = document.getElementById('schedule-stats-chart');
        if (scheduleChart && scheduleStats) {
            this.createScheduleChart(scheduleChart, scheduleStats);
        }
    }

    createCountryChart(container, data) {
        const countries = Object.keys(data);
        const counts = Object.values(data);
        
        // Create a simple bar chart using CSS
        container.innerHTML = `
            <div class="chart-container">
                <h4>Facilitators by Country</h4>
                <div class="chart-bars">
                    ${countries.map((country, index) => `
                        <div class="chart-bar">
                            <div class="bar-label">${country}</div>
                            <div class="bar" style="height: ${(counts[index] / Math.max(...counts)) * 100}%"></div>
                            <div class="bar-value">${counts[index]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createScheduleChart(container, data) {
        // Create a simple schedule statistics display
        container.innerHTML = `
            <div class="chart-container">
                <h4>Schedule Overview</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${data.totalDays || 0}</div>
                        <div class="stat-label">Total Days</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${data.totalSessions || 0}</div>
                        <div class="stat-label">Total Sessions</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${data.totalHours || 0}</div>
                        <div class="stat-label">Total Hours</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Quick Actions
    quickAddFacilitator() {
        this.switchSection('facilitators');
        setTimeout(() => {
            this.addNewFacilitator();
        }, 100);
    }

    quickAddSession() {
        this.switchSection('schedule');
        setTimeout(() => {
            this.addNewDay();
        }, 100);
    }

    quickAddMaterial() {
        this.switchSection('course-materials');
        setTimeout(() => {
            this.addNewCategory();
        }, 100);
    }

    quickAddResource() {
        this.switchSection('resources');
        setTimeout(() => {
            this.addNewResource();
        }, 100);
    }

    quickViewStats() {
        // Toggle analytics visibility
        const analytics = document.querySelector('.dashboard-analytics');
        if (analytics) {
            analytics.style.display = analytics.style.display === 'none' ? 'block' : 'none';
        }
    }

    async quickBackup() {
        try {
            this.notificationSystem.show('info', 'Backup', 'Creating backup of all content...');
            await this.exportAllContent();
            this.notificationSystem.show('success', 'Backup Complete', 'All content has been exported successfully!');
        } catch (error) {
            this.notificationSystem.show('error', 'Backup Failed', 'Failed to create backup: ' + error.message);
        }
    }

    // Help System
    showHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.add('active');
        }
    }

    hideHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.remove('active');
        }
    }

    // Status Management
    updateStatus(text, type = 'ready') {
        const indicator = document.getElementById('admin-status-indicator');
        const statusText = document.getElementById('admin-status-text');
        
        if (indicator && statusText) {
            statusText.textContent = text;
            indicator.className = `status-indicator ${type}`;
        }
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('admin-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    showLoadingStatus(text = 'Loading...') {
        this.updateStatus(text, 'loading');
        this.updateProgress(0);
    }

    showReadyStatus(text = 'Ready') {
        this.updateStatus(text, 'ready');
        this.updateProgress(100);
    }

    showErrorStatus(text = 'Error occurred') {
        this.updateStatus(text, 'error');
        this.updateProgress(0);
    }

    async loadHeroContent() {
        try {
            const heroData = await this.contentLoader.loadHeroContent();
            this.populateHeroForm(heroData);
        } catch (error) {
            console.error('Error loading hero content:', error);
        }
    }

    populateHeroForm(data) {
        if (data.title) document.getElementById('hero-title').value = data.title;
        if (data.subtitle) document.getElementById('hero-subtitle').value = data.subtitle;
        if (data.dates) document.getElementById('hero-dates').value = data.dates;
        if (data.location) document.getElementById('hero-location').value = data.location;
        if (data.stats) {
            if (data.stats.days) document.getElementById('stat-days').value = data.stats.days;
            if (data.stats.hours) document.getElementById('stat-hours').value = data.stats.hours;
            if (data.stats.modules) document.getElementById('stat-modules').value = data.stats.modules;
            if (data.stats.experts) document.getElementById('stat-experts').value = data.stats.experts;
        }
    }

    // Hero Content Management
    async saveHeroContent() {
        try {
            const heroData = {
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value,
                dates: document.getElementById('hero-dates').value,
                location: document.getElementById('hero-location').value,
                stats: {
                    days: parseInt(document.getElementById('stat-days').value),
                    hours: parseInt(document.getElementById('stat-hours').value),
                    modules: parseInt(document.getElementById('stat-modules').value),
                    experts: parseInt(document.getElementById('stat-experts').value)
                }
            };
            
            await this.contentLoader.saveHeroContent(heroData);
            this.clearChanges('hero-content');
            this.notificationSystem.show('success', 'Hero Content Saved', 'Hero section content has been updated successfully');
            
        } catch (error) {
            console.error('Error saving hero content:', error);
            this.notificationSystem.show('error', 'Save Error', 'Failed to save hero content');
        }
    }

    resetHeroContent() {
        if (confirm('Are you sure you want to reset the hero content to default values?')) {
            this.loadHeroContent();
            this.clearChanges('hero-content');
        }
    }

    // Schedule Management
    addNewDay() {
        this.scheduleManager.addNewDay();
    }

    importSchedule() {
        this.scheduleManager.importSchedule();
    }

    saveScheduleDayEdit() {
        this.scheduleManager.saveDayEdit();
    }

    saveSchedulePartEdit() {
        this.scheduleManager.savePartEdit();
    }

    saveScheduleSessionEdit() {
        this.scheduleManager.saveSessionEdit();
    }

    // Facilitators Management
    addNewFacilitator() {
        this.facilitatorsManager.addNewFacilitator();
    }

    editFacilitator(facilitatorId) {
        this.facilitatorsManager.editFacilitator(facilitatorId);
    }

    deleteFacilitator(facilitatorId) {
        this.facilitatorsManager.deleteFacilitator(facilitatorId);
    }

    saveFacilitatorEdit() {
        this.facilitatorsManager.saveFacilitatorEdit();
    }

    closeFacilitatorModal() {
        this.facilitatorsManager.closeModal();
    }

    importFacilitators() {
        this.facilitatorsManager.importFacilitators();
    }

    toggleFacilitatorsSortOrder() {
        this.facilitatorsManager.toggleSortOrder();
    }

    bulkActivateFacilitators() {
        this.facilitatorsManager.bulkActivateFacilitators();
    }

    bulkDeactivateFacilitators() {
        this.facilitatorsManager.bulkDeactivateFacilitators();
    }

    // Course Materials Management
    addNewCategory() {
        this.materialsManager.addNewCategory();
    }

    manageFileUploads() {
        // Redirect to main site file management
        window.open('index.html#course-materials', '_blank');
    }

    // Navigation Management
    addNewMenuItem() {
        this.navigationManager.addNewMenuItem();
    }

    reorderMenu() {
        this.navigationManager.reorderMenu();
    }

    // Contact Management
    addNewContact() {
        this.contactManager.addNewContact();
    }

    manageEmailProtection() {
        this.contactManager.manageEmailProtection();
    }

    // Resources Management
    addNewResource() {
        this.resourcesManager.addNewResource();
    }

    importResources() {
        this.resourcesManager.importResources();
    }

    // Global Operations
    async refreshAllContent() {
        try {
            this.showLoadingStatus('Refreshing content...');
            this.updateProgress(10);
            
            this.notificationSystem.show('info', 'Refreshing Content', 'Loading fresh content from repository...');
            
            this.updateProgress(30);
            await this.scheduleManager.loadSchedule();
            
            this.updateProgress(50);
            await this.facilitatorsManager.loadFacilitators();
            
            this.updateProgress(70);
            await Promise.all([
                this.materialsManager.loadCategories(),
                this.navigationManager.loadMenuItems(),
                this.contactManager.loadContactInfo(),
                this.resourcesManager.loadResources()
            ]);
            
            this.updateProgress(90);
            await this.loadDashboardData();
            
            this.updateProgress(100);
            this.showReadyStatus('Content refreshed');
            
            this.notificationSystem.show('success', 'Content Refreshed', 'All content has been refreshed successfully');
            
        } catch (error) {
            console.error('Error refreshing content:', error);
            this.showErrorStatus('Refresh failed');
            this.notificationSystem.show('error', 'Refresh Error', 'Failed to refresh some content');
        }
    }

    async exportAllContent() {
        try {
            const allContent = {
                hero: await this.contentLoader.loadHeroContent(),
                schedule: await this.scheduleManager.exportSchedule(),
                facilitators: await this.facilitatorsManager.exportFacilitators(),
                materials: await this.materialsManager.exportCategories(),
                navigation: await this.navigationManager.exportMenuItems(),
                contact: await this.contactManager.exportContactInfo(),
                resources: await this.resourcesManager.exportResources()
            };
            
            // Create and download JSON file
            const blob = new Blob([JSON.stringify(allContent, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gwac-content-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.notificationSystem.show('success', 'Content Exported', 'All content has been exported successfully');
            
        } catch (error) {
            console.error('Error exporting content:', error);
            this.notificationSystem.show('error', 'Export Error', 'Failed to export content');
        }
    }

    async saveAllChanges() {
        try {
            if (this.unsavedChanges.size === 0) {
                this.notificationSystem.show('info', 'No Changes', 'No unsaved changes to save');
                return;
            }
            
            this.notificationSystem.show('info', 'Saving Changes', 'Saving all unsaved changes...');
            
            // Save changes for each section
            const savePromises = [];
            
            if (this.unsavedChanges.has('hero-content')) {
                savePromises.push(this.saveHeroContent());
            }
            
            // Add other section saves here as they're implemented
            
            await Promise.all(savePromises);
            
            this.unsavedChanges.clear();
            this.notificationSystem.show('success', 'Changes Saved', 'All changes have been saved successfully');
            
        } catch (error) {
            console.error('Error saving all changes:', error);
            this.notificationSystem.show('error', 'Save Error', 'Failed to save some changes');
        }
    }

    // Change Tracking
    markAsChanged(elementId) {
        this.unsavedChanges.add(elementId);
        this.updateSaveButton();
    }

    clearChanges(elementId) {
        this.unsavedChanges.delete(elementId);
        this.updateSaveButton();
    }

    updateSaveButton() {
        const saveButton = document.querySelector('[onclick="adminManager.saveAllChanges()"]');
        if (saveButton) {
            if (this.unsavedChanges.size > 0) {
                saveButton.innerHTML = `<i class="fas fa-save"></i> Save All Changes (${this.unsavedChanges.size})`;
                saveButton.classList.add('btn-warning');
            } else {
                saveButton.innerHTML = `<i class="fas fa-save"></i> Save All Changes`;
                saveButton.classList.remove('btn-warning');
            }
        }
    }

    // Authentication
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async authenticate() {
        const tokenInput = document.getElementById('github-token');
        const token = tokenInput.value.trim();
        
        if (!token) {
            this.notificationSystem.show('error', 'Authentication Error', 'Please enter a GitHub token');
            return;
        }
        
        try {
            // Test the token
            const isValid = await this.githubIntegration.testToken(token);
            
            if (isValid) {
                this.githubToken = token;
                this.isAuthenticated = true;
                localStorage.setItem('github-token', token);
                
                this.hideAuthModal();
                this.notificationSystem.show('success', 'Authentication Successful', 'GitHub token validated successfully');
                
                // Initialize managers with the new token
                await this.initializeManagers();
                
                // Load initial content
                await this.loadDashboardData();
                
            } else {
                this.notificationSystem.show('error', 'Authentication Failed', 'Invalid GitHub token. Please check your token and try again.');
            }
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.notificationSystem.show('error', 'Authentication Error', 'Failed to validate GitHub token');
        }
    }

    // Navigation
    goToMainSite() {
        window.open('index.html', '_blank');
    }

    // Utility Methods
    getCurrentSection() {
        return this.currentSection;
    }

    isSectionActive(sectionName) {
        return this.currentSection === sectionName;
    }

    getUnsavedChangesCount() {
        return this.unsavedChanges.size;
    }

    hasUnsavedChanges() {
        return this.unsavedChanges.size > 0;
    }
}
