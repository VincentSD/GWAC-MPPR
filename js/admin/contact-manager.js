/**
 * Contact Manager for Admin Panel
 * Handles comprehensive contact information and support management
 */

class ContactManager {
    constructor(githubIntegration) {
        this.githubIntegration = githubIntegration;
        this.contactInfo = {};
        this.officeLocations = [];
        this.supportCategories = [];
        this.editingContact = null;
        this.editingLocation = null;
        this.editingCategory = null;
    }

    async init() {
        try {
            await this.loadContactInfo();
            await this.loadOfficeLocations();
            await this.loadSupportCategories();
            this.setupEventListeners();
            this.renderContactInfo();
            this.renderOfficeLocations();
            this.renderSupportCategories();
        } catch (error) {
            console.error('Error initializing contact manager:', error);
        }
    }

    async loadContactInfo() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'contact-info.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.contactInfo = JSON.parse(decodedContent);
            } else {
                this.contactInfo = this.getDefaultContactInfo();
            }
        } catch (error) {
            this.contactInfo = this.getDefaultContactInfo();
        }
    }

    async loadOfficeLocations() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'office-locations.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.officeLocations = JSON.parse(decodedContent);
            } else {
                this.officeLocations = this.getDefaultOfficeLocations();
            }
        } catch (error) {
            this.officeLocations = this.getDefaultOfficeLocations();
        }
    }

    async loadSupportCategories() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'support-categories.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.supportCategories = JSON.parse(decodedContent);
            } else {
                this.supportCategories = this.getDefaultSupportCategories();
            }
        } catch (error) {
            this.supportCategories = this.getDefaultSupportCategories();
        }
    }

    getDefaultContactInfo() {
        return {
            primaryContact: {
                generalInquiries: "info@g-wac.org",
                phone: "(+233) 322 192 173",
                mainOffice: "KNUST, College of Health Sciences, Kumasi, Ghana",
                website: "http://www.g-wac.org/",
                workingHours: "Monday - Friday, 8:00 AM - 5:00 PM GMT"
            },
            courseSpecific: {
                technicalSupport: "tech-support@g-wac.org",
                registration: "registration@g-wac.org",
                academicInquiries: "academic@g-wac.org"
            },
            emergencyContact: {
                afterHours: "+233 20 123 4567",
                emergencyEmail: "emergency@g-wac.org"
            },
            socialMedia: {
                linkedin: "https://linkedin.com/company/g-wac",
                twitter: "https://twitter.com/gwac_org",
                facebook: "https://facebook.com/gwac.org"
            }
        };
    }

    getDefaultOfficeLocations() {
        return [
            {
                id: "ghana-office",
                name: "Ghana Office",
                type: "Main Office",
                address: {
                    street: "G-WAC Secretariat",
                    institution: "Kwame Nkrumah University of Science and Technology",
                    city: "Kumasi",
                    country: "Ghana",
                    postalCode: "PMB",
                    campus: "Kumasi Campus"
                },
                contact: {
                    phone: "(+233) 322 192 173",
                    email: "info@g-wac.org",
                    fax: "(+233) 322 192 174"
                },
                coordinates: {
                    latitude: 6.6885,
                    longitude: -1.6244
                },
                isActive: true,
                order: 1
            },
            {
                id: "germany-office",
                name: "Germany Office",
                type: "European Branch",
                address: {
                    street: "G-WAC European Secretariat",
                    institution: "Freie Universität Berlin",
                    city: "Berlin",
                    country: "Germany",
                    postalCode: "14195",
                    campus: "Dahlem Campus"
                },
                contact: {
                    phone: "+49 30 838 52200",
                    email: "germany@g-wac.org",
                    fax: "+49 30 838 52201"
                },
                coordinates: {
                    latitude: 52.5200,
                    longitude: 13.4050
                },
                isActive: true,
                order: 2
            }
        ];
    }

    getDefaultSupportCategories() {
        return [
            {
                id: "course-information",
                name: "Course Information",
                description: "General questions about course content, schedule, and requirements",
                email: "course-info@g-wac.org",
                responseTime: "24 hours",
                isActive: true,
                order: 1
            },
            {
                id: "technical-support",
                name: "Technical Support",
                description: "Help with platform access, file downloads, and technical issues",
                email: "tech-support@g-wac.org",
                responseTime: "4 hours",
                isActive: true,
                order: 2
            },
            {
                id: "registration",
                name: "Registration & Enrollment",
                description: "Questions about registration process, payments, and enrollment status",
                email: "registration@g-wac.org",
                responseTime: "12 hours",
                isActive: true,
                order: 3
            },
            {
                id: "academic-inquiries",
                name: "Academic Inquiries",
                description: "Questions about academic content, assignments, and grading",
                email: "academic@g-wac.org",
                responseTime: "24 hours",
                isActive: true,
                order: 4
            },
            {
                id: "partnership",
                name: "Partnership & Collaboration",
                description: "Inquiries about partnerships, collaborations, and joint programs",
                email: "partnerships@g-wac.org",
                responseTime: "48 hours",
                isActive: true,
                order: 5
            },
            {
                id: "general-inquiry",
                name: "General Inquiry",
                description: "Other general questions and information requests",
                email: "info@g-wac.org",
                responseTime: "24 hours",
                isActive: true,
                order: 6
            }
        ];
    }

    setupEventListeners() {
        // Add new contact button
        const addContactBtn = document.querySelector('[onclick="adminManager.addNewContact()"]');
        if (addContactBtn) {
            addContactBtn.onclick = () => this.addNewContact();
        }

        // Manage email protection button
        const emailProtectionBtn = document.querySelector('[onclick="adminManager.manageEmailProtection()"]');
        if (emailProtectionBtn) {
            emailProtectionBtn.onclick = () => this.manageEmailProtection();
        }
    }

    renderContactInfo() {
        const container = document.getElementById('contact-info-list');
        if (!container) return;

        container.innerHTML = '';

        // Add primary contact section
        const primarySection = this.createPrimaryContactSection();
        container.appendChild(primarySection);

        // Add course-specific contact section
        const courseSection = this.createCourseSpecificSection();
        container.appendChild(courseSection);

        // Add emergency contact section
        const emergencySection = this.createEmergencyContactSection();
        container.appendChild(emergencySection);

        // Add social media section
        const socialSection = this.createSocialMediaSection();
        container.appendChild(socialSection);

        // Add new contact button
        const addSection = this.createAddContactSection();
        container.appendChild(addSection);
    }

    renderOfficeLocations() {
        const container = document.getElementById('office-locations-list');
        if (!container) return;

        container.innerHTML = '';

        // Add office locations grid
        const locationsGrid = this.createOfficeLocationsGrid();
        container.appendChild(locationsGrid);

        // Add new location button
        const addSection = this.createAddLocationSection();
        container.appendChild(addSection);
    }

    renderSupportCategories() {
        const container = document.getElementById('support-categories-list');
        if (!container) return;

        container.innerHTML = '';

        // Add support categories grid
        const categoriesGrid = this.createSupportCategoriesGrid();
        container.appendChild(categoriesGrid);

        // Add new category button
        const addSection = this.createAddSupportCategorySection();
        container.appendChild(addSection);
    }

    createPrimaryContactSection() {
        const section = document.createElement('div');
        section.className = 'contact-section';
        section.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-info-circle"></i> Primary Contact Information</h3>
                <button class="btn btn-sm btn-outline" onclick="contactManager.editPrimaryContact()">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            <div class="contact-grid">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>General Inquiries</h4>
                        <p class="protected-email" data-email="${this.contactInfo.primaryContact.generalInquiries}">
                            Click to reveal email
                        </p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>Phone</h4>
                        <p>${this.contactInfo.primaryContact.phone}</p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <h4>Main Office</h4>
                        <p>${this.contactInfo.primaryContact.mainOffice}</p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-globe"></i>
                    <div>
                        <h4>Website</h4>
                        <p><a href="${this.contactInfo.primaryContact.website}" target="_blank">${this.contactInfo.primaryContact.website}</a></p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>Working Hours</h4>
                        <p>${this.contactInfo.primaryContact.workingHours}</p>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    createCourseSpecificSection() {
        const section = document.createElement('div');
        section.className = 'contact-section';
        section.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-graduation-cap"></i> Course-Specific Enquiries</h3>
                <button class="btn btn-sm btn-outline" onclick="contactManager.editCourseSpecific()">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            <div class="contact-grid">
                <div class="contact-item">
                    <i class="fas fa-tools"></i>
                    <div>
                        <h4>Technical Support</h4>
                        <p class="protected-email" data-email="${this.contactInfo.courseSpecific.technicalSupport}">
                            Click to reveal email
                        </p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-user-plus"></i>
                    <div>
                        <h4>Registration</h4>
                        <p class="protected-email" data-email="${this.contactInfo.courseSpecific.registration}">
                            Click to reveal email
                        </p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-book"></i>
                    <div>
                        <h4>Academic Inquiries</h4>
                        <p class="protected-email" data-email="${this.contactInfo.courseSpecific.academicInquiries}">
                            Click to reveal email
                        </p>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    createEmergencyContactSection() {
        const section = document.createElement('div');
        section.className = 'contact-section';
        section.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-exclamation-triangle"></i> Emergency Contact</h3>
                <button class="btn btn-sm btn-outline" onclick="contactManager.editEmergencyContact()">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            <div class="contact-grid">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>After Hours</h4>
                        <p>${this.contactInfo.emergencyContact.afterHours}</p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>Emergency Email</h4>
                        <p class="protected-email" data-email="${this.contactInfo.emergencyContact.emergencyEmail}">
                            Click to reveal email
                        </p>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    createSocialMediaSection() {
        const section = document.createElement('div');
        section.className = 'contact-section';
        section.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-share-alt"></i> Social Media</h3>
                <button class="btn btn-sm btn-outline" onclick="contactManager.editSocialMedia()">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            <div class="social-media-grid">
                ${Object.entries(this.contactInfo.socialMedia).map(([platform, url]) => `
                    <div class="social-item">
                        <i class="fab fa-${platform}"></i>
                        <div>
                            <h4>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
                            <p><a href="${url}" target="_blank">${url}</a></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return section;
    }

    createOfficeLocationsGrid() {
        const grid = document.createElement('div');
        grid.className = 'office-locations-grid';
        
        grid.innerHTML = this.officeLocations.map(location => `
            <div class="location-card ${location.isActive ? 'active' : 'inactive'}" data-location-id="${location.id}">
                <div class="location-header">
                    <div class="location-type">
                        <span class="type-badge">${location.type}</span>
                    </div>
                    <div class="location-status">
                        <span class="status-badge ${location.isActive ? 'active' : 'inactive'}">
                            ${location.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                
                <div class="location-info">
                    <h4 class="location-name">${location.name}</h4>
                    <div class="location-address">
                        <p><strong>${location.address.institution}</strong></p>
                        <p>${location.address.street}</p>
                        <p>${location.address.city}, ${location.address.country}</p>
                        <p>${location.address.postalCode}</p>
                    </div>
                    
                    <div class="location-contact">
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${location.contact.phone}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span class="protected-email" data-email="${location.contact.email}">
                                Click to reveal email
                            </span>
                        </div>
                        ${location.contact.fax ? `
                            <div class="contact-item">
                                <i class="fas fa-fax"></i>
                                <span>${location.contact.fax}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="location-coordinates">
                        <span><i class="fas fa-map-marker-alt"></i> ${location.coordinates.latitude}, ${location.coordinates.longitude}</span>
                    </div>
                </div>
                
                <div class="location-actions">
                    <button class="btn btn-sm btn-outline" onclick="contactManager.editLocation('${location.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="contactManager.toggleLocationStatus('${location.id}')">
                        <i class="fas fa-${location.isActive ? 'pause' : 'play'}"></i> 
                        ${location.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="contactManager.deleteLocation('${location.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        return grid;
    }

    createSupportCategoriesGrid() {
        const grid = document.createElement('div');
        grid.className = 'support-categories-grid';
        
        grid.innerHTML = this.supportCategories.map(category => `
            <div class="support-category-card ${category.isActive ? 'active' : 'inactive'}" data-category-id="${category.id}">
                <div class="category-header">
                    <div class="category-icon">
                        <i class="fas fa-headset"></i>
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
                
                <div class="category-details">
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <span class="protected-email" data-email="${category.email}">
                            Click to reveal email
                        </span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Response: ${category.responseTime}</span>
                    </div>
                </div>
                
                <div class="category-actions">
                    <button class="btn btn-sm btn-outline" onclick="contactManager.editSupportCategory('${category.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="contactManager.toggleSupportCategoryStatus('${category.id}')">
                        <i class="fas fa-${category.isActive ? 'pause' : 'play'}"></i> 
                        ${category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="contactManager.deleteSupportCategory('${category.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        return grid;
    }

    createAddContactSection() {
        const section = document.createElement('div');
        section.className = 'add-contact-section';
        section.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="contactManager.addNewContact()">
                <i class="fas fa-plus"></i> Add New Contact
            </button>
        `;
        return section;
    }

    createAddLocationSection() {
        const section = document.createElement('div');
        section.className = 'add-location-section';
        section.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="contactManager.addNewLocation()">
                <i class="fas fa-plus"></i> Add New Office Location
            </button>
        `;
        return section;
    }

    createAddSupportCategorySection() {
        const section = document.createElement('div');
        section.className = 'add-support-category-section';
        section.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="contactManager.addNewSupportCategory()">
                <i class="fas fa-plus"></i> Add New Support Category
            </button>
        `;
        return section;
    }

    addNewContact() {
        this.showNotification('Contact management coming soon!', 'info');
    }

    addNewLocation() {
        const newLocation = {
            id: `location-${Date.now()}`,
            name: 'New Office Location',
            type: 'Branch Office',
            address: {
                street: 'Street Address',
                institution: 'Institution Name',
                city: 'City',
                country: 'Country',
                postalCode: 'Postal Code',
                campus: 'Campus'
            },
            contact: {
                phone: '+123 456 7890',
                email: 'new-office@g-wac.org',
                fax: ''
            },
            coordinates: {
                latitude: 0,
                longitude: 0
            },
            isActive: true,
            order: this.officeLocations.length + 1
        };
        
        this.officeLocations.push(newLocation);
        this.renderOfficeLocations();
        this.editLocation(newLocation.id);
        this.showNotification('New office location added successfully', 'success');
    }

    addNewSupportCategory() {
        const newCategory = {
            id: `support-category-${Date.now()}`,
            name: 'New Support Category',
            description: 'Support category description',
            email: 'new-support@g-wac.org',
            responseTime: '24 hours',
            isActive: true,
            order: this.supportCategories.length + 1
        };
        
        this.supportCategories.push(newCategory);
        this.renderSupportCategories();
        this.editSupportCategory(newCategory.id);
        this.showNotification('New support category added successfully', 'success');
    }

    editPrimaryContact() {
        this.showContactEditModal('primary', this.contactInfo.primaryContact);
    }

    editCourseSpecific() {
        this.showContactEditModal('course', this.contactInfo.courseSpecific);
    }

    editEmergencyContact() {
        this.showContactEditModal('emergency', this.contactInfo.emergencyContact);
    }

    editSocialMedia() {
        this.showContactEditModal('social', this.contactInfo.socialMedia);
    }

    editLocation(locationId) {
        const location = this.officeLocations.find(l => l.id === locationId);
        if (!location) return;
        
        this.editingLocation = location;
        this.showLocationEditModal(location);
    }

    editSupportCategory(categoryId) {
        const category = this.supportCategories.find(c => c.id === categoryId);
        if (!category) return;
        
        this.editingCategory = category;
        this.showSupportCategoryEditModal(category);
    }

    showContactEditModal(type, data) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        let modalContent = '';
        let title = '';
        
        switch (type) {
            case 'primary':
                title = 'Edit Primary Contact Information';
                modalContent = this.createPrimaryContactForm(data);
                break;
            case 'course':
                title = 'Edit Course-Specific Contact Information';
                modalContent = this.createCourseSpecificForm(data);
                break;
            case 'emergency':
                title = 'Edit Emergency Contact Information';
                modalContent = this.createEmergencyContactForm(data);
                break;
            case 'social':
                title = 'Edit Social Media Links';
                modalContent = this.createSocialMediaForm(data);
                break;
        }
        
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="contactManager.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${modalContent}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="contactManager.saveContactEdit('${type}')">Save Changes</button>
                    <button class="btn btn-secondary" onclick="contactManager.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    createPrimaryContactForm(data) {
        return `
            <div class="form-grid">
                <div class="form-group">
                    <label>General Inquiries Email *</label>
                    <input type="email" id="edit-primary-general-email" value="${data.generalInquiries}" required>
                </div>
                <div class="form-group">
                    <label>Phone *</label>
                    <input type="tel" id="edit-primary-phone" value="${data.phone}" required>
                </div>
                <div class="form-group full-width">
                    <label>Main Office Address *</label>
                    <textarea id="edit-primary-main-office" rows="2" required>${data.mainOffice}</textarea>
                </div>
                <div class="form-group">
                    <label>Website *</label>
                    <input type="url" id="edit-primary-website" value="${data.website}" required>
                </div>
                <div class="form-group">
                    <label>Working Hours *</label>
                    <input type="text" id="edit-primary-working-hours" value="${data.workingHours}" required>
                </div>
            </div>
        `;
    }

    createCourseSpecificForm(data) {
        return `
            <div class="form-grid">
                <div class="form-group">
                    <label>Technical Support Email *</label>
                    <input type="email" id="edit-course-tech-support" value="${data.technicalSupport}" required>
                </div>
                <div class="form-group">
                    <label>Registration Email *</label>
                    <input type="email" id="edit-course-registration" value="${data.registration}" required>
                </div>
                <div class="form-group">
                    <label>Academic Inquiries Email *</label>
                    <input type="email" id="edit-course-academic" value="${data.academicInquiries}" required>
                </div>
            </div>
        `;
    }

    createEmergencyContactForm(data) {
        return `
            <div class="form-grid">
                <div class="form-group">
                    <label>After Hours Phone *</label>
                    <input type="tel" id="edit-emergency-phone" value="${data.afterHours}" required>
                </div>
                <div class="form-group">
                    <label>Emergency Email *</label>
                    <input type="email" id="edit-emergency-email" value="${data.emergencyEmail}" required>
                </div>
            </div>
        `;
    }

    createSocialMediaForm(data) {
        return `
            <div class="form-grid">
                <div class="form-group">
                    <label>LinkedIn URL</label>
                    <input type="url" id="edit-social-linkedin" value="${data.linkedin || ''}">
                </div>
                <div class="form-group">
                    <label>Twitter URL</label>
                    <input type="url" id="edit-social-twitter" value="${data.twitter || ''}">
                </div>
                <div class="form-group">
                    <label>Facebook URL</label>
                    <input type="url" id="edit-social-facebook" value="${data.facebook || ''}">
                </div>
            </div>
        `;
    }

    showLocationEditModal(location) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>Edit Office Location: ${location.name}</h3>
                    <button class="modal-close" onclick="contactManager.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Location Name *</label>
                            <input type="text" id="edit-location-name" value="${location.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Type *</label>
                            <select id="edit-location-type" required>
                                <option value="Main Office" ${location.type === 'Main Office' ? 'selected' : ''}>Main Office</option>
                                <option value="Branch Office" ${location.type === 'Branch Office' ? 'selected' : ''}>Branch Office</option>
                                <option value="Regional Office" ${location.type === 'Regional Office' ? 'selected' : ''}>Regional Office</option>
                                <option value="Partner Office" ${location.type === 'Partner Office' ? 'selected' : ''}>Partner Office</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Institution *</label>
                            <input type="text" id="edit-location-institution" value="${location.address.institution}" required>
                        </div>
                        <div class="form-group">
                            <label>Street Address *</label>
                            <input type="text" id="edit-location-street" value="${location.address.street}" required>
                        </div>
                        <div class="form-group">
                            <label>City *</label>
                            <input type="text" id="edit-location-city" value="${location.address.city}" required>
                        </div>
                        <div class="form-group">
                            <label>Country *</label>
                            <input type="text" id="edit-location-country" value="${location.address.country}" required>
                        </div>
                        <div class="form-group">
                            <label>Postal Code</label>
                            <input type="text" id="edit-location-postal-code" value="${location.address.postalCode}">
                        </div>
                        <div class="form-group">
                            <label>Campus</label>
                            <input type="text" id="edit-location-campus" value="${location.address.campus}">
                        </div>
                        <div class="form-group">
                            <label>Phone *</label>
                            <input type="tel" id="edit-location-phone" value="${location.contact.phone}" required>
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" id="edit-location-email" value="${location.contact.email}" required>
                        </div>
                        <div class="form-group">
                            <label>Fax</label>
                            <input type="tel" id="edit-location-fax" value="${location.contact.fax}">
                        </div>
                        <div class="form-group">
                            <label>Latitude</label>
                            <input type="number" id="edit-location-latitude" value="${location.coordinates.latitude}" step="0.0001">
                        </div>
                        <div class="form-group">
                            <label>Longitude</label>
                            <input type="number" id="edit-location-longitude" value="${location.coordinates.longitude}" step="0.0001">
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="contactManager.saveLocationEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="contactManager.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showSupportCategoryEditModal(category) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Support Category: ${category.name}</h3>
                    <button class="modal-close" onclick="contactManager.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Category Name *</label>
                        <input type="text" id="edit-support-category-name" value="${category.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Description *</label>
                        <textarea id="edit-support-category-description" rows="3" required>${category.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="edit-support-category-email" value="${category.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Response Time *</label>
                        <input type="text" id="edit-support-category-response-time" value="${category.responseTime}" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="edit-support-category-status">
                            <option value="true" ${category.isActive ? 'selected' : ''}>Active</option>
                            <option value="false" ${!category.isActive ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="contactManager.saveSupportCategoryEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="contactManager.closeModal()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveContactEdit(type) {
        switch (type) {
            case 'primary':
                this.savePrimaryContact();
                break;
            case 'course':
                this.saveCourseSpecific();
                break;
            case 'emergency':
                this.saveEmergencyContact();
                break;
            case 'social':
                this.saveSocialMedia();
                break;
        }
    }

    savePrimaryContact() {
        const generalInquiries = document.getElementById('edit-primary-general-email').value;
        const phone = document.getElementById('edit-primary-phone').value;
        const mainOffice = document.getElementById('edit-primary-main-office').value;
        const website = document.getElementById('edit-primary-website').value;
        const workingHours = document.getElementById('edit-primary-working-hours').value;
        
        this.contactInfo.primaryContact = {
            generalInquiries,
            phone,
            mainOffice,
            website,
            workingHours
        };
        
        this.renderContactInfo();
        this.closeModal();
        this.showNotification('Primary contact information updated successfully', 'success');
    }

    saveCourseSpecific() {
        const technicalSupport = document.getElementById('edit-course-tech-support').value;
        const registration = document.getElementById('edit-course-registration').value;
        const academicInquiries = document.getElementById('edit-course-academic').value;
        
        this.contactInfo.courseSpecific = {
            technicalSupport,
            registration,
            academicInquiries
        };
        
        this.renderContactInfo();
        this.closeModal();
        this.showNotification('Course-specific contact information updated successfully', 'success');
    }

    saveEmergencyContact() {
        const afterHours = document.getElementById('edit-emergency-phone').value;
        const emergencyEmail = document.getElementById('edit-emergency-email').value;
        
        this.contactInfo.emergencyContact = {
            afterHours,
            emergencyEmail
        };
        
        this.renderContactInfo();
        this.closeModal();
        this.showNotification('Emergency contact information updated successfully', 'success');
    }

    saveSocialMedia() {
        const linkedin = document.getElementById('edit-social-linkedin').value;
        const twitter = document.getElementById('edit-social-twitter').value;
        const facebook = document.getElementById('edit-social-facebook').value;
        
        this.contactInfo.socialMedia = {
            linkedin,
            twitter,
            facebook
        };
        
        this.renderContactInfo();
        this.closeModal();
        this.showNotification('Social media links updated successfully', 'success');
    }

    saveLocationEdit() {
        if (!this.editingLocation) return;
        
        const location = this.editingLocation;
        const locationIndex = this.officeLocations.findIndex(l => l.id === location.id);
        if (locationIndex === -1) return;
        
        const name = document.getElementById('edit-location-name').value;
        const type = document.getElementById('edit-location-type').value;
        const institution = document.getElementById('edit-location-institution').value;
        const street = document.getElementById('edit-location-street').value;
        const city = document.getElementById('edit-location-city').value;
        const country = document.getElementById('edit-location-country').value;
        const postalCode = document.getElementById('edit-location-postal-code').value;
        const campus = document.getElementById('edit-location-campus').value;
        const phone = document.getElementById('edit-location-phone').value;
        const email = document.getElementById('edit-location-email').value;
        const fax = document.getElementById('edit-location-fax').value;
        const latitude = parseFloat(document.getElementById('edit-location-latitude').value);
        const longitude = parseFloat(document.getElementById('edit-location-longitude').value);
        
        this.officeLocations[locationIndex] = {
            ...location,
            name,
            type,
            address: {
                street,
                institution,
                city,
                country,
                postalCode,
                campus
            },
            contact: {
                phone,
                email,
                fax
            },
            coordinates: {
                latitude,
                longitude
            }
        };
        
        this.renderOfficeLocations();
        this.closeModal();
        this.showNotification('Office location updated successfully', 'success');
    }

    saveSupportCategoryEdit() {
        if (!this.editingCategory) return;
        
        const category = this.editingCategory;
        const categoryIndex = this.supportCategories.findIndex(c => c.id === category.id);
        if (categoryIndex === -1) return;
        
        const name = document.getElementById('edit-support-category-name').value;
        const description = document.getElementById('edit-support-category-description').value;
        const email = document.getElementById('edit-support-category-email').value;
        const responseTime = document.getElementById('edit-support-category-response-time').value;
        const isActive = document.getElementById('edit-support-category-status').value === 'true';
        
        this.supportCategories[categoryIndex] = {
            ...category,
            name,
            description,
            email,
            responseTime,
            isActive
        };
        
        this.renderSupportCategories();
        this.closeModal();
        this.showNotification('Support category updated successfully', 'success');
    }

    toggleLocationStatus(locationId) {
        const location = this.officeLocations.find(l => l.id === locationId);
        if (!location) return;
        
        location.isActive = !location.isActive;
        this.renderOfficeLocations();
        this.showNotification(
            `Office location ${location.isActive ? 'activated' : 'deactivated'} successfully`, 
            'success'
        );
    }

    toggleSupportCategoryStatus(categoryId) {
        const category = this.supportCategories.find(c => c.id === categoryId);
        if (!category) return;
        
        category.isActive = !category.isActive;
        this.renderSupportCategories();
        this.showNotification(
            `Support category ${category.isActive ? 'activated' : 'deactivated'} successfully`, 
            'success'
        );
    }

    deleteLocation(locationId) {
        const location = this.officeLocations.find(l => l.id === locationId);
        if (!location) return;
        
        if (confirm(`Are you sure you want to delete the office location "${location.name}"?`)) {
            this.officeLocations = this.officeLocations.filter(l => l.id !== locationId);
            this.renderOfficeLocations();
            this.showNotification('Office location deleted successfully', 'success');
        }
    }

    deleteSupportCategory(categoryId) {
        const category = this.supportCategories.find(c => c.id === categoryId);
        if (!category) return;
        
        if (confirm(`Are you sure you want to delete the support category "${category.name}"?`)) {
            this.supportCategories = this.supportCategories.filter(c => c.id !== categoryId);
            this.renderSupportCategories();
            this.showNotification('Support category deleted successfully', 'success');
        }
    }

    manageEmailProtection() {
        this.showNotification('Email protection management coming soon!', 'info');
    }

    closeModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.remove();
        }
        this.editingLocation = null;
        this.editingCategory = null;
    }

    showNotification(message, type = 'info') {
        // Use the notification system if available
        if (window.adminManager && window.adminManager.notificationSystem) {
            window.adminManager.notificationSystem.show(type, 'Contact Manager', message);
        } else {
            alert(message);
        }
    }

    async getCount() {
        return this.officeLocations.filter(l => l.isActive).length;
    }

    async exportContactInfo() {
        return {
            contactInfo: this.contactInfo,
            officeLocations: this.officeLocations,
            supportCategories: this.supportCategories
        };
    }

    async importContactInfo() {
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
                    
                    if (importedData.contactInfo) this.contactInfo = importedData.contactInfo;
                    if (importedData.officeLocations) this.officeLocations = importedData.officeLocations;
                    if (importedData.supportCategories) this.supportCategories = importedData.supportCategories;
                    
                    this.renderContactInfo();
                    this.renderOfficeLocations();
                    this.renderSupportCategories();
                    
                    this.showNotification('Contact information imported successfully', 'success');
                } catch (error) {
                    this.showNotification('Error importing contact information: ' + error.message, 'error');
                }
            }
        };
        input.click();
    }
}
// Make ContactManager available globally
window.ContactManager = ContactManager;
