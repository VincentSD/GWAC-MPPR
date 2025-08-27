// Interactive Code Execution System for G-WAC Short Course
class CodeExecutionSystem {
    constructor() {
        this.gitHistory = [];
        this.rCodeResults = [];
        this.init();
    }

    init() {
        this.setupGitTerminal();
        this.setupRStudio();
        this.setupRStudioEnhanced(); // Add enhanced functionality
        this.setupCopyButtons();
    }

    setupGitTerminal() {
        const gitCommandInput = document.getElementById('git-command');
        if (gitCommandInput) {
            gitCommandInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.executeGitCommand(gitCommandInput.value);
                    gitCommandInput.value = '';
                }
            });
        }
    }

    setupRStudio() {
        // R Studio tab switching
        const tabs = document.querySelectorAll('.r-studio-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.switchRStudioTab(tab.textContent);
            });
        });
    }

    setupCopyButtons() {
        // Setup copy functionality for code blocks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                const codeId = e.target.getAttribute('onclick')?.match(/copyCode\('([^']+)'\)/)?.[1];
                if (codeId) {
                    this.copyCodeToClipboard(codeId);
                }
            }
        });
    }

    executeGitCommand(command) {
        const output = document.getElementById('git-output');
        if (!output) return;

        const commandLower = command.toLowerCase().trim();
        let response = '';

        // Simulate Git command responses
        switch (commandLower) {
            case 'git init':
                response = `
                    <p>Initialized empty Git repository in .git/</p>
                    <p>✓ Repository created successfully!</p>
                `;
                this.gitHistory.push({ command: 'git init', success: true });
                break;

            case 'git status':
                response = `
                    <p>On branch main</p>
                    <p>No commits yet</p>
                    <p>nothing to commit (working tree clean)</p>
                `;
                break;

            case 'git add .':
                response = `
                    <p>✓ All files staged for commit</p>
                    <p>Ready to commit your changes!</p>
                `;
                this.gitHistory.push({ command: 'git add .', success: true });
                break;

            case 'git commit -m "initial commit"':
            case 'git commit -m "first commit"':
                response = `
                    <p>[main (root-commit) abc1234] initial commit</p>
                    <p>1 file changed, 25 insertions(+)</p>
                    <p>✓ Commit created successfully!</p>
                `;
                this.gitHistory.push({ command: 'git commit', success: true });
                break;

            case 'git log':
                response = `
                    <p>commit abc1234 (HEAD -> main)</p>
                    <p>Author: Student <student@example.com></p>
                    <p>Date: ${new Date().toLocaleString()}</p>
                    <p>    initial commit</p>
                `;
                break;

            case 'git branch':
                response = `
                    <p>* main</p>
                    <p>✓ You're currently on the main branch</p>
                `;
                break;

            case 'git branch feature':
                response = `
                    <p>✓ New branch 'feature' created</p>
                    <p>Use 'git checkout feature' to switch to it</p>
                `;
                this.gitHistory.push({ command: 'git branch feature', success: true });
                break;

            case 'git checkout feature':
                response = `
                    <p>Switched to branch 'feature'</p>
                    <p>✓ Now working on feature branch</p>
                `;
                this.gitHistory.push({ command: 'git checkout feature', success: true });
                break;

            case 'git merge feature':
                response = `
                    <p>Updating abc1234..def5678</p>
                    <p>Fast-forward</p>
                    <p>✓ Feature branch merged successfully!</p>
                `;
                this.gitHistory.push({ command: 'git merge feature', success: true });
                break;

            case 'help':
            case 'git help':
                response = `
                    <p><strong>Available Git Commands:</strong></p>
                    <ul>
                        <li><code>git init</code> - Initialize a new repository</li>
                        <li><code>git status</code> - Check repository status</li>
                        <li><code>git add .</code> - Stage all changes</li>
                        <li><code>git commit -m "message"</code> - Commit changes</li>
                        <li><code>git log</code> - View commit history</li>
                        <li><code>git branch</code> - List branches</li>
                        <li><code>git branch name</code> - Create new branch</li>
                        <li><code>git checkout name</code> - Switch branches</li>
                        <li><code>git merge name</code> - Merge branches</li>
                    </ul>
                `;
                break;

            default:
                if (commandLower.startsWith('git ')) {
                    response = `
                        <p>❌ Command not recognized: ${command}</p>
                        <p>Type <code>help</code> to see available commands</p>
                    `;
                    this.gitHistory.push({ command: command, success: false });
                } else if (commandLower.trim()) {
                    response = `
                        <p>❌ Command not found: ${command}</p>
                        <p>Try using <code>git</code> commands or type <code>help</code></p>
                    `;
                }
                break;
        }

        if (response) {
            output.innerHTML = response;
            this.animateOutput(output);
        }
    }

    animateOutput(output) {
        output.style.opacity = '0';
        output.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            output.style.transition = 'all 0.3s ease';
            output.style.opacity = '1';
            output.style.transform = 'translateY(0)';
        }, 100);
    }

    switchRStudioTab(tabName) {
        // Handle R Studio tab switching
        const tabs = document.querySelectorAll('.r-studio-tabs .tab');
        tabs.forEach(tab => {
            if (tab.textContent === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update content based on tab
        this.updateRStudioContent(tabName);
    }

    updateRStudioContent(tabName) {
        const output = document.getElementById('odin-output');
        if (!output) return;

        switch (tabName) {
            case 'Console':
                output.innerHTML = `
                    <p><strong>R Console Output:</strong></p>
                    <p>Ready to execute R code...</p>
                    <p>Type your commands or click "Run Code" to execute the SIR model.</p>
                `;
                break;
            case 'Plots':
                output.innerHTML = `
                    <p><strong>Plots Panel:</strong></p>
                    <p>Graphical output will appear here when you run plotting code.</p>
                    <p>Try running the SIR model to see the epidemic curve!</p>
                `;
                break;
            default:
                output.innerHTML = `
                    <p>Click "Run Code" to execute this SIR model simulation!</p>
                `;
        }
    }

    runOdinCode() {
        const output = document.getElementById('odin-output');
        if (!output) return;

        // Simulate R code execution
        output.innerHTML = `
            <div class="code-execution-result">
                <p><strong>Executing R code...</strong></p>
                <div class="loading-animation">⏳</div>
            </div>
        `;

        // Simulate processing time
        setTimeout(() => {
            this.showOdinResults(output);
            // Update the plot after code execution
            this.updatePlot();
        }, 1500);
    }

    // Enhanced R Studio functionality
    setupRStudioEnhanced() {
        const codeEditor = document.getElementById('odin-code');
        if (codeEditor) {
            // Make the code editable
            codeEditor.contentEditable = true;
            codeEditor.addEventListener('input', () => {
                this.updateCodeDisplay();
            });
        }

        // Setup parameter controls (now in HTML)
        this.setupParameterControls();
        
        // Setup plot functionality
        this.setupPlotFunctionality();
    }



    setupParameterControls() {
        const betaSlider = document.getElementById('beta-param');
        const gammaSlider = document.getElementById('gamma-param');
        const populationSlider = document.getElementById('population-param');
        const runButton = document.getElementById('run-with-params');

        if (betaSlider) {
            betaSlider.addEventListener('input', (e) => {
                document.getElementById('beta-value').textContent = e.target.value;
                this.updatePlot(); // Update plot when parameters change
            });
        }

        if (gammaSlider) {
            gammaSlider.addEventListener('input', (e) => {
                document.getElementById('gamma-value').textContent = e.target.value;
                this.updatePlot(); // Update plot when parameters change
            });
        }

        if (populationSlider) {
            populationSlider.addEventListener('input', (e) => {
                document.getElementById('population-value').textContent = e.target.value;
                this.updatePlot(); // Update plot when parameters change
            });
        }

        if (runButton) {
            runButton.addEventListener('click', () => {
                this.runWithNewParameters();
            });
        }
    }

    setupPlotFunctionality() {
        const updatePlotButton = document.getElementById('update-plot');
        const downloadPlotButton = document.getElementById('download-plot');

        if (updatePlotButton) {
            updatePlotButton.addEventListener('click', () => {
                this.updatePlot();
            });
        }

        if (downloadPlotButton) {
            downloadPlotButton.addEventListener('click', () => {
                this.downloadPlot();
            });
        }

        // Initialize the plot
        this.updatePlot();
    }

    updatePlot() {
        const canvas = document.getElementById('sir-plot-main');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const beta = parseFloat(document.getElementById('beta-param')?.value || 0.3);
        const gamma = parseFloat(document.getElementById('gamma-param')?.value || 0.1);
        const population = parseInt(document.getElementById('population-param')?.value || 1000);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas size for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        // Simulate SIR model results
        const timeSteps = 100;
        const timeData = [];
        const susceptibleData = [];
        const infectedData = [];
        const recoveredData = [];

        let S = population - 1;
        let I = 1;
        let R = 0;

        for (let t = 0; t <= timeSteps; t++) {
            timeData.push(t);
            susceptibleData.push(S);
            infectedData.push(I);
            recoveredData.push(R);

            // Simple SIR model simulation
            const newInfections = (beta * S * I) / population;
            const newRecoveries = gamma * I;

            S = Math.max(0, S - newInfections);
            I = Math.max(0, I + newInfections - newRecoveries);
            R = Math.max(0, R + newRecoveries);
        }

        // Calculate scales
        const maxY = Math.max(...susceptibleData, ...infectedData, ...recoveredData);
        const scaleX = (canvas.width / dpr - 80) / timeSteps;
        const scaleY = (canvas.height / dpr - 80) / maxY;

        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = 40 + (i * timeSteps / 10) * scaleX;
            ctx.beginPath();
            ctx.moveTo(x, 40);
            ctx.lineTo(x, canvas.height / dpr - 40);
            ctx.stroke();

            const y = 40 + (i * maxY / 10) * scaleY;
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(canvas.width / dpr - 40, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 40);
        ctx.lineTo(40, canvas.height / dpr - 40);
        ctx.lineTo(canvas.width / dpr - 40, canvas.height / dpr - 40);
        ctx.stroke();

        // Draw labels
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Time (days)', canvas.width / dpr / 2, canvas.height / dpr - 10);
        
        ctx.save();
        ctx.translate(20, canvas.height / dpr / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Population', 0, 0);
        ctx.restore();

        // Draw curves
        this.drawCurve(ctx, timeData, susceptibleData, scaleX, scaleY, '#3b82f6', 'Susceptible');
        this.drawCurve(ctx, timeData, infectedData, scaleX, scaleY, '#ef4444', 'Infected');
        this.drawCurve(ctx, timeData, recoveredData, scaleX, scaleY, '#10b981', 'Recovered');

        // Draw legend
        this.drawLegend(ctx, canvas.width / dpr);
    }

    drawCurve(ctx, xData, yData, scaleX, scaleY, color, label) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let i = 0; i < xData.length; i++) {
            const x = 40 + xData[i] * scaleX;
            const y = (ctx.canvas.height / (window.devicePixelRatio || 1)) - 40 - yData[i] * scaleY;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    drawLegend(ctx, canvasWidth) {
        const legendItems = [
            { color: '#3b82f6', label: 'Susceptible' },
            { color: '#ef4444', label: 'Infected' },
            { color: '#10b981', label: 'Recovered' }
        ];

        const legendX = canvasWidth - 150;
        const legendY = 60;
        const itemHeight = 25;

        legendItems.forEach((item, index) => {
            const y = legendY + index * itemHeight;
            
            // Draw color line
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(legendX, y + 10);
            ctx.lineTo(legendX + 20, y + 10);
            ctx.stroke();

            // Draw label
            ctx.fillStyle = '#1e293b';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, legendX + 30, y + 15);
        });
    }

    downloadPlot() {
        const canvas = document.getElementById('sir-plot-main');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'sir-model-plot.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    runWithNewParameters() {
        const output = document.getElementById('odin-output');
        if (!output) return;

        const beta = parseFloat(document.getElementById('beta-param').value);
        const gamma = parseFloat(document.getElementById('gamma-param').value);
        const population = parseInt(document.getElementById('population-param').value);
        const r0 = (beta / gamma).toFixed(2);

        // Simulate running with new parameters
        output.innerHTML = `
            <div class="code-execution-result">
                <p><strong>✓ Code executed successfully with new parameters!</strong></p>
                <div class="result-section">
                    <h4>Model Output:</h4>
                    <ul>
                        <li>✓ SIR model compiled successfully</li>
                        <li>✓ Model parameters set: N=${population}, β=${beta}, γ=${gamma}</li>
                        <li>✓ Simulation completed: 1000 time steps</li>
                        <li>✓ Plot generated: Epidemic curve</li>
                    </ul>
                </div>
                <div class="result-section">
                    <h4>Key Results:</h4>
                    <ul>
                        <li>Basic reproduction number (R₀): ${r0}</li>
                        <li>Peak infections: ~${Math.round(population * 0.3)} individuals</li>
                        <li>Final recovered: ~${Math.round(population * 0.95)} individuals</li>
                        <li>Epidemic duration: ~${Math.round(100 / gamma)} days</li>
                    </ul>
                </div>
                <div class="result-section">
                    <h4>Parameter Impact:</h4>
                    <p>With β=${beta} and γ=${gamma}, the disease will ${r0 > 1 ? 'spread' : 'not spread'} in the population. 
                    ${r0 > 1 ? `The epidemic will peak around day ${Math.round(50 / gamma)}.` : 'The disease will die out quickly.'}</p>
                </div>
            </div>
        `;
    }

    updateCodeDisplay() {
        // This would update the code display when editing
        // For now, just a placeholder
        console.log('Code updated');
    }

    showOdinResults(output) {
        const results = `
            <div class="code-execution-result">
                <p><strong>✓ Code executed successfully!</strong></p>
                <div class="result-section">
                    <h4>Model Output:</h4>
                    <ul>
                        <li>✓ SIR model compiled successfully</li>
                        <li>✓ Model parameters set: N=1000, β=0.3, γ=0.1</li>
                        <li>✓ Simulation completed: 1000 time steps</li>
                        <li>✓ Plot generated: Epidemic curve</li>
                    </ul>
                </div>
                <div class="result-section">
                    <h4>Key Results:</h4>
                    <ul>
                        <li>Peak infections: ~300 individuals at day 15</li>
                        <li>Final recovered: ~950 individuals</li>
                        <li>Basic reproduction number (R₀): 3.0</li>
                    </ul>
                </div>
                <div class="result-section">
                    <h4>Next Steps:</h4>
                    <p>Try modifying the parameters (β, γ) to see how they affect the epidemic dynamics!</p>
                </div>
            </div>
        `;

        output.innerHTML = results;
        this.animateOutput(output);
    }

    resetOdinCode() {
        // Reset parameter controls to default values
        const betaSlider = document.getElementById('beta-param');
        const gammaSlider = document.getElementById('gamma-param');
        const populationSlider = document.getElementById('population-param');

        if (betaSlider) betaSlider.value = 0.3;
        if (gammaSlider) gammaSlider.value = 0.1;
        if (populationSlider) populationSlider.value = 1000;

        // Update display values
        document.getElementById('beta-value').textContent = '0.3';
        document.getElementById('gamma-value').textContent = '0.1';
        document.getElementById('population-value').textContent = '1000';

        // Reset output
        const output = document.getElementById('odin-output');
        if (output) {
            output.innerHTML = '<p>Click "Run Code" to execute this SIR model simulation!</p>';
        }

        // Update plot with reset parameters
        this.updatePlot();
    }

    resetOdinCode() {
        const output = document.getElementById('odin-output');
        if (output) {
            output.innerHTML = `
                <p>Click "Run Code" to execute this SIR model simulation!</p>
            `;
        }
    }

    copyCodeToClipboard(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;

        const text = codeElement.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopySuccess(codeId);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                this.fallbackCopyTextToClipboard(text, codeId);
            });
        } else {
            this.fallbackCopyTextToClipboard(text, codeId);
        }
    }

    fallbackCopyTextToClipboard(text, codeId) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(codeId);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess(codeId) {
        const copyBtn = document.querySelector(`[onclick*="${codeId}"]`);
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }

    // Get execution statistics
    getExecutionStats() {
        return {
            gitCommands: this.gitHistory.length,
            successfulGitCommands: this.gitHistory.filter(cmd => cmd.success).length,
            rCodeExecutions: this.rCodeResults.length,
            lastExecution: this.rCodeResults.length > 0 ? this.rCodeResults[this.rCodeResults.length - 1] : null
        };
    }

    // Export for use in other modules
    exportResults() {
        return {
            gitHistory: this.gitHistory,
            rCodeResults: this.rCodeResults,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize code execution system
let codeExecutionSystem;

document.addEventListener('DOMContentLoaded', () => {
    codeExecutionSystem = new CodeExecutionSystem();
});

// Global functions for HTML onclick handlers
function runOdinCode() {
    if (codeExecutionSystem) {
        codeExecutionSystem.runOdinCode();
    }
}

function resetOdinCode() {
    if (codeExecutionSystem) {
        codeExecutionSystem.resetOdinCode();
    }
}

function copyCode(codeId) {
    if (codeExecutionSystem) {
        codeExecutionSystem.copyCodeToClipboard(codeId);
    }
}

// Export for use in other modules
window.CodeExecutionSystem = CodeExecutionSystem;
