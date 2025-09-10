#!/usr/bin/env python3

# Read the current index.html
with open('index.html', 'r') as f:
    content = f.read()

# Add session links to Day 2 - Modeling sessions
# Day 2 - Modeling I
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Jean Claude Dejon Agobé and James Azam</span>
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
                                                <span class="name">Jean Claude Dejon Agobé and James Azam</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Vincent Donkoh, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/disease-modeling.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/sir-models.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Model Examples
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 2 - Modeling II (after exercises)
content = content.replace(
    '''                                        <div class="exercise-topics">
                                            <h5>Exercises on:</h5>
                                            <ul>
                                                <li>Overview of infectious diseases and control measures</li>
                                                <li>Basics of infectious disease modeling</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="exercise-topics">
                                            <h5>Exercises on:</h5>
                                            <ul>
                                                <li>Overview of infectious diseases and control measures</li>
                                                <li>Basics of infectious disease modeling</li>
                                            </ul>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/modeling-exercises.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Exercise Sheets
                                            </a>
                                            <a href="labs/modeling-lab.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Lab Session
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 3 - Opening Ceremony
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Chair:</span>
                                                <span class="name">Prof. Christian Agyare, Provost, CHS KNUST</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Speakers:</span>
                                                <span class="name">Dr. John Amuasi, Director, G-WAC, KNUST; Prof. Wilm Quentin, Director, G-WAC, TU Berlin</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Moderator:</span>
                                                <span class="name">Dr. Daniel Opoku, G-WAC KNUST</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Chair:</span>
                                                <span class="name">Prof. Christian Agyare, Provost, CHS KNUST</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Speakers:</span>
                                                <span class="name">Dr. John Amuasi, Director, G-WAC, KNUST; Prof. Wilm Quentin, Director, G-WAC, TU Berlin</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Moderator:</span>
                                                <span class="name">Dr. Daniel Opoku, G-WAC KNUST</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="#about-gwac" class="session-link">
                                                <i class="fas fa-book"></i> About G-WAC
                                            </a>
                                            <a href="https://g-wac.org/" class="session-link" target="_blank">
                                                <i class="fas fa-info-circle"></i> G-WAC Website
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 3 - Model simulation
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">James Azam, Vincent Donkoh</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Andrzej Jarynowski, Jean Claude Dejon Agobé, Vincent Donkoh, Opanin Adu Agyei, Charlène Naomie Tedto Mfangnia, James Azam, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">James Azam, Vincent Donkoh</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Andrzej Jarynowski, Jean Claude Dejon Agobé, Vincent Donkoh, Opanin Adu Agyei, Charlène Naomie Tedto Mfangnia, James Azam, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/odin-intro.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/odin-intro.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Simulation Lab
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 3 - SIR Extensions
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">James Azam</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports & Exercise Supervision:</span>
                                                <span class="name">Vincent Donkoh, Opanin Adu Agyei, Jean Claude Dejon Agobé, Andrzej Jarynowski, Charlène Naomie Tedto Mfangnia</span>
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
                                                <span class="role">Supports & Exercise Supervision:</span>
                                                <span class="name">Vincent Donkoh, Opanin Adu Agyei, Jean Claude Dejon Agobé, Andrzej Jarynowski, Charlène Naomie Tedto Mfangnia</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/sir-extensions.html" class="session-link">
                                                <i class="fas fa-book"></i> Course Materials
                                            </a>
                                            <a href="labs/sir-extensions.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Assignments
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 4 - Model Calibration
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">James Azam</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Vincent Donkoh, Andrzej Jarynowski, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
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
                                                <span class="name">Vincent Donkoh, Andrzej Jarynowski, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/data-curation.html" class="session-link">
                                                <i class="fas fa-database"></i> Data Resources
                                            </a>
                                            <a href="labs/model-fitting.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Fitting Methods
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 4 - Implementation
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="support-instructor">
                                                <span class="role">Exercise Supervision:</span>
                                                <span class="name">James Azam, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="support-instructor">
                                                <span class="role">Exercise Supervision:</span>
                                                <span class="name">James Azam, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/fitting-lab.html" class="session-link">
                                                <i class="fas fa-laptop-code"></i> Lab Session
                                            </a>
                                            <a href="labs/fitting-exercises.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Practice Exercises
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 5 - Scenario Modeling
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Andrzej Jarynowski and Gesine Meyer-Rath</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">James Azam, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="exercise-topics">
                                            <h5>Exercise on scenario modeling</h5>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Andrzej Jarynowski and Gesine Meyer-Rath</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">James Azam, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="exercise-topics">
                                            <h5>Exercise on scenario modeling</h5>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/scenario-modeling.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Scenario Methods
                                            </a>
                                            <a href="labs/scenario-exercises.html" class="session-link">
                                                <i class="fas fa-tasks"></i> Exercise on Scenario Modeling
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 5 - Health Economics
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Brian Adu Asare</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Andrzej Jarynowski, James Azam, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei, Daniel Boateng, Daniel Opoku</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Brian Adu Asare</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supports:</span>
                                                <span class="name">Andrzej Jarynowski, James Azam, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei, Daniel Boateng, Daniel Opoku</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="labs/health-economics.html" class="session-link">
                                                <i class="fas fa-chart-line"></i> Economic Methods
                                            </a>
                                            <a href="labs/mpox-case-study.html" class="session-link">
                                                <i class="fas fa-book"></i> Mpox Case Study
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 6 - Science Communication
content = content.replace(
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Daniel Opoku & Daniel Boateng</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supervision:</span>
                                                <span class="name">James Azam, Andrzej Jarynowski, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="exercise-topics">
                                            <h5>Group projects (allocations & overview):</h5>
                                            <p><strong>This year's projects:</strong> COVID-19 in West Africa (Andrzej), Malaria spread under vaccination (Charlène)</p>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="instructor-details">
                                            <div class="main-instructor">
                                                <span class="role">Main:</span>
                                                <span class="name">Daniel Opoku & Daniel Boateng</span>
                                            </div>
                                            <div class="support-instructor">
                                                <span class="role">Supervision:</span>
                                                <span class="name">James Azam, Andrzej Jarynowski, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="exercise-topics">
                                            <h5>Group projects (allocations & overview):</h5>
                                            <p><strong>This year's projects:</strong> COVID-19 in West Africa (Andrzej), Malaria spread under vaccination (Charlène)</p>
                                        </div>
                                        <div class="session-links">
                                            <a href="courses.html#science-communication" class="session-link">
                                                <i class="fas fa-comments"></i> Communication Tools
                                            </a>
                                            <a href="courses.html#data-visualization" class="session-link">
                                                <i class="fas fa-chart-bar"></i> Visualization Methods
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 8, 9 - Group Projects
for day in ['monday-sept8', 'tuesday-sept9']:
    content = content.replace(
        '''                                        <div class="instructor-details">
                                            <div class="support-instructor">
                                                <span class="role">Supervision:</span>
                                                <span class="name">James Azam, Andrzej Jarynowski, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>''',
        '''                                        <div class="instructor-details">
                                            <div class="support-instructor">
                                                <span class="role">Supervision:</span>
                                                <span class="name">James Azam, Andrzej Jarynowski, Vincent Donkoh, Jean Claude Dejon Agobé, Charlène Naomie Tedto Mfangnia, Opanin Adu Agyei</span>
                                            </div>
                                        </div>
                                        <div class="session-links">
                                            <a href="courses.html#group-projects" class="session-link">
                                                <i class="fas fa-users"></i> Project Resources
                                            </a>
                                            <a href="courses.html#project-guidance" class="session-link">
                                                <i class="fas fa-lightbulb"></i> Project Guidance
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
    )

# Day 10 - Group Presentations
content = content.replace(
    '''                                    <div class="session-content">
                                        <p>Final project presentations and course feedback</p>
                                    </div>
                                </div>''',
    '''                                    <div class="session-content">
                                        <p>Final project presentations and course feedback</p>
                                        <div class="session-links">
                                            <a href="courses.html#project-presentations" class="session-link">
                                                <i class="fas fa-presentation"></i> Presentation Guidelines
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Day 10 - Network Launch
content = content.replace(
    '''                                        <div class="exercise-topics">
                                            <h5>G-WAC NETWORK OF MODELERS FOR PANDEMIC PREPAREDNESS AND RESPONSE</h5>
                                            <p>G-WAC invites you to the inauguration of new members into the G-WAC Network of Modelers for Pandemic Preparedness and Response (G-WAC MPPR Network). This network is to collaborate and contribute high-quality modelling evidence to inform decisions in the management of epidemics and pandemics as well as endemic diseases across Africa.</p>
                                        </div>
                                    </div>
                                </div>''',
    '''                                        <div class="exercise-topics">
                                            <h5>G-WAC NETWORK OF MODELERS FOR PANDEMIC PREPAREDNESS AND RESPONSE</h5>
                                            <p>G-WAC invites you to the inauguration of new members into the G-WAC Network of Modelers for Pandemic Preparedness and Response (G-WAC MPPR Network). This network is to collaborate and contribute high-quality modelling evidence to inform decisions in the management of epidemics and pandemics as well as endemic diseases across Africa.</p>
                                        </div>
                                        <div class="session-links">
                                            <a href="courses.html#network-launch" class="session-link">
                                                <i class="fas fa-network-wired"></i> Network Details
                                            </a>
                                            <a href="courses.html#launch-program" class="session-link">
                                                <i class="fas fa-calendar-alt"></i> Launch Program
                                            </a>
                                        </div>
                                    </div>
                                </div>'''
)

# Write the updated content
with open('index.html', 'w') as f:
    f.write(content)

print("All session links added successfully!")
