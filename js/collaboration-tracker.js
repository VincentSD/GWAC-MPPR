/**
 * GitHub Collaboration Tracker
 * Monitors real-time collaboration activity for team exercises
 */

class CollaborationTracker {
    constructor(repoOwner, repoName) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.apiBase = 'https://api.github.com';
        this.pollInterval = 10000; // Poll every 10 seconds
        this.lastUpdate = new Date();
        this.participants = new Map();
        this.activities = [];
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Collaboration Tracker...');
        
        // Initialize UI elements
        this.initializeElements();
        
        // Start monitoring
        await this.updateActivity();
        this.startPolling();
        
        console.log('✅ Collaboration Tracker active!');
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            teamCount: document.getElementById('team-members-count'),
            prsSubmitted: document.getElementById('prs-submitted'),
            conflictsResolved: document.getElementById('conflicts-resolved'),
            prsMerged: document.getElementById('prs-merged'),
            activityList: document.getElementById('activity-list'),
            participantList: document.getElementById('participant-list')
        };

        // Clear sample content
        if (this.elements.activityList) {
            this.elements.activityList.innerHTML = '';
        }
        if (this.elements.participantList) {
            this.elements.participantList.innerHTML = '';
        }
    }

    async fetchGitHubAPI(endpoint) {
        try {
            const response = await fetch(`${this.apiBase}/repos/${this.repoOwner}/${this.repoName}${endpoint}`);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GitHub API fetch error:', error);
            return null;
        }
    }

    async updateActivity() {
        try {
            // Fetch pull requests
            const pullRequests = await this.fetchGitHubAPI('/pulls?state=all&per_page=50');
            
            if (pullRequests) {
                await this.processPullRequests(pullRequests);
            }

            // Fetch commits to track participation
            const commits = await this.fetchGitHubAPI('/commits?per_page=50');
            if (commits) {
                this.processCommits(commits);
            }

            this.updateStats();
            this.updateParticipantList();
            
        } catch (error) {
            console.error('Error updating activity:', error);
            this.addActivity('❌', 'Connection error - retrying...', 'error');
        }
    }

    async processPullRequests(pullRequests) {
        const newActivities = [];
        
        for (const pr of pullRequests) {
            const prDate = new Date(pr.created_at);
            
            // Only process new activities since last update
            if (prDate > this.lastUpdate) {
                // Track participant
                this.addParticipant(pr.user.login, pr.user.avatar_url);
                
                // Add activity for PR creation
                newActivities.push({
                    icon: '🔄',
                    text: `${pr.user.login} submitted PR: "${pr.title}"`,
                    time: this.formatTime(prDate),
                    timestamp: prDate
                });

                // Check if PR is merged
                if (pr.merged_at) {
                    const mergeDate = new Date(pr.merged_at);
                    if (mergeDate > this.lastUpdate) {
                        newActivities.push({
                            icon: '✅',
                            text: `PR "${pr.title}" merged successfully`,
                            time: this.formatTime(mergeDate),
                            timestamp: mergeDate
                        });
                    }
                }

                // Check for merge commits (indicates conflict resolution)
                if (pr.commits > 1) {
                    // Fetch PR commits to check for merge commits
                    const prCommits = await this.fetchGitHubAPI(`/pulls/${pr.number}/commits`);
                    if (prCommits) {
                        for (const commit of prCommits) {
                            if (commit.commit.message.toLowerCase().includes('merge') || 
                                commit.commit.message.toLowerCase().includes('conflict')) {
                                const commitDate = new Date(commit.commit.author.date);
                                if (commitDate > this.lastUpdate) {
                                    newActivities.push({
                                        icon: '⚔️',
                                        text: `${commit.commit.author.name} resolved merge conflicts`,
                                        time: this.formatTime(commitDate),
                                        timestamp: commitDate
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Sort activities by timestamp and add them
        newActivities.sort((a, b) => b.timestamp - a.timestamp);
        for (const activity of newActivities) {
            this.addActivity(activity.icon, activity.text, 'success', activity.time);
        }
    }

    processCommits(commits) {
        for (const commit of commits) {
            if (commit.author) {
                this.addParticipant(commit.author.login, commit.author.avatar_url);
            }
        }
    }

    addParticipant(username, avatarUrl) {
        if (!this.participants.has(username)) {
            this.participants.set(username, {
                username,
                avatarUrl,
                status: 'active',
                joinTime: new Date()
            });
        }
    }

    addActivity(icon, text, type = 'info', time = null) {
        const activity = {
            icon,
            text,
            type,
            time: time || this.formatTime(new Date())
        };

        this.activities.unshift(activity);
        
        // Keep only last 50 activities
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }

        this.renderActivity(activity);
    }

    renderActivity(activity) {
        if (!this.elements.activityList) return;

        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.type}`;
        activityItem.innerHTML = `
            <span class="activity-icon">${activity.icon}</span>
            <span class="activity-text">${activity.text}</span>
            <span class="activity-time">${activity.time}</span>
        `;

        // Add to top of list
        this.elements.activityList.insertBefore(activityItem, this.elements.activityList.firstChild);

        // Remove old items if more than 20 visible
        const items = this.elements.activityList.children;
        if (items.length > 20) {
            this.elements.activityList.removeChild(items[items.length - 1]);
        }

        // Highlight new activity
        activityItem.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
            activityItem.style.backgroundColor = '';
        }, 2000);
    }

    updateStats() {
        if (!this.elements.teamCount) return;

        // Update counters
        this.elements.teamCount.textContent = this.participants.size;
        
        // Count different types of activities
        let prsSubmitted = 0;
        let conflictsResolved = 0;
        let prsMerged = 0;

        for (const activity of this.activities) {
            if (activity.text.includes('submitted PR')) prsSubmitted++;
            if (activity.text.includes('resolved merge conflicts')) conflictsResolved++;
            if (activity.text.includes('merged successfully')) prsMerged++;
        }

        this.elements.prsSubmitted.textContent = prsSubmitted;
        this.elements.conflictsResolved.textContent = conflictsResolved;
        this.elements.prsMerged.textContent = prsMerged;
    }

    updateParticipantList() {
        if (!this.elements.participantList) return;

        this.elements.participantList.innerHTML = '';

        for (const [username, participant] of this.participants) {
            const participantItem = document.createElement('div');
            participantItem.className = 'participant-item';
            
            const avatar = participant.avatarUrl ? 
                `<img src="${participant.avatarUrl}" alt="${username}" style="width: 40px; height: 40px; border-radius: 50%;">` :
                `<span class="participant-avatar">👤</span>`;

            participantItem.innerHTML = `
                ${avatar}
                <span class="participant-name">${username}</span>
                <div class="participant-status">
                    <span class="status-badge ${participant.status}">${this.getStatusText(participant.status)}</span>
                </div>
            `;

            this.elements.participantList.appendChild(participantItem);
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': '⏳ Ready to start',
            'active': '🔄 Contributing',
            'completed': '✅ Completed'
        };
        return statusMap[status] || '⏳ Ready to start';
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    startPolling() {
        setInterval(async () => {
            await this.updateActivity();
            this.lastUpdate = new Date();
        }, this.pollInterval);
    }

    // Method to manually add test activity (for demo purposes)
    addTestActivity() {
        const testActivities = [
            { icon: '🔄', text: 'Sarah Chen submitted PR: "Add Sarah Chen to team directory"' },
            { icon: '⚔️', text: 'James Mitchell resolved merge conflicts' },
            { icon: '✅', text: 'PR "Add Maria Santos to team" merged successfully' },
            { icon: '💬', text: 'Review posted on "Add Alex Kim to team" PR' }
        ];

        const randomActivity = testActivities[Math.floor(Math.random() * testActivities.length)];
        this.addActivity(randomActivity.icon, randomActivity.text, 'success');
    }
}

// Initialize tracker when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the collaboration page
    if (document.getElementById('team-members-count')) {
        // Initialize with your repository details
        window.collaborationTracker = new CollaborationTracker('VincentSD', 'team-collaboration-exercise');
        
        // Add some initial test activity for demonstration
        setTimeout(() => {
            window.collaborationTracker.addActivity('🚀', 'Collaboration tracking started!', 'success');
        }, 1000);
    }
});

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollaborationTracker;
}
