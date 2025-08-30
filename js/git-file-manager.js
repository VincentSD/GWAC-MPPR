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
            const result = await this.uploadFileToGitHub(file, title, description, category, session, facilitator);
            
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

    async uploadFileToGitHub(file, title, description, category, session, facilitator) {
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
            const commitMessage = `Add course material: ${title}\n\nCategory: ${category}\nSession: ${session || 'General'}\nFacilitator: ${facilitator}\nDescription: ${description || 'No description'}`;
            
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
                facilitator: facilitator, // Include facilitator from form
                size: this.formatFileSize(file.size),
                type: file.type,
                uploadDate: new Date().toISOString(),
                uploadedBy: 'Facilitator',
                downloadCount: 0,
                githubPath: filePath,
                path: filePath, // Add path for editing
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
        // Check if file already exists to prevent duplicates
        const existingFile = Array.from(this.files.values()).find(f => 
            f.path === fileInfo.path || f.sha === fileInfo.sha
        );
        
        if (existingFile) {
            console.log('File already exists, skipping duplicate:', fileInfo.path);
            return;
        }
        
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
                // For PDFs, open directly in new tab using blob URL
                if (file.type.includes('pdf')) {
                    this.openFileInBrowser(file, 'pdf');
                }
                // For images, open directly in new tab
                else if (file.type.includes('image')) {
                    this.openFileInBrowser(file, 'image');
                }
                // For text-based files, fetch and display content
                else if (file.type.includes('text') || file.type.includes('markdown') || file.type.includes('code')) {
                    this.openFileInBrowser(file, 'text');
                }
                // For CSV files, open in new tab
                else if (file.type.includes('csv')) {
                    this.openFileInBrowser(file, 'csv');
                }
                // For other files, try to open in browser if possible
                else {
                    this.openFileInBrowser(file, 'default');
                }
                
            } catch (error) {
                console.error('Present error:', error);
                this.showNotification('❌ Failed to open file. Please try downloading instead.', 'error');
            }
        }
    }

    async openFileInBrowser(file, fileType) {
        try {
            // Fetch file content
            const response = await fetch(file.downloadUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }

            let content, mimeType, fileName;

            if (fileType === 'pdf') {
                // For PDFs, create blob URL
                const blob = await response.blob();
                content = URL.createObjectURL(blob);
                mimeType = 'application/pdf';
                fileName = file.name;
            } else if (fileType === 'image') {
                // For images, create blob URL
                const blob = await response.blob();
                content = URL.createObjectURL(blob);
                mimeType = blob.type;
                fileName = file.name;
            } else if (fileType === 'text' || fileType === 'markdown' || fileType === 'code') {
                // For text files, create formatted HTML page
                const text = await response.text();
                content = this.createTextFileViewer(text, file.name, file.type);
                mimeType = 'text/html';
                fileName = `${file.name}.html`;
            } else if (fileType === 'csv') {
                // For CSV files, create formatted HTML table
                const csvText = await response.text();
                content = this.createCSVViewer(csvText, file.name);
                mimeType = 'text/html';
                fileName = `${file.name}.html`;
            } else {
                // For other files, try to open directly
                const blob = await response.blob();
                content = URL.createObjectURL(blob);
                mimeType = blob.type;
                fileName = file.name;
            }

            // Open in new tab
            const newTab = window.open(content, '_blank');
            
            if (newTab) {
                this.showNotification(`✅ ${file.title} opened in new tab`, 'success');
                
                // Clean up blob URLs after a delay
                if (fileType === 'pdf' || fileType === 'image' || fileType === 'default') {
                    setTimeout(() => {
                        if (content.startsWith('blob:')) {
                            URL.revokeObjectURL(content);
                        }
                    }, 1000);
                }
            } else {
                // Fallback: download if popup blocked
                this.downloadFile(file.id);
                this.showNotification('ℹ️ Popup blocked. File downloaded instead.', 'info');
            }

        } catch (error) {
            console.error('Error opening file in browser:', error);
            // Fallback to download
            this.downloadFile(file.id);
            this.showNotification('❌ Failed to open file. Downloaded instead.', 'error');
        }
    }

    createTextFileViewer(content, fileName, fileType) {
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${fileName}</title>
                <style>
                    body { 
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
                        margin: 20px; 
                        background: #f5f5f5; 
                        line-height: 1.6;
                    }
                    .container { 
                        max-width: 1200px; 
                        margin: 0 auto; 
                        background: white; 
                        padding: 20px; 
                        border-radius: 8px; 
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header { 
                        border-bottom: 2px solid #007acc; 
                        padding-bottom: 10px; 
                        margin-bottom: 20px; 
                        color: #333;
                    }
                    .content { 
                        background: #f8f9fa; 
                        padding: 20px; 
                        border-radius: 4px; 
                        border-left: 4px solid #007acc;
                        white-space: pre-wrap; 
                        font-size: 14px;
                        overflow-x: auto;
                    }
                    .file-info { 
                        color: #666; 
                        font-size: 12px; 
                        margin-bottom: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${fileName}</h1>
                        <div class="file-info">
                            File Type: ${fileType} | 
                            Size: ${(content.length / 1024).toFixed(2)} KB
                        </div>
                    </div>
                    <div class="content">${this.escapeHtml(content)}</div>
                </div>
            </body>
            </html>
        `;
        
        return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    }

    createCSVViewer(csvContent, fileName) {
        try {
            const rows = csvContent.split('\n').map(row => 
                row.split(',').map(cell => cell.trim().replace(/"/g, ''))
            );
            
            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${fileName}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px; 
                            background: #f5f5f5;
                        }
                        .container { 
                            max-width: 1200px; 
                            margin: 0 auto; 
                            background: white; 
                            padding: 20px; 
                            border-radius: 8px; 
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .header { 
                            border-bottom: 2px solid #28a745; 
                            padding-bottom: 10px; 
                            margin-bottom: 20px; 
                            color: #333;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 12px; 
                            text-align: left;
                        }
                        th { 
                            background-color: #28a745; 
                            color: white; 
                            font-weight: bold;
                        }
                        tr:nth-child(even) { background-color: #f2f2f2; }
                        tr:hover { background-color: #e9ecef; }
                        .file-info { 
                            color: #666; 
                            font-size: 12px; 
                            margin-bottom: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>${fileName}</h1>
                            <div class="file-info">
                                File Type: CSV | 
                                Rows: ${rows.length} | 
                                Columns: ${rows[0] ? rows[0].length : 0}
                            </div>
                        </div>
                        <table>
                            ${rows.map((row, index) => 
                                `<tr>${row.map(cell => 
                                    index === 0 ? `<th>${this.escapeHtml(cell)}</th>` : `<td>${this.escapeHtml(cell)}</td>`
                                ).join('')}</tr>`
                            ).join('')}
                        </table>
                    </div>
                </body>
                </html>
            `;
            
            return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
        } catch (error) {
            console.error('Error creating CSV viewer:', error);
            return this.createTextFileViewer(csvContent, fileName, 'text/csv');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async deleteFile(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        // Check if user has GitHub token
        if (!this.githubToken) {
            this.showNotification('❌ You need to connect GitHub to delete files', 'error');
            return;
        }

        // Confirm deletion
        const confirmDelete = confirm(`Are you sure you want to delete "${file.title}"?\n\nThis action cannot be undone and will remove the file from the repository.`);
        if (!confirmDelete) return;

        try {
            this.showNotification('🔄 Deleting file from GitHub...', 'info');

            // Delete file from GitHub
            await this.deleteFileFromGitHub(file);

            // Note: Local state will be cleared and refreshed from GitHub
            // to ensure consistency with repository state

            // Clear local state and refresh from GitHub to ensure sync
            this.files.clear();
            this.categories.clear();
            
            // Refresh files from repository to ensure consistency
            await this.fetchFilesFromRepository();

            // Close the edit modal since file no longer exists
            this.closeEditModal(fileId);

            this.showNotification('✅ File deleted successfully from GitHub!', 'success');

        } catch (error) {
            console.error('Error deleting file:', error);
            this.showNotification('❌ Failed to delete file: ' + error.message, 'error');
        }
    }

    async deleteFileFromGitHub(file) {
        try {
            // Get current commit SHA
            const commitSHA = await this.getCurrentCommitSHA();
            if (!commitSHA) {
                throw new Error('Could not get current commit SHA');
            }

            // Get current tree SHA
            const treeSHA = await this.getCurrentTreeSHA();
            if (!treeSHA) {
                throw new Error('Could not get current tree SHA');
            }

            // Get the current tree to see all files
            const treeResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees/${treeSHA}?recursive=1`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!treeResponse.ok) {
                const errorText = await treeResponse.text();
                throw new Error(`Failed to get current tree: ${treeResponse.status} ${treeResponse.statusText}. ${errorText}`);
            }

            const currentTree = await treeResponse.json();
            
            // Filter out the file to be deleted, but keep all other files
            const newTreeItems = currentTree.tree.filter(item => 
                item.path !== file.path
            );

            // Create new tree without the deleted file
            const newTreeResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_tree: treeSHA,
                    tree: newTreeItems
                })
            });

            if (!newTreeResponse.ok) {
                const errorText = await newTreeResponse.text();
                throw new Error(`Failed to create new tree: ${newTreeResponse.status} ${newTreeResponse.statusText}. ${errorText}`);
            }

            const newTreeData = await newTreeResponse.json();

            // Create commit for deletion
            const commitResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Delete file: ${file.name}\n\nRemoved: ${file.title}\nCategory: ${file.category}\nSession: ${file.session || 'General'}`,
                    tree: newTreeData.sha,
                    parents: [commitSHA]
                })
            });

            if (!commitResponse.ok) {
                const errorText = await commitResponse.text();
                throw new Error(`Failed to create commit: ${commitResponse.status} ${commitResponse.statusText}. ${errorText}`);
            }

            const commitData = await commitResponse.json();

            // Update branch reference
            const refResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sha: commitData.sha
                })
            });

            if (!refResponse.ok) {
                const errorText = await refResponse.text();
                throw new Error(`Failed to update branch: ${refResponse.status} ${refResponse.statusText}. ${errorText}`);
            }

            console.log('File deleted successfully from GitHub');

        } catch (error) {
            console.error('Error deleting file from GitHub:', error);
            throw error;
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
            
            // Clear existing files to prevent duplicates
            this.files.clear();
            this.categories.clear();
            
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
                facilitator: this.extractFacilitatorFromFilename(filename), // Extract from filename
                size: this.formatFileSize(file.size || 0),
                type: fileType,
                uploadDate: new Date().toISOString(), // We'll use current date as fallback
                uploadedBy: 'Course Facilitator', // Default value - will be updated when uploaded
                downloadCount: 0,
                githubPath: file.path,
                path: file.path, // Add path for editing
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

    extractFacilitatorFromFilename(filename) {
        // Try to extract facilitator name from filename
        // Common patterns: "filename_FacilitatorName.ext" or "filename - FacilitatorName.ext"
        const patterns = [
            /[-_]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\./g,  // Matches "Name" in "filename_Name.ext"
            /[-_]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\./g, // Matches "Name" in "filename_Name .ext"
        ];
        
        for (const pattern of patterns) {
            const match = filename.match(pattern);
            if (match && match[1]) {
                const name = match[1].trim();
                // Check if it matches known facilitators
                const knownFacilitators = [
                    'Vincent', 'Donkoh', 'Jean-Claude', 'Dejon', 'Agobé', 'Gesine', 'Meyer-Rath',
                    'Opanin', 'Agyei', 'Adu', 'Charlène', 'Naomie', 'Tedto', 'Mfangnia'
                ];
                
                if (knownFacilitators.some(f => name.includes(f))) {
                    return this.mapFacilitatorName(name);
                }
            }
        }
        
        return 'Dr. Vincent Donkoh'; // Default facilitator
    }

    mapFacilitatorName(name) {
        // Map partial names to full facilitator names
        const facilitatorMap = {
            'Vincent': 'Dr. Vincent Donkoh',
            'Donkoh': 'Dr. Vincent Donkoh',
            'Jean-Claude': 'Dr. Jean Claude Dejon Agobé',
            'Dejon': 'Dr. Jean Claude Dejon Agobé',
            'Agobé': 'Dr. Jean Claude Dejon Agobé',
            'Gesine': 'Prof. Gesine Meyer-Rath',
            'Meyer-Rath': 'Prof. Gesine Meyer-Rath',
            'Opanin': 'Dr. Opanin Agyei Adu',
            'Agyei': 'Dr. Opanin Agyei Adu',
            'Adu': 'Dr. Opanin Agyei Adu',
            'Charlène': 'Charlène Naomie Tedto Mfangnia',
            'Naomie': 'Charlène Naomie Tedto Mfangnia',
            'Tedto': 'Charlène Naomie Tedto Mfangnia',
            'Mfangnia': 'Charlène Naomie Tedto Mfangnia'
        };
        
        for (const [partial, full] of Object.entries(facilitatorMap)) {
            if (name.includes(partial)) {
                return full;
            }
        }
        
        return name; // Return as-is if no mapping found
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
                    ${file.facilitator ? `
                        <div class="meta-item">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span>${file.facilitator}</span>
                        </div>
                    ` : ''}
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
               fileType.includes('code') ||
               fileType.includes('markdown') ||
               fileType.includes('csv') ||
               fileType.includes('excel') ||
               fileType.includes('spreadsheet') ||
               fileType.includes('word') ||
               fileType.includes('document');
    }

    getPresentButtonText(fileType) {
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
            return 'Present';
        } else if (fileType.includes('pdf')) {
            return 'View PDF';
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

        // Check if user has GitHub token (can edit)
        if (!this.githubToken) {
            this.showNotification('❌ You need to connect GitHub to edit files', 'error');
            return;
        }

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
                        <div class="form-group">
                            <label>Facilitator:</label>
                            <select id="edit-facilitator-${fileId}">
                                <option value="">Select a facilitator</option>
                                <option value="Dr. Vincent Donkoh" ${file.facilitator === 'Dr. Vincent Donkoh' ? 'selected' : ''}>Dr. Vincent Donkoh</option>
                                <option value="Dr. Jean Claude Dejon Agobé" ${file.facilitator === 'Dr. Jean Claude Dejon Agobé' ? 'selected' : ''}>Dr. Jean Claude Dejon Agobé</option>
                                <option value="Prof. Gesine Meyer-Rath" ${file.facilitator === 'Prof. Gesine Meyer-Rath' ? 'selected' : ''}>Prof. Gesine Meyer-Rath</option>
                                <option value="Dr. Opanin Agyei Adu" ${file.facilitator === 'Dr. Opanin Agyei Adu' ? 'selected' : ''}>Dr. Opanin Agyei Adu</option>
                                <option value="Charlène Naomie Tedto Mfangnia" ${file.facilitator === 'Charlène Naomie Tedto Mfangnia' ? 'selected' : ''}>Charlène Naomie Tedto Mfangnia</option>
                                <option value="Other" ${file.facilitator === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Replace File (Optional):</label>
                            <input type="file" id="edit-file-${fileId}" accept=".pdf,.docx,.doc,.txt,.md,.r,.rdata,.csv,.xlsx,.xls">
                            <small class="file-help">Leave empty to keep current file. New file will create a new version.</small>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="gitFileManager.closeEditModal('${fileId}')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                            <button type="button" class="btn btn-danger" onclick="gitFileManager.deleteFile('${fileId}')" style="margin-left: auto;">
                                <i class="fas fa-trash"></i> Delete File
                            </button>
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

    async saveCardEdits(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        // Check if user has GitHub token
        if (!this.githubToken) {
            this.showNotification('❌ You need to connect GitHub to save changes', 'error');
            return;
        }

        // Get form values
        const newTitle = document.getElementById(`edit-title-${fileId}`).value.trim();
        const newDescription = document.getElementById(`edit-desc-${fileId}`).value.trim();
        const newCategory = document.getElementById(`edit-category-${fileId}`).value;
        const newSession = document.getElementById(`edit-session-${fileId}`).value;
        const newFacilitator = document.getElementById(`edit-facilitator-${fileId}`).value;
        const newFileInput = document.getElementById(`edit-file-${fileId}`);

        // Validate required fields
        if (!newTitle || !newCategory || !newFacilitator) {
            this.showNotification('❌ Title, Category, and Facilitator are required', 'error');
            return;
        }

        try {
            this.showNotification('🔄 Saving changes to GitHub...', 'info');

            // Handle file replacement if a new file is selected
            if (newFileInput.files.length > 0) {
                const newFile = newFileInput.files[0];
                await this.replaceFileInGitHub(fileId, newFile, {
                    title: newTitle,
                    description: newDescription,
                    category: newCategory,
                    session: newSession,
                    facilitator: newFacilitator
                });
            } else {
                // Update metadata only (no file replacement)
                await this.updateFileMetadataInGitHub(fileId, {
                    title: newTitle,
                    description: newDescription,
                    category: newCategory,
                    session: newSession,
                    facilitator: newFacilitator
                });
            }

            // Update local file object
            file.title = newTitle;
            file.description = newDescription;
            file.category = newCategory;
            file.session = newSession;
            file.facilitator = newFacilitator;

            // Update display
            this.renderFiles();

            // Close modal
            this.closeEditModal(fileId);

            this.showNotification('✅ File updated successfully on GitHub!', 'success');

        } catch (error) {
            console.error('Error saving card edits:', error);
            this.showNotification('❌ Failed to save changes: ' + error.message, 'error');
        }
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

    async updateFileMetadataInGitHub(fileId, metadata) {
        const file = this.files.get(fileId);
        if (!file) throw new Error('File not found');

        try {
            // Create a metadata file to track changes
            const metadataContent = JSON.stringify({
                title: metadata.title,
                description: metadata.description,
                category: metadata.category,
                session: metadata.session,
                facilitator: metadata.facilitator,
                lastUpdated: new Date().toISOString(),
                originalFile: file.path
            }, null, 2);

            // Create metadata file path
            const metadataPath = `course-materials/${file.category}/${file.name.replace(/\.[^/.]+$/, '')}_metadata.json`;

            // Create blob for metadata
            const metadataBlob = await this.createBlob(metadataContent, 'application/json');

            // Get current tree SHA
            const treeSha = await this.getCurrentTreeSHA();

            // Create new tree with metadata
            const treeResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_tree: treeSha,
                    tree: [{
                        path: metadataPath,
                        mode: '100644',
                        type: 'blob',
                        sha: metadataBlob.sha
                    }]
                })
            });

            if (!treeResponse.ok) {
                throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
            }

            const treeData = await treeResponse.json();

            // Create commit
            const commitResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update metadata for ${file.name}: ${metadata.title}`,
                    tree: treeData.sha,
                    parents: [await this.getCurrentCommitSHA()]
                })
            });

            if (!commitResponse.ok) {
                throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
            }

            const commitData = await commitResponse.json();

            // Update branch reference
            await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sha: commitData.sha
                })
            });

        } catch (error) {
            console.error('Error updating metadata:', error);
            throw error;
        }
    }

    async replaceFileInGitHub(fileId, newFile, metadata) {
        const file = this.files.get(fileId);
        if (!file) throw new Error('File not found');

        try {
            // Create new file path with version
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileExtension = newFile.name.split('.').pop();
            const baseName = newFile.name.replace(/\.[^/.]+$/, '');
            const newFilePath = `course-materials/${metadata.category}/${baseName}_v${timestamp}.${fileExtension}`;

            // Create blob for new file
            const fileContent = await this.readFileAsBase64(newFile);
            const blob = await this.createBlob(fileContent, newFile.type);

            // Create metadata file
            const metadataContent = JSON.stringify({
                title: metadata.title,
                description: metadata.description,
                category: metadata.category,
                session: metadata.session,
                facilitator: metadata.facilitator,
                lastUpdated: new Date().toISOString(),
                originalFile: file.path,
                newFile: newFilePath,
                version: timestamp
            }, null, 2);

            const metadataPath = `course-materials/${metadata.category}/${baseName}_metadata.json`;
            const metadataBlob = await this.createBlob(metadataContent, 'application/json');

            // Get current tree SHA
            const treeSha = await this.getCurrentTreeSHA();

            // Create new tree with both files
            const treeResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/trees`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_tree: treeSha,
                    tree: [
                        {
                            path: newFilePath,
                            mode: '100644',
                            type: 'blob',
                            sha: blob.sha
                        },
                        {
                            path: metadataPath,
                            mode: '100644',
                            type: 'blob',
                            sha: metadataBlob.sha
                        }
                    ]
                })
            });

            if (!treeResponse.ok) {
                throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
            }

            const treeData = await treeResponse.json();

            // Create commit
            const commitResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/commits`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Replace file ${file.name} with new version: ${metadata.title}`,
                    tree: treeData.sha,
                    parents: [await this.getCurrentCommitSHA()]
                })
            });

            if (!commitResponse.ok) {
                throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
            }

            const commitData = await commitResponse.json();

            // Update branch reference
            await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/git/refs/heads/${this.branch}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sha: commitData.sha
                })
            });

            // Update local file object with new path
            file.path = newFilePath;
            file.name = newFile.name;

        } catch (error) {
            console.error('Error replacing file:', error);
            throw error;
        }
    }

    async readFileAsBase64(file) {
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

    async createBlob(content, contentType) {
        try {
            // Create blob for content
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

            if (!blobResponse.ok) {
                const errorText = await blobResponse.text();
                throw new Error(`Failed to create blob: ${blobResponse.status} ${blobResponse.statusText}. ${errorText}`);
            }

            const blob = await blobResponse.json();
            return blob;

        } catch (error) {
            console.error('Error creating blob:', error);
            throw error;
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
