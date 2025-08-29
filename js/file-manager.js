/**
 * G-WAC File Management System
 * Handles file uploads, downloads, and organization for course materials
 */

class FileManager {
    constructor() {
        this.files = new Map();
        this.categories = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExistingFiles();
        this.setupDragAndDrop();
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
        
        // Handle file input change
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                const fileLabel = document.querySelector('.file-input-label');
                
                if (files.length > 0 && fileLabel) {
                    if (files.length === 1) {
                        fileLabel.innerHTML = `<i class="fas fa-file"></i> ${files[0].name}`;
                    } else {
                        fileLabel.innerHTML = `<i class="fas fa-files-o"></i> ${files.length} files selected`;
                    }
                    
                    // Auto-fill title if it's empty
                    const titleInput = document.getElementById('title');
                    if (titleInput && !titleInput.value && files.length === 1) {
                        const fileName = files[0].name;
                        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
                        titleInput.value = nameWithoutExt.replace(/[_-]/g, ' ');
                    }
                }
            });
        }
    }

    async handleFileUpload(event) {
        event.preventDefault();
        
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
            // In a real implementation, this would upload to a server
            // For now, we'll simulate the upload
            const fileInfo = {
                id: Date.now().toString(),
                name: file.name,
                title: title,
                description: description,
                category: category,
                session: session,
                size: this.formatFileSize(file.size),
                type: file.type,
                uploadDate: new Date().toISOString(),
                uploadedBy: 'Facilitator', // In real app, get from user session
                downloadCount: 0
            };

            this.addFile(fileInfo);
            this.showNotification('File uploaded successfully!', 'success');
            this.hideUploadModal();
            event.target.reset();

        } catch (error) {
            console.error('Upload error:', error);
            this.showNotification('Upload failed. Please try again.', 'error');
        }
    }

    addFile(fileInfo) {
        this.files.set(fileInfo.id, fileInfo);
        
        // Add to category
        if (!this.categories.has(fileInfo.category)) {
            this.categories.set(fileInfo.category, []);
        }
        this.categories.get(fileInfo.category).push(fileInfo.id);
        
        this.renderFiles();
        this.saveToLocalStorage();
    }

    removeFile(fileId) {
        const file = this.files.get(fileId);
        if (file) {
            // Remove from category
            const categoryFiles = this.categories.get(file.category);
            if (categoryFiles) {
                const index = categoryFiles.indexOf(fileId);
                if (index > -1) {
                    categoryFiles.splice(index, 1);
                }
            }
            
            this.files.delete(fileId);
            this.renderFiles();
            this.saveToLocalStorage();
        }
    }

    downloadFile(fileId) {
        const file = this.files.get(fileId);
        if (file) {
            file.downloadCount++;
            this.saveToLocalStorage();
            
            try {
                // Create a download link for the file
                const downloadLink = document.createElement('a');
                
                // For demo purposes, create a blob with sample content
                // In production, this would be the actual file from server
                let content = '';
                let mimeType = 'text/plain';
                
                switch (file.type) {
                    case 'application/pdf':
                        content = `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(${file.title}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000111 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF`;
                        mimeType = 'application/pdf';
                        break;
                    case 'text/x-r':
                        content = `# ${file.title}\n\n# ${file.description}\n\n# Example R code\nlibrary(deSolve)\n\n# Your R code here\nprint("Hello from R!")`;
                        mimeType = 'text/x-r';
                        break;
                    default:
                        content = `${file.title}\n\n${file.description}\n\nThis is a sample file for demonstration purposes.\n\nFile Type: ${file.type}\nSize: ${file.size}\nUploaded: ${this.formatDate(file.uploadDate)}`;
                }
                
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                
                downloadLink.href = url;
                downloadLink.download = file.name;
                downloadLink.style.display = 'none';
                
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // Clean up the URL
                URL.revokeObjectURL(url);
                
                this.showNotification(`${file.title} downloaded successfully!`, 'success');
                
            } catch (error) {
                console.error('Download error:', error);
                this.showNotification('Download failed. Please try again.', 'error');
            }
        }
    }

    presentFile(fileId) {
        const file = this.files.get(fileId);
        if (file) {
            try {
                // Create a blob with sample content for demo
                // In production, this would be the actual file from server
                let content = '';
                let mimeType = 'text/plain';
                
                switch (file.type) {
                    case 'application/pdf':
                        content = `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(${file.title}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000111 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF`;
                        mimeType = 'application/pdf';
                        break;
                    case 'text/x-r':
                        content = `# ${file.title}\n\n# ${file.description}\n\n# Example R code\nlibrary(deSolve)\n\n# Your R code here\nprint("Hello from R!")`;
                        mimeType = 'text/x-r';
                        break;
                    default:
                        content = `${file.title}\n\n${file.description}\n\nThis is a sample file for demonstration purposes.\n\nFile Type: ${file.type}\nSize: ${file.size}\nUploaded: ${this.formatDate(file.uploadDate)}`;
                }
                
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                
                // Open in new tab for presentation/viewing
                const newTab = window.open(url, '_blank');
                
                if (newTab) {
                    this.showNotification(`${file.title} opened in new tab for ${this.getPresentButtonText(file.type).toLowerCase()}`, 'success');
                } else {
                    // Fallback: download if popup blocked
                    this.downloadFile(fileId);
                    this.showNotification('Popup blocked. File downloaded instead.', 'info');
                }
                
                // Clean up the URL after a delay
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
                
            } catch (error) {
                console.error('Present error:', error);
                this.showNotification('Failed to open file. Please try downloading instead.', 'error');
            }
        }
    }

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
                <button class="btn btn-sm btn-primary" onclick="fileManager.downloadFile('${file.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
                ${isViewable ? `
                    <button class="btn btn-sm btn-success" onclick="fileManager.presentFile('${file.id}')">
                        <i class="fas fa-eye"></i> ${this.getPresentButtonText(file.type)}
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-outline" onclick="fileManager.showFileDetails('${file.id}')">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                ${this.isFacilitator() ? `
                    <button class="btn btn-sm btn-danger" onclick="fileManager.removeFile('${file.id}')">
                        <i class="fas fa-trash"></i> Remove
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
        // Files that can be opened in browser or presentation mode
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

    isFacilitator() {
        // In a real implementation, check user role from authentication
        // For now, return true to show facilitator features
        return true;
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
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            // Visual feedback for drag over
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
                console.log('Drag over detected');
            });
            
            // Remove visual feedback when leaving
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                // Only remove class if we're actually leaving the drop zone
                if (!dropZone.contains(e.relatedTarget)) {
                    dropZone.classList.remove('drag-over');
                    console.log('Drag leave detected');
                }
            });
            
            // Handle file drop
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
            
            // Add click handler to also open upload modal
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
            // Show upload modal first
            this.showUploadModal();
            
            // Set the dropped file to the file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                // Create a new DataTransfer object and add the dropped files
                const dataTransfer = new DataTransfer();
                Array.from(files).forEach(file => {
                    dataTransfer.items.add(file);
                });
                fileInput.files = dataTransfer.files;
                
                // Update the file input label to show selected file
                const fileLabel = document.querySelector('.file-input-label');
                if (fileLabel) {
                    if (files.length === 1) {
                        fileLabel.innerHTML = `<i class="fas fa-file"></i> ${files[0].name}`;
                    } else {
                        fileLabel.innerHTML = `<i class="fas fa-files-o"></i> ${files.length} files selected`;
                    }
                }
                
                // Auto-fill title if it's empty
                const titleInput = document.getElementById('title');
                if (titleInput && !titleInput.value && files.length === 1) {
                    const fileName = files[0].name;
                    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension
                    titleInput.value = nameWithoutExt.replace(/[_-]/g, ' '); // Replace underscores/dashes with spaces
                }
                
                console.log(`Dropped ${files.length} file(s):`, Array.from(files).map(f => f.name));
            }
        }
    }

    loadExistingFiles() {
        // Load from localStorage (in real app, load from server)
        const saved = localStorage.getItem('gwac-files');
        if (saved) {
            try {
                const filesData = JSON.parse(saved);
                filesData.forEach(fileInfo => {
                    this.files.set(fileInfo.id, fileInfo);
                    
                    if (!this.categories.has(fileInfo.category)) {
                        this.categories.set(fileInfo.category, []);
                    }
                    this.categories.get(fileInfo.category).push(fileInfo.id);
                });
            } catch (error) {
                console.error('Error loading saved files:', error);
            }
        }
        
        // Add some sample files for demonstration
        this.addSampleFiles();
    }

    addSampleFiles() {
        if (this.files.size === 0) {
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
                    downloadCount: 0
                },
                {
                    id: '2',
                    name: 'deSolve_Package_Guide.pdf',
                    title: 'deSolve Package Guide',
                    description: 'Comprehensive guide to the deSolve package for ODE systems',
                    category: 'R Programming',
                    session: 'Crash Course in R Programming',
                    size: '1.8 MB',
                    type: 'application/pdf',
                    uploadDate: new Date().toISOString(),
                    uploadedBy: 'James Azam',
                    downloadCount: 0
                },
                {
                    id: '3',
                    name: 'ODE_Systems_Examples.R',
                    title: 'ODE Systems Examples',
                    description: 'R code examples for writing ODE systems',
                    category: 'R Programming',
                    session: 'Crash Course in R Programming',
                    size: '15 KB',
                    type: 'text/x-r',
                    uploadDate: new Date().toISOString(),
                    uploadedBy: 'James Azam',
                    downloadCount: 0
                }
            ];
            
            sampleFiles.forEach(file => this.addFile(file));
        }
    }

    saveToLocalStorage() {
        const filesArray = Array.from(this.files.values());
        localStorage.setItem('gwac-files', JSON.stringify(filesArray));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fileManager = new FileManager();
});
