// Interactive Git Basics Module for G-WAC Short Course
console.log('Git Basics Module: Script file loaded successfully!');

class GitBasicsModule {
    constructor() {
        console.log('Git Basics Module: Constructor called');
        this.gitHistory = [];
        this.currentDirectory = '/project';
        this.init();
    }

    init() {
        console.log('Git Basics Module: Initializing...');
        this.setupGitTerminal();
        this.setupInteractiveElements();
        console.log('Git Basics Module: Initialization complete');
    }

    setupGitTerminal() {
        const gitCommandInput = document.getElementById('git-command');
        const gitOutput = document.getElementById('git-output');
        const runButton = document.getElementById('run-git-command');

        if (gitCommandInput) {
            console.log('Git command input found');
            
            // Handle Enter key
            gitCommandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.executeGitCommand(gitCommandInput.value);
                }
            });

            // Handle run button
            if (runButton) {
                runButton.addEventListener('click', () => {
                    this.executeGitCommand(gitCommandInput.value);
                });
            }
        } else {
            console.log('Git command input not found');
        }
    }

    setupInteractiveElements() {
        // Setup copy buttons for code blocks
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const codeId = e.target.getAttribute('onclick')?.match(/copyCode\('([^']+)'\)/)?.[1];
                if (codeId) {
                    this.copyCodeToClipboard(codeId);
                }
            });
        });

        // Setup interactive concept explanations
        this.setupConceptInteractions();
    }

    setupConceptInteractions() {
        // Add hover effects and click interactions for Git concepts
        const conceptCards = document.querySelectorAll('.concept-card, .motivation-card');
        conceptCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showConceptDetails(card);
            });
        });
    }

    executeGitCommand(command) {
        const gitCommandInput = document.getElementById('git-command');
        const gitOutput = document.getElementById('git-output');
        
        if (!gitCommandInput || !gitOutput) {
            console.log('Git terminal elements not found');
            return;
        }

        const commandLower = command.toLowerCase().trim();
        let response = '';

        // Clear previous output
        gitOutput.innerHTML = '';

        // Show command being executed
        gitOutput.innerHTML += `<div class="command-executed">$ <span class="command-text">${command}</span></div>`;

        // Simulate Git command responses
        switch (commandLower) {
            case 'git init':
                response = `
                    <div class="command-response success">
                        <p>Initialized empty Git repository in .git/</p>
                        <p>✓ Repository created successfully!</p>
                    </div>
                `;
                this.gitHistory.push({ command: 'git init', success: true });
                break;

            case 'git status':
                response = `
                    <div class="command-response info">
                        <p>On branch main</p>
                        <p>No commits yet</p>
                        <p>nothing to commit (working tree clean)</p>
                    </div>
                `;
                break;

            case 'git add .':
                response = `
                    <div class="command-response success">
                        <p>✓ All files staged for commit</p>
                        <p>Ready to commit your changes!</p>
                    </div>
                `;
                this.gitHistory.push({ command: 'git add .', success: true });
                break;

            case 'git commit -m "initial commit"':
            case 'git commit -m "first commit"':
                response = `
                    <div class="command-response success">
                        <p>[main (root-commit) abc1234] initial commit</p>
                        <p>1 file changed, 25 insertions(+)</p>
                        <p>✓ Commit created successfully!</p>
                    </div>
                `;
                this.gitHistory.push({ command: 'git commit', success: true });
                break;

            case 'git log':
                response = `
                    <div class="command-response info">
                        <p>commit abc1234 (HEAD -> main)</p>
                        <p>Author: Student <student@example.com></p>
                        <p>Date: ${new Date().toLocaleString()}</p>
                        <p>    initial commit</p>
                    </div>
                `;
                break;

            case 'git branch':
                response = `
                    <div class="command-response info">
                        <p>* main</p>
                        <p>Current branch is highlighted with *</p>
                    </div>
                `;
                break;

            case 'git remote add origin https://github.com/user/repo.git':
                response = `
                    <div class="command-response success">
                        <p>✓ Remote 'origin' added</p>
                        <p>Your local repository is now connected to GitHub!</p>
                    </div>
                `;
                break;

            case 'git push -u origin main':
                response = `
                    <div class="command-response success">
                        <p>Branch 'main' set up to track remote branch 'main' from 'origin'</p>
                        <p>✓ Code pushed to GitHub successfully!</p>
                    </div>
                `;
                break;

            case 'help':
            case 'git help':
                response = `
                    <div class="command-response help">
                        <h4>Available Git Commands:</h4>
                        <ul>
                            <li><strong>git init</strong> - Initialize a new repository</li>
                            <li><strong>git status</strong> - Check repository status</li>
                            <li><strong>git add .</strong> - Stage all changes</li>
                            <li><strong>git commit -m "message"</strong> - Commit changes</li>
                            <li><strong>git log</strong> - View commit history</li>
                            <li><strong>git branch</strong> - List branches</li>
                            <li><strong>git remote add origin URL</strong> - Add remote repository</li>
                            <li><strong>git push -u origin main</strong> - Push to remote</li>
                            <li><strong>help</strong> - Show this help message</li>
                        </ul>
                    </div>
                `;
                break;

            default:
                if (commandLower.startsWith('git ')) {
                    response = `
                        <div class="command-response error">
                            <p>❌ Command not recognized or not implemented in this demo</p>
                            <p>Try typing <strong>help</strong> to see available commands</p>
                        </div>
                    `;
                } else if (commandLower.trim() !== '') {
                    response = `
                        <div class="command-response error">
                            <p>❌ Command not found: ${command}</p>
                            <p>This is a Git terminal. Try starting commands with <strong>git</strong></p>
                            <p>Type <strong>help</strong> for available commands</p>
                        </div>
                    `;
                }
                break;
        }

        if (response) {
            gitOutput.innerHTML += response;
            gitOutput.scrollTop = gitOutput.scrollHeight;
        }

        // Clear input
        gitCommandInput.value = '';
        
        // Update command history display
        this.updateCommandHistory();
    }

    updateCommandHistory() {
        const historyContainer = document.getElementById('command-history');
        if (!historyContainer) return;

        if (this.gitHistory.length === 0) {
            historyContainer.innerHTML = '<p>No commands executed yet</p>';
            return;
        }

        const historyHTML = this.gitHistory.map(item => `
            <div class="history-item ${item.success ? 'success' : 'error'}">
                <span class="command">${item.command}</span>
                <span class="status">${item.success ? '✓' : '✗'}</span>
            </div>
        `).join('');

        historyContainer.innerHTML = historyHTML;
    }

    showConceptDetails(card) {
        // Add visual feedback when concepts are clicked
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }

    copyCodeToClipboard(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;

        const textToCopy = codeElement.textContent || codeElement.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show success feedback
            const button = document.querySelector(`[onclick="copyCode('${codeId}')"]`);
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#27ae60';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

// Initialize the module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Git Basics Module...');
    new GitBasicsModule();
});

// Also initialize on window load for better compatibility
window.addEventListener('load', () => {
    console.log('Window loaded, Git Basics Module ready');
});
