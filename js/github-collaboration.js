// Interactive GitHub Collaboration Module for G-WAC Short Course
console.log('GitHub Collaboration Module: Script file loaded successfully!');

class GitHubCollaborationModule {
    constructor() {
        console.log('GitHub Collaboration Module: Constructor called');
        this.currentUser = 'student';
        this.collaborators = ['alice', 'bob', 'charlie'];
        this.pullRequests = [];
        this.init();
    }

    init() {
        console.log('GitHub Collaboration Module: Initializing...');
        this.setupCollaborationFeatures();
        this.setupPullRequestWorkflow();
        this.setupCodeReview();
        this.setupConflictResolution();
        console.log('GitHub Collaboration Module: Initialization complete');
    }

    setupCollaborationFeatures() {
        // Setup real-time collaboration simulation
        this.setupLiveChat();
        this.setupFileSharing();
        this.setupBranchManagement();
    }

    setupPullRequestWorkflow() {
        // Setup PR creation and management
        const createPRButton = document.getElementById('create-pr');
        const reviewPRButton = document.getElementById('review-pr');
        const mergePRButton = document.getElementById('merge-pr');

        if (createPRButton) {
            createPRButton.addEventListener('click', () => {
                this.createPullRequest();
            });
        }

        if (reviewPRButton) {
            reviewPRButton.addEventListener('click', () => {
                this.reviewPullRequest();
            });
        }

        if (mergePRButton) {
            mergePRButton.addEventListener('click', () => {
                this.mergePullRequest();
            });
        }

        // Setup PR workflow steps
        this.setupWorkflowSteps();
    }

    setupWorkflowSteps() {
        const workflowSteps = document.querySelectorAll('.workflow-step');
        workflowSteps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.activateWorkflowStep(index);
            });

            // Add hover effects
            step.addEventListener('mouseenter', () => {
                this.addStepHoverEffect(step);
            });

            step.addEventListener('mouseleave', () => {
                this.removeStepHoverEffect(step);
            });
        });
    }

    setupCodeReview() {
        // Setup code review functionality
        const reviewButtons = document.querySelectorAll('.review-code');
        reviewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const codeBlock = e.target.closest('.code-block');
                if (codeBlock) {
                    this.startCodeReview(codeBlock);
                }
            });
        });

        // Setup comment system
        this.setupCommentSystem();
    }

    setupConflictResolution() {
        // Setup merge conflict resolution
        const resolveButton = document.getElementById('resolve-conflicts');
        if (resolveButton) {
            resolveButton.addEventListener('click', () => {
                this.resolveMergeConflicts();
            });
        }
    }

    setupLiveChat() {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        if (chatInput && chatSend) {
            chatSend.addEventListener('click', () => {
                this.sendChatMessage(chatInput.value);
                chatInput.value = '';
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage(chatInput.value);
                    chatInput.value = '';
                }
            });
        }

        // Simulate incoming messages
        this.simulateIncomingMessages();
    }

    setupFileSharing() {
        // Setup file sharing functionality
        const shareButton = document.getElementById('share-file');
        if (shareButton) {
            shareButton.addEventListener('click', () => {
                this.shareFile();
            });
        }
    }

    setupBranchManagement() {
        // Setup branch creation and switching
        const createBranchButton = document.getElementById('create-branch');
        const switchBranchButton = document.getElementById('switch-branch');

        if (createBranchButton) {
            createBranchButton.addEventListener('click', () => {
                this.createFeatureBranch();
            });
        }

        if (switchBranchButton) {
            switchBranchButton.addEventListener('click', () => {
                this.switchBranch();
            });
        }
    }

    setupCommentSystem() {
        // Setup inline commenting
        const codeBlocks = document.querySelectorAll('.code-block');
        codeBlocks.forEach(block => {
            block.addEventListener('click', (e) => {
                if (e.target.tagName === 'CODE') {
                    this.addInlineComment(e.target, e);
                }
            });
        });
    }

    activateWorkflowStep(index) {
        // Remove active class from all steps
        document.querySelectorAll('.workflow-step').forEach(step => {
            step.classList.remove('active');
        });

        // Add active class to current step
        const currentStep = document.querySelectorAll('.workflow-step')[index];
        if (currentStep) {
            currentStep.classList.add('active');
            
            // Show step details
            this.showStepDetails(index);
        }
    }

    addStepHoverEffect(step) {
        step.style.transform = 'translateY(-2px)';
        step.style.boxShadow = '0 12px 24px -8px rgba(0, 0, 0, 0.15)';
    }

    removeStepHoverEffect(step) {
        step.style.transform = 'translateY(0)';
        step.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    }

    showStepDetails(index) {
        const detailsContainer = document.getElementById('workflow-details');
        if (!detailsContainer) return;

        const stepDetails = [
            {
                title: 'Fork the Repository',
                description: 'Create your own copy of the project to work on',
                code: 'gh repo fork owner/repo-name',
                tips: ['Use GitHub CLI for quick forking', 'Ensure you have proper permissions']
            },
            {
                title: 'Clone Your Fork',
                description: 'Download the repository to your local machine',
                code: 'git clone https://github.com/your-username/repo-name.git',
                tips: ['Always clone your fork, not the original', 'Use HTTPS or SSH based on your setup']
            },
            {
                title: 'Create Feature Branch',
                description: 'Create a new branch for your specific feature or fix',
                code: 'git checkout -b feature/your-feature-name',
                tips: ['Use descriptive branch names', 'Keep branches focused on single features']
            },
            {
                title: 'Make Changes & Commit',
                description: 'Implement your changes and commit them with clear messages',
                code: 'git add .\ngit commit -m "Add feature: description of changes"',
                tips: ['Commit frequently with clear messages', 'Use conventional commit format']
            },
            {
                title: 'Push to Your Fork',
                description: 'Upload your changes to your fork on GitHub',
                code: 'git push origin feature/your-feature-name',
                tips: ['Push regularly to backup your work', 'Use the same branch name as local']
            },
            {
                title: 'Create Pull Request',
                description: 'Request to merge your changes into the original repository',
                code: 'gh pr create --title "Feature: description" --body "Detailed description"',
                tips: ['Write clear PR descriptions', 'Include screenshots if UI changes']
            },
            {
                title: 'Code Review Process',
                description: 'Collaborate with maintainers to improve your code',
                code: 'Address review comments and push updates',
                tips: ['Be responsive to feedback', 'Keep discussions professional']
            },
            {
                title: 'Merge & Cleanup',
                description: 'After approval, merge your PR and clean up branches',
                code: 'gh pr merge --squash\ngit branch -d feature/your-feature-name',
                tips: ['Use squash merge for clean history', 'Delete feature branches after merge']
            }
        ];

        if (stepDetails[index]) {
            const detail = stepDetails[index];
            detailsContainer.innerHTML = `
                <h3>${detail.title}</h3>
                <p>${detail.description}</p>
                <div class="code-example">
                    <h4>Command:</h4>
                    <pre><code>${detail.code}</code></pre>
                </div>
                <div class="tips">
                    <h4>💡 Pro Tips:</h4>
                    <ul>
                        ${detail.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    createPullRequest() {
        const prContainer = document.getElementById('pull-request-container');
        if (!prContainer) return;

        const pr = {
            id: Date.now(),
            title: 'Feature: Enhanced SIR Model with Age Structure',
            author: this.currentUser,
            status: 'open',
            description: 'This PR adds age-structured compartments to the SIR model, improving accuracy for COVID-19 modeling.',
            files: ['sir_model.R', 'analysis.R', 'README.md'],
            reviewers: ['alice', 'bob']
        };

        this.pullRequests.push(pr);
        this.displayPullRequest(pr);
        this.showNotification('Pull Request created successfully!', 'success');
    }

    displayPullRequest(pr) {
        const prContainer = document.getElementById('pull-request-container');
        if (!prContainer) return;

        const prHTML = `
            <div class="pull-request" data-pr-id="${pr.id}">
                <div class="pr-header">
                    <h3>${pr.title}</h3>
                    <span class="pr-status ${pr.status}">${pr.status}</span>
                </div>
                <div class="pr-details">
                    <p><strong>Author:</strong> ${pr.author}</p>
                    <p><strong>Description:</strong> ${pr.description}</p>
                    <p><strong>Files Changed:</strong> ${pr.files.join(', ')}</p>
                    <p><strong>Reviewers:</strong> ${pr.reviewers.join(', ')}</p>
                </div>
                <div class="pr-actions">
                    <button class="btn btn-primary" onclick="githubModule.reviewPullRequest(${pr.id})">Review</button>
                    <button class="btn btn-success" onclick="githubModule.mergePullRequest(${pr.id})">Merge</button>
                    <button class="btn btn-danger" onclick="githubModule.closePullRequest(${pr.id})">Close</button>
                </div>
            </div>
        `;

        prContainer.innerHTML = prHTML;
    }

    reviewPullRequest(prId) {
        const pr = this.pullRequests.find(p => p.id === prId);
        if (!pr) return;

        const reviewContainer = document.getElementById('code-review-container');
        if (!reviewContainer) return;

        reviewContainer.innerHTML = `
            <div class="code-review">
                <h3>Code Review: ${pr.title}</h3>
                <div class="review-files">
                    <h4>Files to Review:</h4>
                    ${pr.files.map(file => `
                        <div class="review-file">
                            <h5>${file}</h5>
                            <div class="file-content">
                                <pre><code># Sample content for ${file}
# This would show the actual file content
# with line numbers and diff highlighting</code></pre>
                            </div>
                            <div class="review-comments">
                                <button class="btn btn-sm btn-outline" onclick="githubModule.addReviewComment('${file}')">Add Comment</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="review-actions">
                    <button class="btn btn-success" onclick="githubModule.approvePR(${prId})">Approve</button>
                    <button class="btn btn-warning" onclick="githubModule.requestChanges(${prId})">Request Changes</button>
                </div>
            </div>
        `;

        this.showNotification('Code review started', 'info');
    }

    mergePullRequest(prId) {
        const pr = this.pullRequests.find(p => p.id === prId);
        if (!pr) return;

        pr.status = 'merged';
        this.updatePRDisplay(prId);
        this.showNotification('Pull Request merged successfully!', 'success');
    }

    closePullRequest(prId) {
        const pr = this.pullRequests.find(p => p.id === prId);
        if (!pr) return;

        pr.status = 'closed';
        this.updatePRDisplay(prId);
        this.showNotification('Pull Request closed', 'info');
    }

    updatePRDisplay(prId) {
        const prElement = document.querySelector(`[data-pr-id="${prId}"]`);
        if (prElement) {
            const statusElement = prElement.querySelector('.pr-status');
            const pr = this.pullRequests.find(p => p.id === prId);
            if (statusElement && pr) {
                statusElement.textContent = pr.status;
                statusElement.className = `pr-status ${pr.status}`;
            }
        }
    }

    startCodeReview(codeBlock) {
        // Add review mode to code block
        codeBlock.classList.add('review-mode');
        
        // Add comment button
        const commentButton = document.createElement('button');
        commentButton.className = 'btn btn-sm btn-outline add-comment';
        commentButton.textContent = '💬 Add Comment';
        commentButton.onclick = () => this.addInlineComment(codeBlock);
        
        codeBlock.appendChild(commentButton);
    }

    addInlineComment(codeBlock, event = null) {
        const comment = prompt('Enter your review comment:');
        if (!comment) return;

        const commentElement = document.createElement('div');
        commentElement.className = 'inline-comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong>${this.currentUser}</strong>
                <span class="comment-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="comment-content">${comment}</div>
        `;

        if (event && event.target.tagName === 'CODE') {
            event.target.parentNode.insertBefore(commentElement, event.target.nextSibling);
        } else {
            codeBlock.appendChild(commentElement);
        }

        this.showNotification('Comment added successfully!', 'success');
    }

    resolveMergeConflicts() {
        const conflictContainer = document.getElementById('conflict-resolution');
        if (!conflictContainer) return;

        conflictContainer.innerHTML = `
            <div class="conflict-resolution">
                <h3>Merge Conflict Resolution</h3>
                <div class="conflict-file">
                    <h4>sir_model.R</h4>
                    <div class="conflict-content">
                        <div class="conflict-section">
                            <h5>Current Branch (main)</h5>
                            <pre><code># Current version of the function
sir_model <- function(population, transmission, recovery) {
    # ... existing code ...
}</code></pre>
                        </div>
                        <div class="conflict-section">
                            <h5>Incoming Branch (feature/age-structured)</h5>
                            <pre><code># New version with age structure
sir_model <- function(population, transmission, recovery, age_groups) {
    # ... new code with age structure ...
}</code></pre>
                        </div>
                        <div class="resolution-options">
                            <h5>Resolution Options:</h5>
                            <button class="btn btn-primary" onclick="githubModule.acceptCurrent()">Accept Current</button>
                            <button class="btn btn-primary" onclick="githubModule.acceptIncoming()">Accept Incoming</button>
                            <button class="btn btn-warning" onclick="githubModule.manualResolve()">Manual Resolve</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.showNotification('Merge conflicts displayed', 'info');
    }

    sendChatMessage(message) {
        if (!message.trim()) return;

        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message own-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <strong>${this.currentUser}:</strong> ${message}
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    simulateIncomingMessages() {
        const messages = [
            'Hey team! I\'m working on the age-structured SIR model.',
            'Has anyone tested the new parameter validation?',
            'Great work on the documentation updates!',
            'I found a small bug in the plotting function.',
            'Ready for the code review session at 2 PM?'
        ];

        // EMERGENCY: Auto-messaging disabled to prevent crashes
        console.log('EMERGENCY: Auto-messaging disabled to prevent crashes');
        /*
        let messageIndex = 0;
        setInterval(() => {
            if (messageIndex < messages.length) {
                this.receiveChatMessage(messages[messageIndex], this.collaborators[messageIndex % this.collaborators.length]);
                messageIndex++;
            }
        }, 10000); // Send message every 10 seconds
        */
    }

    receiveChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message other-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <strong>${sender}:</strong> ${message}
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    shareFile() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.R,.r,.md,.txt';
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showNotification(`File "${file.name}" shared successfully!`, 'success');
            }
        };
        
        fileInput.click();
    }

    createFeatureBranch() {
        const branchName = prompt('Enter feature branch name:');
        if (!branchName) return;

        this.showNotification(`Feature branch "${branchName}" created successfully!`, 'success');
    }

    switchBranch() {
        const branches = ['main', 'develop', 'feature/sir-model', 'feature/age-structure'];
        const branchName = prompt(`Available branches: ${branches.join(', ')}\nEnter branch name to switch to:`);
        
        if (branchName && branches.includes(branchName)) {
            this.showNotification(`Switched to branch "${branchName}"`, 'success');
        } else {
            this.showNotification('Invalid branch name', 'error');
        }
    }

    approvePR(prId) {
        this.showNotification('Pull Request approved!', 'success');
    }

    requestChanges(prId) {
        this.showNotification('Changes requested for Pull Request', 'warning');
    }

    acceptCurrent() {
        this.showNotification('Current version accepted', 'success');
    }

    acceptIncoming() {
        this.showNotification('Incoming version accepted', 'success');
    }

    manualResolve() {
        this.showNotification('Manual resolution mode activated', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing GitHub Collaboration Module...');
    window.githubModule = new GitHubCollaborationModule();
});

// Also initialize on window load for better compatibility
window.addEventListener('load', () => {
    console.log('Window loaded, GitHub Collaboration Module ready');
});
