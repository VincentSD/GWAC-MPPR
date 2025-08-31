/**
 * Resources Manager for Admin Panel
 * Handles comprehensive resources and links management
 */

class ResourcesManager {
    constructor(githubIntegration) {
        this.githubIntegration = githubIntegration;
        this.resources = [];
        this.categories = [];
        this.editingResource = null;
        this.editingCategory = null;
        this.currentFilter = 'all';
    }

    async init() {
        try {
            await this.loadResources();
            await this.loadCategories();
            this.setupEventListeners();
            this.renderResources();
            this.renderCategories();
        } catch (error) {
            console.error('Error initializing resources manager:', error);
        }
    }

    async loadResources() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'resources.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.resources = JSON.parse(decodedContent);
            } else {
                this.resources = this.getDefaultResources();
            }
        } catch (error) {
            this.resources = this.getDefaultResources();
        }
    }

    async loadCategories() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'resource-categories.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.categories = JSON.parse(decodedContent);
            } else {
                this.categories = this.getDefaultCategories();
            }
        } catch (error) {
            this.categories = this.getDefaultCategories();
        }
    }

    getDefaultResources() {
        return [
            {
                id: "r-project",
                title: "R Project",
                description: "Official R programming language website with downloads, documentation, and community resources",
                url: "https://www.r-project.org/",
                category: "software-tools",
                type: "external-link",
                format: "website",
                tags: ["r-programming", "software", "documentation"],
                isActive: true,
                order: 1,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "cran-repository",
                title: "CRAN Repository",
                description: "Comprehensive R Archive Network - official repository for R packages and documentation",
                url: "https://cran.r-project.org/",
                category: "software-tools",
                type: "external-link",
                format: "repository",
                tags: ["r-packages", "documentation", "repository"],
                isActive: true,
                order: 2,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "ici3d-program",
                title: "ICI3D Program",
                description: "International Clinics on Infectious Disease Dynamics and Data program resources",
                url: "https://www.ici3d.org/",
                category: "learning-resources",
                type: "external-link",
                format: "website",
                tags: ["infectious-diseases", "modeling", "training"],
                isActive: true,
                order: 3,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "course-syllabus",
                title: "Course Syllabus 2025",
                description: "Complete course outline, learning objectives, and assessment criteria",
                url: "documents/syllabus-2025.pdf",
                category: "course-materials",
                type: "internal-file",
                format: "pdf",
                tags: ["syllabus", "course-info", "objectives"],
                isActive: true,
                order: 4,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "r-installation-guide",
                title: "R Installation Guide",
                description: "Step-by-step guide for installing R and RStudio on different operating systems",
                url: "guides/r-installation-guide.pdf",
                category: "guides",
                type: "internal-file",
                format: "pdf",
                tags: ["installation", "r-programming", "setup"],
                isActive: true,
                order: 5,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "required-packages",
                title: "Required R Packages",
                description: "List of R packages required for the course with installation instructions",
                url: "guides/required-packages.md",
                category: "guides",
                type: "internal-file",
                format: "markdown",
                tags: ["r-packages", "dependencies", "installation"],
                isActive: true,
                order: 6,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "sample-datasets",
                title: "Sample Datasets",
                description: "Collection of sample datasets for practice exercises and demonstrations",
                url: "datasets/sample-data.zip",
                category: "datasets",
                type: "internal-file",
                format: "zip",
                tags: ["datasets", "practice", "examples"],
                isActive: true,
                order: 7,
                lastVerified: "2025-01-15",
                accessCount: 0
            },
            {
                id: "code-templates",
                title: "Code Templates",
                description: "Reusable R code templates for common modeling tasks and analyses",
                url: "templates/code-templates.zip",
                category: "code-templates",
                type: "internal-file",
                format: "zip",
                tags: ["code-templates", "r-scripts", "examples"],
                isActive: true,
                order: 8,
                lastVerified: "2025-01-15",
                accessCount: 0
            }
        ];
    }

    getDefaultCategories() {
        return [
            {
                id: "software-tools",
                name: "Software & Tools",
                description: "Programming languages, software, and development tools",
                color: "#3b82f6",
                icon: "fas fa-tools",
                order: 1,
                isActive: true,
                resourcesCount: 0
            },
            {
                id: "learning-resources",
                name: "Learning Resources",
                description: "Educational materials, tutorials, and training programs",
                color: "#10b981",
                icon: "fas fa-graduation-cap",
                order: 2,
                isActive: true,
                resourcesCount: 0
            },
            {
                id: "course-materials",
                name: "Course Materials",
                description: "Course-specific documents, presentations, and resources",
                color: "#f59e0b",
                icon: "fas fa-book",
                order: 3,
                isActive: true,
                resourcesCount: 0
            },
            {
                id: "guides",
                name: "Guides & Documentation",
                description: "How-to guides, manuals, and documentation",
                color: "#8b5cf6",
                icon: "fas fa-file-alt",
                order: 4,
                isActive: true,
                resourcesCount: 0
            },
            {
                id: "datasets",
                name: "Datasets",
                description: "Data files, datasets, and sample data for exercises",
                color: "#ef4444",
                icon: "fas fa-database",
                order: 5,
                isActive: true,
                resourcesCount: 0
            },
            {
                id: "code-templates",
                name: "Code Templates",
                description: "Reusable code snippets, templates, and examples",
                color: "#06b6d4",
                icon: "fas fa-code",
                order: 6,
                isActive: true,
                resourcesCount: 0
            }
        ];
    }

    setupEventListeners() {
        // Add new resource button
        const addResourceBtn = document.querySelector('[onclick="adminManager.addNewResource()"]');
        if (addResourceBtn) {
            addResourceBtn.onclick = () => this.addNewResource();
        }

        // Import resources button
        const importBtn = document.querySelector('[onclick="adminManager.importResources()"]');
        if (importBtn) {
            importBtn.onclick = () => this.importResources();
        }
    }

    renderResources() {
        const container = document.getElementById('resources-list');
        if (!container) return;

        container.innerHTML = '';

        // Add filter controls
        const filterSection = this.createResourcesFilterSection();
        container.appendChild(filterSection);

        // Add resources grid
        const resourcesGrid = this.createResourcesGrid();
        container.appendChild(resourcesGrid);

        // Add new resource button
        const addSection = this.createAddResourceSection();
        container.appendChild(addSection);
    }

    renderCategories() {
        const container = document.getElementById('resource-categories-list');
        if (!container) return;

        container.innerHTML = '';

        // Add categories grid
        const categoriesGrid = this.createCategoriesGrid();
        container.appendChild(categoriesGrid);

        // Add new category button
        const addSection = this.createAddCategorySection();
        container.appendChild(addSection);
    }

    createResourcesFilterSection() {
        const section = document.createElement('div');
        section.className = 'resources-filter-section';
        section.innerHTML = `
            <div class="filter-controls">
                <div class="filter-group">
                    <label>Filter by Category:</label>
                    <select id="resource-category-filter" onchange="resourcesManager.setCategoryFilter(this.value)">
                        <option value="all">All Categories</option>
                        ${this.categories.filter(c => c.isActive).map(category => `
                            <option value="${category.id}">${category.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="filter-group">
                    <label>Filter by Type:</label>
                    <select id="resource-type-filter" onchange="resourcesManager.setTypeFilter(this.value)">
                        <option value="all">All Types</option>
                        <option value="external-link">External Links</option>
                        <option value="internal-file">Internal Files</option>
                    </select>
                </div>
                <div class="search-group">
                    <input type="text" id="resource-search" placeholder="Search resources..." onkeyup="resourcesManager.searchResources(this.value)">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        `;
        return section;
    }

    createResourcesGrid() {
        const grid = document.createElement('div');
        grid.className = 'resources-grid';
        
        const filteredResources = this.getFilteredResources();
        
        grid.innerHTML = filteredResources.map(resource => `
            <div class="resource-card ${resource.isActive ? 'active' : 'inactive'}" data-resource-id="${resource.id}">
                <div class="resource-header">
                    <div class="resource-type">
                        <i class="fas fa-${this.getTypeIcon(resource.type)}"></i>
                        <span class="type-label">${resource.type === 'external-link' ? 'External' : 'Internal'}</span>
                    </div>
                    <div class="resource-status">
                        <span class="status-badge ${resource.isActive ? 'active' : 'inactive'}">
                            ${resource.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                
                <div class="resource-info">
                    <h4 class="resource-title">${resource.title}</h4>
                    <p class="resource-description">${resource.description}</p>
                    
                    <div class="resource-meta">
                        <span class="meta-item">
                            <i class="fas fa-folder"></i>
                            ${this.getCategoryName(resource.category)}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-file"></i>
                            ${resource.format.toUpperCase()}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-sort-numeric-down"></i>
                            Order: ${resource.order}
                        </span>
                    </div>
                    
                    <div class="resource-tags">
                        ${resource.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    
                    <div class="resource-url">
                        <i class="fas fa-link"></i>
                        <a href="${resource.url}" target="_blank" class="resource-link">
                            ${resource.url.length > 50 ? resource.url.substring(0, 50) + '...' : resource.url}
                        </a>
                    </div>
                    
                    <div class="resource-stats">
                        <span class="stat">
                            <i class="fas fa-eye"></i>
                            ${resource.accessCount} views
                        </span>
                        <span class="stat">
                            <i class="fas fa-calendar-check"></i>
                            Verified: ${resource.lastVerified}
                        </span>
                    </div>
                </div>
                
                <div class="resource-actions">
                    <button class="btn btn-sm btn-outline" onclick="resourcesManager.editResource('${resource.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="resourcesManager.toggleResourceStatus('${resource.id}')">
                        <i class="fas fa-${resource.isActive ? 'pause' : 'play'}"></i> 
                        ${resource.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="resourcesManager.verifyResource('${resource.id}')">
                        <i class="fas fa-check-circle"></i> Verify
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="resourcesManager.deleteResource('${resource.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        return grid;
    }

    createCategoriesGrid() {
        const grid = document.createElement('div');
        grid.className = 'resource-categories-grid';
        
        grid.innerHTML = this.categories.map(category => `
            <div class="category-card ${category.isActive ? 'active' : 'inactive'}" data-category-id="${category.id}">
                <div class="category-header" style="border-left-color: ${category.color}">
                    <div class="category-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <div class="category-info">
                        <h4>${category.name}</h4>
                        <p>${category.description}</p>
                    </div>
                    <div class="category-status">
                        <span class="status-badge ${category.isActive ? 'active' : 'inactive'}">
                            ${category.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                
                <div class="category-stats">
                    <span class="stat-item">
                        <i class="fas fa-link"></i>
                        ${this.getResourcesCountForCategory(category.id)} Resources
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-sort-numeric-down"></i>
                        Order: ${category.order}
                    </span>
                </div>
                
                <div class="category-actions">
                    <button class="btn btn-sm btn-outline" onclick="resourcesManager.editCategory('${category.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="resourcesManager.toggleCategoryStatus('${category.id}')">
                        <i class="fas fa-${category.isActive ? 'pause' : 'play'}"></i> 
                        ${category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="resourcesManager.deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        return grid;
    }

    createAddResourceSection() {
        const section = document.createElement('div');
        section.className = 'add-resource-section';
        section.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="resourcesManager.addNewResource()">
                <i class="fas fa-plus"></i> Add New Resource
            </button>
        `;
        return section;
    }

    createAddCategorySection() {
        const section = document.createElement('div');
        section.className = 'add-category-section';
        section.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="resourcesManager.addNewCategory()">
                <i class="fas fa-plus"></i> Add New Category
            </button>
        `;
        return section;
    }

    getFilteredResources() {
        let filtered = this.resources;
        
        // Apply category filter
        const categoryFilter = document.getElementById('resource-category-filter')?.value;
        if (categoryFilter && categoryFilter !== 'all') {
            filtered = filtered.filter(r => r.category === categoryFilter);
        }
        
        // Apply type filter
        const typeFilter = document.getElementById('resource-type-filter')?.value;
        if (typeFilter && typeFilter !== 'all') {
            filtered = filtered.filter(r => r.type === typeFilter);
        }
        
        // Apply search filter
        const searchTerm = document.getElementById('resource-search')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.title.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm) ||
                r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        return filtered.sort((a, b) => a.order - b.order);
    }

    setCategoryFilter(categoryId) {
        this.currentFilter = categoryId;
        this.renderResources();
    }

    setTypeFilter(type) {
        this.currentFilter = type;
        this.renderResources();
    }

    searchResources(searchTerm) {
        // Search is handled in getFilteredResources
        this.renderResources();
    }

    getTypeIcon(type) {
        return type === 'external-link' ? 'external-link-alt' : 'file';
    }

    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }

    getResourcesCountForCategory(categoryId) {
        return this.resources.filter(r => r.category === categoryId).length;
    }

    addNewResource() {
        const newResource = {
            id: `resource-${Date.now()}`,
            title: 'New Resource',
            description: 'Resource description',
            url: 'https://example.com',
            category: this.categories[0]?.id || 'software-tools',
            type: 'external-link',
            format: 'website',
            tags: ['new'],
            isActive: true,
            order: this.resources.length + 1,
            lastVerified: new Date().toISOString().split('T')[0],
            accessCount: 0
        };
        
        this.resources.push(newResource);
        this.renderResources();
        this.editResource(newResource.id);
        this.showNotification('New resource added successfully', 'success');
    }

    addNewCategory() {
        const newCategory = {
            id: `category-${Date.now()}`,
            name: 'New Category',
            description: 'Category description',
            color: '#6b7280',
            icon: 'fas fa-folder',
            order: this.categories.length + 1,
            isActive: true,
            resourcesCount: 0
        };
        
        this.categories.push(newCategory);
        this.renderCategories();
        this.editCategory(newCategory.id);
        this.showNotification('New category added successfully', 'success');
    }

    editResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        this.editingResource = resource;
        this.showResourceEditModal(resource);
    }

    editCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        this.editingCategory = category;
        this.showCategoryEditModal(category);
    }

    showResourceEditModal(resource) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>Edit Resource: ${resource.title}</h3>
                    <button class="modal-close" onclick="resourcesManager.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Resource Title *</label>
                            <input type="text" id="edit-resource-title" value="${resource.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Category *</label>
                            <select id="edit-resource-category" required>
                                ${this.categories.filter(c => c.isActive).map(category => `
                                    <option value="${category.id}" ${resource.category === category.id ? 'selected' : ''}>
                                        ${category.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Type *</label>
                            <select id="edit-resource-type" required>
                                <option value="external-link" ${resource.type === 'external-link' ? 'selected' : ''}>External Link</option>
                                <option value="internal-file" ${resource.type === 'internal-file' ? 'selected' : ''}>Internal File</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Format</label>
                            <input type="text" id="edit-resource-format" value="${resource.format}" placeholder="e.g., website, pdf, zip">
                        </div>
                        <div class="form-group full-width">
                            <label>Description *</label>
                            <textarea id="edit-resource-description" rows="3" required>${resource.description}</textarea>
                        </div>
                        <div class="form-group full-width">
                            <label>URL/Link *</label>
                            <input type="url" id="edit-resource-url" value="${resource.url}" required>
                        </div>
                        <div class="form-group">
                            <label>Tags (comma-separated)</label>
                            <input type="text" id="edit-resource-tags" value="${resource.tags.join(', ')}">
                        </div>
                        <div class="form-group">
                            <label>Order</label>
                            <input type="number" id="edit-resource-order" value="${resource.order}" min="1">
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select id="edit-resource-status">
                                <option value="true" ${resource.isActive ? 'selected' : ''}>Active</option>
                                <option value="false" ${!resource.isActive ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="resourcesManager.saveResourceEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="resourcesManager.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showCategoryEditModal(category) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Category: ${category.name}</h3>
                    <button class="modal-close" onclick="resourcesManager.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Category Name *</label>
                        <input type="text" id="edit-category-name" value="${category.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Description *</label>
                        <textarea id="edit-category-description" rows="3" required>${category.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Color *</label>
                        <input type="color" id="edit-category-color" value="${category.color}" required>
                    </div>
                    <div class="form-group">
                        <label>Icon *</label>
                        <select id="edit-category-icon" required>
                            <option value="fas fa-folder" ${category.icon === 'fas fa-folder' ? 'selected' : ''}>📁 Folder</option>
                            <option value="fas fa-tools" ${category.icon === 'fas fa-tools' ? 'selected' : ''}>🔧 Tools</option>
                            <option value="fas fa-graduation-cap" ${category.icon === 'fas fa-graduation-cap' ? 'selected' : ''}>🎓 Graduation Cap</option>
                            <option value="fas fa-book" ${category.icon === 'fas fa-book' ? 'selected' : ''}>📚 Book</option>
                            <option value="fas fa-file-alt" ${category.icon === 'fas fa-file-alt' ? 'selected' : ''}>📄 File</option>
                            <option value="fas fa-database" ${category.icon === 'fas fa-database' ? 'selected' : ''}>🗄️ Database</option>
                            <option value="fas fa-code" ${category.icon === 'fas fa-code' ? 'selected' : ''}>💻 Code</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Order</label>
                        <input type="number" id="edit-category-order" value="${category.order}" min="1">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="edit-category-status">
                            <option value="true" ${category.isActive ? 'selected' : ''}>Active</option>
                            <option value="false" ${!category.isActive ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="resourcesManager.saveCategoryEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="resourcesManager.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveResourceEdit() {
        if (!this.editingResource) return;
        
        const resource = this.editingResource;
        const resourceIndex = this.resources.findIndex(r => r.id === resource.id);
        if (resourceIndex === -1) return;
        
        const title = document.getElementById('edit-resource-title').value;
        const category = document.getElementById('edit-resource-category').value;
        const type = document.getElementById('edit-resource-type').value;
        const format = document.getElementById('edit-resource-format').value;
        const description = document.getElementById('edit-resource-description').value;
        const url = document.getElementById('edit-resource-url').value;
        const tags = document.getElementById('edit-resource-tags').value
            .split(',').map(s => s.trim()).filter(s => s);
        const order = parseInt(document.getElementById('edit-resource-order').value);
        const isActive = document.getElementById('edit-resource-status').value === 'true';
        
        this.resources[resourceIndex] = {
            ...resource,
            title,
            category,
            type,
            format,
            description,
            url,
            tags,
            order,
            isActive
        };
        
        this.renderResources();
        this.closeModal();
        this.showNotification('Resource updated successfully', 'success');
    }

    saveCategoryEdit() {
        if (!this.editingCategory) return;
        
        const category = this.editingCategory;
        const categoryIndex = this.categories.findIndex(c => c.id === category.id);
        if (categoryIndex === -1) return;
        
        const name = document.getElementById('edit-category-name').value;
        const description = document.getElementById('edit-category-description').value;
        const color = document.getElementById('edit-category-color').value;
        const icon = document.getElementById('edit-category-icon').value;
        const order = parseInt(document.getElementById('edit-category-order').value);
        const isActive = document.getElementById('edit-category-status').value === 'true';
        
        this.categories[categoryIndex] = {
            ...category,
            name,
            description,
            color,
            icon,
            order,
            isActive
        };
        
        this.renderCategories();
        this.closeModal();
        this.showNotification('Category updated successfully', 'success');
    }

    toggleResourceStatus(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        resource.isActive = !resource.isActive;
        this.renderResources();
        this.showNotification(
            `Resource ${resource.isActive ? 'activated' : 'deactivated'} successfully`, 
            'success'
        );
    }

    toggleCategoryStatus(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        category.isActive = !category.isActive;
        this.renderCategories();
        this.showNotification(
            `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`, 
            'success'
        );
    }

    verifyResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        resource.lastVerified = new Date().toISOString().split('T')[0];
        this.renderResources();
        this.showNotification('Resource verification date updated successfully', 'success');
    }

    deleteResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
            this.resources = this.resources.filter(r => r.id !== resourceId);
            this.renderResources();
            this.showNotification('Resource deleted successfully', 'success');
        }
    }

    deleteCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        // Check if category has resources
        const resourcesInCategory = this.resources.filter(r => r.category === categoryId);
        if (resourcesInCategory.length > 0) {
            this.showNotification(
                `Cannot delete category: ${resourcesInCategory.length} resources are assigned to it. Please reassign or delete resources first.`,
                'error'
            );
            return;
        }
        
        if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.renderCategories();
            this.showNotification('Category deleted successfully', 'success');
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.remove();
        }
        this.editingResource = null;
        this.editingCategory = null;
    }

    showNotification(message, type = 'info') {
        // Use the notification system if available
        if (window.adminManager && window.adminManager.notificationSystem) {
            window.adminManager.notificationSystem.show(type, 'Resources Manager', message);
        } else {
            alert(message);
        }
    }

    async getCount() {
        return this.resources.filter(r => r.isActive).length;
    }

    async exportResources() {
        return {
            resources: this.resources,
            categories: this.categories
        };
    }

    async importResources() {
        // Create file input for import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const importedData = JSON.parse(text);
                    
                    if (importedData.resources) this.resources = importedData.resources;
                    if (importedData.categories) this.categories = importedData.categories;
                    
                    this.renderResources();
                    this.renderCategories();
                    
                    this.showNotification('Resources imported successfully', 'success');
                } catch (error) {
                    this.showNotification('Error importing resources: ' + error.message, 'error');
                }
            }
        };
        input.click();
    }
}
// Make ResourcesManager available globally
window.ResourcesManager = ResourcesManager;
