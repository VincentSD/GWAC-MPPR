// Main JavaScript functionality for GWAC-MPPR
class GWACApp {
    constructor() {
        console.log('GWACApp: Constructor called');
        this.init();
    }

    init() {
        console.log('GWACApp: Initializing...');
        this.setupEventListeners();
        this.loadSubmissions();
        this.loadParticipants();
        this.setupSmoothScrolling();
        this.initProgressTracking();
        console.log('GWACApp: Initialization complete');
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add active state to navigation based on scroll position
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    setupSmoothScrolling() {
        // Smooth scrolling for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    async loadSubmissions() {
        const loadingEl = document.getElementById('submissions-loading');
        const contentEl = document.getElementById('submissions-content');
        const noSubmissionsEl = document.getElementById('no-submissions');
        const tableBody = document.getElementById('submissions-tbody');

        try {
            loadingEl.style.display = 'flex';
            contentEl.style.display = 'none';
            noSubmissionsEl.style.display = 'none';

            const response = await fetch('https://api.github.com/repos/vincentsd/GWAC-MPPR/contents/submissions/');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const submissions = data.filter(file => file.name.endsWith('.txt'));

            if (submissions.length === 0) {
                this.showNoSubmissions(loadingEl, noSubmissionsEl);
                return;
            }

            // Sort submissions by commit date (most recent first)
            const submissionsWithDates = await this.getSubmissionsWithDates(submissions);
            submissionsWithDates.sort((a, b) => new Date(b.commitDate) - new Date(a.commitDate));

            this.renderSubmissions(submissionsWithDates, tableBody);
            this.showSubmissions(loadingEl, contentEl);

        } catch (error) {
            console.error('Error fetching submissions:', error);
            this.showSubmissionsError(loadingEl, noSubmissionsEl, error.message);
        }
    }

    async getSubmissionsWithDates(submissions) {
        const submissionsWithDates = [];

        for (const submission of submissions) {
            try {
                // Get the commit history for this file to find the most recent commit
                const commitResponse = await fetch(`https://api.github.com/repos/vincentsd/GWAC-MPPR/commits?path=submissions/${submission.name}&per_page=1`);
                
                if (commitResponse.ok) {
                    const commits = await commitResponse.json();
                    if (commits.length > 0) {
                        submissionsWithDates.push({
                            ...submission,
                            commitDate: commits[0].commit.author.date
                        });
                    } else {
                        // Fallback to current time if no commit info
                        submissionsWithDates.push({
                            ...submission,
                            commitDate: new Date().toISOString()
                        });
                    }
                } else {
                    // Fallback to current time if API call fails
                    submissionsWithDates.push({
                        ...submission,
                        commitDate: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.warn(`Could not get commit date for ${submission.name}:`, error);
                // Fallback to current time
                submissionsWithDates.push({
                    ...submission,
                    commitDate: new Date().toISOString()
                });
            }
        }

        return submissionsWithDates;
    }

    renderSubmissions(submissions, tableBody) {
        tableBody.innerHTML = '';

        submissions.forEach(submission => {
            const row = document.createElement('tr');
            
            // Name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = submission.name.replace('.txt', '');
            row.appendChild(nameCell);

            // Time cell with proper formatting
            const timeCell = document.createElement('td');
            const commitDate = new Date(submission.commitDate);
            timeCell.textContent = this.formatDate(commitDate);
            row.appendChild(timeCell);

            // Download cell
            const downloadCell = document.createElement('td');
            const downloadLink = document.createElement('a');
            downloadLink.href = submission.download_url;
            downloadLink.textContent = 'Download';
            downloadLink.setAttribute('download', submission.name);
            downloadLink.setAttribute('target', '_blank');
            downloadLink.setAttribute('rel', 'noopener');
            downloadCell.appendChild(downloadLink);
            row.appendChild(downloadCell);

            tableBody.appendChild(row);
        });
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today at ' + date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (diffDays === 1) {
            return 'Yesterday at ' + date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }

    showSubmissions(loadingEl, contentEl) {
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
    }

    showNoSubmissions(loadingEl, noSubmissionsEl) {
        loadingEl.style.display = 'none';
        noSubmissionsEl.style.display = 'block';
    }

    showSubmissionsError(loadingEl, noSubmissionsEl, errorMessage) {
        loadingEl.style.display = 'none';
        noSubmissionsEl.style.display = 'block';
        noSubmissionsEl.innerHTML = `
            <p class="no-submissions-text">
                <span class="no-submissions-icon">⚠️</span>
                Error loading submissions: ${errorMessage}
            </p>
        `;
    }

    async loadParticipants() {
        const loadingEl = document.getElementById('participants-loading');
        const contentEl = document.getElementById('participants-content');
        const participantsList = document.getElementById('participants-list');

        try {
            loadingEl.style.display = 'flex';
            contentEl.style.display = 'none';

            const response = await fetch('https://api.github.com/repos/vincentsd/GWAC-MPPR/contents/README.md');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const content = atob(data.content); // Decode the base64 content
            
            // Extract participants from README
            const participants = this.extractParticipantsFromREADME(content);

            if (participants.length === 0) {
                this.showNoParticipants(loadingEl, contentEl);
                return;
            }

            this.renderParticipants(participants, participantsList);
            this.showParticipants(loadingEl, contentEl);

        } catch (error) {
            console.error('Error fetching participants:', error);
            this.showParticipantsError(loadingEl, contentEl, error.message);
        }
    }

    extractParticipantsFromREADME(content) {
        // Look for participants section in README
        const participantsMatch = content.match(/## Participants([\s\S]*?)(?=\n##|\n$)/i);
        
        if (participantsMatch) {
            const participantsSection = participantsMatch[1].trim();
            // Split by lines and filter out empty lines and markdown formatting
            return participantsSection
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*'))
                .map(line => line.replace(/^[-*]\s*/, '').trim())
                .filter(line => line.length > 0);
        }

        // Fallback: look for any list of names
        const nameMatches = content.match(/(?:^|\n)(?:[-*]\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)(?:\n|$)/g);
        if (nameMatches) {
            return nameMatches
                .map(match => match.trim())
                .map(line => line.replace(/^[-*]\s*/, '').trim())
                .filter(line => line.length > 0 && line.length < 50); // Filter reasonable name lengths
        }

        return [];
    }

    renderParticipants(participants, participantsList) {
        participantsList.innerHTML = '';

        participants.forEach(participant => {
            const li = document.createElement('li');
            li.textContent = participant;
            participantsList.appendChild(li);
        });
    }

    showParticipants(loadingEl, contentEl) {
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
    }

    showNoParticipants(loadingEl, contentEl) {
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `
            <div class="no-participants">
                <p class="no-participants-text">
                    <span class="no-participants-icon">👥</span>
                    No participants found in README
                </p>
            </div>
        `;
        contentEl.style.display = 'block';
    }

    showParticipantsError(loadingEl, contentEl, errorMessage) {
        loadingEl.style.display = 'none';
        contentEl.innerHTML = `
            <div class="participants-error">
                <p class="error-text">
                    <span class="error-icon">⚠️</span>
                    Error loading participants: ${errorMessage}
                </p>
            </div>
        `;
        contentEl.style.display = 'block';
    }

    initProgressTracking() {
        // Create progress bar in header
        this.createProgressBar();
        
        // Track module completion
        this.trackModuleCompletion();
        
        // Update progress on navigation
        this.updateProgressOnNavigation();
        
        // Initialize theme toggle
        this.initThemeToggle();
        
        // Initialize copy functionality
        this.initCopyFunctionality();
    }

    createProgressBar() {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'course-progress';
        progressContainer.innerHTML = `
            <div class="progress-info">
                <span class="progress-label">Course Progress</span>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-stats">
                <span class="completed-modules">0/6</span> modules completed
            </div>
        `;
        
        header.appendChild(progressContainer);
    }

    trackModuleCompletion() {
        const modules = [
            'git-basics', 'github-collaboration', 'r-git-workflow',
            'odin-intro', 'monty-fitting', 'advanced-modeling'
        ];
        
        modules.forEach(module => {
            if (localStorage.getItem(`module-${module}-completed`)) {
                this.updateProgress();
            }
        });
    }

    updateProgress() {
        const modules = [
            'git-basics', 'github-collaboration', 'r-git-workflow',
            'odin-intro', 'monty-fitting', 'advanced-modeling'
        ];
        
        const completed = modules.filter(module => 
            localStorage.getItem(`module-${module}-completed`)
        ).length;
        
        const percentage = Math.round((completed / modules.length) * 100);
        
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        const completedModules = document.querySelector('.completed-modules');
        
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
        if (completedModules) completedModules.textContent = `${completed}/${modules.length}`;
        
        // Add completion animation
        if (percentage === 100) {
            this.showCompletionCelebration();
        }
    }

    updateProgressOnNavigation() {
        // Mark modules as completed when navigating to them
        const currentPath = window.location.pathname;
        const moduleMap = {
            'git-basics.html': 'git-basics',
            'github-collaboration.html': 'github-collaboration',
            'r-git-workflow.html': 'r-git-workflow',
            'odin-intro.html': 'odin-intro',
            'monty-fitting.html': 'monty-fitting',
            'advanced-modeling.html': 'advanced-modeling'
        };
        
        Object.entries(moduleMap).forEach(([path, module]) => {
            {
                localStorage.setItem(`module-${module}-completed`, 'true');
                this.updateProgress();
            }
        });
    }

    showCompletionCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration-popup';
        celebration.innerHTML = `
            <div class="celebration-content">
                <h2>🎉 Congratulations!</h2>
                <p>You've completed the entire G-WAC Short Course!</p>
                <div class="celebration-actions">
                    <button onclick="this.downloadCertificate()">📄 Download Certificate</button>
                    <button onclick="this.closeCelebration()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 10000);
    }

    initThemeToggle() {
        // Create theme toggle button
        this.createThemeToggle();
        
        // Load saved theme preference
        this.loadThemePreference();
        
        // Add theme toggle event listener
        this.setupThemeToggle();
        
        // Initialize copy functionality
        this.initCopyFunctionality();
    }

    createThemeToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = '<span class="icon">🌙</span>';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        
        document.body.appendChild(toggle);
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    setupThemeToggle() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-toggle .icon');
        if (icon) {
                    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    initCopyFunctionality() {
        // Add copy buttons to all code blocks
        this.addCopyButtons();
        
        // Setup copy event listeners
        this.setupCopyListeners();
    }

    addCopyButtons() {
        const codeBlocks = document.querySelectorAll('.code-block');
        codeBlocks.forEach(block => {
            if (!block.querySelector('.copy-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.textContent = 'Copy';
                copyBtn.onclick = () => this.copyCode(block);
                block.appendChild(copyBtn);
            }
        });
    }

    setupCopyListeners() {
        // Listen for new code blocks being added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList.contains('code-block')) {
                        this.addCopyButtons();
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async copyCode(codeBlock) {
        const codeElement = codeBlock.querySelector('code');
        if (!codeElement) return;
        
        try {
            await navigator.clipboard.writeText(codeElement.textContent);
            this.showCopySuccess(codeBlock);
        } catch (err) {
            this.fallbackCopyTextToClipboard(codeElement.textContent, codeBlock);
        }
    }

    showCopySuccess(codeBlock) {
        const copyBtn = codeBlock.querySelector('.copy-btn');
        if (!copyBtn) return;
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }

    fallbackCopyTextToClipboard(text, codeBlock) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(codeBlock);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
}
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('GWACApp: DOM loaded, creating app...');
    new GWACApp();
});

// Add some additional utility functions
window.addEventListener('load', () => {
    // Add loading animation to the page
    document.body.classList.add('loaded');
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
});
