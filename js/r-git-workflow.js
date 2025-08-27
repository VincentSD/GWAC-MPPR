// Interactive R-Git Workflow Module for G-WAC Short Course
console.log('R-Git Workflow Module: Script file loaded successfully!');

class RGitWorkflowModule {
    constructor() {
        console.log('R-Git Workflow Module: Constructor called');
        this.currentStep = 0;
        this.workflowProgress = {};
        this.init();
    }

    init() {
        console.log('R-Git Workflow Module: Initializing...');
        this.setupWorkflowInteractions();
        this.setupCodeExecution();
        this.setupProgressTracking();
        console.log('R-Git Workflow Module: Initialization complete');
    }

    setupWorkflowInteractions() {
        // Setup interactive workflow steps
        const workflowSteps = document.querySelectorAll('.iterative-workflow-step');
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

        // Setup workflow navigation
        this.setupWorkflowNavigation();
    }

    setupWorkflowNavigation() {
        const nextButton = document.getElementById('next-workflow-step');
        const prevButton = document.getElementById('prev-workflow-step');
        const progressBar = document.getElementById('workflow-progress');

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.nextWorkflowStep();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.previousWorkflowStep();
            });
        }

        // Update progress bar
        this.updateWorkflowProgress();
    }

    setupCodeExecution() {
        // Setup R code execution simulation
        const runButtons = document.querySelectorAll('.run-r-code');
        runButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const codeBlock = e.target.closest('.code-block');
                if (codeBlock) {
                    this.executeRCode(codeBlock);
                }
            });
        });

        // Setup Git command execution
        const gitButtons = document.querySelectorAll('.run-git-command');
        gitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const command = e.target.dataset.command;
                if (command) {
                    this.executeGitCommand(command);
                }
            });
        });
    }

    setupProgressTracking() {
        // Track user progress through the workflow
        const progressData = localStorage.getItem('r-git-workflow-progress');
        if (progressData) {
            this.workflowProgress = JSON.parse(progressData);
        }

        // Mark completed steps
        this.markCompletedSteps();
    }

    activateWorkflowStep(index) {
        // Remove active class from all steps
        document.querySelectorAll('.iterative-workflow-step').forEach(step => {
            step.classList.remove('active');
        });

        // Add active class to current step
        const currentStep = document.querySelectorAll('.iterative-workflow-step')[index];
        if (currentStep) {
            currentStep.classList.add('active');
            this.currentStep = index;
            
            // Update progress
            this.updateWorkflowProgress();
            
            // Mark as completed
            this.markStepCompleted(index);
        }
    }

    addStepHoverEffect(step) {
        step.style.transform = 'translateY(-2px)';
        step.style.boxShadow = '0 12px 24px -8px rgba(0, 0, 0, 0.15)';
    }

    removeStepHoverEffect(step) {
        step.style.transform = 'translateY(0)';
        step.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.1)';
    }

    nextWorkflowStep() {
        const totalSteps = document.querySelectorAll('.iterative-workflow-step').length;
        if (this.currentStep < totalSteps - 1) {
            this.activateWorkflowStep(this.currentStep + 1);
        }
    }

    previousWorkflowStep() {
        if (this.currentStep > 0) {
            this.activateWorkflowStep(this.currentStep - 1);
        }
    }

    updateWorkflowProgress() {
        const progressBar = document.getElementById('workflow-progress');
        if (!progressBar) return;

        const totalSteps = document.querySelectorAll('.iterative-workflow-step').length;
        const progress = ((this.currentStep + 1) / totalSteps) * 100;
        
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        
        // Update progress text
        const progressText = progressBar.parentElement.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `Step ${this.currentStep + 1} of ${totalSteps}`;
        }
    }

    markStepCompleted(index) {
        this.workflowProgress[`step_${index}`] = {
            completed: true,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('r-git-workflow-progress', JSON.stringify(this.workflowProgress));

        // Visual feedback
        const step = document.querySelectorAll('.iterative-workflow-step')[index];
        if (step) {
            step.classList.add('completed');
            
            // Add completion indicator
            const completionIndicator = step.querySelector('.completion-indicator');
            if (!completionIndicator) {
                const indicator = document.createElement('div');
                indicator.className = 'completion-indicator';
                indicator.innerHTML = '✓';
                step.appendChild(indicator);
            }
        }
    }

    markCompletedSteps() {
        Object.keys(this.workflowProgress).forEach(key => {
            if (this.workflowProgress[key].completed) {
                const stepIndex = parseInt(key.split('_')[1]);
                const step = document.querySelectorAll('.iterative-workflow-step')[stepIndex];
                if (step) {
                    step.classList.add('completed');
                    
                    // Add completion indicator
                    const indicator = document.createElement('div');
                    indicator.className = 'completion-indicator';
                    indicator.innerHTML = '✓';
                    step.appendChild(indicator);
                }
            }
        });
    }

    executeRCode(codeBlock) {
        // Simulate R code execution
        const outputArea = codeBlock.querySelector('.code-output');
        if (!outputArea) return;

        // Show loading state
        outputArea.innerHTML = '<div class="loading">🔄 Executing R code...</div>';

        // Simulate execution time
        setTimeout(() => {
            const code = codeBlock.querySelector('code')?.textContent || '';
            
            if (code.includes('SIR')) {
                outputArea.innerHTML = `
                    <div class="code-result success">
                        <h4>✅ SIR Model Executed Successfully!</h4>
                        <p>Model parameters:</p>
                        <ul>
                            <li>Population: 1000</li>
                            <li>Initial Infected: 1</li>
                            <li>Transmission Rate: 0.3</li>
                            <li>Recovery Rate: 0.1</li>
                        </ul>
                        <p>Results: Peak infection at day 15 with 300 cases</p>
                    </div>
                `;
            } else if (code.includes('plot')) {
                outputArea.innerHTML = `
                    <div class="code-result success">
                        <h4>📊 Plot Generated Successfully!</h4>
                        <p>Epidemic curve plotted with:</p>
                        <ul>
                            <li>Susceptible (blue line)</li>
                            <li>Infected (red line)</li>
                            <li>Recovered (green line)</li>
                        </ul>
                    </div>
                `;
            } else {
                outputArea.innerHTML = `
                    <div class="code-result info">
                        <h4>ℹ️ Code Executed</h4>
                        <p>R code ran without errors</p>
                        <p>Output: ${code.substring(0, 50)}...</p>
                    </div>
                `;
            }
        }, 1500);
    }

    executeGitCommand(command) {
        // Simulate Git command execution
        const commandOutput = document.getElementById('git-command-output');
        if (!commandOutput) return;

        commandOutput.innerHTML = `<div class="command-executed">$ ${command}</div>`;

        let response = '';
        switch (command) {
            case 'git status':
                response = `
                    <div class="command-response info">
                        <p>On branch feature/age-structured-sir</p>
                        <p>Changes not staged for commit:</p>
                        <p>  modified:   sir_model.R</p>
                        <p>  modified:   analysis.R</p>
                        <p>Untracked files:</p>
                        <p>  plots/</p>
                    </div>
                `;
                break;
            case 'git add .':
                response = `
                    <div class="command-response success">
                        <p>✓ All changes staged for commit</p>
                        <p>Ready to commit your incremental progress!</p>
                    </div>
                `;
                break;
            case 'git commit -m "Add age-structured SIR model"':
                response = `
                    <div class="command-response success">
                        <p>[feature/age-structured-sir abc1234] Add age-structured SIR model</p>
                        <p>2 files changed, 45 insertions(+)</p>
                        <p>✓ Incremental commit created!</p>
                    </div>
                `;
                break;
            default:
                response = `
                    <div class="command-response info">
                        <p>Command executed: ${command}</p>
                        <p>This is a simulation of the Git workflow</p>
                    </div>
                `;
        }

        commandOutput.innerHTML += response;
        commandOutput.scrollTop = commandOutput.scrollHeight;
    }

    // Utility methods
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
    console.log('DOM loaded, initializing R-Git Workflow Module...');
    new RGitWorkflowModule();
});

// Also initialize on window load for better compatibility
window.addEventListener('load', () => {
    console.log('Window loaded, R-Git Workflow Module ready');
});
