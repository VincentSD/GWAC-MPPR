// Real-time Collaboration System for G-WAC Short Course
class CollaborationSystem {
    constructor() {
        this.currentUser = null;
        this.collaborators = [];
        this.messages = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeUser();
        this.startCollaboration();
        this.updateCollaboratorStatus();
    }

    setupEventListeners() {
        // Chat input handling
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Real-time updates
        setInterval(() => {
            this.updateCollaboratorStatus();
        }, 5000);
    }

    initializeUser() {
        // Generate a random user ID for demo purposes
        const userId = 'student_' + Math.floor(Math.random() * 1000);
        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        this.currentUser = {
            id: userId,
            name: randomName,
            status: 'Online',
            currentModule: 'Course Overview',
            lastActivity: new Date()
        };

        // Add user to collaborators list
        this.collaborators.push(this.currentUser);
    }

    startCollaboration() {
        // Simulate other users joining
        const demoUsers = [
            { id: 'student_001', name: 'Student 1', status: 'Working on Git Module 2', currentModule: 'Git & GitHub' },
            { id: 'student_002', name: 'Student 2', status: 'Completed Part 1', currentModule: 'Completed' },
            { id: 'student_003', name: 'Student 3', status: 'Working on SIR Model', currentModule: 'Infectious Disease Modeling' }
        ];

        this.collaborators = [...this.collaborators, ...demoUsers];
        this.renderCollaborators();
    }

    updateCollaboratorStatus() {
        // Simulate status changes
        this.collaborators.forEach(collaborator => {
            if (collaborator.id !== this.currentUser.id) {
                // Random status updates for demo
                if (Math.random() < 0.3) {
                    const activities = [
                        'Working on Git basics',
                        'Setting up repository',
                        'Learning about branches',
                        'Practicing commits',
                        'Working on SIR model',
                        'Fitting parameters',
                        'Analyzing results'
                    ];
                    collaborator.status = activities[Math.floor(Math.random() * activities.length)];
                    collaborator.lastActivity = new Date();
                }
            }
        });

        this.renderCollaborators();
    }

    renderCollaborators() {
        const collaboratorList = document.querySelector('.collaborator-list');
        if (!collaboratorList) return;

        collaboratorList.innerHTML = '';
        
        this.collaborators.forEach(collaborator => {
            const collaboratorEl = document.createElement('div');
            collaboratorEl.className = 'collaborator';
            
            const isOnline = this.isUserOnline(collaborator.lastActivity);
            const statusColor = isOnline ? '#27ae60' : '#95a5a6';
            
            collaboratorEl.innerHTML = `
                <span class="collab-avatar" style="color: ${statusColor}">👤</span>
                <span class="collab-name">${collaborator.name}</span>
                <span class="collab-status">${collaborator.status}</span>
            `;
            
            collaboratorList.appendChild(collaboratorEl);
        });

        // Update online count
        const onlineCount = this.collaborators.filter(c => this.isUserOnline(c.lastActivity)).length;
        const countEl = document.querySelector('.collab-count');
        if (countEl) {
            countEl.textContent = `${onlineCount} online`;
        }
    }

    isUserOnline(lastActivity) {
        const now = new Date();
        const timeDiff = now - lastActivity;
        return timeDiff < 300000; // 5 minutes
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const messageText = chatInput.value.trim();
        
        if (!messageText) return;

        const message = {
            id: Date.now(),
            author: this.currentUser.name,
            text: messageText,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.renderMessages();
        
        // Clear input
        chatInput.value = '';
        
        // Simulate response from other users
        setTimeout(() => {
            this.simulateResponse(messageText);
        }, 1000 + Math.random() * 2000);
    }

    simulateResponse(originalMessage) {
        const responses = [
            'That\'s a great question!',
            'I was wondering about that too.',
            'Let me help you with that.',
            'Have you tried checking the documentation?',
            'I think I found the solution.',
            'Can you share your code?',
            'That makes sense!'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const randomUser = this.collaborators.find(c => c.id !== this.currentUser.id);
        
        if (randomUser) {
            const response = {
                id: Date.now(),
                author: randomUser.name,
                text: randomResponse,
                timestamp: new Date()
            };

            this.messages.push(response);
            this.renderMessages();
        }
    }

    renderMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        chatMessages.innerHTML = '';
        
        this.messages.forEach(message => {
            const messageEl = document.createElement('div');
            messageEl.className = 'message';
            
            const timeString = this.formatTime(message.timestamp);
            
            messageEl.innerHTML = `
                <span class="message-author">${message.author}:</span>
                <span class="message-text">${message.text}</span>
                <div class="message-time">${timeString}</div>
            `;
            
            chatMessages.appendChild(messageEl);
        });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return timestamp.toLocaleDateString();
    }

    // Update user's current module
    updateUserModule(moduleName) {
        if (this.currentUser) {
            this.currentUser.currentModule = moduleName;
            this.currentUser.lastActivity = new Date();
            
            // Update status based on module
            const statusMap = {
                'Git & GitHub': 'Working on Git fundamentals',
                'Infectious Disease Modeling': 'Building epidemiological models',
                'Course Overview': 'Exploring course materials'
            };
            
            this.currentUser.status = statusMap[moduleName] || 'Learning';
        }
    }

    // Get collaboration statistics
    getCollaborationStats() {
        const totalUsers = this.collaborators.length;
        const onlineUsers = this.collaborators.filter(c => this.isUserOnline(c.lastActivity)).length;
        const totalMessages = this.messages.length;
        
        return {
            totalUsers,
            onlineUsers,
            totalMessages,
            activeModules: [...new Set(this.collaborators.map(c => c.currentModule))]
        };
    }
}

// Initialize collaboration system
let collaborationSystem;

document.addEventListener('DOMContentLoaded', () => {
    collaborationSystem = new CollaborationSystem();
});

// Global function for sending messages (called from HTML)
function sendMessage() {
    if (collaborationSystem) {
        collaborationSystem.sendMessage();
    }
}

// Export for use in other modules
window.CollaborationSystem = CollaborationSystem;
