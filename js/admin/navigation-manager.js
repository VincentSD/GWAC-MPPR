/**
 * Navigation Manager for Admin Panel
 * Handles comprehensive navigation menu management
 */

class NavigationManager {
    constructor(githubIntegration) {
        this.githubIntegration = githubIntegration;
        this.menuItems = [];
        this.editingMenuItem = null;
        this.draggedItem = null;
    }

    async init() {
        try {
            await this.loadMenuItems();
            this.setupEventListeners();
            this.renderMenuItems();
        } catch (error) {
            console.error('Error initializing navigation manager:', error);
        }
    }

    async loadMenuItems() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'navigation.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.menuItems = JSON.parse(decodedContent);
            } else {
                this.menuItems = this.getDefaultMenuItems();
            }
        } catch (error) {
            console.log('Using default navigation:', error);
            this.menuItems = this.getDefaultMenuItems();
        }
    }

    getDefaultMenuItems() {
        return [
            {
                id: "home",
                label: "Home",
                url: "#home",
                icon: "fas fa-home",
                order: 1,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "Main landing page"
            },
            {
                id: "schedule",
                label: "Program Schedule",
                url: "#schedule",
                icon: "fas fa-calendar-alt",
                order: 2,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "9-day program schedule and sessions"
            },
            {
                id: "courses",
                label: "Course Materials",
                url: "#courses",
                icon: "fas fa-book-open",
                order: 3,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "Access to all course materials and resources"
            },
            {
                id: "facilitators",
                label: "Course Facilitators",
                url: "#facilitators",
                icon: "fas fa-chalkboard-teacher",
                order: 4,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "Meet our expert instructors and facilitators"
            },
            {
                id: "students",
                label: "Student Portal",
                url: "#students",
                icon: "fas fa-user-graduate",
                order: 5,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "Student dashboard and progress tracking"
            },
            {
                id: "resources",
                label: "Resources",
                url: "#resources",
                icon: "fas fa-link",
                order: 6,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "Additional learning resources and tools"
            },
            {
                id: "contact",
                label: "Contact",
                url: "#contact",
                icon: "fas fa-envelope",
                order: 7,
                isActive: true,
                isVisible: true,
                target: "_self",
                children: [],
                description: "Get in touch with our team"
            }
        ];
    }

    setupEventListeners() {
        // Add new menu item button
        const addBtn = document.querySelector('[onclick="adminManager.addNewMenuItem()"]');
        if (addBtn) {
            addBtn.onclick = () => this.addNewMenuItem();
        }

        // Reorder menu button
        const reorderBtn = document.querySelector('[onclick="adminManager.reorderMenu()"]');
        if (reorderBtn) {
            reorderBtn.onclick = () => this.toggleReorderMode();
        }
    }

    renderMenuItems() {
        const container = document.getElementById('menu-items');
        if (!container) return;

        container.innerHTML = '';

        // Add menu items list
        const menuList = this.createMenuItemsList();
        container.appendChild(menuList);

        // Add new menu item button
        const addSection = this.createAddMenuItemSection();
        container.appendChild(addSection);
    }

    createMenuItemsList() {
        const list = document.createElement('div');
        list.className = 'menu-items-list';
        
        list.innerHTML = `
            <div class="menu-header">
                <h3><i class="fas fa-bars"></i> Navigation Menu Structure</h3>
                <p>Drag and drop to reorder, or use the reorder mode for easier management</p>
            </div>
            <div class="menu-items-container" id="menu-items-container">
                ${this.menuItems.map(item => this.createMenuItemElement(item)).join('')}
            </div>
        `;
        
        // Setup drag and drop
        this.setupDragAndDrop();
        
        return list;
    }

    createMenuItemElement(item) {
        return `
            <div class="menu-item ${item.isActive ? 'active' : 'inactive'} ${item.isVisible ? 'visible' : 'hidden'}" 
                 data-menu-id="${item.id}" draggable="true">
                <div class="menu-item-header">
                    <div class="drag-handle">
                        <i class="fas fa-grip-vertical"></i>
                    </div>
                    <div class="menu-item-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="menu-item-info">
                        <h4 class="menu-item-label">${item.label}</h4>
                        <p class="menu-item-url">${item.url}</p>
                        <p class="menu-item-description">${item.description}</p>
                    </div>
                    <div class="menu-item-status">
                        <span class="status-badge ${item.isActive ? 'active' : 'inactive'}">
                            ${item.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span class="visibility-badge ${item.isVisible ? 'visible' : 'hidden'}">
                            ${item.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                    </div>
                </div>
                
                <div class="menu-item-meta">
                    <span class="meta-item">
                        <i class="fas fa-sort-numeric-down"></i>
                        Order: ${item.order}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-external-link-alt"></i>
                        Target: ${item.target}
                    </span>
                    ${item.children && item.children.length > 0 ? `
                        <span class="meta-item">
                            <i class="fas fa-sitemap"></i>
                            ${item.children.length} Sub-items
                        </span>
                    ` : ''}
                </div>
                
                <div class="menu-item-actions">
                    <button class="btn btn-sm btn-outline" onclick="navigationManager.editMenuItem('${item.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="navigationManager.toggleMenuItemStatus('${item.id}')">
                        <i class="fas fa-${item.isActive ? 'pause' : 'play'}"></i> 
                        ${item.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="navigationManager.toggleMenuItemVisibility('${item.id}')">
                        <i class="fas fa-${item.isVisible ? 'eye-slash' : 'eye'}"></i> 
                        ${item.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="navigationManager.deleteMenuItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    createAddMenuItemSection() {
        const section = document.createElement('div');
        section.className = 'add-menu-item-section';
        section.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="navigationManager.addNewMenuItem()">
                <i class="fas fa-plus"></i> Add New Menu Item
            </button>
        `;
        return section;
    }

    setupDragAndDrop() {
        const container = document.getElementById('menu-items-container');
        if (!container) return;

        const items = container.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                this.draggedItem = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedItem && this.draggedItem !== item) {
                    this.reorderMenuItem(this.draggedItem, item);
                }
            });
        });
    }

    reorderMenuItem(draggedItem, targetItem) {
        const draggedId = draggedItem.dataset.menuId;
        const targetId = targetItem.dataset.menuId;
        
        const draggedIndex = this.menuItems.findIndex(item => item.id === draggedId);
        const targetIndex = this.menuItems.findIndex(item => item.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Remove dragged item
        const [draggedMenuItem] = this.menuItems.splice(draggedIndex, 1);
        
        // Insert at target position
        this.menuItems.splice(targetIndex, 0, draggedMenuItem);
        
        // Update order numbers
        this.updateOrderNumbers();
        
        // Re-render
        this.renderMenuItems();
        
        this.showNotification('Menu item reordered successfully', 'success');
    }

    updateOrderNumbers() {
        this.menuItems.forEach((item, index) => {
            item.order = index + 1;
        });
    }

    addNewMenuItem() {
        const newMenuItem = {
            id: `menu-item-${Date.now()}`,
            label: 'New Menu Item',
            url: '#new-item',
            icon: 'fas fa-link',
            order: this.menuItems.length + 1,
            isActive: true,
            isVisible: true,
            target: '_self',
            children: [],
            description: 'New menu item description'
        };
        
        this.menuItems.push(newMenuItem);
        this.renderMenuItems();
        this.editMenuItem(newMenuItem.id);
        this.showNotification('New menu item added successfully', 'success');
    }

    editMenuItem(menuItemId) {
        const menuItem = this.menuItems.find(m => m.id === menuItemId);
        if (!menuItem) return;
        
        this.editingMenuItem = menuItem;
        this.showMenuItemEditModal(menuItem);
    }

    showMenuItemEditModal(menuItem) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Menu Item: ${menuItem.label}</h3>
                    <button class="modal-close" onclick="navigationManager.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Menu Label *</label>
                        <input type="text" id="edit-menu-label" value="${menuItem.label}" required>
                    </div>
                    <div class="form-group">
                        <label>URL/Link *</label>
                        <input type="text" id="edit-menu-url" value="${menuItem.url}" required>
                    </div>
                    <div class="form-group">
                        <label>Icon *</label>
                        <select id="edit-menu-icon" required>
                            <option value="fas fa-home" ${menuItem.icon === 'fas fa-home' ? 'selected' : ''}>🏠 Home</option>
                            <option value="fas fa-calendar-alt" ${menuItem.icon === 'fas fa-calendar-alt' ? 'selected' : ''}>📅 Calendar</option>
                            <option value="fas fa-book-open" ${menuItem.icon === 'fas fa-book-open' ? 'selected' : ''}>📚 Book</option>
                            <option value="fas fa-chalkboard-teacher" ${menuItem.icon === 'fas fa-chalkboard-teacher' ? 'selected' : ''}>👨‍🏫 Teacher</option>
                            <option value="fas fa-user-graduate" ${menuItem.icon === 'fas fa-user-graduate' ? 'selected' : ''}>🎓 Student</option>
                            <option value="fas fa-link" ${menuItem.icon === 'fas fa-link' ? 'selected' : ''}>🔗 Link</option>
                            <option value="fas fa-envelope" ${menuItem.icon === 'fas fa-envelope' ? 'selected' : ''}>✉️ Envelope</option>
                            <option value="fas fa-cog" ${menuItem.icon === 'fas fa-cog' ? 'selected' : ''}>⚙️ Settings</option>
                            <option value="fas fa-info-circle" ${menuItem.icon === 'fas fa-info-circle' ? 'selected' : ''}>ℹ️ Info</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="edit-menu-description" rows="2">${menuItem.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Target</label>
                        <select id="edit-menu-target">
                            <option value="_self" ${menuItem.target === '_self' ? 'selected' : ''}>Same Window</option>
                            <option value="_blank" ${menuItem.target === '_blank' ? 'selected' : ''}>New Window</option>
                            <option value="_parent" ${menuItem.target === '_parent' ? 'selected' : ''}>Parent Frame</option>
                            <option value="_top" ${menuItem.target === '_top' ? 'selected' : ''}>Top Frame</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Order</label>
                        <input type="number" id="edit-menu-order" value="${menuItem.order}" min="1">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="edit-menu-status">
                            <option value="true" ${menuItem.isActive ? 'selected' : ''}>Active</option>
                            <option value="false" ${!menuItem.isActive ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Visibility</label>
                        <select id="edit-menu-visibility">
                            <option value="true" ${menuItem.isVisible ? 'selected' : ''}>Visible</option>
                            <option value="false" ${!menuItem.isVisible ? 'selected' : ''}>Hidden</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="navigationManager.saveMenuItemEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="navigationManager.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveMenuItemEdit() {
        if (!this.editingMenuItem) return;
        
        const menuItem = this.editingMenuItem;
        const menuItemIndex = this.menuItems.findIndex(m => m.id === menuItem.id);
        if (menuItemIndex === -1) return;
        
        const label = document.getElementById('edit-menu-label').value;
        const url = document.getElementById('edit-menu-url').value;
        const icon = document.getElementById('edit-menu-icon').value;
        const description = document.getElementById('edit-menu-description').value;
        const target = document.getElementById('edit-menu-target').value;
        const order = parseInt(document.getElementById('edit-menu-order').value);
        const isActive = document.getElementById('edit-menu-status').value === 'true';
        const isVisible = document.getElementById('edit-menu-visibility').value === 'true';
        
        this.menuItems[menuItemIndex] = {
            ...menuItem,
            label,
            url,
            icon,
            description,
            target,
            order,
            isActive,
            isVisible
        };
        
        // Update order numbers if order changed
        this.updateOrderNumbers();
        
        this.renderMenuItems();
        this.closeModal();
        this.showNotification('Menu item updated successfully', 'success');
    }

    toggleMenuItemStatus(menuItemId) {
        const menuItem = this.menuItems.find(m => m.id === menuItemId);
        if (!menuItem) return;
        
        menuItem.isActive = !menuItem.isActive;
        this.renderMenuItems();
        this.showNotification(
            `Menu item ${menuItem.isActive ? 'activated' : 'deactivated'} successfully`, 
            'success'
        );
    }

    toggleMenuItemVisibility(menuItemId) {
        const menuItem = this.menuItems.find(m => m.id === menuItemId);
        if (!menuItem) return;
        
        menuItem.isVisible = !menuItem.isVisible;
        this.renderMenuItems();
        this.showNotification(
            `Menu item ${menuItem.isVisible ? 'shown' : 'hidden'} successfully`, 
            'success'
        );
    }

    deleteMenuItem(menuItemId) {
        const menuItem = this.menuItems.find(m => m.id === menuItemId);
        if (!menuItem) return;
        
        if (confirm(`Are you sure you want to delete the menu item "${menuItem.label}"?`)) {
            this.menuItems = this.menuItems.filter(m => m.id !== menuItemId);
            this.updateOrderNumbers();
            this.renderMenuItems();
            this.showNotification('Menu item deleted successfully', 'success');
        }
    }

    toggleReorderMode() {
        const container = document.getElementById('menu-items-container');
        if (!container) return;
        
        container.classList.toggle('reorder-mode');
        
        if (container.classList.contains('reorder-mode')) {
            this.showNotification('Reorder mode enabled. Drag and drop menu items to reorder them.', 'info');
        } else {
            this.showNotification('Reorder mode disabled.', 'info');
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.remove();
        }
        this.editingMenuItem = null;
    }

    showNotification(message, type = 'info') {
        // Use the notification system if available
        if (window.adminManager && window.adminManager.notificationSystem) {
            window.adminManager.notificationSystem.show(type, 'Navigation Manager', message);
        } else {
            alert(message);
        }
    }

    async getCount() {
        return this.menuItems.filter(m => m.isActive && m.isVisible).length;
    }

    async exportMenuItems() {
        return this.menuItems;
    }

    async importMenuItems() {
        // Create file input for import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const importedMenuItems = JSON.parse(text);
                    this.menuItems = importedMenuItems;
                    this.updateOrderNumbers();
                    this.renderMenuItems();
                    this.showNotification('Menu items imported successfully', 'success');
                } catch (error) {
                    this.showNotification('Error importing menu items: ' + error.message, 'error');
                }
            }
        };
        input.click();
    }
}

// Make NavigationManager available globally
window.NavigationManager = NavigationManager;
