/**
 * Course Facilitators Manager for Admin Panel
 * Handles comprehensive facilitator management
 */

class FacilitatorsManager {
    constructor(githubIntegration) {
        this.githubIntegration = githubIntegration;
        this.facilitators = [];
        this.editingFacilitator = null;
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.sortBy = 'name';
        this.sortOrder = 'asc';
    }

    async init() {
        try {
            await this.loadFacilitators();
            this.setupEventListeners();
            this.renderFacilitators();
        } catch (error) {
            console.error('Error initializing facilitators manager:', error);
        }
    }

    async loadFacilitators() {
        try {
            // First try to load from localStorage for persistence
            if (this.loadFacilitatorsFromStorage()) {
                return;
            }
            
            // Fallback to GitHub API
            if (this.githubIntegration) {
                const content = await this.githubIntegration.getContentFile('', 'facilitators.json');
                if (content) {
                    const decodedContent = atob(content.content);
                    this.facilitators = JSON.parse(decodedContent);
                    // Save to localStorage for future use
                    this.saveFacilitatorsToStorage();
                    return;
                }
            }
            
            // Use default facilitators if nothing else works
            this.facilitators = this.getDefaultFacilitators();
            this.saveFacilitatorsToStorage();
            
        } catch (error) {
            this.facilitators = this.getDefaultFacilitators();
            this.saveFacilitatorsToStorage();
        }
    }

    saveFacilitatorsToStorage() {
        try {
            localStorage.setItem('facilitators', JSON.stringify(this.facilitators));
        } catch (error) {
            console.error('Error saving facilitators to localStorage:', error);
        }
    }

    loadFacilitatorsFromStorage() {
        try {
            const stored = localStorage.getItem('facilitators');
            if (stored) {
                this.facilitators = JSON.parse(stored);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading facilitators from localStorage:', error);
            return false;
        }
    }

    getDefaultFacilitators() {
        return [
            {
                id: "james-azam",
                name: "Dr. James Azam",
                title: "Course Facilitator",
                institution: "London School of Hygiene and Tropical Medicine",
                expertise: "Expert in infectious disease modeling and R programming",
                email: "james.azam@lshtm.ac.uk",
                phone: "+44 20 7636 8636",
                country: "United Kingdom",
                bio: "Dr. James Azam is a leading expert in infectious disease modeling with extensive experience in R programming and epidemiological modeling. He has worked on multiple disease outbreaks and has published extensively in the field.",
                specialties: ["Infectious Disease Modeling", "R Programming", "Epidemiology", "Mathematical Modeling"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/james-azam",
                    twitter: "https://twitter.com/james_azam",
                    github: "https://github.com/jamesmbaazam"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 1
            },
            {
                id: "andrzej-jarynowski",
                name: "Dr. Andrzej Jarynowski",
                title: "Course Coordinator",
                institution: "Wrocław University of Science and Technology",
                expertise: "Mathematical modeling and data science",
                email: "andrzej.jarynowski@pwr.edu.pl",
                phone: "+48 71 320 0000",
                country: "Poland",
                bio: "Dr. Andrzej Jarynowski specializes in mathematical modeling and data science applications in public health and epidemiology.",
                specialties: ["Mathematical Modeling", "Data Science", "Epidemiology", "Public Health"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/andrzej-jarynowski",
                    twitter: "https://twitter.com/andrzej_jarynowski",
                    github: "https://github.com/andrzej-jarynowski"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 2
            },
            {
                id: "vincent-donkoh",
                name: "Vincent Donkoh",
                title: "Course Facilitator",
                institution: "KNUST, Kumasi",
                expertise: "R programming and data analysis",
                email: "vincent.donkoh@knust.edu.gh",
                phone: "+233 20 123 4567",
                country: "Ghana",
                bio: "Vincent Donkoh is a skilled R programmer and data analyst with expertise in statistical modeling and data visualization.",
                specialties: ["R Programming", "Data Analysis", "Statistical Modeling", "Data Visualization"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/vincent-donkoh",
                    twitter: "https://twitter.com/vincent_donkoh",
                    github: "https://github.com/vincentdonkoh"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 3
            },
            {
                id: "jean-claude-dejon-agobe",
                name: "Dr. Jean-Claude Dejon Agobe",
                title: "Course Facilitator",
                institution: "University of Yaoundé",
                expertise: "Infectious disease epidemiology",
                email: "jc.dejon-agobe@uyaounde.cm",
                phone: "+237 222 000 000",
                country: "Cameroon",
                bio: "Dr. Jean-Claude Dejon Agobe is an expert in infectious disease epidemiology with extensive field experience in Africa.",
                specialties: ["Infectious Disease Epidemiology", "Field Research", "Public Health", "Disease Surveillance"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/jean-claude-dejon-agobe",
                    twitter: "https://twitter.com/jcdejonagobe",
                    github: "https://github.com/jcdejonagobe"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 4
            },
            {
                id: "gesine-meyer-rath",
                name: "Dr. Gesine Meyer-Rath",
                title: "Course Facilitator",
                institution: "Boston University",
                expertise: "Health economics and modeling",
                email: "gmeyer@bu.edu",
                phone: "+1 617 353 0000",
                country: "United States",
                bio: "Dr. Gesine Meyer-Rath specializes in health economics and economic modeling for public health interventions.",
                specialties: ["Health Economics", "Economic Modeling", "Public Health", "Cost-Effectiveness Analysis"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/gesine-meyer-rath",
                    twitter: "https://twitter.com/gmeyer_rath",
                    github: "https://github.com/gmeyer-rath"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 5
            },
            {
                id: "charlene-tedto-mfangnia",
                name: "Charlène Tedto Mfangnia",
                title: "Course Facilitator",
                institution: "University of Douala",
                expertise: "Biostatistics and research methods",
                email: "charlene.tedto@univ-douala.cm",
                phone: "+237 233 000 000",
                country: "Cameroon",
                bio: "Charlène Tedto Mfangnia is an expert in biostatistics and research methodology with focus on African health research.",
                specialties: ["Biostatistics", "Research Methods", "Health Research", "Statistical Analysis"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/charlene-tedto-mfangnia",
                    twitter: "https://twitter.com/charlene_tedto",
                    github: "https://github.com/charlene-tedto"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 6
            },
            {
                id: "opanin-agyei-adu",
                name: "Opanin Agyei Adu",
                title: "Course Facilitator",
                institution: "KNUST, Kumasi",
                expertise: "R programming and statistical analysis",
                email: "opanin.agyei-adu@knust.edu.gh",
                phone: "+233 20 123 4568",
                country: "Ghana",
                bio: "Opanin Agyei Adu is a skilled R programmer and statistical analyst with expertise in health data analysis.",
                specialties: ["R Programming", "Statistical Analysis", "Health Data Analysis", "Data Visualization"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/opanin-agyei-adu",
                    twitter: "https://twitter.com/opanin_agyei_adu",
                    github: "https://github.com/opanin-agyei-adu"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 7
            },
            {
                id: "john-amuasi",
                name: "Dr. John Amuasi",
                title: "Course Director",
                institution: "G-WAC Secretariat",
                expertise: "Global health and infectious diseases",
                email: "john.amuasi@g-wac.org",
                phone: "+233 322 192 173",
                country: "Ghana",
                bio: "Dr. John Amuasi is the Course Director and leads the G-WAC initiative for global health and pandemic prevention.",
                specialties: ["Global Health", "Infectious Diseases", "Pandemic Prevention", "Health Policy"],
                socialLinks: {
                    linkedin: "https://linkedin.com/in/john-amuasi",
                    twitter: "https://twitter.com/john_amuasi",
                    github: "https://github.com/john-amuasi"
                },
                avatar: "images/facilitators/placeholder.svg",
                isActive: true,
                order: 8
            }
        ];
    }

    setupEventListeners() {
        // Add new facilitator button
        const addBtn = document.querySelector('[onclick="adminManager.addNewFacilitator()"]');
        if (addBtn) {
            addBtn.onclick = () => this.addNewFacilitator();
        }

        // Import facilitators button
        const importBtn = document.querySelector('[onclick="adminManager.importFacilitators()"]');
        if (importBtn) {
            importBtn.onclick = () => this.importFacilitators();
        }
    }

    renderFacilitators() {
        const container = document.getElementById('facilitators-list');
        if (!container) return;

        container.innerHTML = '';

        // Add search and filter controls
        const controlsSection = this.createFacilitatorsControls();
        container.appendChild(controlsSection);

        // Render facilitators grid
        const facilitatorsGrid = document.createElement('div');
        facilitatorsGrid.className = 'facilitators-grid';
        
        // Get filtered and sorted facilitators
        const filteredFacilitators = this.getFilteredFacilitators();
        
        filteredFacilitators.forEach(facilitator => {
            const facilitatorCard = this.createFacilitatorCard(facilitator);
            facilitatorsGrid.appendChild(facilitatorCard);
        });

        container.appendChild(facilitatorsGrid);

        // Add new facilitator button
        const addSection = this.createAddFacilitatorSection();
        container.appendChild(addSection);
        
        // Show results count
        this.updateResultsCount(filteredFacilitators.length);
    }

    createFacilitatorCard(facilitator) {
        const card = document.createElement('div');
        card.className = 'facilitator-card';
        
        // Create status indicator
        const statusIndicator = facilitator.isActive ? 
            '<div class="facilitator-status active"></div>' : 
            '<div class="facilitator-status inactive"></div>';
        
        // Create specialties HTML
        const specialtiesHTML = facilitator.specialties && facilitator.specialties.length > 0 ? 
            `<div class="facilitator-specialties">
                ${facilitator.specialties.map(specialty => 
                    `<span class="specialty-tag">${specialty}</span>`
                ).join('')}
            </div>` : '';
        
        card.innerHTML = `
            ${statusIndicator}
            <div class="facilitator-avatar">
                <img src="${facilitator.avatar}" alt="${facilitator.name}" onerror="this.src='images/facilitators/placeholder.svg';">
            </div>
            <div class="facilitator-info">
                <h3>${facilitator.name}</h3>
                <p class="title">${facilitator.title}</p>
                <p class="institution">${facilitator.institution}</p>
                <p class="expertise">${facilitator.expertise}</p>
                ${specialtiesHTML}
                <p class="country">${facilitator.country}</p>
            </div>
            <div class="facilitator-actions">
                <button class="btn btn-sm btn-outline" onclick="adminManager.editFacilitator('${facilitator.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="adminManager.deleteFacilitator('${facilitator.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        return card;
    }

    createFacilitatorsControls() {
        const controls = document.createElement('div');
        controls.className = 'facilitators-controls';
        controls.innerHTML = `
            <div class="controls-row">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="facilitators-search" placeholder="Search facilitators..." value="${this.searchQuery}">
                </div>
                                    <div class="filter-controls">
                        <select id="facilitators-filter">
                            <option value="all" ${this.currentFilter === 'all' ? 'selected' : ''}>All Facilitators</option>
                            <option value="active" ${this.currentFilter === 'active' ? 'selected' : ''}>Active Only</option>
                            <option value="inactive" ${this.currentFilter === 'inactive' ? 'selected' : ''}>Inactive Only</option>
                        </select>
                        <select id="facilitators-sort">
                            <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Sort by Name</option>
                            <option value="institution" ${this.sortBy === 'institution' ? 'selected' : ''}>Sort by Institution</option>
                            <option value="country" ${this.sortBy === 'country' ? 'selected' : ''}>Sort by Country</option>
                            <option value="order" ${this.sortBy === 'order' ? 'selected' : ''}>Sort by Order</option>
                        </select>
                        <button class="btn btn-sm btn-outline" onclick="adminManager.toggleFacilitatorsSortOrder()">
                            <i class="fas fa-sort-${this.sortOrder === 'asc' ? 'up' : 'down'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="adminManager.bulkActivateFacilitators()">
                            <i class="fas fa-check-circle"></i> Bulk Activate
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="adminManager.bulkDeactivateFacilitators()">
                            <i class="fas fa-times-circle"></i> Bulk Deactivate
                        </button>
                    </div>
            </div>
            <div class="results-info">
                <span id="facilitators-count">Showing ${this.facilitators.length} facilitators</span>
            </div>
        `;
        
        // Add event listeners
        this.setupControlsEventListeners(controls);
        
        return controls;
    }

    setupControlsEventListeners(controls) {
        const searchInput = controls.querySelector('#facilitators-search');
        const filterSelect = controls.querySelector('#facilitators-filter');
        const sortSelect = controls.querySelector('#facilitators-sort');
        
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderFacilitators();
        });
        
        filterSelect.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderFacilitators();
        });
        
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderFacilitators();
        });
    }

    getFilteredFacilitators() {
        let filtered = [...this.facilitators];
        
        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(facilitator => 
                facilitator.name.toLowerCase().includes(query) ||
                facilitator.institution.toLowerCase().includes(query) ||
                facilitator.expertise.toLowerCase().includes(query) ||
                facilitator.country.toLowerCase().includes(query) ||
                (facilitator.specialties && facilitator.specialties.some(s => s.toLowerCase().includes(query)))
            );
        }
        
        // Apply status filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(f => f.isActive);
        } else if (this.currentFilter === 'inactive') {
            filtered = filtered.filter(f => !f.isActive);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[this.sortBy];
            let bVal = b[this.sortBy];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (this.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        return filtered;
    }

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.renderFacilitators();
    }

    updateResultsCount(count) {
        const countElement = document.getElementById('facilitators-count');
        if (countElement) {
            countElement.textContent = `Showing ${count} of ${this.facilitators.length} facilitators`;
        }
    }

    bulkActivateFacilitators() {
        const selectedFacilitators = this.getSelectedFacilitators();
        if (selectedFacilitators.length === 0) {
            this.showNotification('Please select facilitators to activate', 'warning');
            return;
        }
        
        if (confirm(`Are you sure you want to activate ${selectedFacilitators.length} facilitators?`)) {
            selectedFacilitators.forEach(facilitator => {
                facilitator.isActive = true;
            });
            this.saveFacilitatorsToStorage();
            this.renderFacilitators();
            this.showNotification(`${selectedFacilitators.length} facilitators activated successfully`, 'success');
        }
    }

    bulkDeactivateFacilitators() {
        const selectedFacilitators = this.getSelectedFacilitators();
        if (selectedFacilitators.length === 0) {
            this.showNotification('Please select facilitators to deactivate', 'warning');
            return;
        }
        
        if (confirm(`Are you sure you want to deactivate ${selectedFacilitators.length} facilitators?`)) {
            selectedFacilitators.forEach(facilitator => {
                facilitator.isActive = false;
            });
            this.saveFacilitatorsToStorage();
            this.renderFacilitators();
            this.showNotification(`${selectedFacilitators.length} facilitators deactivated successfully`, 'success');
        }
    }

    getSelectedFacilitators() {
        // For now, return all facilitators - in a real implementation, you'd have checkboxes
        return this.facilitators;
    }

    async getFacilitatorsByCountry() {
        const countryCounts = {};
        this.facilitators.forEach(facilitator => {
            const country = facilitator.country || 'Unknown';
            countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
        return countryCounts;
    }

    createAddFacilitatorSection() {
        const section = document.createElement('div');
        section.className = 'add-facilitator-section';
        section.innerHTML = `
            <div class="add-facilitator-content">
                <i class="fas fa-user-plus" style="font-size: 2rem; color: var(--admin-accent); margin-bottom: 1rem;"></i>
                <h3>Add New Facilitator</h3>
                <p>Click the button below to add a new course facilitator to the system.</p>
                <button class="btn btn-primary btn-large" onclick="adminManager.addNewFacilitator()">
                    <i class="fas fa-plus"></i> Add New Facilitator
                </button>
            </div>
        `;
        return section;
    }

    addNewFacilitator() {
        const newFacilitator = {
            id: `facilitator-${Date.now()}`,
            name: 'New Facilitator',
            title: 'Course Facilitator',
            institution: 'Institution',
            expertise: 'Expertise area',
            email: 'email@example.com',
            phone: '+123 456 7890',
            country: 'Country',
            bio: 'Brief biography',
            specialties: ['Specialty 1', 'Specialty 2'],
            socialLinks: {
                linkedin: '',
                twitter: '',
                github: ''
            },
            avatar: 'images/facilitators/placeholder.svg',
            isActive: true,
            order: this.facilitators.length + 1
        };
        
        this.facilitators.push(newFacilitator);
        // Save to localStorage for persistence
        this.saveFacilitatorsToStorage();
        this.renderFacilitators();
        this.editFacilitator(newFacilitator.id);
        this.showNotification('New facilitator added successfully', 'success');
    }

    editFacilitator(facilitatorId) {
        const facilitator = this.facilitators.find(f => f.id === facilitatorId);
        if (!facilitator) return;
        
        this.editingFacilitator = facilitator;
        this.showFacilitatorEditModal(facilitator);
    }

    showFacilitatorEditModal(facilitator) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Facilitator: ${facilitator.name}</h3>
                    <button class="modal-close" onclick="adminManager.closeFacilitatorModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" id="edit-facilitator-name" value="${facilitator.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" id="edit-facilitator-title" value="${facilitator.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Institution *</label>
                        <input type="text" id="edit-facilitator-institution" value="${facilitator.institution}" required>
                    </div>
                    <div class="form-group">
                        <label>Expertise *</label>
                        <input type="text" id="edit-facilitator-expertise" value="${facilitator.expertise}" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="edit-facilitator-email" value="${facilitator.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="text" id="edit-facilitator-phone" value="${facilitator.phone}">
                    </div>
                    <div class="form-group">
                        <label>Country *</label>
                        <input type="text" id="edit-facilitator-country" value="${facilitator.country}" required>
                    </div>
                    <div class="form-group">
                        <label>Biography</label>
                        <textarea id="edit-facilitator-bio" rows="3">${facilitator.bio}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Avatar URL</label>
                        <input type="text" id="edit-facilitator-avatar" value="${facilitator.avatar}">
                        <small>Leave empty to use default placeholder</small>
                    </div>
                    <div class="form-group">
                        <label>Specialties</label>
                        <input type="text" id="edit-specialties" value="${facilitator.specialties ? facilitator.specialties.join(', ') : ''}" placeholder="Enter specialties separated by commas">
                        <small>Separate multiple specialties with commas</small>
                    </div>
                    <div class="form-group">
                        <label>LinkedIn URL</label>
                        <input type="url" id="edit-linkedin" value="${facilitator.socialLinks?.linkedin || ''}" placeholder="https://linkedin.com/in/username">
                    </div>
                    <div class="form-group">
                        <label>Twitter URL</label>
                        <input type="url" id="edit-twitter" value="${facilitator.socialLinks?.twitter || ''}" placeholder="https://twitter.com/username">
                    </div>
                    <div class="form-group">
                        <label>GitHub URL</label>
                        <input type="url" id="edit-github" value="${facilitator.socialLinks?.github || ''}" placeholder="https://github.com/username">
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="edit-isActive" ${facilitator.isActive ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Active Facilitator
                        </label>
                        <small>Inactive facilitators won't appear on the main site</small>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="adminManager.saveFacilitatorEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="adminManager.closeFacilitatorModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveFacilitatorEdit() {
        if (!this.editingFacilitator) return;
        
        const facilitator = this.editingFacilitator;
        const facilitatorIndex = this.facilitators.findIndex(f => f.id === facilitator.id);
        if (facilitatorIndex === -1) return;
        
        const name = document.getElementById('edit-facilitator-name').value;
        const title = document.getElementById('edit-facilitator-title').value;
        const institution = document.getElementById('edit-facilitator-institution').value;
        const expertise = document.getElementById('edit-facilitator-expertise').value;
        const email = document.getElementById('edit-facilitator-email').value;
        const phone = document.getElementById('edit-facilitator-phone').value;
        const country = document.getElementById('edit-facilitator-country').value;
        const bio = document.getElementById('edit-facilitator-bio').value;
        const avatar = document.getElementById('edit-facilitator-avatar').value || 'images/facilitators/placeholder.svg';
        // Parse specialties from comma-separated input
        const specialties = document.getElementById('edit-specialties').value.split(',').map(s => s.trim()).filter(s => s);
        // Get social links
        const linkedin = document.getElementById('edit-linkedin').value.trim();
        const twitter = document.getElementById('edit-twitter').value.trim();
        const github = document.getElementById('edit-github').value.trim();
        // Get active status
        const isActive = document.getElementById('edit-isActive').checked;
        
        this.facilitators[facilitatorIndex] = {
            ...facilitator,
            name,
            title,
            institution,
            expertise,
            email,
            phone,
            country,
            bio,
            avatar,
            specialties,
            socialLinks: { linkedin, twitter, github },
            isActive
        };
        
        // Save to localStorage for persistence
        this.saveFacilitatorsToStorage();
        this.renderFacilitators();
        this.closeModal();
        this.showNotification('Facilitator updated successfully', 'success');
    }

    deleteFacilitator(facilitatorId) {
        const facilitator = this.facilitators.find(f => f.id === facilitatorId);
        if (!facilitator) return;
        
        if (confirm(`Are you sure you want to delete the facilitator "${facilitator.name}"?`)) {
            this.facilitators = this.facilitators.filter(f => f.id !== facilitatorId);
            // Save to localStorage for persistence
            this.saveFacilitatorsToStorage();
            this.renderFacilitators();
            this.showNotification('Facilitator deleted successfully', 'success');
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.remove();
        }
        this.editingFacilitator = null;
    }

    showNotification(message, type = 'info') {
        // Use the notification system if available
        if (window.adminManager && window.adminManager.notificationSystem) {
            window.adminManager.notificationSystem.show(type, 'Facilitators Manager', message);
        } else {
            alert(message);
        }
    }

    async getCount() {
        return this.facilitators.filter(f => f.isActive).length;
    }

    async exportFacilitators() {
        return this.facilitators;
    }

    async importFacilitators() {
        // Create file input for import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const importedFacilitators = JSON.parse(text);
                    this.facilitators = importedFacilitators;
                    this.saveFacilitatorsToStorage();
                    this.renderFacilitators();
                    this.showNotification('Facilitators imported successfully', 'success');
                } catch (error) {
                    this.showNotification('Error importing facilitators: ' + error.message, 'error');
                }
            }
        };
        input.click();
    }

    async exportToGitHub() {
        try {
            if (!this.githubIntegration) {
                this.showNotification('GitHub integration not available', 'error');
                return;
            }

            this.showNotification('Exporting to GitHub...', 'info');
            
            // Convert facilitators to JSON
            const content = JSON.stringify(this.facilitators, null, 2);
            const encodedContent = btoa(content);
            
            // Save to GitHub
            await this.githubIntegration.putContent(
                'facilitators.json',
                encodedContent,
                'Update facilitators data',
                'Update facilitators from admin panel'
            );
            
            this.showNotification('Successfully exported to GitHub!', 'success');
            
        } catch (error) {
            console.error('Error exporting to GitHub:', error);
            this.showNotification('Failed to export to GitHub: ' + error.message, 'error');
        }
    }

    exportFacilitatorsToFile() {
        const dataStr = JSON.stringify(this.facilitators, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'facilitators.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Facilitators exported to file successfully!', 'success');
    }
}

// Make FacilitatorsManager available globally
window.FacilitatorsManager = FacilitatorsManager;
