/**
 * Schedule Manager for Admin Panel
 * Handles comprehensive program schedule management
 */

class ScheduleManager {
    constructor(githubIntegration) {
        this.githubIntegration = githubIntegration;
        this.schedule = null;
        this.currentDay = null;
        this.editingSession = null;
        this.currentPart = null;
    }

    async init() {
        try {
            await this.loadSchedule();
            this.setupEventListeners();
            this.renderSchedule();
        } catch (error) {
            console.error('Error initializing schedule manager:', error);
        }
    }

    async loadSchedule() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'schedule.json');
            if (content) {
                const decodedContent = atob(content.content);
                this.schedule = JSON.parse(decodedContent);
            } else {
                this.schedule = this.getDefaultSchedule();
            }
        } catch (error) {
            console.log('Using default schedule:', error);
            this.schedule = this.getDefaultSchedule();
        }
    }

    getDefaultSchedule() {
        return {
            parts: [
                {
                    id: 'part-1',
                    title: 'Part I: Essentials of Disease Modelling',
                    description: 'Foundation building with R programming, Git/GitHub, and basic infectious disease modeling concepts',
                    duration: '3 Days',
                    hours: 24,
                    instructors: 10,
                    color: '#3b82f6'
                },
                {
                    id: 'part-2',
                    title: 'Part II: Advanced Disease Modelling for Pandemic Preparedness and Response',
                    description: 'Advanced modeling techniques, scenario analysis, health economics, and intensive group projects with hands-on exercises',
                    duration: '6 Days',
                    hours: 48,
                    instructors: 8,
                    color: '#10b981'
                }
            ],
            days: [
                {
                    id: 'monday-sept1',
                    date: '2025-09-01',
                    dayName: 'Monday',
                    theme: 'Introduction & R Programming',
                    part: 'part-1',
                    sessions: [
                        {
                            id: 'session-1',
                            time: '09:00 - 10:30 GMT',
                            title: 'Introduction to the German West-African Centre for Global Health and Prevention (G-WAC)',
                            type: 'morning',
                            topics: ['Overview of G-WAC mission, structure, and global health initiatives'],
                            mainInstructor: 'Dr. John Amuasi',
                            supportInstructors: [],
                            links: [
                                { text: 'About G-WAC', url: '#about-gwac', icon: 'fas fa-info-circle' },
                                { text: 'G-WAC Website', url: 'https://g-wac.org/', icon: 'fas fa-external-link-alt' }
                            ]
                        },
                        {
                            id: 'session-2',
                            time: '10:30 - 12:00 GMT',
                            title: 'Crash Course in R Programming',
                            type: 'morning',
                            topics: ['Writing R functions', 'Basics of deSolve package', 'Writing ODE systems in R', 'Optimization', 'Debugging/profiling R code', 'Writing efficient R code'],
                            mainInstructor: 'James Azam',
                            supportInstructors: ['Vincent Donkoh', 'Opanin Agyei Adu', 'Charlène Naomie Tedto Mfangnia'],
                            links: [
                                { text: 'Course Materials', url: '#course-materials', icon: 'fas fa-book' },
                                { text: 'R Tutorials (GitHub)', url: 'https://github.com/jamesmbaazam/mppr/tree/main/tutorials/R', icon: 'fab fa-github' },
                                { text: 'Presentations (Drive)', url: 'https://drive.google.com/drive/folders/1MYPl2YaE5aALSVrOV8EdJre2V85gTjpd', icon: 'fab fa-google-drive' }
                            ]
                        },
                        {
                            id: 'lunch-1',
                            time: '12:00 - 13:30 GMT',
                            title: 'Lunch Break',
                            type: 'lunch',
                            topics: ['Networking and refreshments'],
                            mainInstructor: '',
                            supportInstructors: [],
                            links: []
                        }
                    ]
                }
            ]
        };
    }

    setupEventListeners() {
        // Add new day button
        const addDayBtn = document.querySelector('[onclick="adminManager.addNewDay()"]');
        if (addDayBtn) {
            addDayBtn.onclick = () => this.addNewDay();
        }

        // Import schedule button
        const importBtn = document.querySelector('[onclick="adminManager.importSchedule()"]');
        if (importBtn) {
            importBtn.onclick = () => this.importSchedule();
        }
    }

    renderSchedule() {
        const container = document.getElementById('schedule-days');
        if (!container) return;

        container.innerHTML = '';

        // Render parts overview
        const partsSection = this.createPartsSection();
        container.appendChild(partsSection);

        // Render days
        this.schedule.days.forEach(day => {
            const dayElement = this.createDayElement(day);
            container.appendChild(dayElement);
        });

        // Add new day button
        const addDayBtn = this.createAddDayButton();
        container.appendChild(addDayBtn);
    }

    createPartsSection() {
        const section = document.createElement('div');
        section.className = 'schedule-parts-section';
        section.innerHTML = `
            <h3><i class="fas fa-layer-group"></i> Program Parts Overview</h3>
            <div class="parts-grid">
                ${this.schedule.parts.map(part => `
                    <div class="part-card" data-part-id="${part.id}">
                        <div class="part-header" style="border-left-color: ${part.color}">
                            <h4>${part.title}</h4>
                            <p>${part.description}</p>
                        </div>
                        <div class="part-stats">
                            <span><i class="fas fa-calendar"></i> ${part.duration}</span>
                            <span><i class="fas fa-clock"></i> ${part.hours} Hours</span>
                            <span><i class="fas fa-users"></i> ${part.instructors}+ Instructors</span>
                        </div>
                        <div class="part-actions">
                            <button class="btn btn-sm btn-outline" onclick="adminManager.editSchedulePart('${part.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        return section;
    }

    createDayElement(day) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-card';
        dayElement.dataset.dayId = day.id;
        
        dayElement.innerHTML = `
            <div class="day-header">
                <div class="day-info">
                    <div class="day-date">
                        <span class="day-name">${day.dayName}</span>
                        <span class="date">${this.formatDate(day.date)}</span>
                    </div>
                    <div class="day-theme">${day.theme}</div>
                </div>
                <div class="day-actions">
                    <button class="btn btn-sm btn-outline" onclick="adminManager.editScheduleDay('${day.id}')">
                        <i class="fas fa-edit"></i> Edit Day
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="adminManager.addScheduleSession('${day.id}')">
                        <i class="fas fa-plus"></i> Add Session
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminManager.deleteScheduleDay('${day.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="day-sessions">
                ${day.sessions.map(session => `
                    <div class="session-item ${session.type}" data-session-id="${session.id}">
                        <div class="session-time">${session.time}</div>
                        <div class="session-content">
                            <h5>${session.title}</h5>
                            <p><strong>Topics:</strong> ${session.topics.join(', ')}</p>
                            ${session.mainInstructor ? `
                                <div class="instructor-info">
                                    <span class="main-instructor">Main: ${session.mainInstructor}</span>
                                    ${session.supportInstructors.length > 0 ? `
                                        <span class="support-instructors">Support: ${session.supportInstructors.join(', ')}</span>
                                    ` : ''}
                                </div>
                            ` : ''}
                            ${session.links.length > 0 ? `
                                <div class="session-links">
                                    ${session.links.map(link => `
                                        <a href="${link.url}" class="session-link ${link.url.startsWith('http') ? 'external' : 'internal'}" target="${link.url.startsWith('http') ? '_blank' : ''}">
                                            <i class="${link.icon}"></i> ${link.text}
                                        </a>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="session-actions">
                            <button class="btn btn-sm btn-outline" onclick="adminManager.editScheduleSession('${day.id}', '${session.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="adminManager.deleteScheduleSession('${day.id}', '${session.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return dayElement;
    }

    createAddDayButton() {
        const button = document.createElement('div');
        button.className = 'add-day-section';
        button.innerHTML = `
            <button class="btn btn-primary btn-large" onclick="adminManager.addScheduleDay()">
                <i class="fas fa-plus"></i> Add New Day
            </button>
        `;
        return button;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    addNewDay() {
        const newDay = {
            id: `day-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            dayName: 'New Day',
            theme: 'New Theme',
            part: 'part-1',
            sessions: []
        };
        
        this.schedule.days.push(newDay);
        this.renderSchedule();
        this.showNotification('New day added successfully', 'success');
    }

    editDay(dayId) {
        const day = this.schedule.days.find(d => d.id === dayId);
        if (!day) return;
        
        this.currentDay = day;
        this.showDayEditModal(day);
    }

    editPart(partId) {
        const part = this.schedule.parts.find(p => p.id === partId);
        if (!part) return;
        
        this.currentPart = part;
        this.showPartEditModal(part);
    }

    addSession(dayId) {
        const day = this.schedule.days.find(d => d.id === dayId);
        if (!day) return;
        
        const newSession = {
            id: `session-${Date.now()}`,
            time: '09:00 - 10:30 GMT',
            title: 'New Session',
            type: 'morning',
            topics: ['Session topics...'],
            mainInstructor: '',
            supportInstructors: [],
            links: []
        };
        
        day.sessions.push(newSession);
        this.renderSchedule();
        this.showNotification('New session added successfully', 'success');
    }

    editSession(dayId, sessionId) {
        const day = this.schedule.days.find(d => d.id === dayId);
        if (!day) return;
        
        const session = day.sessions.find(s => s.id === sessionId);
        if (!session) return;
        
        this.editingSession = { dayId, session };
        this.showSessionEditModal(session);
    }

    deleteDay(dayId) {
        if (confirm('Are you sure you want to delete this day? This will remove all sessions.')) {
            this.schedule.days = this.schedule.days.filter(d => d.id !== dayId);
            this.renderSchedule();
            this.showNotification('Day deleted successfully', 'success');
        }
    }

    deleteSession(dayId, sessionId) {
        if (confirm('Are you sure you want to delete this session?')) {
            const day = this.schedule.days.find(d => d.id === dayId);
            if (day) {
                day.sessions = day.sessions.filter(s => s.id !== sessionId);
                this.renderSchedule();
                this.showNotification('Session deleted successfully', 'success');
            }
        }
    }

    showPartEditModal(part) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Part: ${part.title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="edit-part-title" value="${part.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="edit-part-description" rows="3" required>${part.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Duration</label>
                        <input type="text" id="edit-part-duration" value="${part.duration}" required>
                    </div>
                    <div class="form-group">
                        <label>Hours</label>
                        <input type="number" id="edit-part-hours" value="${part.hours}" required>
                    </div>
                    <div class="form-group">
                        <label>Instructors</label>
                        <input type="number" id="edit-part-instructors" value="${part.instructors}" required>
                    </div>
                    <div class="form-group">
                        <label>Color</label>
                        <input type="color" id="edit-part-color" value="${part.color}" required>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="adminManager.saveSchedulePartEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showDayEditModal(day) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Day: ${day.dayName}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Day Name</label>
                        <input type="text" id="edit-day-name" value="${day.dayName}">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="edit-day-date" value="${day.date}">
                    </div>
                    <div class="form-group">
                        <label>Theme</label>
                        <input type="text" id="edit-day-theme" value="${day.theme}">
                    </div>
                    <div class="form-group">
                        <label>Part</label>
                        <select id="edit-day-part">
                            ${this.schedule.parts.map(part => `
                                <option value="${part.id}" ${day.part === part.id ? 'selected' : ''}>
                                    ${part.title}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="adminManager.saveScheduleDayEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showSessionEditModal(session) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Session: ${session.title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Time</label>
                        <input type="text" id="edit-session-time" value="${session.time}">
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="edit-session-title" value="${session.title}">
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select id="edit-session-type">
                            <option value="morning" ${session.type === 'morning' ? 'selected' : ''}>Morning</option>
                            <option value="afternoon" ${session.type === 'afternoon' ? 'selected' : ''}>Afternoon</option>
                            <option value="evening" ${session.type === 'evening' ? 'selected' : ''}>Evening</option>
                            <option value="lunch" ${session.type === 'lunch' ? 'selected' : ''}>Lunch Break</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Topics (comma-separated)</label>
                        <textarea id="edit-session-topics" rows="3">${session.topics.join(', ')}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Main Instructor</label>
                        <input type="text" id="edit-session-main-instructor" value="${session.mainInstructor}">
                    </div>
                    <div class="form-group">
                        <label>Support Instructors (comma-separated)</label>
                        <input type="text" id="edit-session-support-instructors" value="${session.supportInstructors.join(', ')}">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="adminManager.saveScheduleSessionEdit()">Save Changes</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    savePartEdit() {
        if (!this.currentPart) return;
        
        const title = document.getElementById('edit-part-title').value;
        const description = document.getElementById('edit-part-description').value;
        const duration = document.getElementById('edit-part-duration').value;
        const hours = parseInt(document.getElementById('edit-part-hours').value);
        const instructors = parseInt(document.getElementById('edit-part-instructors').value);
        const color = document.getElementById('edit-part-color').value;
        
        this.currentPart.title = title;
        this.currentPart.description = description;
        this.currentPart.duration = duration;
        this.currentPart.hours = hours;
        this.currentPart.instructors = instructors;
        this.currentPart.color = color;
        
        this.renderSchedule();
        this.closeModal();
        this.showNotification('Part updated successfully', 'success');
    }

    saveDayEdit() {
        if (!this.currentDay) return;
        
        const dayName = document.getElementById('edit-day-name').value;
        const date = document.getElementById('edit-day-date').value;
        const theme = document.getElementById('edit-day-theme').value;
        const part = document.getElementById('edit-day-part').value;
        
        this.currentDay.dayName = dayName;
        this.currentDay.date = date;
        this.currentDay.theme = theme;
        this.currentDay.part = part;
        
        this.renderSchedule();
        this.closeModal();
        this.showNotification('Day updated successfully', 'success');
    }

    saveSessionEdit() {
        if (!this.editingSession) return;
        
        const { dayId, session } = this.editingSession;
        const day = this.schedule.days.find(d => d.id === dayId);
        if (!day) return;
        
        const sessionIndex = day.sessions.findIndex(s => s.id === session.id);
        if (sessionIndex === -1) return;
        
        const time = document.getElementById('edit-session-time').value;
        const title = document.getElementById('edit-session-title').value;
        const type = document.getElementById('edit-session-type').value;
        const topics = document.getElementById('edit-session-topics').value
            .split(',').map(s => s.trim()).filter(s => s);
        const mainInstructor = document.getElementById('edit-session-main-instructor').value;
        const supportInstructors = document.getElementById('edit-session-support-instructors').value
            .split(',').map(s => s.trim()).filter(s => s);
        
        day.sessions[sessionIndex] = {
            ...session,
            time,
            title,
            type,
            topics,
            mainInstructor,
            supportInstructors
        };
        
        this.renderSchedule();
        this.closeModal();
        this.showNotification('Session updated successfully', 'success');
    }

    closeModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.remove();
        }
        this.currentDay = null;
        this.editingSession = null;
        this.currentPart = null;
    }

    showNotification(message, type = 'info') {
        // Use the notification system if available
        if (window.adminManager && window.adminManager.notificationSystem) {
            window.adminManager.notificationSystem.show(type, 'Schedule Manager', message);
        } else {
            alert(message);
        }
    }

    async getCount() {
        return this.schedule.days.length;
    }

    async exportSchedule() {
        return this.schedule;
    }

    async importSchedule() {
        // Create file input for import
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const importedSchedule = JSON.parse(text);
                    this.schedule = importedSchedule;
                    this.renderSchedule();
                    this.showNotification('Schedule imported successfully', 'success');
                } catch (error) {
                    this.showNotification('Error importing schedule: ' + error.message, 'error');
                }
            }
        };
        input.click();
    }
}

// Make ScheduleManager available globally
window.ScheduleManager = ScheduleManager;
