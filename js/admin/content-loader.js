/**
 * Content Loader for Admin Panel
 * Handles loading and saving content from JSON files
 */

class ContentLoader {
    constructor(githubIntegration) {
        this.githubIntegration = githubIntegration;
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
                },
                {
                    id: "data",
                    name: "Data & Datasets",
                    description: "Data files and datasets for exercises",
                    color: "#ef4444"
                }
            ],
            navigation: [
                {
                    id: "home",
                    text: "Home",
                    href: "#home",
                    order: 1
                },
                {
                    id: "schedule",
                    text: "Schedule",
                    href: "#schedule",
                    order: 2
                },
                {
                    id: "courses",
                    text: "Courses",
                    href: "#courses",
                    order: 3
                },
                {
                    id: "materials",
                    text: "Materials",
                    href: "#course-materials",
                    order: 4
                },
                {
                    id: "students",
                    text: "Students",
                    href: "#students",
                    order: 5
                },
                {
                    id: "resources",
                    text: "Resources",
                    href: "#resources",
                    order: 6
                },
                {
                    id: "contact",
                    text: "Contact",
                    href: "#contact",
                    order: 7
                }
            ],
            contact: {
                general: {
                    email: "info@g-wac.org",
                    phone: "+233 XX XXX XXXX",
                    address: "KNUST, Kumasi, Ghana"
                },
                support: {
                    email: "support@g-wac.org",
                    responseTime: "24-48 hours"
                },
                emergency: {
                    email: "emergency@g-wac.org",
                    responseTime: "2-4 hours"
                }
            },
            resources: [
                {
                    id: "gwac-website",
                    title: "G-WAC Official Website",
                    description: "Official website of the German-West African Centre",
                    url: "https://g-wac.org/",
                    category: "Official",
                    featured: true
                },
                {
                    id: "r-tutorials",
                    title: "R Programming Tutorials",
                    description: "Comprehensive R programming tutorials and examples",
                    url: "https://github.com/jamesmbaazam/mppr/tree/main/tutorials/R",
                    category: "Tutorials",
                    featured: true
                },
                {
                    id: "drive-folder",
                    title: "Course Presentations",
                    description: "Google Drive folder with course presentations",
                    url: "https://drive.google.com/drive/folders/1MYPl2YaE5aALSVrOV8EdJre2V85gTjpd",
                    category: "Presentations",
                    featured: false
                }
            ]
        };
    }

    /**
     * Load hero content
     * @returns {Promise<Object>} - Hero content data
     */
    async loadHeroContent() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'hero.json');
            return content || this.defaultContent.hero;
        } catch (error) {
            console.error('Error loading hero content:', error);
            return this.defaultContent.hero;
        }
    }

    /**
     * Save hero content
     * @param {Object} data - Hero content data
     * @returns {Promise<Object>} - Response data
     */
    async saveHeroContent(data) {
        try {
            const message = `Update hero section content - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'hero.json', data, message);
        } catch (error) {
            console.error('Error saving hero content:', error);
            throw error;
        }
    }

    /**
     * Load schedule content
     * @returns {Promise<Object>} - Schedule content data
     */
    async loadSchedule() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'schedule.json');
            return content || this.defaultContent.schedule;
        } catch (error) {
            console.error('Error loading schedule content:', error);
            return this.defaultContent.schedule;
        }
    }

    /**
     * Save schedule content
     * @param {Object} data - Schedule content data
     * @returns {Promise<Object>} - Response data
     */
    async saveSchedule(data) {
        try {
            const message = `Update program schedule - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'schedule.json', data, message);
        } catch (error) {
            console.error('Error saving schedule content:', error);
            throw error;
        }
    }

    /**
     * Load facilitators content
     * @returns {Promise<Array>} - Facilitators data
     */
    async loadFacilitators() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'facilitators.json');
            return content || this.defaultContent.facilitators;
        } catch (error) {
            console.error('Error loading facilitators content:', error);
            return this.defaultContent.facilitators;
        }
    }

    /**
     * Save facilitators content
     * @param {Array} data - Facilitators data
     * @returns {Promise<Object>} - Response data
     */
    async saveFacilitators(data) {
        try {
            const message = `Update course facilitators - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'facilitators.json', data, message);
        } catch (error) {
            console.error('Error saving facilitators content:', error);
            throw error;
        }
    }

    /**
     * Load categories content
     * @returns {Promise<Array>} - Categories data
     */
    async loadCategories() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'categories.json');
            return content || this.defaultContent.categories;
        } catch (error) {
            console.error('Error loading categories content:', error);
            return this.defaultContent.categories;
        }
    }

    /**
     * Save categories content
     * @param {Array} data - Categories data
     * @returns {Promise<Object>} - Response data
     */
    async saveCategories(data) {
        try {
            const message = `Update course material categories - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'categories.json', data, message);
        } catch (error) {
            console.error('Error saving categories content:', error);
            throw error;
        }
    }

    /**
     * Load navigation content
     * @returns {Promise<Array>} - Navigation data
     */
    async loadNavigation() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'navigation.json');
            return content || this.defaultContent.navigation;
        } catch (error) {
            console.error('Error loading navigation content:', error);
            return this.defaultContent.navigation;
        }
    }

    /**
     * Save navigation content
     * @param {Array} data - Navigation data
     * @returns {Promise<Object>} - Response data
     */
    async saveNavigation(data) {
        try {
            const message = `Update navigation menu - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'navigation.json', data, message);
        } catch (error) {
            console.error('Error saving navigation content:', error);
            throw error;
        }
    }

    /**
     * Load contact content
     * @returns {Promise<Object>} - Contact data
     */
    async loadContact() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'contact.json');
            return content || this.defaultContent.contact;
        } catch (error) {
            console.error('Error loading contact content:', error);
            return this.defaultContent.contact;
        }
    }

    /**
     * Save contact content
     * @param {Object} data - Contact data
     * @returns {Promise<Object>} - Response data
     */
    async saveContact(data) {
        try {
            const message = `Update contact information - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'contact.json', data, message);
        } catch (error) {
            console.error('Error saving contact content:', error);
            throw error;
        }
    }

    /**
     * Load resources content
     * @returns {Promise<Array>} - Resources data
     */
    async loadResources() {
        try {
            const content = await this.githubIntegration.getContentFile('', 'resources.json');
            return content || this.defaultContent.resources;
        } catch (error) {
            console.error('Error loading resources content:', error);
            return this.defaultContent.resources;
        }
    }

    /**
     * Save resources content
     * @param {Array} data - Resources data
     * @returns {Promise<Object>} - Response data
     */
    async saveResources(data) {
        try {
            const message = `Update resources and links - ${new Date().toISOString()}`;
            return await this.githubIntegration.saveContentData('', 'resources.json', data, message);
        } catch (error) {
            console.error('Error saving resources content:', error);
            throw error;
        }
    }

    /**
     * Load all content
     * @returns {Promise<Object>} - All content data
     */
    async loadAllContent() {
        try {
            const [hero, schedule, facilitators, categories, navigation, contact, resources] = await Promise.all([
                this.loadHeroContent(),
                this.loadSchedule(),
                this.loadFacilitators(),
                this.loadCategories(),
                this.loadNavigation(),
                this.loadContact(),
                this.loadResources()
            ]);

            return {
                hero,
                schedule,
                facilitators,
                categories,
                navigation,
                contact,
                resources
            };
        } catch (error) {
            console.error('Error loading all content:', error);
            return this.defaultContent;
        }
    }

    /**
     * Save all content
     * @param {Object} data - All content data
     * @returns {Promise<Array>} - Array of response data
     */
    async saveAllContent(data) {
        try {
            const timestamp = new Date().toISOString();
            const promises = [];

            if (data.hero) {
                promises.push(this.saveHeroContent(data.hero));
            }
            if (data.schedule) {
                promises.push(this.saveSchedule(data.schedule));
            }
            if (data.facilitators) {
                promises.push(this.saveFacilitators(data.facilitators));
            }
            if (data.categories) {
                promises.push(this.saveCategories(data.categories));
            }
            if (data.navigation) {
                promises.push(this.saveNavigation(data.navigation));
            }
            if (data.contact) {
                promises.push(this.saveContact(data.contact));
            }
            if (data.resources) {
                promises.push(this.saveResources(data.resources));
            }

            return await Promise.all(promises);
        } catch (error) {
            console.error('Error saving all content:', error);
            throw error;
        }
    }

    /**
     * Initialize content directory structure
     * @returns {Promise<boolean>} - True if successful
     */
    async initializeContentStructure() {
        try {
            // Check if content directory exists
            const contentExists = await this.githubIntegration.getContent(this.githubIntegration.contentPath);
            
            if (!contentExists) {
                // Create content directory with initial files
                const initialContent = this.defaultContent;
                
                await this.saveAllContent(initialContent);
                console.log('Content directory structure initialized');
            }
            
            return true;
        } catch (error) {
            console.error('Error initializing content structure:', error);
            return false;
        }
    }

    /**
     * Export content to JSON file
     * @param {Object} data - Content data to export
     * @param {string} filename - Export filename
     */
    exportContent(data, filename = 'gwac-content-export.json') {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting content:', error);
            throw error;
        }
    }

    /**
     * Import content from JSON file
     * @param {File} file - JSON file to import
     * @returns {Promise<Object>} - Parsed content data
     */
    async importContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target.result);
                    resolve(content);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Validate content structure
     * @param {Object} content - Content to validate
     * @returns {Object} - Validation result
     */
    validateContent(content) {
        const errors = [];
        const warnings = [];
        
        // Check required sections
        const requiredSections = ['hero', 'schedule', 'facilitators', 'categories', 'navigation', 'contact', 'resources'];
        
        requiredSections.forEach(section => {
            if (!content[section]) {
                errors.push(`Missing required section: ${section}`);
            }
        });
        
        // Validate hero section
        if (content.hero) {
            if (!content.hero.title) {
                errors.push('Hero section missing title');
            }
            if (!content.hero.stats) {
                warnings.push('Hero section missing statistics');
            }
        }
        
        // Validate facilitators
        if (content.facilitators && Array.isArray(content.facilitators)) {
            content.facilitators.forEach((facilitator, index) => {
                if (!facilitator.name) {
                    errors.push(`Facilitator ${index + 1} missing name`);
                }
                if (!facilitator.institution) {
                    warnings.push(`Facilitator ${index + 1} missing institution`);
                }
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}
