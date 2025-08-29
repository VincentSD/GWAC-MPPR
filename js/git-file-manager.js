/**
 * G-WAC Git-Based File Management System
 * Works with GitHub Pages by integrating with GitHub API and Git operations
 */

class GitFileManager {
    constructor() {
        this.files = new Map();
        this.categories = new Map();
        this.repoOwner = 'jamesmbaazam'; // Your GitHub username
        this.repoName = 'mppr'; // Your repository name
        this.branch = 'main'; // Your default branch
        this.githubToken = null; // Will be set by user
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExistingFiles();
        this.setupDragAndDrop();
        this.checkGitHubAuth();
    }

    setupEventListeners() {
        // File upload button
        const uploadBtn = document.getElementById('file-upload-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.showUploadModal());
        }

        // Search functionality
        const searchInput = document.getElementById('file-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchFiles(e.target.value));
        }

        // Category filters
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', (e) => this.filterByCategory(e.target.value));
        });

        // GitHub token input
        const tokenInput = document.getElementById('github-token');
        if (tokenInput) {
            tokenInput.addEventListener('change', (e) => {
                this.githubToken = e.target.value;
                localStorage.setItem('github-token', this.githubToken);
                this.checkGitHubAuth();
            });
        }
    }

    checkGitHubAuth() {
        // Check if we have a stored token
        const storedToken = localStorage.getItem('github-token');
        if (storedToken) {
            this.githubToken = storedToken;
            document.getElementById('github-token').value = storedToken;
        }

        if (this.githubToken) {
            this.showNotification('✅ GitHub connected successfully!', 'success');
            this.loadExistingFiles();
        } else {
            this.showNotification('🔑 Please enter your GitHub Personal Access Token', 'info');
        }
    }

    showUploadModal() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            modal.style.display = 'block';
            this.setupUploadForm();
        }
    }

    hideUploadModal() {
        const modal = document.getElementById('upload-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    setupUploadForm() {
        const form = document.getElementById('upload-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFileUpload(e));
        }
    }

    async handleFileUpload(event) {
        event.preventDefault();
        
        if (!this.githubToken) {
            this.showNotification('❌ Please enter your GitHub Personal Access Token first', 'error');
            return;
        }

        const formData = new FormData(event.target);
        const file = formData.get('file');
        const title = formData.get('title');
        const description = formData.get('description');
        const category = formData.get('category');
        const session = formData.get('session');

        if (!file || !title || !category) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            this.showNotification('📤 Uploading file to GitHub...', 'info');
            
            // Upload file to GitHub
            const result = await this.uploadFileToGitHub(file, title, description, category, session);
            
            if (result.success) {
                this.addFile(result.file);
                this.showNotification('✅ File uploaded to GitHub successfully!', 'success');
                this.hideUploadModal();
                event.target.reset();
            } else {
                throw new Error(result.error || 'Upload failed');
            }

        } catch (error) {
            console.error('Upload error:', error);
            this.showNotification(`❌ Upload failed: ${error.message}`, 'error');
        }
    }

    async uploadFileToGitHub(file, title, description, category, session) {
        try {
            console.log('Starting GitHub upload process...');
            console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
            console.log('Repository:', `${this.repoOwner}/${this.repoName}`);
            console.log('Branch:', this.branch);
            console.log('Token length:', this.githubToken ? this.githubToken.length : 0);
            
            // Read file content
            const content = await this.readFileAsBase64(file);
            console.log('File content read, length:', content.length);
            
            // Create file path in repository
            const timestamp = new Date().toISOString().split('T')[0];
            const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filePath = `course-materials/${category}/${fileName}`;
            console.log('File path:', filePath);
            
            // Create commit message
            const commitMessage = `Add course material: ${title}\n\nCategory: ${category}\nSession: ${session || 'General'}\nDescription: ${description || 'No description'}`;
            
            // Get current tree SHA
            console.log('Getting current tree SHA...');
            const treeSHA = await this.getCurrentTreeSHA();
            console.log('Tree SHA:', treeSHA);
            
            // Create blob
            console.log('Creating blob...');
            const blobResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/blobs`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    encoding: 'base64'
                })
            });

            console.log('Blob response status:', blobResponse.status, blobResponse.statusText);
            
            if (!blobResponse.ok) {
                const errorText = await blobResponse.text();
                console.error('Blob creation failed:', errorText);
                throw new Error(`Failed to create blob: ${blobResponse.status} ${blobResponse.statusText}. ${errorText}`);
            }

            const blob = await blobResponse.json();
            console.log('Blob created successfully:', blob.sha);
            
            // Create tree
            console.log('Creating tree...');
            const treeResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_tree: treeSHA,
                    tree: [{
                        path: filePath,
                        mode: '100644',
                        type: 'blob',
                        sha: blob.sha
                    }]
                })
            });

            console.log('Tree response status:', treeResponse.status, treeResponse.statusText);
            
            if (!treeResponse.ok) {
                const errorText = await treeResponse.text();
                console.error('Tree creation failed:', errorText);
                throw new Error(`Failed to create tree: ${treeResponse.status} ${treeResponse.statusText}. ${errorText}`);
            }

            const tree = await treeResponse.json();
            console.log('Tree created successfully:', tree.sha);
            
            // Create commit
            console.log('Creating commit...');
            const commitResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: commitMessage,
                    tree: tree.sha,
                    parents: [treeSHA]
                })
            });

            console.log('Commit response status:', commitResponse.status, commitResponse.statusText);
            
            if (!commitResponse.ok) {
                const errorText = await commitResponse.text();
                console.error('Commit creation failed:', errorText);
                throw new Error(`Failed to create commit: ${commitResponse.status} ${commitResponse.statusText}. ${errorText}`);
            }

            const commit = await commitResponse.json();
            console.log('Commit created successfully:', commit.sha);
            
            // Update branch reference
            console.log('Updating branch reference...');
            const refResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sha: commit.sha
                })
            });

            console.log('Ref response status:', refResponse.status, refResponse.statusText);
            
            if (!refResponse.ok) {
                const errorText = await refResponse.text();
                console.error('Branch update failed:', errorText);
                throw new Error(`Failed to update branch: ${refResponse.status} ${refResponse.statusText}. ${errorText}`);
            }

            console.log('Branch updated successfully!');
            
            // Create file metadata
            const fileInfo = {
                id: Date.now().toString(),
                name: file.name,
                filename: fileName,
                title: title,
                description: description,
                category: category,
                session: session,
                size: this.formatFileSize(file.size),
                type: file.type,
                uploadDate: new Date().toISOString(),
                uploadedBy: 'Facilitator',
                downloadCount: 0,
                githubPath: filePath,
                downloadUrl: `https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/${this.branch}/${filePath}`,
                viewUrl: `https://github.com/${this.repoOwner}/${this.repoName}/blob/${this.branch}/${filePath}`
            };

            return { success: true, file: fileInfo };

        } catch (error) {
            console.error('GitHub upload error:', error);
            return { success: false, error: error.message };
        }
    }

    async getCurrentTreeSHA() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get current branch reference');
            }

            const ref = await response.json();
            
            // Get the commit
            const commitResponse = await fetch(ref.object.url, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!commitResponse.ok) {
                throw new Error('Failed to get commit');
            }

            const commit = await commitResponse.json();
            return commit.tree.sha;

        } catch (error) {
            console.error('Error getting tree SHA:', error);
            throw error;
        }
    }

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    addFile(fileInfo) {
        this.files.set(fileInfo.id, fileInfo);
        
        // Add to category
        if (!this.categories.has(fileInfo.category)) {
            this.categories.set(fileInfo.category, []);
        }
        this.categories.get(fileInfo.category).push(fileInfo.id);
        
        this.renderFiles();
    }

    downloadFile(fileId) {
        const file = this.files.get(fileId);
        if (file) {
            file.downloadCount++;
            
            try {
                // Download from GitHub raw URL
                const downloadLink = document.createElement('a');
                downloadLink.href = file.downloadUrl;
                downloadLink.download = file.name;
                downloadLink.style.display = 'none';
                
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                this.showNotification(`✅ ${file.title} downloaded successfully!`, 'success');
                
            } catch (error) {
                console.error('Download error:', error);
                this.showNotification('❌ Download failed. Please try again.', 'error');
            }
        }
    }

    presentFile(fileId) {
        const file = this.files.get(fileId);
        if (file) {
            try {
                // Open GitHub view URL in new tab
                const newTab = window.open(file.viewUrl, '_blank');
                
                if (newTab) {
                    this.showNotification(`✅ ${file.title} opened in GitHub for viewing`, 'success');
                } else {
                    // Fallback: download if popup blocked
                    this.downloadFile(fileId);
                    this.showNotification('ℹ️ Popup blocked. File downloaded instead.', 'info');
                }
                
            } catch (error) {
                console.error('Present error:', error);
                this.showNotification('❌ Failed to open file. Please try downloading instead.', 'error');
            }
        }
    }

    async loadExistingFiles() {
        try {
            // Load files from GitHub API
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/course-materials`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const contents = await response.json();
                await this.processGitHubContents(contents);
            } else {
                console.log('No course-materials folder found, using sample files');
                this.addSampleFiles();
            }
        } catch (error) {
            console.error('Error loading files from GitHub:', error);
            this.addSampleFiles();
        }
        
        this.renderFiles();
    }

    async processGitHubContents(contents) {
        // This would process the GitHub contents and create file metadata
        // For now, we'll use sample files
        this.addSampleFiles();
    }

    addSampleFiles() {
        const sampleFiles = [
            {
                id: '1',
                name: 'R_Programming_Basics.pdf',
                title: 'R Programming Basics',
                description: 'Introduction to R programming fundamentals',
                category: 'R Programming',
                session: 'Crash Course in R Programming',
                size: '2.5 MB',
                type: 'application/pdf',
                uploadDate: new Date().toISOString(),
                uploadedBy: 'James Azam',
                downloadCount: 0,
                githubPath: 'course-materials/R_Programming/R_Programming_Basics.pdf',
                downloadUrl: 'https://raw.githubusercontent.com/jamesmbaazam/mppr/main/course-materials/R_Programming/R_Programming_Basics.pdf',
                viewUrl: 'https://github.com/jamesmbaazam/mppr/blob/main/course-materials/R_Programming/R_Programming_Basics.pdf'
            }
        ];
        
        sampleFiles.forEach(file => this.addFile(file));
    }

    // ... (rest of the methods remain the same as in the original file manager)
    searchFiles(query) {
        const fileCards = document.querySelectorAll('.file-card');
        const searchTerm = query.toLowerCase();
        
        fileCards.forEach(card => {
            const title = card.querySelector('.file-title').textContent.toLowerCase();
            const description = card.querySelector('.file-description').textContent.toLowerCase();
            const category = card.querySelector('.file-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterByCategory(category) {
        const fileCards = document.querySelectorAll('.file-card');
        
        fileCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    renderFiles() {
        const container = document.getElementById('files-container');
        if (!container) return;

        container.innerHTML = '';
        
        this.files.forEach(file => {
            const fileCard = this.createFileCard(file);
            container.appendChild(fileCard);
        });
    }

    createFileCard(file) {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.dataset.category = file.category;
        card.dataset.session = file.session;
        
        // Check if file is viewable/presentable
        const isViewable = this.isViewableFile(file.type);
        
        card.innerHTML = `
            <div class="file-icon">
                <i class="fas ${this.getFileIcon(file.type)}"></i>
            </div>
            <div class="file-info">
                <h4 class="file-title">${file.title}</h4>
                <p class="file-description">${file.description || 'No description'}</p>
                <div class="file-meta">
                    <span class="file-category">${file.category}</span>
                    <span class="file-size">${file.size}</span>
                    <span class="file-date">${this.formatDate(file.uploadDate)}</span>
                </div>
                ${file.session ? `<span class="file-session">Session: ${file.session}</span>` : ''}
            </div>
            <div class="file-actions">
                <button class="btn btn-sm btn-primary" onclick="gitFileManager.downloadFile('${file.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
                ${isViewable ? `
                    <button class="btn btn-sm btn-success" onclick="gitFileManager.presentFile('${file.id}')">
                        <i class="fas fa-eye"></i> ${this.getPresentButtonText(file.type)}
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-outline" onclick="gitFileManager.showFileDetails('${file.id}')">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                <a href="${file.viewUrl}" target="_blank" class="btn btn-sm btn-info">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        `;
        
        return card;
    }

    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'fa-file-pdf';
        if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word';
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'fa-file-powerpoint';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fa-file-excel';
        if (fileType.includes('image')) return 'fa-file-image';
        if (fileType.includes('code') || fileType.includes('text')) return 'fa-file-code';
        return 'fa-file';
    }

    isViewableFile(fileType) {
        return fileType.includes('pdf') || 
               fileType.includes('powerpoint') || 
               fileType.includes('presentation') ||
               fileType.includes('image') ||
               fileType.includes('text') ||
               fileType.includes('code');
    }

    getPresentButtonText(fileType) {
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
            return 'Present';
        } else if (fileType.includes('pdf')) {
            return 'View';
        } else if (fileType.includes('image')) {
            return 'View';
        } else if (fileType.includes('text') || fileType.includes('code')) {
            return 'View';
        }
        return 'Open';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    showFileDetails(fileId) {
        const file = this.files.get(fileId);
        if (file) {
            const details = `
                <strong>Title:</strong> ${file.title}
                <br><strong>Description:</strong> ${file.description || 'No description'}
                <br><strong>Category:</strong> ${file.category}
                <br><strong>Session:</strong> ${file.session || 'General'}
                <br><strong>Size:</strong> ${file.size}
                <br><strong>Type:</strong> ${file.type}
                <br><strong>Uploaded:</strong> ${this.formatDate(file.uploadDate)}
                <br><strong>Uploaded by:</strong> ${file.uploadedBy}
                <br><strong>Downloads:</strong> ${file.downloadCount}
                <br><strong>GitHub Path:</strong> ${file.githubPath}
            `;
            
            this.showNotification(details, 'info', 5000);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    setupDragAndDrop() {
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
                console.log('Drag over detected');
            });
            
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                if (!dropZone.contains(e.relatedTarget)) {
                    dropZone.classList.remove('drag-over');
                    console.log('Drag leave detected');
                }
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                console.log('Drop detected, files:', files);
                
                if (files.length > 0) {
                    this.handleDroppedFiles(files);
                } else {
                    console.log('No files in drop event');
                }
            });
            
            dropZone.addEventListener('click', () => {
                this.showUploadModal();
            });
            
            console.log('Drag and drop setup complete for:', dropZone);
        } else {
            console.error('Drop zone element not found');
        }
    }

    handleDroppedFiles(files) {
        if (files.length > 0) {
            this.showUploadModal();
            
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                const dataTransfer = new DataTransfer();
                Array.from(files).forEach(file => {
                    dataTransfer.items.add(file);
                });
                fileInput.files = dataTransfer.files;
                
                const fileLabel = document.querySelector('.file-input-label');
                if (fileLabel) {
                    if (files.length === 1) {
                        fileLabel.innerHTML = `<i class="fas fa-file"></i> ${files[0].name}`;
                    } else {
                        fileLabel.innerHTML = `<i class="fas fa-files-o"></i> ${files.length} files selected`;
                    }
                }
                
                const titleInput = document.getElementById('title');
                if (titleInput && !titleInput.value && files.length === 1) {
                    const fileName = files[0].name;
                    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
                    titleInput.value = nameWithoutExt.replace(/[_-]/g, ' ');
                }
                
                console.log(`Dropped ${files.length} file(s):`, Array.from(files).map(f => f.name));
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.gitFileManager = new GitFileManager();
});
