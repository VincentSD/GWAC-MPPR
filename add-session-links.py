#!/usr/bin/env python3

# Read the current index.html
with open('index.html', 'r') as f:
    content = f.read()

# Define session links for each day based on the original structure
session_links = {
    'monday-sept1': {
        'r-programming': '''                                        <div class="session-links">
                                            <a href="#course-materials" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="https://github.com/jamesmbaazam/mppr/tree/main/tutorials/R" class="session-link" target="_blank">
                                                <i class="fas fa-laptop-code"></i> R Tutorials (GitHub)
                                            </a>
                                            <a href="https://drive.google.com/drive/folders/1MYPl2YaE5aALSVrOV8EdJre2V85gTjpd" class="session-link" target="_blank">
                                                <i class="fas fa-presentation"></i> Presentations (Drive)
                                            </a>
                                        </div>''',
        'git-github': '''                                        <div class="session-links">
                                            <a href="labs/git-basics.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/git-basics.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Lab Exercises
                                            </a>
                                        </div>'''
    },
    'tuesday-sept2': {
        'modeling-i': '''                                        <div class="session-links">
                                            <a href="labs/disease-modeling.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/sir-models.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Model Examples
                                            </a>
                                        </div>''',
        'modeling-ii': '''                                        <div class="session-links">
                                            <a href="labs/modeling-exercises.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Exercise Sheets
                                            </a>
                                            <a href="labs/modeling-lab.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Lab Session
                                            </a>
                                        </div>'''
    },
    'wednesday-sept3': {
        'opening': '''                                        <div class="session-links">
                                            <a href="#about-gwac" class="session-link">
                                                <i class="fas fa-book"></i> About G-WAC
                                            </a>
                                            <a href="https://g-wac.org/" class="session-link" target="_blank">
                                                <i class="fas fa-info-circle"></i> G-WAC Website
                                            </a>
                                        </div>''',
        'modeling': '''                                        <div class="session-links">
                                            <a href="labs/odin-intro.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/odin-intro.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Simulation Lab
                                            </a>
                                        </div>''',
        'sir-extensions': '''                                        <div class="session-links">
                                            <a href="labs/sir-extensions.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/sir-extensions.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Assignments
                                            </a>
                                        </div>'''
    },
    'thursday-sept4': {
        'calibration': '''                                        <div class="session-links">
                                            <a href="labs/data-curation.html" class="session-link">
                                                <i class="fas fa-database"></i> Data Resources
                                            </a>
                                            <a href="labs/model-fitting.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Fitting Methods
                                            </a>
                                        </div>''',
        'implementation': '''                                        <div class="session-links">
                                            <a href="labs/fitting-lab.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Lab Session
                                            </a>
                                            <a href="labs/fitting-exercises.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Practice Exercises
                                            </a>
                                        </div>'''
    },
    'friday-sept5': {
        'scenario': '''                                        <div class="session-links">
                                            <a href="labs/scenario-modeling.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Scenario Methods
                                            </a>
                                            <a href="labs/scenario-exercises.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Exercise on Scenario Modeling
                                            </a>
                                        </div>''',
        'economics': '''                                        <div class="session-links">
                                            <a href="labs/health-economics.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Economic Methods
                                            </a>
                                            <a href="labs/mpox-case-study.html" class="session-link">
                                                <i class="fas fa-book"></i> Mpox Case Study
                                            </a>
                                        </div>'''
    },
    'saturday-sept6': {
        'communication': '''                                        <div class="session-links">
                                            <a href="courses.html#science-communication" class="session-link">
                                                <i class="fas fa-comments"></i> Communication Tools
                                            </a>
                                            <a href="courses.html#data-visualization" class="session-link">
                                                <i class="fas fa-chart-bar"></i> Visualization Methods
                                            </a>
                                        </div>''',
        'projects': '''                                        <div class="session-links">
                                            <a href="courses.html#group-projects" class="session-link">
                                                <i class="fas fa-users"></i> Project Overview
                                            </a>
                                            <a href="courses.html#project-allocation" class="session-link">
                                                <i class="fas fa-tasks"></i> Project Allocation
                                            </a>
                                        </div>'''
    },
    'monday-sept8': {
        'projects': '''                                        <div class="session-links">
                                            <a href="courses.html#group-projects" class="session-link">
                                                <i class="fas fa-users"></i> Project Resources
                                            </a>
                                            <a href="courses.html#project-guidance" class="session-link">
                                                <i class="fas fa-lightbulb"></i> Project Guidance
                                            </a>
                                        </div>'''
    },
    'tuesday-sept9': {
        'projects': '''                                        <div class="session-links">
                                            <a href="courses.html#group-projects" class="session-link">
                                                <i class="fas fa-users"></i> Project Resources
                                            </a>
                                            <a href="courses.html#project-guidance" class="session-link">
                                                <i class="fas fa-lightbulb"></i> Project Guidance
                                            </a>
                                        </div>'''
    },
    'wednesday-sept10': {
        'presentations': '''                                        <div class="session-links">
                                            <a href="courses.html#project-presentations" class="session-link">
                                                <i class="fas fa-presentation"></i> Presentation Guidelines
                                            </a>
                                        </div>''',
        'network': '''                                        <div class="session-links">
                                            <a href="courses.html#network-launch" class="session-link">
                                                <i class="fas fa-network-wired"></i> Network Details
                                            </a>
                                            <a href="courses.html#launch-program" class="session-link">
                                                <i class="fas fa-calendar-alt"></i> Launch Program
                                            </a>
                                        </div>'''
    }
}

# Add session links to specific sessions
# Day 1 - R Programming session
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">James Azam</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Vincent Donkoh, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">James Azam</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Vincent Donkoh, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="#course-materials" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="https://github.com/jamesmbaazam/mppr/tree/main/tutorials/R" class="session-link" target="_blank">
                                                <i class="fas fa-laptop-code"></i> R Tutorials (GitHub)
                                            </a>
                                            <a href="https://drive.google.com/drive/folders/1MYPl2YaE5aALSVrOV8EdJre2V85gTjpd" class="session-link" target="_blank">
                                                <i class="fas fa-presentation"></i> Presentations (Drive)
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 1 - Git/GitHub session
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Vincent Donkoh</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">James Azam, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Vincent Donkoh</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">James Azam, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/git-basics.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/git-basics.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Lab Exercises
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Write the updated content
with open('index.html', 'w') as f:
    f.write(content)

print("Session links added successfully!")
