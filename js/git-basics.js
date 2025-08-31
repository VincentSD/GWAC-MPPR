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
        this.setupProgressTracking();
        this.setupStatusHistoryTerminal();
        this.setupBackToTopButton();
        this.setupTableOfContents();
        console.log('Git Basics Module: Initialization complete');
    }

    setupGitTerminal() {
        // Main Git terminal
        this.setupTerminal('git-command', 'git-output', 'run-git-command');
        
        // Research collaboration terminal
        this.setupTerminal('research-command', 'research-output', 'run-research-command');
        
        // Workflow terminal
        this.setupTerminal('workflow-command', 'workflow-output', 'run-workflow-command');
    }

    setupTerminal(inputId, outputId, buttonId) {
        const commandInput = document.getElementById(inputId);
        const output = document.getElementById(outputId);
        const runButton = document.getElementById(buttonId);

        if (commandInput && output) {
            console.log(`Setting up terminal: ${inputId}`);
            
            // Handle Enter key
            commandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.executeCommand(commandInput.value, outputId);
                }
            });

            // Handle run button
            if (runButton) {
                runButton.addEventListener('click', () => {
                    this.executeCommand(commandInput.value, outputId);
                });
            }
        } else {
            console.log(`Terminal elements not found: ${inputId}`);
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
        
        // Setup image zoom modal
        this.setupImageModal();
    }

    setupStatusHistoryTerminal() {
        const input = document.getElementById('status-history-input');
        if (input) {
            // Handle Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.executeStatusHistoryCommand();
                }
            });
        }
    }

    setupBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show button when scrolling down
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupTableOfContents() {
        // Add smooth scrolling to all TOC links
        const tocLinks = document.querySelectorAll('.toc-item');
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
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

    executeCommand(command, outputId) {
        const output = document.getElementById(outputId);
        
        if (!output) {
            console.log(`Output element not found: ${outputId}`);
            return;
        }

        const commandLower = command.toLowerCase().trim();
        let response = '';

        // Clear previous output
        output.innerHTML = '';

        // Show command being executed
        output.innerHTML += `<div class="command-executed">$ <span class="command-text">${command}</span></div>`;

        // Handle different terminal types
        if (outputId === 'research-output') {
            response = this.handleResearchCommands(commandLower);
        } else if (outputId === 'workflow-output') {
            response = this.handleWorkflowCommands(commandLower);
        } else {
            response = this.handleGitCommands(commandLower);
        }

        if (response) {
            output.innerHTML += response;
            output.scrollTop = output.scrollHeight;
        }

        // Update command history for main terminal
        if (outputId === 'git-output') {
            this.updateCommandHistory();
        }
    }

    handleGitCommands(commandLower) {
        let response = '';

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

        return response;
    }

    handleResearchCommands(commandLower) {
        let response = '';

        switch (commandLower) {
            case 'git log --oneline':
                response = `
                    <div class="command-response info">
                        <p>abc1234 (HEAD -> main) Update COVID-19 model parameters</p>
                        <p>def5678 Add new vaccination data</p>
                        <p>ghi9012 Initial epidemiological model</p>
                        <p>✓ Research timeline visible!</p>
                    </div>
                `;
                break;

            case 'git show head':
                response = `
                    <div class="command-response info">
                        <p>commit abc1234 (HEAD -> main)</p>
                        <p>Author: Dr. Smith <smith@research.org></p>
                        <p>Date: ${new Date().toLocaleString()}</p>
                        <p>    Update COVID-19 model parameters</p>
                        <p>    - Adjusted R₀ from 2.5 to 3.0</p>
                        <p>    - Updated vaccination efficacy data</p>
                        <p>    - Added new testing protocols</p>
                    </div>
                `;
                break;

            case 'git diff head~1':
                response = `
                    <div class="command-response info">
                        <p>diff --git a/model.py b/model.py</p>
                        <p>index 1234567..abcdefg 100644</p>
                        <p>--- a/model.py</p>
                        <p>+++ b/model.py</p>
                        <p>@@ -15,7 +15,7 @@</p>
                        <p>- R0 = 2.5  # Basic reproduction number</p>
                        <p>+ R0 = 3.0  # Updated based on new data</p>
                        <p>✓ Changes clearly visible!</p>
                    </div>
                `;
                break;

            case 'help':
                response = `
                    <div class="command-response help">
                        <h4>Research Collaboration Commands:</h4>
                        <ul>
                            <li><strong>git log --oneline</strong> - See recent changes</li>
                            <li><strong>git show HEAD</strong> - View latest commit details</li>
                            <li><strong>git diff HEAD~1</strong> - Compare with previous version</li>
                            <li><strong>help</strong> - Show this help message</li>
                        </ul>
                    </div>
                `;
                break;

            default:
                if (commandLower.trim() !== '') {
                    response = `
                        <div class="command-response error">
                            <p>❌ Try research-specific commands:</p>
                            <p><code>git log --oneline</code>, <code>git show HEAD</code>, <code>git diff HEAD~1</code></p>
                            <p>Type <strong>help</strong> for available commands</p>
                        </div>
                    `;
                }
                break;
        }

        return response;
    }

    handleWorkflowCommands(commandLower) {
        let response = '';

        switch (commandLower) {
            case 'git status':
                response = `
                    <div class="command-response info">
                        <p>On branch main</p>
                        <p>Changes not staged for commit:</p>
                        <p>  (use "git add <file>..." to update what will be committed)</p>
                        <p>  (use "git restore <file>..." to discard changes in working directory)</p>
                        <p>        modified:   model.py</p>
                        <p>        modified:   data.csv</p>
                        <p>✓ Working directory status visible!</p>
                    </div>
                `;
                break;

            case 'git add model.py':
                response = `
                    <div class="command-response success">
                        <p>✓ model.py staged for commit</p>
                        <p>File is now in the staging area!</p>
                    </div>
                `;
                break;

            case 'git commit -m "update model parameters"':
                response = `
                    <div class="command-response success">
                        <p>[main abc1234] update model parameters</p>
                        <p>1 file changed, 3 insertions(+), 1 deletion(-)</p>
                        <p>✓ Changes committed to repository!</p>
                    </div>
                `;
                break;

            case 'help':
                response = `
                    <div class="command-response help">
                        <h4>Git Workflow Commands:</h4>
                        <ul>
                            <li><strong>git status</strong> - Check working directory</li>
                            <li><strong>git add filename</strong> - Stage changes</li>
                            <li><strong>git commit -m "message"</strong> - Create snapshot</li>
                            <li><strong>help</strong> - Show this help message</li>
                        </ul>
                    </div>
                `;
                break;

            default:
                if (commandLower.trim() !== '') {
                    response = `
                        <div class="command-response error">
                            <p>❌ Try workflow commands:</p>
                            <p><code>git status</code>, <code>git add filename</code>, <code>git commit -m "message"</code></p>
                            <p>Type <strong>help</strong> for available commands</p>
                        </div>
                    `;
                }
                break;
        }

        return response;
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
    
    setupImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.close-modal');
        
        if (!modal || !modalImg || !modalCaption || !closeBtn) {
            console.log('Image modal elements not found');
            return;
        }
        
        // Close modal when clicking the close button
        closeBtn.addEventListener('click', () => {
            this.closeImageModal();
        });
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeImageModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal();
            }
        });
        
        // Setup click handlers for comparison images
        this.setupComparisonImageClicks();
    }

    executeStatusHistoryCommand() {
        const input = document.getElementById('status-history-input');
        const output = document.getElementById('status-history-output');
        
        if (!input || !output) return;
        
        const command = input.value.trim().toLowerCase();
        
        if (!command) return;
        
        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'command-executed';
        commandLine.innerHTML = `<span class="prompt">$</span> <span class="command">${input.value}</span>`;
        output.appendChild(commandLine);
        
        // Process command and show output
        let response = '';
        
        if (command === 'git status') {
            response = `On branch main
nothing to commit, working tree clean

Your repository is clean! All changes have been committed.`;
        } else if (command === 'git status --short') {
            response = `No output - working tree is clean`;
        } else if (command === 'git log') {
            response = `commit abc1234 (HEAD -> main)
Author: Student <student@example.com>
Date:   Mon Mar 25 10:30:00 2025 +0000

    Add data analysis script

commit def5678
Author: Student <student@example.com>
Date:   Mon Mar 25 09:15:00 2025 +0000

    Initial commit: Add README file

commit ghi9012
Author: Student <student@example.com>
Date:   Mon Mar 25 08:00:00 2025 +0000

    Create project structure`;
        } else if (command === 'git log --oneline') {
            response = `abc1234 (HEAD -> main) Add data analysis script
def5678 Initial commit: Add README file
ghi9012 Create project structure`;
        } else if (command === 'git log --graph') {
            response = `* abc1234 (HEAD -> main) Add data analysis script
* def5678 Initial commit: README file
* ghi9012 Create project structure`;
        } else if (command === 'git log --stat') {
            response = `commit abc1234 (HEAD -> main)
Author: Student <student@example.com>
Date:   Mon Mar 25 10:30:00 2025 +0000

    Add data analysis script

 analysis.R | 45 +++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 45 insertions(+)

commit def5678
Author: Student <student@example.com>
Date:   Mon Mar 25 09:15:00 2025 +0000

    Initial commit: Add README file

 README.md | 12 ++++++++++++
 1 file changed, 12 insertions(+)`;
        } else {
            response = `Command not recognized. Try these commands:
• git status
• git status --short  
• git log
• git log --oneline
• git log --graph
• git log --stat`;
        }
        
        // Add response to output
        const responseLine = document.createElement('div');
        responseLine.className = 'command-response';
        responseLine.innerHTML = response.replace(/\n/g, '<br>');
        responseLine.style.color = '#e2e8f0';
        responseLine.style.marginBottom = '15px';
        output.appendChild(responseLine);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
        
        // Add some spacing
        const spacer = document.createElement('div');
        spacer.style.height = '10px';
        output.appendChild(spacer);
    }
    
    setupComparisonImageClicks() {
        // Find all comparison images and placeholders
        const comparisonImages = document.querySelectorAll('.comparison-image img, .image-placeholder');
        
        comparisonImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                this.openImageModal(img, index);
            });
        });
    }
    
    openImageModal(img, index) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const modalTitle = document.getElementById('modalTitle');
        
        if (!modal || !modalImg || !modalCaption || !modalTitle) return;
        
        // Get image source, caption, and title
        let imageSrc = '';
        let caption = '';
        let title = '';
        
        if (img.tagName === 'IMG') {
            imageSrc = img.src;
            caption = img.getAttribute('data-caption') || 'Git Concept Image';
            
            // Find the parent comparison card to get the title
            const comparisonCard = img.closest('.comparison-card');
            if (comparisonCard) {
                const titleElement = comparisonCard.querySelector('h3');
                title = titleElement ? titleElement.textContent : 'Git Concept';
            }
        } else {
            // Handle placeholder divs
            const placeholderText = img.querySelector('.placeholder-text')?.textContent || 'Git Concept';
            const placeholderDesc = img.querySelector('.placeholder-description')?.textContent || '';
            caption = `${placeholderText}: ${placeholderDesc}`;
            
            // Find the parent comparison card to get the title
            const comparisonCard = img.closest('.comparison-card');
            if (comparisonCard) {
                const titleElement = comparisonCard.querySelector('h3');
                title = titleElement ? titleElement.textContent : 'Git Concept';
            }
            
            // For placeholders, we'll show a larger version of the icon
            const icon = img.querySelector('.placeholder-icon')?.textContent || '📸';
            imageSrc = `data:text/html,<div style="font-size: 200px; text-align: center; padding: 100px; background: white; border-radius: 20px;">${icon}</div>`;
        }
        
        // Set modal content
        modalTitle.textContent = title;
        modalImg.src = imageSrc;
        modalCaption.textContent = caption;
        
        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
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

    setupProgressTracking() {
        // Track user engagement with the module
        this.trackSectionVisibility();
        this.trackTerminalUsage();
    }

    trackSectionVisibility() {
        const sections = document.querySelectorAll('.content-section');
        const progressFill = document.getElementById('module-progress');
        const progressText = document.querySelector('.progress-text');
        
        if (!progressFill || !progressText) return;

        const observer = new IntersectionObserver((entries) => {
            let visibleSections = 0;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleSections++;
                }
            });
            
            const progress = Math.min((visibleSections / sections.length) * 100, 100);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    trackTerminalUsage() {
        // Track when users interact with terminals
        const terminals = document.querySelectorAll('.terminal');
        terminals.forEach(terminal => {
            const input = terminal.querySelector('.command-input');
            if (input) {
                input.addEventListener('input', () => {
                    this.updateProgress(5); // Small progress boost for engagement
                });
            }
        });
    }

    updateProgress(amount) {
        const progressFill = document.getElementById('module-progress');
        const progressText = document.querySelector('.progress-text');
        
        if (!progressFill || !progressText) return;

        const currentWidth = parseFloat(progressFill.style.width) || 0;
        const newWidth = Math.min(currentWidth + amount, 100);
        
        progressFill.style.width = `${newWidth}%`;
        progressText.textContent = `${Math.round(newWidth)}% Complete`;
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
