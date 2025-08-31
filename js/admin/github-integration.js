/**
 * GitHub Integration for Admin Panel
 * Handles GitHub API calls for content management
 */

class GitHubIntegration {
    constructor(token) {
        this.token = token;
        this.repoOwner = 'VincentSD';
        this.repoName = 'GWAC-MPPR';
        this.branch = 'main';
        this.baseUrl = 'https://api.github.com';
        this.contentPath = 'content';
    }

    /**
     * Test if the GitHub token is valid
     * @param {string} token - GitHub token to test
     * @returns {Promise<boolean>} - True if token is valid
     */
    async testToken(token) {
        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                console.log('Authenticated as:', userData.login);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error testing token:', error);
            return false;
        }
    }

    /**
     * Get current user information
     * @returns {Promise<Object>} - User data
     */
    async getCurrentUser() {
        try {
            const response = await fetch(`${this.baseUrl}/user`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }

    /**
     * Get repository information
     * @returns {Promise<Object>} - Repository data
     */
    async getRepository() {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting repository:', error);
            throw error;
        }
    }

    /**
     * Get content from a specific path in the repository
     * @param {string} path - Path to content (relative to repo root)
     * @returns {Promise<Object>} - Content data
     */
    async getContent(path) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // Content doesn't exist
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error getting content from ${path}:`, error);
            throw error;
        }
    }

    /**
     * Create or update content in the repository
     * @param {string} path - Path to content (relative to repo root)
     * @param {string} content - Content to save
     * @param {string} message - Commit message
     * @param {string} sha - SHA of existing content (for updates)
     * @returns {Promise<Object>} - Response data
     */
    async putContent(path, content, message, sha = null) {
        try {
            const body = {
                message: message,
                content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
                branch: this.branch
            };
            
            if (sha) {
                body.sha = sha;
            }
            
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error putting content to ${path}:`, error);
            throw error;
        }
    }

    /**
     * Delete content from the repository
     * @param {string} path - Path to content (relative to repo root)
     * @param {string} message - Commit message
     * @param {string} sha - SHA of content to delete
     * @returns {Promise<Object>} - Response data
     */
    async deleteContent(path, message, sha) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sha: sha,
                    branch: this.branch
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error deleting content from ${path}:`, error);
            throw error;
        }
    }

    /**
     * Get the latest commit SHA for a branch
     * @param {string} branch - Branch name (defaults to main)
     * @returns {Promise<string>} - Latest commit SHA
     */
    async getLatestCommitSha(branch = this.branch) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/commits/${branch}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const commitData = await response.json();
            return commitData.sha;
        } catch (error) {
            console.error('Error getting latest commit SHA:', error);
            throw error;
        }
    }

    /**
     * Create a new branch
     * @param {string} branchName - Name of the new branch
     * @param {string} baseBranch - Base branch to create from (defaults to main)
     * @returns {Promise<Object>} - Response data
     */
    async createBranch(branchName, baseBranch = this.branch) {
        try {
            // Get the SHA of the base branch
            const baseSha = await this.getLatestCommitSha(baseBranch);
            
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/git/refs`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ref: `refs/heads/${branchName}`,
                    sha: baseSha
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error creating branch ${branchName}:`, error);
            throw error;
        }
    }

    /**
     * Create a pull request
     * @param {string} title - PR title
     * @param {string} body - PR description
     * @param {string} head - Source branch
     * @param {string} base - Target branch
     * @returns {Promise<Object>} - Response data
     */
    async createPullRequest(title, body, head, base = this.branch) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/pulls`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    head: head,
                    base: base
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating pull request:', error);
            throw error;
        }
    }

    /**
     * Get content from the content directory
     * @param {string} subPath - Subdirectory within content (optional)
     * @returns {Promise<Object>} - Content data
     */
    async getContentData(subPath = '') {
        const fullPath = subPath ? `${this.contentPath}/${subPath}` : this.contentPath;
        return await this.getContent(fullPath);
    }

    /**
     * Save content to the content directory
     * @param {string} subPath - Subdirectory within content (optional)
     * @param {string} filename - Filename to save
     * @param {Object} data - Data to save
     * @param {string} message - Commit message
     * @returns {Promise<Object>} - Response data
     */
    async saveContentData(subPath, filename, data, message) {
        const fullPath = subPath ? `${this.contentPath}/${subPath}/${filename}` : `${this.contentPath}/${filename}`;
        const content = JSON.stringify(data, null, 2);
        
        // Check if content already exists
        const existingContent = await this.getContent(fullPath);
        const sha = existingContent ? existingContent.sha : null;
        
        return await this.putContent(fullPath, content, message, sha);
    }

    /**
     * Delete content from the content directory
     * @param {string} subPath - Subdirectory within content (optional)
     * @param {string} filename - Filename to delete
     * @param {string} message - Commit message
     * @returns {Promise<Object>} - Response data
     */
    async deleteContentData(subPath, filename, message) {
        const fullPath = subPath ? `${this.contentPath}/${subPath}/${filename}` : `${this.contentPath}/${filename}`;
        
        // Get the SHA of the content to delete
        const existingContent = await this.getContent(fullPath);
        if (!existingContent) {
            throw new Error(`Content not found: ${fullPath}`);
        }
        
        return await this.deleteContent(fullPath, message, existingContent.sha);
    }

    /**
     * List all content files in the content directory
     * @param {string} subPath - Subdirectory within content (optional)
     * @returns {Promise<Array>} - Array of content files
     */
    async listContentFiles(subPath = '') {
        try {
            const content = await this.getContentData(subPath);
            if (!content || !Array.isArray(content)) {
                return [];
            }
            
            return content.filter(item => item.type === 'file' && item.name.endsWith('.json'));
        } catch (error) {
            console.error('Error listing content files:', error);
            return [];
        }
    }

    /**
     * Get content from a specific JSON file
     * @param {string} subPath - Subdirectory within content (optional)
     * @param {string} filename - JSON filename
     * @returns {Promise<Object>} - Parsed JSON content
     */
    async getContentFile(subPath, filename) {
        try {
            const content = await this.getContentData(subPath);
            if (!content || !Array.isArray(content)) {
                return null;
            }
            
            const file = content.find(item => item.name === filename);
            if (!file) {
                return null;
            }
            
            // Decode content
            const decodedContent = atob(file.content);
            return JSON.parse(decodedContent);
        } catch (error) {
            console.error(`Error getting content file ${filename}:`, error);
            return null;
        }
    }

    /**
     * Check if a file exists in the content directory
     * @param {string} subPath - Subdirectory within content (optional)
     * @param {string} filename - Filename to check
     * @returns {Promise<boolean>} - True if file exists
     */
    async contentFileExists(subPath, filename) {
        try {
            const content = await this.getContentData(subPath);
            if (!content || !Array.isArray(content)) {
                return false;
            }
            
            return content.some(item => item.name === filename);
        } catch (error) {
            console.error(`Error checking if file exists ${filename}:`, error);
            return false;
        }
    }

    /**
     * Get repository statistics
     * @returns {Promise<Object>} - Repository statistics
     */
    async getRepositoryStats() {
        try {
            const [repo, commits, contributors] = await Promise.all([
                this.getRepository(),
                fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/commits?per_page=1`).then(r => r.json()),
                fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contributors?per_page=1`).then(r => r.json())
            ]);
            
            return {
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                openIssues: repo.open_issues_count,
                lastCommit: commits[0]?.commit?.author?.date,
                contributors: contributors.length
            };
        } catch (error) {
            console.error('Error getting repository stats:', error);
            throw error;
        }
    }

    /**
     * Update the GitHub token
     * @param {string} newToken - New GitHub token
     */
    updateToken(newToken) {
        this.token = newToken;
    }

    /**
     * Get the current repository configuration
     * @returns {Object} - Repository configuration
     */
    getConfig() {
        return {
            repoOwner: this.repoOwner,
            repoName: this.repoName,
            branch: this.branch,
            baseUrl: this.baseUrl,
            contentPath: this.contentPath
        };
    }
}
// Make GitHubIntegration available globally
window.GitHubIntegration = GitHubIntegration;
