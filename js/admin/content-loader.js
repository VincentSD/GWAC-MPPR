/**
 * Content Loader for Admin Panel
 * Handles loading and saving content from JSON files
 */

class ContentLoader {
    constructor(githubToken) {
        this.githubToken = githubToken;
        this.repoOwner = 'VincentSD';
        this.repoName = 'GWAC-MPPR';
        this.branch = 'main';
        this.baseUrl = 'https://api.github.com';
        this.contentPath = 'content';
        this.defaultContent = this.getDefaultContent();
    }

    /**
     * Get default content structure
     * @returns {Object} - Default content structure
     */
    getDefaultContent() {
        return {
            hero: {
                title: "G-WAC Summer School 2025",
                subtitle: "Join the German-West African Centre for Global Health and Pandemic Prevention for an intensive 9-day program featuring hands-on disease modeling, R programming, and practical training for pandemic preparedness in Africa.",
                dates: "September 1-10, 2025",
                location: "KNUST, Kumasi, Ghana",
                stats: {
                    days: 9,
                    hours: 72,
                    modules: 5,
                    experts: 10
                }
            },
            schedule: {
                parts: [
                    {
                        title: "Part I: Essentials of Disease Modelling",
                        description: "Foundation building with R programming, Git/GitHub, and basic infectious disease modeling concepts",
                        duration: "3 Days",
                        hours: 24,
                        instructors: 10
                    },
                    {
                        title: "Part II: Advanced Modeling Techniques",
                        description: "Advanced disease modeling, scenario analysis, and health economics integration",
                        duration: "6 Days",
                        hours: 48,
                        instructors: 8
                    }
                ],
                days: []
            },
            facilitators: [
                {
                    id: "james-azam",
                    name: "Dr. James Azam",
                    institution: "London School of Hygiene and Tropical Medicine",
                    expertise: "Expert in infectious disease modeling and R programming",
                    email: "james.azam@lshtm.ac.uk",
                    role: "Course Facilitator"
                },
                {
                    id: "andrzej-jarynowski",
                    name: "Dr. Andrzej Jarynowski",
                    institution: "Department of Veterinary Medicine, Freie Universität Berlin",
                    expertise: "Specialist in scenario modeling and sensitivity analysis",
                    email: "andrzej.jarynowski@fu-berlin.de",
                    role: "Course Facilitator"
                },
                {
                    id: "vincent-donkoh",
                    name: "Vincent Donkoh",
                    institution: "Kwame Nkrumah University of Science and Technology, Kumasi",
                    expertise: "R programming, version control, and model simulation",
                    email: "vdonkoh@knust.edu.gh",
                    role: "Course Facilitator"
                }
            ],
            categories: [
                {
                    id: "r-programming",
                    name: "R Programming",
                    description: "R programming tutorials and exercises",
                    color: "#3b82f6"
                },
                {
                    id: "disease-modeling",
                    name: "Disease Modeling",
                    description: "Disease modeling concepts and examples",
                    color: "#10b981"
                },
                {
                    id: "presentations",
                    name: "Presentations",
                    description: "Course presentations and slides",
                    color: "#f59e0b"
                },
                {
                    id: "exercises",
                    name: "Exercises",
                    description: "Practical exercises and assignments",
                    color: "#8b5cf6"
                }
            ],
            navigation: [
                {
                    id: "home",
                    label: "Home",
                    url: "#home",
                    order: 1
                },
                {
                    id: "schedule",
                    label: "Program Schedule",
                    url: "#schedule",
                    order: 2
                },
                {
                    id: "facilitators",
                    label: "Course Facilitators",
                    url: "#facilitators",
                    order: 3
                },
                {
                    id: "courses",
                    label: "Course Materials",
                    url: "#courses",
                    order: 4
                },
                {
                    id: "contact",
                    label: "Contact",
                    url: "#contact",
                    order: 5
                },
                {
                    id: "resources",
                    label: "Resources",
                    url: "#resources",
                    order: 6
                }
            ],
            contact: {
                general: {
                    email: "info@g-wac.org",
                    phone: "+233-20-123-4567",
                    address: "KNUST Campus, Kumasi, Ghana"
                },
                courseSpecific: {
                    email: "summer-school@g-wac.org",
                    phone: "+233-20-123-4568"
                },
                support: {
                    email: "support@g-wac.org",
                    phone: "+233-20-123-4569"
                }
            },
            resources: [
                {
                    id: "r-studio",
                    name: "RStudio",
                    description: "Integrated development environment for R",
                    url: "https://www.rstudio.com/products/rstudio/download/",
                    category: "software"
                },
                {
                    id: "r-base",
                    name: "R Programming Language",
                    description: "Statistical computing and graphics",
                    url: "https://cran.r-project.org/",
                    category: "software"
                },
                {
                    id: "git",
                    name: "Git",
                    description: "Version control system",
                    url: "https://git-scm.com/",
                    category: "software"
                },
                {
                    id: "github",
                    name: "GitHub",
                    description: "Code hosting platform",
                    url: "https://github.com/",
                    category: "platform"
                }
            ]
        };
    }

    // GitHub API methods (self-contained)
    async getContent(path) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404) {
                return null; // File doesn't exist
            }
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting content:', error);
            throw error;
        }
    }

    async putContent(path, content, message, sha = null) {
        try {
            // If no SHA provided, try to get the current file's SHA
            if (!sha) {
                try {
                    const existingFile = await this.getContent(path);
                    if (existingFile) {
                        sha = existingFile.sha;
                    }
                } catch (error) {
                    // Silently handle error
                }
            }
            
            const body = {
                message: message,
                content: btoa(JSON.stringify(content, null, 2)),
                branch: this.branch
            };
            
            if (sha) {
                body.sha = sha;
            }
            
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error putting content:', error);
            throw error;
        }
    }

    // Methods that ContentLoader needs (previously called on githubIntegration)
    async getContentFile(subPath, filename) {
        const path = subPath ? `${subPath}/${filename}` : filename;
        return await this.getContent(path);
    }

    async saveContentData(subPath, filename, data, message) {
        const path = subPath ? `${subPath}/${filename}` : filename;
        return await this.putContent(path, data, message);
    }

    // Content loading methods
    async loadHeroContent() {
        try {
            const content = await this.getContentFile('', 'hero.json');
            if (content) {
                // Decode content from GitHub API response
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.hero;
    }

    async saveHeroContent(data) {
        try {
            const message = `Update hero section content - ${new Date().toISOString()}`;
            const result = await this.saveContentData('', 'hero.json', data, message);

            return result;
        } catch (error) {
            console.error('Error saving hero content:', error);
            throw error;
        }
    }

    async loadSchedule() {
        try {
            const content = await this.getContentFile('', 'schedule.json');
            if (content) {
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.schedule;
    }

    async saveSchedule(data) {
        try {
            const message = `Update schedule content - ${new Date().toISOString()}`;
            return await this.saveContentData('', 'schedule.json', data, message);
        } catch (error) {
            console.error('Error saving schedule:', error);
            throw error;
        }
    }

    async loadFacilitators() {
        try {
            const content = await this.getContentFile('', 'facilitators.json');
            if (content) {
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.facilitators;
    }

    async saveFacilitators(data) {
        try {
            const message = `Update facilitators content - ${new Date().toISOString()}`;
            return await this.saveContentData('', 'facilitators.json', data, message);
        } catch (error) {
            console.error('Error saving facilitators:', error);
            throw error;
        }
    }

    async loadCategories() {
        try {
            const content = await this.getContentFile('', 'categories.json');
            if (content) {
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.categories;
    }

    async saveCategories(data) {
        try {
            const message = `Update categories content - ${new Date().toISOString()}`;
            return await this.saveContentData('', 'categories.json', data, message);
        } catch (error) {
            console.error('Error saving categories:', error);
            throw error;
        }
    }

    async loadNavigation() {
        try {
            const content = await this.getContentFile('', 'navigation.json');
            if (content) {
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.navigation;
    }

    async saveNavigation(data) {
        try {
            const message = `Update navigation content - ${new Date().toISOString()}`;
            return await this.saveContentData('', 'navigation.json', data, message);
        } catch (error) {
            console.error('Error saving navigation:', error);
            throw error;
        }
    }

    async loadContact() {
        try {
            const content = await this.getContentFile('', 'contact.json');
            if (content) {
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.contact;
    }

    async saveContact(data) {
        try {
            const message = `Update contact information - ${new Date().toISOString()}`;
            return await this.saveContentData('', 'contact.json', data, message);
        } catch (error) {
            console.error('Error saving contact info:', error);
            throw error;
        }
    }

    async loadResources() {
        try {
            const content = await this.getContentFile('', 'resources.json');
            if (content) {
                const decodedContent = atob(content.content);
                return JSON.parse(decodedContent);
            }
        } catch (error) {
            // Silently fall back to default content
        }
        
        return this.defaultContent.resources;
    }

    async saveResources(data) {
        try {
            const message = `Update resources content - ${new Date().toISOString()}`;
            return await this.saveContentData('', 'resources.json', data, message);
        } catch (error) {
            console.error('Error saving resources:', error);
            throw error;
        }
    }

    // Utility methods
    async contentExists(path) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async createContentDirectory() {
        try {
            // Create a placeholder file to establish the directory
            const message = `Initialize content directory - ${new Date().toISOString()}`;
            const placeholder = { initialized: true, timestamp: new Date().toISOString() };
            await this.saveContentData('', '.gitkeep', placeholder, message);
            return true;
        } catch (error) {
            console.error('Error creating content directory:', error);
            return false;
        }
    }

    async exportAllContent() {
        try {
            const content = {
                hero: await this.loadHeroContent(),
                schedule: await this.loadSchedule(),
                facilitators: await this.loadFacilitators(),
                categories: await this.loadCategories(),
                navigation: await this.loadNavigation(),
                contact: await this.loadContact(),
                resources: await this.loadResources()
            };
            
            return content;
        } catch (error) {
            console.error('Error exporting all content:', error);
            throw error;
        }
    }

    async importContent(contentData) {
        try {
            const results = [];
            
            if (contentData.hero) {
                results.push(await this.saveHeroContent(contentData.hero));
            }
            if (contentData.schedule) {
                results.push(await this.saveSchedule(contentData.schedule));
            }
            if (contentData.facilitators) {
                results.push(await this.saveFacilitators(contentData.facilitators));
            }
            if (contentData.categories) {
                results.push(await this.saveCategories(contentData.categories));
            }
            if (contentData.navigation) {
                results.push(await this.saveNavigation(contentData.navigation));
            }
            if (contentData.contact) {
                results.push(await this.saveContact(contentData.contact));
            }
            if (contentData.resources) {
                results.push(await this.saveResources(contentData.resources));
            }
            
            return results;
        } catch (error) {
            console.error('Error importing content:', error);
            throw error;
        }
    }
}
