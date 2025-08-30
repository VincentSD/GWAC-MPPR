/**
 * G-WAC Git-Based File Management System
 * Works with GitHub Pages by integrating with GitHub API and Git operations
 */

class GitFileManager {
    constructor() {
        this.files = new Map();
        this.categories = new Map();
        this.repoOwner = 'VincentSD'; // Your GitHub username
        this.repoName = 'GWAC-MPPR'; // Your repository name
        this.branch = 'main'; // Your default branch
        this.githubToken = null; // Will be set by user
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.checkGitHubAuth();
        // Files will be loaded automatically when GitHub token is provided
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

        // Refresh files button
        const refreshBtn = document.getElementById('refresh-files-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshFiles());
        }
    }

    async checkGitHubAuth() {
        // Clear any old fake data from storage
        localStorage.removeItem('gwac-files');
        
        // Check if we have a stored token
        const storedToken = localStorage.getItem('github-token');
        if (storedToken) {
            this.githubToken = storedToken;
            document.getElementById('github-token').value = storedToken;
        }

        if (this.githubToken) {
            this.showNotification('✅ GitHub connected successfully!', 'success');
            // Automatically fetch files from repository when token is provided
            await this.fetchFilesFromRepository();
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
        const facilitator = formData.get('facilitator');

        if (!file || !title || !category || !facilitator) {
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
            
            // Get current commit SHA for parent
            console.log('Getting current commit SHA...');
            const commitSHA = await this.getCurrentCommitSHA();
            console.log('Commit SHA:', commitSHA);
            
            // Handle empty repository case
            let parents = [];
            if (commitSHA) {
                parents = [commitSHA];
            } else {
                console.log('No existing commits found - creating initial commit');
            }
            
            // Get current tree SHA for base_tree
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
            console.log('Commit data:', {
                message: commitMessage,
                tree: tree.sha,
                parents: parents
            });
            
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
                    parents: parents
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

    async getCurrentCommitSHA() {
        try {
            console.log('Getting current commit SHA...');
            
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to get branch reference:', errorText);
                // If it's a 404, the repository might be empty
                if (response.status === 404) {
                    console.log('Repository appears to be empty or branch not found');
                    return null;
                }
                throw new Error(`Failed to get branch reference: ${response.status} ${response.statusText}`);
            }

            const ref = await response.json();
            console.log('Branch reference:', ref);
            
            if (!ref.object || !ref.object.sha) {
                throw new Error('Invalid branch reference - no commit SHA found');
            }

            const commitSHA = ref.object.sha;
            console.log('Latest commit SHA:', commitSHA);
            return commitSHA;

        } catch (error) {
            console.error('Error getting commit SHA:', error);
            throw error;
        }
    }

    async getCurrentTreeSHA() {
        try {
            console.log('Getting current tree SHA...');
            
            // First, get the latest commit SHA for the branch
            const refResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!refResponse.ok) {
                const errorText = await refResponse.text();
                console.error('Failed to get branch reference:', errorText);
                // If it's a 404, the repository might be empty
                if (refResponse.status === 404) {
                    console.log('Repository appears to be empty or branch not found');
                    return null;
                }
                throw new Error(`Failed to get branch reference: ${refResponse.status} ${refResponse.statusText}`);
            }

            const ref = await refResponse.json();
            console.log('Branch reference:', ref);
            
            if (!ref.object || !ref.object.sha) {
                throw new Error('Invalid branch reference - no commit SHA found');
            }

            const commitSHA = ref.object.sha;
            console.log('Latest commit SHA:', commitSHA);
            
            // Get the commit details to get the tree SHA
            const commitResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/commits/${commitSHA}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!commitResponse.ok) {
                const errorText = await commitResponse.text();
                console.error('Failed to get commit:', errorText);
                throw new Error(`Failed to get commit: ${commitResponse.status} ${commitResponse.statusText}`);
            }

            const commit = await commitResponse.json();
            console.log('Commit details:', commit);
            
            if (!commit.tree || !commit.tree.sha) {
                throw new Error('Invalid commit - no tree SHA found');
            }

            const treeSHA = commit.tree.sha;
            console.log('Tree SHA:', treeSHA);
            return treeSHA;

        } catch (error) {
            console.error('Error getting tree SHA:', error);
            // If it's a 404, the repository might be empty
            if (error.message.includes('404') || error.message.includes('Not Found')) {
                console.log('Repository appears to be empty or branch not found');
                return null;
            }
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
                console.log('No course-materials folder found, fetching from repository tree');
                await this.fetchFilesFromRepository();
            }
        } catch (error) {
            console.error('Error loading files from GitHub:', error);
            await this.fetchFilesFromRepository();
        }
        
        this.renderFiles();
    }

    async processGitHubContents(contents) {
        // Process the GitHub contents and create file metadata
        try {
            for (const item of contents) {
                if (item.type === 'file' && item.path.startsWith('course-materials/')) {
                    await this.processRepositoryFile({
                        path: item.path,
                        size: item.size,
                        sha: item.sha
                    });
                }
            }
        } catch (error) {
            console.error('Error processing GitHub contents:', error);
            // Fallback to repository tree fetch
            await this.fetchFilesFromRepository();
        }
    }

    async fetchFilesFromRepository() {
        if (!this.githubToken) {
            console.log('No GitHub token available for fetching files');
            return;
        }

        try {
            this.showNotification('🔄 Fetching files from repository...', 'info');
            
            // Get the current tree SHA
            const treeSha = await this.getCurrentTreeSHA();
            if (!treeSha) {
                console.error('Could not get tree SHA');
                return;
            }

            // Fetch the tree to get all files
            const treeResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${treeSha}?recursive=1`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!treeResponse.ok) {
                throw new Error(`Failed to fetch tree: ${treeResponse.status}`);
            }

            const treeData = await treeResponse.json();
            
            // Filter for course-materials directory
            const courseMaterialFiles = treeData.tree.filter(item => 
                item.type === 'blob' && 
                item.path.startsWith('course-materials/') &&
                !item.path.endsWith('/')
            );

            console.log(`Found ${courseMaterialFiles.length} course material files:`, courseMaterialFiles);
            console.log('All tree items for debugging:', treeData.tree.filter(item => item.path.includes('course-materials')));

            // Process each file
            for (const file of courseMaterialFiles) {
                await this.processRepositoryFile(file);
            }

            this.showNotification(`✅ Loaded ${courseMaterialFiles.length} files from repository`, 'success');
            this.renderFiles();

        } catch (error) {
            console.error('Error fetching files from repository:', error);
            this.showNotification('❌ Error fetching files from repository', 'error');
        }
    }

    async processRepositoryFile(file) {
        try {
            // Extract category from path (e.g., "course-materials/Disease Modeling/file.pdf" -> "Disease Modeling")
            const pathParts = file.path.split('/');
            const category = pathParts[1] || 'General';
            
            // Generate a readable title from filename
            const filename = pathParts[pathParts.length - 1];
            const title = this.generateReadableTitle(filename);
            
            // Determine file type and icon
            const fileType = this.getFileTypeFromPath(filename);
            const fileIcon = this.getFileIcon(fileType);
            
            // Create file object
            const fileObj = {
                id: this.generateFileId(file.path),
                name: filename,
                title: title,
                description: this.generateDefaultDescription(title, category),
                category: category,
                session: this.getSessionFromCategory(category),
                size: this.formatFileSize(file.size || 0),
                type: fileType,
                uploadDate: new Date().toISOString(), // We'll use current date as fallback
                uploadedBy: 'Course Facilitator', // Default value - will be updated when uploaded
                downloadCount: 0,
                githubPath: file.path,
                downloadUrl: `https://raw.githubusercontent.com/${this.repoOwner}/${this.repoName}/main/${file.path}`,
                viewUrl: `https://github.com/${this.repoOwner}/${this.repoName}/blob/main/${file.path}`,
                sha: file.sha
            };

            this.addFile(fileObj);
            console.log('Processed file:', fileObj);

        } catch (error) {
            console.error('Error processing file:', file, error);
        }
    }

    generateFileId(path) {
        // Create a unique ID from the file path
        return 'file_' + path.replace(/[^a-zA-Z0-9]/g, '_');
    }

    generateReadableTitle(filename) {
        // Convert filename to readable title
        // e.g., "2025-08-29_covid_19_background_Jean-Claude.pptx" -> "COVID-19 Background and Context"
        let title = filename
            .replace(/^\d{4}-\d{2}-\d{2}_/, '') // Remove date prefix
            .replace(/\.[^/.]+$/, '') // Remove file extension
            .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
        
        return title;
    }

    generateDefaultDescription(filename, category) {
        // Generate a default description based on title and category
        const descriptions = {
            'Disease Modeling': `Comprehensive materials for ${filename.toLowerCase()} in disease modeling and epidemiology`,
            'Presentations': `Presentation materials covering ${filename.toLowerCase()} for the G-WAC course`,
            'Health Economics': `Health economics integration materials for ${filename.toLowerCase()}`,
            'General': `Course materials for ${filename.toLowerCase()}`
        };
        
        return descriptions[category] || `Course materials for ${filename.toLowerCase()}`;
    }

    getFileTypeFromPath(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'application/pdf',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'ppt': 'application/vnd.ms-powerpoint',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'txt': 'text/plain',
            'md': 'text/markdown',
            'r': 'text/x-r-source',
            'rdata': 'application/octet-stream'
        };
        
        return typeMap[ext] || 'application/octet-stream';
    }

    getSessionFromCategory(category) {
        const sessionMap = {
            'Disease Modeling': 'Disease Modeling & Epidemiology',
            'Presentations': 'General Presentations',
            'Health Economics': 'Health Economics Integration',
            'R Programming': 'R Programming & Data Analysis',
            'Git & GitHub': 'Version Control & Collaboration'
        };
        
        return sessionMap[category] || 'General Session';
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
            <div class="card-header">
                <div class="file-icon">
                    <i class="fas ${this.getFileIcon(file.type)}"></i>
                </div>
                <div class="header-right">
                    <div class="file-badge">${file.category}</div>
                    <button class="action-btn edit-btn" onclick="gitFileManager.editCard('${file.id}')" title="Edit card">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-body">
                <h4 class="file-title">${file.title}</h4>
                <p class="file-description">${file.description || 'No description provided'}</p>
                
                <div class="file-meta">
                    <div class="meta-item">
                        <i class="fas fa-weight-hanging"></i>
                        <span>${file.size}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(file.uploadDate)}</span>
                    </div>
                    ${file.uploadedBy ? `
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${file.uploadedBy}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-actions">
                <button class="action-btn download-btn" onclick="gitFileManager.downloadFile('${file.id}')" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                ${isViewable ? `
                    <button class="action-btn view-btn" onclick="gitFileManager.presentFile('${file.id}')" title="${this.getPresentButtonText(file.type)}">
                        <i class="fas fa-eye"></i>
                    </button>
                ` : ''}
                <a href="${file.viewUrl}" target="_blank" class="action-btn github-btn" title="View on GitHub">
                    <i class="fab fa-github"></i>
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

    editDescription(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        const currentDesc = file.description || 'No description';
        const newDesc = prompt('Edit file description:', currentDesc);
        
        if (newDesc !== null && newDesc !== currentDesc) {
            // Update the file object
            file.description = newDesc;
            
            // Update the display
            const descElement = document.getElementById(`desc-${fileId}`);
            if (descElement) {
                descElement.textContent = newDesc;
            }
            
            // Save to localStorage for persistence
            this.saveFilesToStorage();
            
            this.showNotification('✅ Description updated successfully!', 'success');
        }
    }

    editTitle(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        const currentTitle = file.title || 'No title';
        const newTitle = prompt('Edit file title:', currentTitle);
        
        if (newTitle !== null && newTitle !== currentTitle && newTitle.trim() !== '') {
            // Update the file object
            file.title = newTitle.trim();
            
            // Update the display
            const titleElement = document.getElementById(`title-${fileId}`);
            if (titleElement) {
                titleElement.textContent = newTitle.trim();
            }
            
            // Save to localStorage for persistence
            this.saveFilesToStorage();
            
            this.showNotification('✅ Title updated successfully!', 'success');
        }
    }

    editCard(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        // Create a comprehensive edit form
        const editForm = `
            <div class="edit-card-modal">
                <div class="edit-card-content">
                    <h3>Edit File: ${file.name}</h3>
                    <form id="edit-form-${fileId}">
                        <div class="form-group">
                            <label>Title:</label>
                            <input type="text" id="edit-title-${fileId}" value="${file.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="edit-desc-${fileId}" rows="3">${file.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="edit-category-${fileId}">
                                <option value="R Programming" ${file.category === 'R Programming' ? 'selected' : ''}>R Programming</option>
                                <option value="Disease Modeling" ${file.category === 'Disease Modeling' ? 'selected' : ''}>Disease Modeling</option>
                                <option value="Presentations" ${file.category === 'Presentations' ? 'selected' : ''}>Presentations</option>
                                <option value="Exercises" ${file.category === 'Exercises' ? 'selected' : ''}>Exercises</option>
                                <option value="Data" ${file.category === 'Data' ? 'selected' : ''}>Data & Datasets</option>
                                <option value="Documentation" ${file.category === 'Documentation' ? 'selected' : ''}>Documentation</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Session:</label>
                            <select id="edit-session-${fileId}">
                                <option value="">Select a session</option>
                                <option value="Introduction to G-WAC" ${file.session === 'Introduction to G-WAC' ? 'selected' : ''}>Introduction to G-WAC</option>
                                <option value="Crash Course in R Programming" ${file.session === 'Crash Course in R Programming' ? 'selected' : ''}>Crash Course in R Programming</option>
                                <option value="Introduction to Version Control using Git and GitHub" ${file.session === 'Introduction to Version Control using Git and GitHub' ? 'selected' : ''}>Introduction to Version Control using Git and GitHub</option>
                                <option value="Basics of Infectious Disease Modeling" ${file.session === 'Basics of Infectious Disease Modeling' ? 'selected' : ''}>Basics of Infectious Disease Modeling</option>
                                <option value="Model Simulation in R with odin & monty" ${file.session === 'Model Simulation in R with odin & monty' ? 'selected' : ''}>Model Simulation in R with odin & monty</option>
                                <option value="Extending the SIR Model" ${file.session === 'Extending the SIR Model' ? 'selected' : ''}>Extending the SIR Model</option>
                                <option value="Basics of Model Calibration/Fitting/Validation Techniques" ${file.session === 'Basics of Model Calibration/Fitting/Validation Techniques' ? 'selected' : ''}>Basics of Model Calibration/Fitting/Validation Techniques</option>
                                <option value="Overview of Scenario Modeling" ${file.session === 'Overview of Scenario Modeling' ? 'selected' : ''}>Overview of Scenario Modeling</option>
                                <option value="Incorporating Health Economics into Epidemic Models" ${file.session === 'Incorporating Health Economics into Epidemic Models' ? 'selected' : ''}>Incorporating Health Economics into Epidemic Models</option>
                                <option value="Group Projects" ${file.session === 'Group Projects' ? 'selected' : ''}>Group Projects</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="gitFileManager.closeEditModal('${fileId}')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add modal to page
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = editForm;
        document.body.appendChild(modalContainer);

        // Setup form submission
        const form = document.getElementById(`edit-form-${fileId}`);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCardEdits(fileId);
        });

        // Show modal
        setTimeout(() => {
            modalContainer.querySelector('.edit-card-modal').classList.add('show');
        }, 10);
    }

    saveCardEdits(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        // Get form values
        const newTitle = document.getElementById(`edit-title-${fileId}`).value.trim();
        const newDescription = document.getElementById(`edit-desc-${fileId}`).value.trim();
        const newCategory = document.getElementById(`edit-category-${fileId}`).value;
        const newSession = document.getElementById(`edit-session-${fileId}`).value;

        // Update file object
        file.title = newTitle;
        file.description = newDescription;
        file.category = newCategory;
        file.session = newSession;

        // Update display
        this.renderFiles();

        // Save to storage
        this.saveFilesToStorage();

        // Close modal
        this.closeEditModal(fileId);

        this.showNotification('✅ File updated successfully!', 'success');
    }

    closeEditModal(fileId) {
        const modal = document.querySelector('.edit-card-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.parentElement.remove();
            }, 300);
        }
    }

    saveFilesToStorage() {
        const filesArray = Array.from(this.files.values());
        localStorage.setItem('gwac-files', JSON.stringify(filesArray));
    }

    // Removed loadFilesFromStorage to prevent loading fake data

    async refreshFiles() {
        // Clear current files
        this.files.clear();
        
        // Clear any stored fake data
        localStorage.removeItem('gwac-files');
        
        // Show loading state
        this.showNotification('🔄 Refreshing files from repository...', 'info');
        
        // Fetch fresh files from repository
        await this.fetchFilesFromRepository();
        
        // Update the display
        this.renderFiles();
        
        this.showNotification('✅ Files refreshed successfully!', 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.gitFileManager = new GitFileManager();
});
