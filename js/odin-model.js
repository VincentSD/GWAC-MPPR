// Enhanced Odin Model JavaScript for G-WAC Short Course
class OdinModelManager {
    constructor() {
        this.currentModel = null;
        this.currentResult = null;
        this.init();
    }

    init() {
        try {
            console.log('Initializing Odin Model Manager...');
            
            // Wait a bit for DOM to be fully ready
            setTimeout(() => {
                this.setupMainTabSwitching();
                this.setupOutputTabSwitching();
                this.setupParameterControls();
                this.setupEventListeners();
                this.initializeCanvas();
                
                // Ensure Plots tab is active and visible
                this.ensurePlotsTabActive();
                
                // Run the model automatically on page load to show initial results
                setTimeout(() => {
                    console.log('Auto-running model on page load...');
                    this.runModelWithParameters();
                }, 1000);
            }, 100);
            
        } catch (error) {
            console.error('Error in Odin Model Manager init:', error);
        }
    }

    setupMainTabSwitching() {
        const mainTabs = document.querySelectorAll('.r-studio-tabs .tab');
        const mainTabContents = document.querySelectorAll('.r-studio-tab-content');

        mainTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update active tab
                mainTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                mainTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-tab`) {
                        content.classList.add('active');
                        
                        // If plots tab becomes active, ensure canvas is properly sized and redraw
                        if (content.id === 'plots-tab') {
                            setTimeout(() => {
                                this.initializeCanvas();
                                if (this.currentResult) {
                                    this.updatePlot(this.currentResult);
                                }
                            }, 100);
                        }
                    }
                });
            });
        });
    }

    ensurePlotsTabActive() {
        try {
            console.log('Ensuring Plots tab is active...');
            
            // Make sure Plots tab is active by default
            const plotsTab = document.querySelector('.r-studio-tabs .tab[data-tab="plots"]');
            const plotsContent = document.getElementById('plots-tab');
            
            console.log('Plots tab element:', plotsTab);
            console.log('Plots content element:', plotsContent);
            
            if (plotsTab && plotsContent) {
                // Remove active from all tabs and content
                document.querySelectorAll('.r-studio-tabs .tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.r-studio-tab-content').forEach(c => c.classList.remove('active'));
                
                // Activate Plots tab
                plotsTab.classList.add('active');
                plotsContent.classList.add('active');
                
                console.log('Plots tab activated successfully');
            } else {
                console.error('Could not find Plots tab elements!');
            }
        } catch (error) {
            console.error('Error in ensurePlotsTabActive:', error);
        }
    }

    setupOutputTabSwitching() {
        const outputTabs = document.querySelectorAll('.output-tab');
        const outputContents = document.querySelectorAll('.output-content');

        outputTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update active tab
                outputTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                outputContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    setupParameterControls() {
        // Setup slider value updates
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });
        });

        // Setup run with parameters button
        const runWithParamsBtn = document.getElementById('run-with-params');
        if (runWithParamsBtn) {
            runWithParamsBtn.addEventListener('click', () => {
                this.runModelWithParameters();
            });
        }
    }

    setupEventListeners() {
        // Setup update plot button
        const updatePlotBtn = document.getElementById('update-plot');
        if (updatePlotBtn) {
            updatePlotBtn.addEventListener('click', () => {
                this.updatePlot();
            });
        }

        // Setup download plot button
        const downloadPlotBtn = document.getElementById('download-plot');
        if (downloadPlotBtn) {
            downloadPlotBtn.addEventListener('click', () => {
                this.downloadPlot();
            });
        }
    }

    initializeCanvas() {
        console.log('Initializing canvas...');
        const canvas = document.getElementById('sir-plot-main');
        console.log('Canvas element:', canvas);
        
        if (canvas) {
            // Set canvas size for high DPI displays
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            console.log('Canvas rect:', rect);
            console.log('Device pixel ratio:', dpr);
            
            // Use fallback dimensions if rect is 0
            let width = rect.width || 400;
            let height = rect.height || 300;
            
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            
            // Clear and draw placeholder
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, width, height);
            
            // Draw placeholder text
            ctx.fillStyle = '#6c757d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Loading model...', width / 2, height / 2);
            
            console.log('Canvas initialized successfully with dimensions:', width, 'x', height);
            
            // Set up resize observer to handle dynamic resizing
            if (window.ResizeObserver) {
                const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        const newWidth = entry.contentRect.width;
                        const newHeight = entry.contentRect.height;
                        if (newWidth > 0 && newHeight > 0) {
                            canvas.width = newWidth * dpr;
                            canvas.height = newHeight * dpr;
                            canvas.style.width = newWidth + 'px';
                            canvas.style.height = newHeight + 'px';
                            ctx.scale(dpr, dpr);
                            console.log('Canvas resized to:', newWidth, 'x', newHeight);
                            
                            // Redraw if we have results
                            if (this.currentResult) {
                                this.updatePlot(this.currentResult);
                            }
                        }
                    }
                });
                resizeObserver.observe(canvas);
            }
        } else {
            console.error('Canvas element not found!');
        }
    }

    runModelWithParameters() {
        console.log('Running model with parameters...');
        
        // Get current parameter values
        const beta = parseFloat(document.getElementById('beta-param').value);
        const gamma = parseFloat(document.getElementById('gamma-param').value);
        const population = parseInt(document.getElementById('population-param').value);
        
        console.log('Parameters:', { beta, gamma, population });

        // Update console output
        this.updateConsoleOutput(`Running SIR model with parameters:
β (Transmission Rate): ${beta}
γ (Recovery Rate): ${gamma}
N (Population): ${population}`);

        // Simulate model run (in real implementation, this would call actual R/odin code)
        this.simulateModelRun(beta, gamma, population);
    }

    simulateModelRun(beta, gamma, population) {
        // Simulate SIR model results
        const timeSteps = 100;
        const dt = 1.0;
        const results = {
            time: [],
            S: [],
            I: [],
            R: []
        };

        // Initial conditions
        let S = population - 1;
        let I = 1;
        let R = 0;

        for (let t = 0; t <= timeSteps; t++) {
            results.time.push(t * dt);
            results.S.push(S);
            results.I.push(I);
            results.R.push(R);

            // Simple Euler integration
            const dS = -beta * S * I / population;
            const dI = beta * S * I / population - gamma * I;
            const dR = gamma * I;

            S += dS * dt;
            I += dI * dt;
            R += dR * dt;

            // Ensure non-negative values
            S = Math.max(0, S);
            I = Math.max(0, I);
            R = Math.max(0, R);
        }

        this.currentResult = results;
        this.updateAllOutputs(results);
        this.updateConsoleOutput('Model simulation completed successfully!');
    }

    updateAllOutputs(results) {
        this.updatePlot(results);
        this.updateDataTable(results);
        this.updateSummaryStats(results);
    }

    updatePlot(results) {
        if (!results) {
            results = this.currentResult;
        }
        if (!results) return;

        const canvas = document.getElementById('sir-plot-main');
        if (!canvas) {
            console.error('Canvas element not found in updatePlot');
            return;
        }

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        let width = rect.width;
        let height = rect.height;
        
        console.log('updatePlot called with canvas dimensions:', width, 'x', height);
        console.log('Canvas element:', canvas);
        console.log('Canvas rect:', rect);

        // Check if we have valid dimensions
        if (width <= 0 || height <= 0) {
            console.warn('Canvas has invalid dimensions, using fallback');
            const fallbackWidth = 400;
            const fallbackHeight = 300;
            canvas.width = fallbackWidth;
            canvas.height = fallbackHeight;
            canvas.style.width = fallbackWidth + 'px';
            canvas.style.height = fallbackHeight + 'px';
            width = fallbackWidth;
            height = fallbackHeight;
        }

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Find data ranges
        const maxTime = Math.max(...results.time);
        const maxValue = Math.max(
            Math.max(...results.S),
            Math.max(...results.I),
            Math.max(...results.R)
        );

        // Draw grid
        this.drawGrid(ctx, width, height, maxTime, maxValue);

        // Draw curves
        this.drawCurve(ctx, results.time, results.S, width, height, maxTime, maxValue, '#28a745', 'Susceptible');
        this.drawCurve(ctx, results.time, results.I, width, height, maxTime, maxValue, '#dc3545', 'Infected');
        this.drawCurve(ctx, results.time, results.R, width, height, maxTime, maxValue, '#007bff', 'Recovered');

        // Draw legend
        this.drawLegend(ctx, width, height);
    }

    drawGrid(ctx, width, height, maxTime, maxValue) {
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    drawCurve(ctx, xData, yData, width, height, maxX, maxY, color, label) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let i = 0; i < xData.length; i++) {
            const x = (xData[i] / maxX) * width;
            const y = height - (yData[i] / maxY) * height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    drawLegend(ctx, width, height) {
        const legendItems = [
            { color: '#28a745', label: 'Susceptible' },
            { color: '#dc3545', label: 'Infected' },
            { color: '#007bff', label: 'Recovered' }
        ];

        const legendX = width - 150;
        const legendY = 30;
        const itemHeight = 20;

        legendItems.forEach((item, index) => {
            const y = legendY + index * itemHeight;

            // Draw color line
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(legendX, y + 5);
            ctx.lineTo(legendX + 20, y + 5);
            ctx.stroke();

            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, legendX + 25, y + 12);
        });
    }

    updateDataTable(results) {
        const tableBody = document.getElementById('data-table-body');
        if (!tableBody || !results) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Add data rows (show every 10th point to avoid overwhelming the table)
        for (let i = 0; i < results.time.length; i += 10) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${results.time[i].toFixed(1)}</td>
                <td>${Math.round(results.S[i])}</td>
                <td>${Math.round(results.I[i])}</td>
                <td>${Math.round(results.R[i])}</td>
            `;
            tableBody.appendChild(row);
        }
    }

    updateSummaryStats(results) {
        if (!results) return;

        // Find peak infections
        const maxInfections = Math.max(...results.I);
        const peakTimeIndex = results.I.indexOf(maxInfections);
        const peakTime = results.time[peakTimeIndex];

        // Calculate R₀ (Basic Reproduction Number)
        const beta = parseFloat(document.getElementById('beta-param').value);
        const gamma = parseFloat(document.getElementById('gamma-param').value);
        const rNaught = beta / gamma;

        // Update summary values
        this.updateSummaryValue('peak-infections', Math.round(maxInfections));
        this.updateSummaryValue('peak-time', peakTime.toFixed(1));
        this.updateSummaryValue('total-recovered', Math.round(results.R[results.R.length - 1]));
        this.updateSummaryValue('r-naught', rNaught.toFixed(2));
    }

    updateSummaryValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    updateConsoleOutput(message) {
        const consoleContent = document.querySelector('.console-content');
        if (consoleContent) {
            const timestamp = new Date().toLocaleTimeString();
            const outputLine = document.createElement('p');
            outputLine.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
            consoleContent.appendChild(outputLine);
            
            // Auto-scroll to bottom
            consoleContent.scrollTop = consoleContent.scrollHeight;
        }
    }



    downloadPlot() {
        const canvas = document.getElementById('sir-plot-main');
        if (!canvas) return;

        // Create download link
        const link = document.createElement('a');
        link.download = 'sir-model-plot.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // Public method to run the model
    runModel() {
        this.runModelWithParameters();
    }

    // Public method to reset the model
    resetModel() {
        this.currentResult = null;
        this.initializeCanvas();
        this.updateConsoleOutput('Model reset. Ready for new simulation.');
        
        // Reset parameter sliders to default values
        document.getElementById('beta-param').value = 0.3;
        document.getElementById('beta-value').textContent = '0.3';
        document.getElementById('gamma-param').value = 0.1;
        document.getElementById('gamma-value').textContent = '0.1';
        document.getElementById('population-param').value = 1000;
        document.getElementById('population-value').textContent = '1000';
        
        // Clear data table
        const tableBody = document.getElementById('data-table-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4">Run the model to see data</td></tr>';
        }
        
        // Reset summary stats
        this.updateSummaryValue('peak-infections', '-');
        this.updateSummaryValue('peak-time', '-');
        this.updateSummaryValue('total-recovered', '-');
        this.updateSummaryValue('r-naught', '-');
    }
}

// Initialize Odin Model Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, initializing Odin Model Manager...');
        window.odinModelManager = new OdinModelManager();
    } catch (error) {
        console.error('Error initializing Odin Model Manager:', error);
    }
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM still loading...');
} else {
    try {
        console.log('DOM already loaded, initializing immediately...');
        window.odinModelManager = new OdinModelManager();
    } catch (error) {
        console.error('Error initializing Odin Model Manager immediately:', error);
    }
}

// Global functions for backward compatibility
function runOdinCode() {
    if (window.odinModelManager) {
        window.odinModelManager.runModel();
    }
}

function resetOdinCode() {
    if (window.odinModelManager) {
        window.odinModelManager.resetModel();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OdinModelManager;
}
