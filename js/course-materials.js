/**
 * Course Materials Management
 * Handles module progress, lab status, and course navigation
 */

class CourseMaterialsManager {
    constructor() {
        this.modules = {
            'mathematical-foundations': {
                name: 'Mathematical Foundations',
                labs: ['lab-0', 'lab-1', 'lab-2'],
                status: 'not-started'
            },
            'epidemiological-modeling': {
                name: 'Epidemiological Modeling',
                labs: ['lab-3', 'lab-4', 'lab-5'],
                status: 'not-started'
            },
            'computational-methods': {
                name: 'Computational Methods',
                labs: ['lab-10', 'advanced', 'fitting'],
                status: 'not-started'
            },
            'data-analysis': {
                name: 'Data Analysis & Visualization',
                labs: ['sir', 'git', 'github'],
                status: 'not-started'
            },
            'collaborative-research': {
                name: 'Collaborative Research',
                labs: ['r-git', 'collab'],
                status: 'not-started'
            }
        };
        
        this.labStatuses = {};
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.updateOverallProgress();
        this.setupModuleCards();
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const savedProgress = localStorage.getItem('gwac-course-progress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.labStatuses = progress.labStatuses || {};
                this.modules = { ...this.modules, ...progress.modules };
            } catch (e) {
                console.warn('Failed to load saved progress:', e);
            }
        }
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        const progress = {
            labStatuses: this.labStatuses,
            modules: this.modules,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('gwac-course-progress', JSON.stringify(progress));
    }

    /**
     * Setup event listeners for interactive elements
     */
    setupEventListeners() {
        // Module card interactions
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.module-actions')) {
                    this.toggleModuleExpansion(card);
                }
            });
        });

        // Lab link interactions
        document.querySelectorAll('.lab-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const labId = this.getLabIdFromLink(link);
                this.startLab(labId);
            });
        });
    }

    /**
     * Setup module cards with initial state
     */
    setupModuleCards() {
        Object.keys(this.modules).forEach(moduleId => {
            this.updateModuleStatus(moduleId);
            this.updateLabStatuses(moduleId);
        });
    }

    /**
     * Toggle module card expansion
     */
    toggleModuleExpansion(card) {
        const content = card.querySelector('.module-content');
        const isExpanded = content.style.display !== 'none';
        
        if (isExpanded) {
            content.style.display = 'none';
            card.classList.remove('expanded');
        } else {
            content.style.display = 'block';
            card.classList.add('expanded');
        }
    }

    /**
     * Start a module
     */
    startModule(moduleId) {
        if (this.modules[moduleId]) {
            this.modules[moduleId].status = 'in-progress';
            this.updateModuleStatus(moduleId);
            this.saveProgress();
            this.updateOverallProgress();
            
            // Show notification
            this.showNotification(`Started ${this.modules[moduleId].name} module!`, 'success');
        }
    }

    /**
     * View module details
     */
    viewModuleDetails(moduleId) {
        const module = this.modules[moduleId];
        if (module) {
            // Create and show modal with module details
            this.showModuleModal(module);
        }
    }

    /**
     * Start a lab
     */
    startLab(labId) {
        this.labStatuses[labId] = 'in-progress';
        this.updateLabStatus(labId);
        this.saveProgress();
        this.updateOverallProgress();
        
        // Show notification
        this.showNotification(`Started lab: ${this.getLabDisplayName(labId)}`, 'success');
        
        // Navigate to lab after a short delay
        setTimeout(() => {
            this.navigateToLab(labId);
        }, 1000);
    }

    /**
     * Complete a lab
     */
    completeLab(labId) {
        this.labStatuses[labId] = 'completed';
        this.updateLabStatus(labId);
        this.saveProgress();
        this.updateOverallProgress();
        
        // Check if module is completed
        this.checkModuleCompletion();
        
        // Show notification
        this.showNotification(`Completed lab: ${this.getLabDisplayName(labId)}`, 'success');
    }

    /**
     * Get lab ID from link element
     */
    getLabIdFromLink(link) {
        const href = link.getAttribute('href');
        const labName = href.split('/').pop().replace('.html', '');
        return labName;
    }

    /**
     * Get lab display name
     */
    getLabDisplayName(labId) {
        const labNames = {
            'lab_00': 'Lab 0: Introduction to R',
            'lab_01': 'Lab 1: Basic Modeling',
            'lab_02': 'Lab 2: SIR Models',
            'lab_03': 'Lab 3: Advanced SIR',
            'lab_04': 'Lab 4: Stochastic Models',
            'lab_05': 'Lab 5: Network Models',
            'lab_10': 'Lab 10: Data Analysis',
            'advanced-modeling': 'Advanced Modeling',
            'monty-fitting': 'Model Fitting',
            'odin-intro': 'Interactive SIR Explorer',
            'git-basics': 'Git & Collaboration',
            'github-collaboration': 'GitHub Workflow',
            'r-git-workflow': 'R & Git Integration',
            'collaboration': 'Collaboration Tools'
        };
        return labNames[labId] || labId;
    }

    /**
     * Navigate to lab page
     */
    navigateToLab(labId) {
        const labUrls = {
            'lab_00': 'labs/lab_00.html',
            'lab_01': 'labs/lab_01.html',
            'lab_02': 'labs/lab_02.html',
            'lab_03': 'labs/lab_03.html',
            'lab_04': 'labs/lab_04.html',
            'lab_05': 'labs/lab_05.html',
            'lab_10': 'labs/lab_10.html',
            'advanced-modeling': 'labs/advanced-modeling.html',
            'monty-fitting': 'labs/monty-fitting.html',
            'odin-intro': 'labs/odin-intro.html',
            'git-basics': 'labs/git-basics.html',
            'github-collaboration': 'labs/github-collaboration.html',
            'r-git-workflow': 'labs/r-git-workflow.html',
            'collaboration': 'labs/collaboration.html'
        };
        
        const url = labUrls[labId];
        if (url) {
            window.location.href = url;
        }
    }

    /**
     * Update module status display
     */
    updateModuleStatus(moduleId) {
        const module = this.modules[moduleId];
        const statusElement = document.getElementById(`status-${this.getModuleNumber(moduleId)}`);
        
        if (statusElement) {
            statusElement.textContent = this.formatStatus(module.status);
            statusElement.className = `status-badge ${module.status}`;
        }
    }

    /**
     * Update lab statuses for a module
     */
    updateLabStatuses(moduleId) {
        const module = this.modules[moduleId];
        module.labs.forEach(labId => {
            this.updateLabStatus(labId);
        });
    }

    /**
     * Update individual lab status
     */
    updateLabStatus(labId) {
        const statusElement = document.getElementById(`${labId}-status`);
        if (statusElement) {
            const status = this.labStatuses[labId] || 'not-started';
            statusElement.textContent = this.formatStatus(status);
            statusElement.className = `lab-status ${status}`;
        }
    }

    /**
     * Get module number for status element ID
     */
    getModuleNumber(moduleId) {
        const moduleNumbers = {
            'mathematical-foundations': '1',
            'epidemiological-modeling': '2',
            'computational-methods': '3',
            'data-analysis': '4',
            'collaborative-research': '5'
        };
        return moduleNumbers[moduleId] || '1';
    }

    /**
     * Format status for display
     */
    formatStatus(status) {
        const statusLabels = {
            'not-started': 'Not Started',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        return statusLabels[status] || 'Not Started';
    }

    /**
     * Check if a module is completed
     */
    checkModuleCompletion() {
        Object.keys(this.modules).forEach(moduleId => {
            const module = this.modules[moduleId];
            const allLabsCompleted = module.labs.every(labId => 
                this.labStatuses[labId] === 'completed'
            );
            
            if (allLabsCompleted && module.status !== 'completed') {
                module.status = 'completed';
                this.updateModuleStatus(moduleId);
                this.saveProgress();
                
                // Show completion notification
                this.showNotification(`Congratulations! You've completed ${module.name}!`, 'success');
            }
        });
    }

    /**
     * Update overall progress display
     */
    updateOverallProgress() {
        const totalLabs = Object.values(this.modules).reduce((total, module) => {
            return total + module.labs.length;
        }, 0);
        
        const completedLabs = Object.values(this.labStatuses).filter(status => 
            status === 'completed'
        ).length;
        
        const progressPercentage = totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0;
        
        // Update progress bar
        const progressBar = document.getElementById('overall-progress');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progressPercentage}%`;
            progressText.textContent = `${Math.round(progressPercentage)}%`;
        }
    }

    /**
     * Show module details modal
     */
    showModuleModal(module) {
        const modal = document.createElement('div');
        modal.className = 'module-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${module.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="module-overview">
                        <h3>Module Overview</h3>
                        <p>This module covers essential concepts and practical applications in ${module.name.toLowerCase()}.</p>
                    </div>
                    <div class="module-objectives">
                        <h3>Learning Objectives</h3>
                        <ul>
                            <li>Understand fundamental concepts</li>
                            <li>Apply theoretical knowledge to practical problems</li>
                            <li>Complete hands-on exercises and labs</li>
                            <li>Collaborate with peers on projects</li>
                        </ul>
                    </div>
                    <div class="module-resources">
                        <h3>Additional Resources</h3>
                        <ul>
                            <li>Reading materials and references</li>
                            <li>Video tutorials and demonstrations</li>
                            <li>Practice exercises and datasets</li>
                            <li>Discussion forums and Q&A sessions</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="courseMaterials.startModule('${Object.keys(this.modules).find(key => this.modules[key] === module)}')">
                        Start Module
                    </button>
                    <button class="btn btn-outline" onclick="this.closest('.module-modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.body.appendChild(modal);
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Reset all progress
     */
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.labStatuses = {};
            Object.keys(this.modules).forEach(moduleId => {
                this.modules[moduleId].status = 'not-started';
            });
            
            this.saveProgress();
            this.setupModuleCards();
            this.updateOverallProgress();
            
            this.showNotification('Progress has been reset successfully.', 'info');
        }
    }

    /**
     * Export progress data
     */
    exportProgress() {
        const progressData = {
            modules: this.modules,
            labStatuses: this.labStatuses,
            overallProgress: this.calculateOverallProgress(),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(progressData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'gwac-course-progress.json';
        link.click();
        
        this.showNotification('Progress data exported successfully.', 'success');
    }

    /**
     * Calculate overall progress percentage
     */
    calculateOverallProgress() {
        const totalLabs = Object.values(this.modules).reduce((total, module) => {
            return total + module.labs.length;
        }, 0);
        
        const completedLabs = Object.values(this.labStatuses).filter(status => 
            status === 'completed'
        ).length;
        
        return totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.courseMaterials = new CourseMaterialsManager();
    
    // Add CSS for course materials page
    const style = document.createElement('style');
    style.textContent = `
        .course-hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        
        .course-hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin: 0 0 16px 0;
        }
        
        .course-hero p {
            font-size: 1.25rem;
            opacity: 0.9;
            margin: 0 0 40px 0;
        }
        
        .course-progress {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .progress-indicator {
            text-align: left;
        }
        
        .progress-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .progress-bar-large {
            width: 100%;
            height: 12px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-fill-large {
            height: 100%;
            background: linear-gradient(90deg, #ffd700, #ffed4e);
            transition: width 0.5s ease;
            width: 0%;
        }
        
        .progress-percentage {
            font-weight: 600;
            color: #ffd700;
        }
        
        .course-modules {
            padding: 80px 0;
            background: #f8fafc;
        }
        
        .modules-grid {
            display: grid;
            gap: 30px;
        }
        
        .module-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .module-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }
        
        .module-header {
            padding: 30px;
            display: flex;
            align-items: center;
            gap: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .module-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .module-icon i {
            font-size: 1.5rem;
            color: white;
        }
        
        .module-info {
            flex: 1;
        }
        
        .module-info h3 {
            font-size: 1.4rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 8px 0;
        }
        
        .module-info p {
            color: #64748b;
            margin: 0;
        }
        
        .module-status {
            flex-shrink: 0;
        }
        
        .status-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-badge.not-started {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .status-badge.in-progress {
            background: #fef3c7;
            color: #d97706;
        }
        
        .status-badge.completed {
            background: #d1fae5;
            color: #059669;
        }
        
        .module-content {
            padding: 30px;
            display: none;
        }
        
        .module-card.expanded .module-content {
            display: block;
        }
        
        .module-topics,
        .module-labs {
            margin-bottom: 30px;
        }
        
        .module-topics h4,
        .module-labs h4 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 16px 0;
        }
        
        .module-topics ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .module-topics li {
            padding: 8px 0;
            color: #64748b;
            position: relative;
            padding-left: 20px;
        }
        
        .module-topics li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: 600;
        }
        
        .lab-links {
            display: grid;
            gap: 12px;
        }
        
        .lab-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            text-decoration: none;
            color: #64748b;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }
        
        .lab-link:hover {
            background: #f1f5f9;
            color: #3b82f6;
            transform: translateX(4px);
        }
        
        .lab-link i {
            color: #3b82f6;
            width: 16px;
        }
        
        .lab-status {
            margin-left: auto;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .lab-status.not-started {
            background: #f1f5f9;
            color: #64748b;
        }
        
        .lab-status.in-progress {
            background: #fef3c7;
            color: #d97706;
        }
        
        .lab-status.completed {
            background: #d1fae5;
            color: #059669;
        }
        
        .module-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .quick-access {
            padding: 60px 0;
            background: white;
        }
        
        .quick-access h2 {
            text-align: center;
            font-size: 2rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 40px 0;
        }
        
        .quick-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .quick-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 30px 20px;
            background: #f8fafc;
            border-radius: 16px;
            text-decoration: none;
            color: #64748b;
            transition: all 0.3s ease;
            border: 1px solid #e2e8f0;
        }
        
        .quick-link:hover {
            background: #3b82f6;
            color: white;
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        .quick-link i {
            font-size: 2rem;
            color: #3b82f6;
        }
        
        .quick-link:hover i {
            color: white;
        }
        
        .quick-link span {
            font-weight: 500;
            text-align: center;
        }
        
        .module-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 24px 30px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #1e293b;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .modal-body h3 {
            color: #1e293b;
            margin: 0 0 16px 0;
        }
        
        .modal-body ul {
            list-style: none;
            padding: 0;
            margin: 0 0 24px 0;
        }
        
        .modal-body li {
            padding: 8px 0;
            color: #64748b;
            position: relative;
            padding-left: 20px;
        }
        
        .modal-body li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #3b82f6;
        }
        
        .modal-footer {
            padding: 24px 30px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
            .course-hero h1 {
                font-size: 2rem;
            }
            
            .module-header {
                flex-direction: column;
                text-align: center;
                gap: 16px;
            }
            
            .module-actions {
                flex-direction: column;
            }
            
            .quick-links {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    `;
    document.head.appendChild(style);
});

// Global functions for onclick handlers
function startModule(moduleId) {
    if (window.courseMaterials) {
        window.courseMaterials.startModule(moduleId);
    }
}

function viewModuleDetails(moduleId) {
    if (window.courseMaterials) {
        window.courseMaterials.viewModuleDetails(moduleId);
    }
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourseMaterialsManager;
}
