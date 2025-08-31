/**
 * Student Submissions Tracker
 * Manages and displays student exercise submissions
 */

class SubmissionsTracker {
    constructor() {
        this.submissions = this.loadSubmissions();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderSubmissions();
        this.updateStats();
    }

    setupEventListeners() {
        const form = document.getElementById('testSubmissionForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmission(e));
        }
    }

    handleSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submission = {
            id: Date.now(),
            studentName: formData.get('studentName'),
            exerciseType: formData.get('exerciseType'),
            submissionUrl: formData.get('submissionUrl'),
            notes: formData.get('submissionNotes'),
            status: 'pending',
            timestamp: new Date().toISOString(),
            reviewedBy: null,
            reviewNotes: null
        };

        this.addSubmission(submission);
        e.target.reset();
        
        // Show success message
        this.showNotification('Submission added successfully!', 'success');
    }

    addSubmission(submission) {
        this.submissions.push(submission);
        this.saveSubmissions();
        this.renderSubmissions();
        this.updateStats();
    }

    updateSubmissionStatus(id, status, reviewNotes = null, reviewedBy = 'Instructor') {
        const submission = this.submissions.find(s => s.id === id);
        if (submission) {
            submission.status = status;
            submission.reviewNotes = reviewNotes;
            submission.reviewedBy = reviewedBy;
            submission.reviewedAt = new Date().toISOString();
            
            this.saveSubmissions();
            this.renderSubmissions();
            this.updateStats();
        }
    }

    deleteSubmission(id) {
        this.submissions = this.submissions.filter(s => s.id !== id);
        this.saveSubmissions();
        this.renderSubmissions();
        this.updateStats();
    }

    renderSubmissions() {
        this.renderExerciseSubmissions('exercise1');
        this.renderExerciseSubmissions('exercise2');
    }

    renderExerciseSubmissions(exerciseType) {
        const container = document.getElementById(`${exerciseType}-submissions`);
        if (!container) return;

        const exerciseSubmissions = this.submissions.filter(s => s.exerciseType === exerciseType);
        
        if (exerciseSubmissions.length === 0) {
            container.innerHTML = '<p class="no-submissions">No submissions yet. Students can submit their work through the exercise pages.</p>';
            return;
        }

        const submissionsHTML = exerciseSubmissions.map(submission => this.createSubmissionCard(submission)).join('');
        container.innerHTML = submissionsHTML;

        // Add event listeners to action buttons
        this.addCardEventListeners(exerciseType);
    }

    createSubmissionCard(submission) {
        const statusClass = this.getStatusClass(submission.status);
        const statusIcon = this.getStatusIcon(submission.status);
        const timestamp = new Date(submission.timestamp).toLocaleString();
        
        return `
            <div class="submission-card ${statusClass}" data-id="${submission.id}">
                <div class="submission-header">
                    <div class="student-info">
                        <h4>${submission.studentName}</h4>
                        <span class="timestamp">${timestamp}</span>
                    </div>
                    <div class="status-badge ${statusClass}">
                        ${statusIcon} ${submission.status}
                    </div>
                </div>
                
                <div class="submission-content">
                    <div class="submission-url">
                        <strong>Submission:</strong> 
                        <a href="${submission.submissionUrl}" target="_blank" rel="noopener">
                            ${this.getUrlDisplay(submission.submissionUrl)}
                        </a>
                    </div>
                    
                    ${submission.notes ? `<div class="submission-notes"><strong>Notes:</strong> ${submission.notes}</div>` : ''}
                    
                    ${submission.reviewNotes ? `
                        <div class="review-notes">
                            <strong>Review Notes:</strong> ${submission.reviewNotes}
                        </div>
                    ` : ''}
                </div>
                
                <div class="submission-actions">
                    ${this.getActionButtons(submission)}
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        switch (status) {
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'pending': return 'status-pending';
            default: return 'status-pending';
        }
    }

    getStatusIcon(status) {
        switch (status) {
            case 'approved': return '✅';
            case 'rejected': return '❌';
            case 'pending': return '⏳';
            default: return '⏳';
        }
    }

    getUrlDisplay(url) {
        if (url.includes('github.com')) {
            return 'GitHub Repository';
        } else if (url.includes('pull')) {
            return 'Pull Request';
        } else {
            return 'View Submission';
        }
    }

    getActionButtons(submission) {
        if (submission.status === 'pending') {
            return `
                <button class="btn btn-success" onclick="submissionsTracker.updateSubmissionStatus(${submission.id}, 'approved')">
                    ✅ Approve
                </button>
                <button class="btn btn-danger" onclick="submissionsTracker.updateSubmissionStatus(${submission.id}, 'rejected')">
                    ❌ Reject
                </button>
                <button class="btn btn-secondary" onclick="submissionsTracker.showReviewModal(${submission.id})">
                    📝 Add Review Notes
                </button>
            `;
        } else {
            return `
                <button class="btn btn-secondary" onclick="submissionsTracker.updateSubmissionStatus(${submission.id}, 'pending')">
                    🔄 Reset to Pending
                </button>
                <button class="btn btn-danger" onclick="submissionsTracker.deleteSubmission(${submission.id})">
                    🗑️ Delete
                </button>
            `;
        }
    }

    addCardEventListeners(exerciseType) {
        // Event listeners are added via onclick attributes for simplicity
        // In a production app, you'd use proper event delegation
    }

    showReviewModal(submissionId) {
        const reviewNotes = prompt('Enter review notes:');
        if (reviewNotes !== null) {
            this.updateSubmissionStatus(submissionId, 'pending', reviewNotes);
        }
    }

    updateStats() {
        this.updateExerciseStats('exercise1');
        this.updateExerciseStats('exercise2');
    }

    updateExerciseStats(exerciseType) {
        const exerciseSubmissions = this.submissions.filter(s => s.exerciseType === exerciseType);
        const total = exerciseSubmissions.length;
        const pending = exerciseSubmissions.filter(s => s.status === 'pending').length;
        const approved = exerciseSubmissions.filter(s => s.status === 'approved').length;
        const merged = exerciseSubmissions.filter(s => s.status === 'approved').length; // For exercise 2

        const totalElement = document.getElementById(`${exerciseType}-total`);
        const pendingElement = document.getElementById(`${exerciseType}-pending`);
        const approvedElement = document.getElementById(`${exerciseType}-approved`);

        if (totalElement) totalElement.textContent = total;
        if (pendingElement) pendingElement.textContent = pending;
        if (approvedElement) approvedElement.textContent = approved;
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadSubmissions() {
        const saved = localStorage.getItem('g-wac-submissions');
        return saved ? JSON.parse(saved) : [];
    }

    saveSubmissions() {
        localStorage.setItem('g-wac-submissions', JSON.stringify(this.submissions));
    }
}

// Initialize the submissions tracker when the page loads
let submissionsTracker;
document.addEventListener('DOMContentLoaded', () => {
    submissionsTracker = new SubmissionsTracker();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubmissionsTracker;
}

