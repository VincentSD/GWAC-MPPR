// Odin Model - Interactive SIR Model with Safe Canvas Operations
class OdinModel {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.canvasWidth = 600; // Reduced from 800 for memory efficiency
        this.canvasHeight = 400; // Reduced from 500 for memory efficiency
        this.parameterUpdateTimeout = null;
        this.isInitialized = false;
        
        // Model parameters
        this.parameters = {
            beta: 0.3,
            gamma: 0.1,
            population: 1000,
            initialInfected: 1
        };
        
        // Simulation results
        this.results = null;
        
        console.log('OdinModel: Initialized with safe canvas operations');
    }
    
    setupAfterDOMReady() {
        if (this.isInitialized) return;
        
        try {
            this.initializeCanvas();
            this.setupTabSwitching();
            this.setupParameterControls();
            this.isInitialized = true;
            console.log('OdinModel: Setup completed successfully');
        } catch (error) {
            console.error('OdinModel: Setup error:', error);
        }
    }
    
    initializeCanvas() {
        try {
            this.canvas = document.getElementById('sir-plot-main');
            if (!this.canvas) {
                console.warn('OdinModel: Canvas not found, skipping initialization');
                return;
            }
            
            // Set safe canvas dimensions
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                console.error('OdinModel: Could not get canvas context');
                return;
            }
            
            // Clear canvas and draw initial state
            this.clearCanvas();
            this.drawInitialMessage();
            
            console.log('OdinModel: Canvas initialized successfully');
        } catch (error) {
            console.error('OdinModel: Canvas initialization error:', error);
        }
    }
    
    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }
    
    drawInitialMessage() {
        if (!this.ctx) return;
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Click "Run Simulation" to see the SIR model results', 
                          this.canvasWidth / 2, this.canvasHeight / 2);
    }
    
    setupTabSwitching() {
        try {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetTab = button.getAttribute('data-tab');
                    
                    // Update active states
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    button.classList.add('active');
                    const targetContent = document.getElementById(targetTab + '-tab');
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                    
                    // Update content based on tab
                    this.updateTabContent(targetTab);
                });
            });
            
            console.log('OdinModel: Tab switching setup completed');
        } catch (error) {
            console.error('OdinModel: Tab switching setup error:', error);
        }
    }
    
    setupParameterControls() {
        try {
            // Beta parameter
            const betaSlider = document.getElementById('beta-param');
            const betaValue = document.getElementById('beta-value');
            if (betaSlider && betaValue) {
                betaSlider.addEventListener('input', (e) => {
                    this.parameters.beta = parseFloat(e.target.value);
                    betaValue.textContent = e.target.value;
                    this.debouncedUpdate();
                });
            }
            
            // Gamma parameter
            const gammaSlider = document.getElementById('gamma-param');
            const gammaValue = document.getElementById('gamma-value');
            if (gammaSlider && gammaValue) {
                gammaSlider.addEventListener('input', (e) => {
                    this.parameters.gamma = parseFloat(e.target.value);
                    gammaValue.textContent = e.target.value;
                    this.debouncedUpdate();
                });
            }
            
            // Population parameter
            const populationSlider = document.getElementById('population-param');
            const populationValue = document.getElementById('population-value');
            if (populationSlider && populationValue) {
                populationSlider.addEventListener('input', (e) => {
                    this.parameters.population = parseInt(e.target.value);
                    populationValue.textContent = e.target.value;
                    this.debouncedUpdate();
                });
            }
            
            // Initial infected parameter
            const initialInfectedSlider = document.getElementById('initial-infected-param');
            const initialInfectedValue = document.getElementById('initial-infected-value');
            if (initialInfectedSlider && initialInfectedValue) {
                initialInfectedSlider.addEventListener('input', (e) => {
                    this.parameters.initialInfected = parseInt(e.target.value);
                    initialInfectedValue.textContent = e.target.value;
                    this.debouncedUpdate();
                });
            }
            
            // Run button
            const runButton = document.getElementById('run-model-main');
            if (runButton) {
                runButton.addEventListener('click', () => this.runModel());
            }
            
            // Reset button
            const resetButton = document.getElementById('reset-model-main');
            if (resetButton) {
                resetButton.addEventListener('click', () => this.resetModel());
            }
            
            console.log('OdinModel: Parameter controls setup completed');
        } catch (error) {
            console.error('OdinModel: Parameter controls setup error:', error);
        }
    }
    
    debouncedUpdate() {
        if (this.parameterUpdateTimeout) {
            clearTimeout(this.parameterUpdateTimeout);
        }
        this.parameterUpdateTimeout = setTimeout(() => {
            if (this.results) {
                this.updatePlot();
            }
        }, 300); // 300ms debounce
    }
    
    runModel() {
        try {
            console.log('OdinModel: Running simulation with parameters:', this.parameters);
            
            // Generate SIR model data
            this.results = this.generateSIRData();
            
            // Update all tabs
            this.updatePlot();
            this.updateTable();
            this.updateMetrics();
            
            console.log('OdinModel: Simulation completed successfully');
        } catch (error) {
            console.error('OdinModel: Simulation error:', error);
        }
    }
    
    generateSIRData() {
        const days = 100;
        const dt = 0.1;
        const steps = Math.floor(days / dt);
        
        const S = new Array(steps);
        const I = new Array(steps);
        const R = new Array(steps);
        const time = new Array(steps);
        
        // Initial conditions
        S[0] = this.parameters.population - this.parameters.initialInfected;
        I[0] = this.parameters.initialInfected;
        R[0] = 0;
        time[0] = 0;
        
        // Run simulation using Euler method
        for (let i = 1; i < steps; i++) {
            const N = S[i-1] + I[i-1] + R[i-1];
            
            const dS = -this.parameters.beta * S[i-1] * I[i-1] / N;
            const dI = this.parameters.beta * S[i-1] * I[i-1] / N - this.parameters.gamma * I[i-1];
            const dR = this.parameters.gamma * I[i-1];
            
            S[i] = Math.max(0, S[i-1] + dS * dt);
            I[i] = Math.max(0, I[i-1] + dI * dt);
            R[i] = Math.max(0, R[i-1] + dR * dt);
            time[i] = i * dt;
        }
        
        return { S, I, R, time, steps };
    }
    
    updatePlot() {
        if (!this.ctx || !this.results) return;
        
        try {
            this.clearCanvas();
            this.drawPlot();
        } catch (error) {
            console.error('OdinModel: Plot update error:', error);
        }
    }
    
    drawPlot() {
        if (!this.ctx || !this.results) return;
        
        const { S, I, R, time, steps } = this.results;
        const margin = 50;
        const plotWidth = this.canvasWidth - 2 * margin;
        const plotHeight = this.canvasHeight - 2 * margin;
        
        // Find data ranges
        const maxS = Math.max(...S);
        const maxI = Math.max(...I);
        const maxR = Math.max(...R);
        const maxY = Math.max(maxS, maxI, maxR);
        const maxTime = time[steps - 1];
        
        // Draw axes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(margin, margin);
        this.ctx.lineTo(margin, this.canvasHeight - margin);
        this.ctx.lineTo(this.canvasWidth - margin, this.canvasHeight - margin);
        this.ctx.stroke();
        
        // Draw grid
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
            const x = margin + (i / 10) * plotWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, margin);
            this.ctx.lineTo(x, this.canvasHeight - margin);
            this.ctx.stroke();
            
            const y = margin + (i / 10) * plotHeight;
            this.ctx.beginPath();
            this.ctx.moveTo(margin, y);
            this.ctx.lineTo(this.canvasWidth - margin, y);
            this.ctx.stroke();
        }
        
        // Draw curves
        this.drawCurve(S, time, '#4CAF50', 'Susceptible', margin, plotWidth, plotHeight, maxY, maxTime);
        this.drawCurve(I, time, '#F44336', 'Infected', margin, plotWidth, plotHeight, maxY, maxTime);
        this.drawCurve(R, time, '#2196F3', 'Recovered', margin, plotWidth, plotHeight, maxY, maxTime);
        
        // Draw legend
        this.drawLegend();
        
        // Draw labels
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Time (days)', this.canvasWidth / 2, this.canvasHeight - 10);
        
        this.ctx.save();
        this.ctx.translate(20, this.canvasHeight / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Population', 0, 0);
        this.ctx.restore();
    }
    
    drawCurve(data, time, color, label, margin, plotWidth, plotHeight, maxY, maxTime) {
        if (!this.ctx) return;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < data.length; i++) {
            const x = margin + (time[i] / maxTime) * plotWidth;
            const y = margin + (1 - data[i] / maxY) * plotHeight;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }
    
    drawLegend() {
        if (!this.ctx) return;
        
        const legendY = 30;
        const legendX = this.canvasWidth - 150;
        
        const colors = ['#4CAF50', '#F44336', '#2196F3'];
        const labels = ['Susceptible', 'Infected', 'Recovered'];
        
        colors.forEach((color, i) => {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(legendX, legendY + i * 20, 15, 15);
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(labels[i], legendX + 20, legendY + i * 20 + 12);
        });
    }
    
    updateTable() {
        if (!this.results) return;
        
        try {
            const tableBody = document.getElementById('table-body-main');
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            const { S, I, R, time, steps } = this.results;
            
            // Show every 10th data point to keep table manageable
            for (let i = 0; i < steps; i += 10) {
                const row = document.createElement('tr');
                
                const timeCell = document.createElement('td');
                timeCell.textContent = time[i].toFixed(1);
                row.appendChild(timeCell);
                
                const sCell = document.createElement('td');
                sCell.textContent = Math.round(S[i]);
                row.appendChild(sCell);
                
                const iCell = document.createElement('td');
                iCell.textContent = Math.round(I[i]);
                row.appendChild(iCell);
                
                const rCell = document.createElement('td');
                rCell.textContent = Math.round(R[i]);
                row.appendChild(rCell);
                
                const incidenceCell = document.createElement('td');
                const incidence = i > 0 ? S[i-1] - S[i] : 0;
                incidenceCell.textContent = Math.round(incidence);
                row.appendChild(incidenceCell);
                
                tableBody.appendChild(row);
            }
        } catch (error) {
            console.error('OdinModel: Table update error:', error);
        }
    }
    
    updateMetrics() {
        if (!this.results) return;
        
        try {
            const { S, I, R, time, steps } = this.results;
            
            // Calculate R₀
            const r0 = this.parameters.beta / this.parameters.gamma;
            const r0Element = document.getElementById('r0-value-main');
            if (r0Element) {
                r0Element.textContent = r0.toFixed(2);
            }
            
            // Find peak infections
            const peakInfections = Math.max(...I);
            const peakDay = time[I.indexOf(peakInfections)];
            const peakInfectionsElement = document.getElementById('peak-infections-main');
            const peakDayElement = document.getElementById('peak-day-main');
            
            if (peakInfectionsElement) {
                peakInfectionsElement.textContent = Math.round(peakInfections);
            }
            if (peakDayElement) {
                peakDayElement.textContent = peakDay.toFixed(1);
            }
            
            // Calculate final epidemic size
            const finalSize = this.parameters.population - S[steps - 1];
            const finalSizeElement = document.getElementById('final-size-main');
            if (finalSizeElement) {
                finalSizeElement.textContent = Math.round(finalSize);
            }
        } catch (error) {
            console.error('OdinModel: Metrics update error:', error);
        }
    }
    
    updateTabContent(tabName) {
        switch (tabName) {
            case 'plot-main':
                if (this.results) {
                    this.updatePlot();
                }
                break;
            case 'table-main':
                if (this.results) {
                    this.updateTable();
                }
                break;
            case 'metrics-main':
                if (this.results) {
                    this.updateMetrics();
                }
                break;
            case 'code-main':
                // Code tab is static HTML, no update needed
                break;
        }
    }
    
    clearTable() {
        try {
            const tableBody = document.getElementById('table-body-main');
            if (tableBody) {
                tableBody.innerHTML = '';
            }
            console.log('OdinModel: Table cleared successfully');
        } catch (error) {
            console.error('OdinModel: Table clear error:', error);
        }
    }
    
    clearMetrics() {
        try {
            const r0Value = document.getElementById('r0-value-main');
            const peakInfections = document.getElementById('peak-infections-main');
            const peakDay = document.getElementById('peak-day-main');
            const finalSize = document.getElementById('final-size-main');
            
            if (r0Value) r0Value.textContent = '3.0';
            if (peakInfections) peakInfections.textContent = '-';
            if (peakDay) peakDay.textContent = '-';
            if (finalSize) finalSize.textContent = '-';
            
            console.log('OdinModel: Metrics cleared successfully');
        } catch (error) {
            console.error('OdinModel: Metrics clear error:', error);
        }
    }
    
    resetModel() {
        try {
            // Reset parameters to defaults
            this.parameters = {
                beta: 0.3,
                gamma: 0.1,
                population: 1000,
                initialInfected: 1
            };
            
            // Reset sliders
            const betaSlider = document.getElementById('beta-param');
            const gammaSlider = document.getElementById('gamma-param');
            const populationSlider = document.getElementById('population-param');
            const initialInfectedSlider = document.getElementById('initial-infected-param');
            
            if (betaSlider) betaSlider.value = this.parameters.beta;
            if (gammaSlider) gammaSlider.value = this.parameters.gamma;
            if (populationSlider) populationSlider.value = this.parameters.population;
            if (initialInfectedSlider) initialInfectedSlider.value = this.parameters.initialInfected;
            
            // Update display values
            const betaValue = document.getElementById('beta-value');
            const gammaValue = document.getElementById('gamma-value');
            const populationValue = document.getElementById('population-value');
            const initialInfectedValue = document.getElementById('initial-infected-value');
            
            if (betaValue) betaValue.textContent = this.parameters.beta;
            if (gammaValue) gammaValue.textContent = this.parameters.gamma;
            if (populationValue) populationValue.textContent = this.parameters.population;
            if (initialInfectedValue) initialInfectedValue.textContent = this.parameters.initialInfected;
            
            // Clear results and canvas
            this.results = null;
            this.clearCanvas();
            this.drawInitialMessage();
            
            // Clear table content
            this.clearTable();
            
            // Clear metrics content
            this.clearMetrics();
            
            console.log('OdinModel: Model reset successfully');
        } catch (error) {
            console.error('OdinModel: Reset error:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('OdinModel: Initializing...');
    window.odinModel = new OdinModel();
    window.odinModel.setupAfterDOMReady();
});

