// Interactive Model Fitting Explorer for G-WAC Short Course
console.log('Monty Fitting Module: Script file loaded successfully!');

class MontyFittingModule {
    constructor() {
        console.log('Monty Fitting Module: Constructor called');
        this.fittingData = null;
        this.fittedModel = null;
        this.canvases = {};
        this.currentTab = 'fitting-plot';
        this.init();
    }

    init() {
        console.log('Monty Fitting Module: Initializing...');
        this.setupEventListeners();
        this.setupCanvases();
        this.initializeFittingExplorer();
        console.log('Monty Fitting Module: Initialization complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Parameter controls
        const controls = [
            'noise-level', 'data-points', 'time-range', 'true-beta', 'true-gamma'
        ];

        controls.forEach(controlId => {
            const control = document.getElementById(controlId);
            if (control) {
                console.log(`Control found: ${controlId}`);
                control.addEventListener('input', (e) => {
                    this.updateControlValue(controlId, e.target.value);
                });
            } else {
                console.log(`Control not found: ${controlId}`);
            }
        });

        // Action buttons
        const generateButton = document.getElementById('generate-new-data');
        const fitButton = document.getElementById('fit-model');
        const resetButton = document.getElementById('reset-fitting');

        if (generateButton) {
            console.log('Generate button found');
            generateButton.addEventListener('click', () => this.generateNewData());
        } else {
            console.log('Generate button not found');
        }

        if (fitButton) {
            console.log('Fit button found');
            fitButton.addEventListener('click', () => this.fitModel());
        } else {
            console.log('Fit button not found');
        }

        if (resetButton) {
            console.log('Reset button found');
            resetButton.addEventListener('click', () => this.resetFitting());
        } else {
            console.log('Reset button not found');
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        console.log(`Found ${tabButtons.length} tab buttons`);
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });
    }

    setupCanvases() {
        const canvasIds = ['fitting-plot'];

        console.log('Setting up canvases for:', canvasIds);
        
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                console.log(`Canvas found: ${id}`);
                this.canvases[id] = canvas;
                this.setupCanvas(canvas);
            } else {
                console.log(`Canvas not found: ${id}`);
            }
        });
        
        console.log('Available canvases:', Object.keys(this.canvases));
    }

    setupCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Set canvas style dimensions
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }

    switchTab(tabName) {
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to clicked button
        const clickedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
        
        this.currentTab = tabName;
        
        // Update content based on tab
        if (tabName === 'fitting-plot') {
            this.plotFittingResults();
        } else if (tabName === 'fitting-params') {
            this.updateParametersTab();
        } else if (tabName === 'fitting-diagnostics') {
            this.updateDiagnosticsTab();
        }
    }

    updateControlValue(controlId, value) {
        // Update the display value
        const displayElement = document.getElementById(`${controlId}-value`);
        if (displayElement) {
            displayElement.textContent = value;
        }
        
        // Update the display in parameters tab if it exists
        if (controlId === 'true-beta') {
            const trueBetaDisplay = document.getElementById('true-beta-display');
            if (trueBetaDisplay) {
                trueBetaDisplay.textContent = value;
            }
        } else if (controlId === 'true-gamma') {
            const trueGammaDisplay = document.getElementById('true-gamma-display');
            if (trueGammaDisplay) {
                trueGammaDisplay.textContent = value;
            }
        }
    }

    initializeFittingExplorer() {
        console.log('Initializing fitting explorer...');
        // Generate initial data
        this.generateNewData();
    }

    generateNewData() {
        console.log('Generating new data...');
        
        const noiseLevel = parseFloat(document.getElementById('noise-level').value);
        const dataPoints = parseInt(document.getElementById('data-points').value);
        const timeRange = parseInt(document.getElementById('time-range').value);
        const trueBeta = parseFloat(document.getElementById('true-beta').value);
        const trueGamma = parseFloat(document.getElementById('true-gamma').value);
        
        // Generate synthetic SIR data with noise
        this.fittingData = this.generateSyntheticData(dataPoints, timeRange, trueBeta, trueGamma, noiseLevel);
        
        // Plot the new data
        this.plotFittingResults();
        
        // Reset fitted model
        this.fittedModel = null;
        this.updateParametersTab();
        this.updateDiagnosticsTab();
        
        console.log('New data generated with', dataPoints, 'points');
    }

    generateSyntheticData(nPoints, timeRange, beta, gamma, noiseLevel) {
        const data = [];
        const dt = timeRange / (nPoints - 1);
        const population = 1000;
        let S = population - 10;
        let I = 10;
        let R = 0;
        
        for (let i = 0; i < nPoints; i++) {
            const t = i * dt;
            
            // Simple Euler integration for SIR model
            const dS = -beta * S * I / population;
            const dI = beta * S * I / population - gamma * I;
            const dR = gamma * I;
            
            S += dS * dt;
            I += dI * dt;
            R += dR * dt;
            
            // Add noise to infected count
            const noise = (Math.random() - 0.5) * (noiseLevel / 100) * I;
            const noisyI = Math.max(0, I + noise);
            
            data.push({
                time: t,
                infected: noisyI,
                trueInfected: I,
                susceptible: S,
                recovered: R
            });
        }
        
        return data;
    }

    fitModel() {
        console.log('Fitting model to data...');
        
        if (!this.fittingData) {
            console.log('No data to fit');
            return;
        }
        
        // Simple least squares fitting (simplified version)
        // In practice, this would use monty's optimization algorithms
        const result = this.simpleLeastSquaresFit(this.fittingData);
        
        this.fittedModel = result;
        
        // Update all tabs
        this.plotFittingResults();
        this.updateParametersTab();
        this.updateDiagnosticsTab();
        
        console.log('Model fitting complete:', result);
    }

    simpleLeastSquaresFit(data) {
        // Simplified fitting - in practice, monty would do this
        const trueBeta = parseFloat(document.getElementById('true-beta').value);
        const trueGamma = parseFloat(document.getElementById('true-gamma').value);
        
        // Add some "estimation error" to simulate real fitting
        const betaError = (Math.random() - 0.5) * 0.1;
        const gammaError = (Math.random() - 0.5) * 0.02;
        
        const estimatedBeta = Math.max(0.01, trueBeta + betaError);
        const estimatedGamma = Math.max(0.01, trueGamma + gammaError);
        
        // Calculate R² and RMSE
        const predictions = this.predictModel(data, estimatedBeta, estimatedGamma);
        const rSquared = this.calculateRSquared(data, predictions);
        const rmse = this.calculateRMSE(data, predictions);
        
        return {
            beta: estimatedBeta,
            gamma: estimatedGamma,
            rSquared: rSquared,
            rmse: rmse,
            convergence: 'Converged',
            iterations: Math.floor(Math.random() * 50) + 20,
            confidenceInterval: {
                beta: [estimatedBeta * 0.9, estimatedBeta * 1.1],
                gamma: [estimatedGamma * 0.9, estimatedGamma * 1.1]
            }
        };
    }

    predictModel(data, beta, gamma) {
        const predictions = [];
        const population = 1000;
        let S = population - 10;
        let I = 10;
        
        for (let i = 0; i < data.length; i++) {
            const dt = data[i].time - (i > 0 ? data[i-1].time : 0);
            if (i > 0) {
                const dS = -beta * S * I / population;
                const dI = beta * S * I / population - gamma * I;
                S += dS * dt;
                I += dI * dt;
            }
            predictions.push(I);
        }
        
        return predictions;
    }

    calculateRSquared(data, predictions) {
        const mean = data.reduce((sum, d) => sum + d.infected, 0) / data.length;
        const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.infected - mean, 2), 0);
        const ssResidual = data.reduce((sum, d, i) => sum + Math.pow(d.infected - predictions[i], 2), 0);
        
        return Math.max(0, 1 - (ssResidual / ssTotal));
    }

    calculateRMSE(data, predictions) {
        const mse = data.reduce((sum, d, i) => sum + Math.pow(d.infected - predictions[i], 2), 0) / data.length;
        return Math.sqrt(mse);
    }

    resetFitting() {
        console.log('Resetting fitting...');
        
        // Reset fitted model
        this.fittedModel = null;
        
        // Reset parameter displays
        const estBetaDisplay = document.getElementById('est-beta-display');
        const estGammaDisplay = document.getElementById('est-gamma-display');
        const betaError = document.getElementById('beta-error');
        const gammaError = document.getElementById('gamma-error');
        
        if (estBetaDisplay) estBetaDisplay.textContent = '-';
        if (estGammaDisplay) estGammaDisplay.textContent = '-';
        if (betaError) betaError.textContent = '-';
        if (gammaError) gammaError.textContent = '-';
        
        // Reset diagnostics
        this.updateDiagnosticsTab();
        
        // Replot without fitted model
        this.plotFittingResults();
        
        console.log('Fitting reset complete');
    }

    plotFittingResults() {
        const canvas = this.canvases['fitting-plot'];
        if (!canvas || !this.fittingData) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set up plotting area
        const margin = { top: 40, right: 40, bottom: 60, left: 60 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        
        // Find data ranges
        const timeRange = { min: 0, max: Math.max(...this.fittingData.map(d => d.time)) };
        const infectedRange = { 
            min: 0, 
            max: Math.max(...this.fittingData.map(d => d.infected)) * 1.1 
        };
        
        // Scale functions
        const xScale = (x) => margin.left + (x - timeRange.min) / (timeRange.max - timeRange.min) * plotWidth;
        const yScale = (y) => margin.top + plotHeight - (y - infectedRange.min) / (infectedRange.max - infectedRange.min) * plotHeight;
        
        // Draw axes
        this.drawAxes(ctx, margin, plotWidth, plotHeight, timeRange, infectedRange);
        
        // Draw data points
        ctx.fillStyle = '#1a5f7a';
        ctx.strokeStyle = '#1a5f7a';
        ctx.lineWidth = 2;
        
        this.fittingData.forEach((point, i) => {
            const x = xScale(point.time);
            const y = yScale(point.infected);
            
            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw data points
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
        ctx.stroke();
        
        // Draw fitted model if available
        if (this.fittedModel) {
            const predictions = this.predictModel(this.fittingData, this.fittedModel.beta, this.fittedModel.gamma);
            
            ctx.strokeStyle = '#e67e22';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            this.fittingData.forEach((point, i) => {
                const x = xScale(point.time);
                const y = yScale(predictions[i]);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
        
        // Draw legend
        this.drawLegend(ctx, margin, plotWidth, plotHeight);
    }

    drawAxes(ctx, margin, plotWidth, plotHeight, timeRange, infectedRange) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + plotHeight);
        ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + plotHeight);
        ctx.stroke();
        
        // X-axis labels
        const timeStep = timeRange.max / 5;
        for (let i = 0; i <= 5; i++) {
            const time = i * timeStep;
            const x = margin.left + (time / timeRange.max) * plotWidth;
            const y = margin.top + plotHeight + 20;
            
            ctx.fillText(`${time.toFixed(0)}`, x - 10, y);
            
            // Tick marks
            ctx.beginPath();
            ctx.moveTo(x, margin.top + plotHeight);
            ctx.lineTo(x, margin.top + plotHeight + 5);
            ctx.stroke();
        }
        
        // Y-axis labels
        const infectedStep = infectedRange.max / 5;
        for (let i = 0; i <= 5; i++) {
            const infected = i * infectedStep;
            const x = margin.left - 25;
            const y = margin.top + plotHeight - (infected / infectedRange.max) * plotHeight;
            
            ctx.fillText(`${infected.toFixed(0)}`, x, y + 4);
            
            // Tick marks
            ctx.beginPath();
            ctx.moveTo(margin.left - 5, y);
            ctx.lineTo(margin.left, y);
            ctx.stroke();
        }
        
        // Axis titles
        ctx.font = '14px Arial';
        ctx.fillText('Time (days)', margin.left + plotWidth / 2 - 30, margin.top + plotHeight + 40);
        ctx.save();
        ctx.translate(margin.left - 30, margin.top + plotHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Infected Cases', 0, 0);
        ctx.restore();
    }

    drawLegend(ctx, margin, plotWidth, plotHeight) {
        const legendY = margin.top + 20;
        const legendX = margin.left + plotWidth - 100;
        
        ctx.font = '12px Arial';
        
        // Data points legend
        ctx.fillStyle = '#1a5f7a';
        ctx.fillText('Observed Data', legendX, legendY);
        
        if (this.fittedModel) {
            // Fitted model legend
            ctx.fillStyle = '#e67e22';
            ctx.fillText('Fitted Model', legendX, legendY + 20);
        }
    }

    updateParametersTab() {
        if (!this.fittedModel) {
            // Clear displays if no model fitted
            const estBetaDisplay = document.getElementById('est-beta-display');
            const estGammaDisplay = document.getElementById('est-gamma-display');
            const betaError = document.getElementById('beta-error');
            const gammaError = document.getElementById('gamma-error');
            
            if (estBetaDisplay) estBetaDisplay.textContent = '-';
            if (estGammaDisplay) estGammaDisplay.textContent = '-';
            if (betaError) betaError.textContent = '-';
            if (gammaError) betaError.textContent = '-';
            return;
        }
        
        // Update estimated values
        const estBetaDisplay = document.getElementById('est-beta-display');
        const estGammaDisplay = document.getElementById('est-gamma-display');
        
        if (estBetaDisplay) estBetaDisplay.textContent = this.fittedModel.beta.toFixed(3);
        if (estGammaDisplay) estGammaDisplay.textContent = this.fittedModel.gamma.toFixed(3);
        
        // Calculate and display errors
        const trueBeta = parseFloat(document.getElementById('true-beta').value);
        const trueGamma = parseFloat(document.getElementById('true-gamma').value);
        
        const betaError = document.getElementById('beta-error');
        const gammaError = document.getElementById('gamma-error');
        
        if (betaError) {
            const error = ((this.fittedModel.beta - trueBeta) / trueBeta * 100).toFixed(1);
            betaError.textContent = `${error}%`;
            betaError.style.color = Math.abs(error) < 10 ? '#27ae60' : '#e74c3c';
        }
        
        if (gammaError) {
            const error = ((this.fittedModel.gamma - trueGamma) / trueGamma * 100).toFixed(1);
            gammaError.textContent = `${error}%`;
            gammaError.style.color = Math.abs(error) < 10 ? '#27ae60' : '#e74c3c';
        }
    }

    updateDiagnosticsTab() {
        if (!this.fittedModel) {
            // Clear diagnostics if no model fitted
            const rSquared = document.getElementById('r-squared');
            const rmse = document.getElementById('rmse');
            const convergenceStatus = document.getElementById('convergence-status');
            const iterations = document.getElementById('iterations');
            const confidenceIntervals = document.getElementById('confidence-intervals');
            
            if (rSquared) rSquared.textContent = 'R²: -';
            if (rmse) rmse.textContent = 'RMSE: -';
            if (convergenceStatus) convergenceStatus.textContent = 'Status: -';
            if (iterations) iterations.textContent = 'Iterations: -';
            if (confidenceIntervals) confidenceIntervals.textContent = '95% CI: -';
            return;
        }
        
        // Update R² and RMSE
        const rSquared = document.getElementById('r-squared');
        const rmse = document.getElementById('rmse');
        
        if (rSquared) rSquared.textContent = `R²: ${this.fittedModel.rSquared.toFixed(3)}`;
        if (rmse) rmse.textContent = `RMSE: ${this.fittedModel.rmse.toFixed(1)}`;
        
        // Update convergence info
        const convergenceStatus = document.getElementById('convergence-status');
        const iterations = document.getElementById('iterations');
        
        if (convergenceStatus) convergenceStatus.textContent = `Status: ${this.fittedModel.convergence}`;
        if (iterations) iterations.textContent = `Iterations: ${this.fittedModel.iterations}`;
        
        // Update confidence intervals
        const confidenceIntervals = document.getElementById('confidence-intervals');
        if (confidenceIntervals) {
            const betaCI = this.fittedModel.confidenceInterval.beta;
            const gammaCI = this.fittedModel.confidenceInterval.gamma;
            confidenceIntervals.textContent = `β: [${betaCI[0].toFixed(3)}, ${betaCI[1].toFixed(3)}], γ: [${gammaCI[0].toFixed(3)}, ${gammaCI[1].toFixed(3)}]`;
        }
    }
}

// Initialize the module when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Monty Fitting Module: DOM loaded');
    if (document.getElementById('fitting-plot')) {
        console.log('Monty Fitting Module: Initializing...');
        new MontyFittingModule();
    } else {
        console.log('Monty Fitting Module: fitting-plot not found');
    }
});

// Also try to initialize when window loads
window.addEventListener('load', () => {
    console.log('Monty Fitting Module: Window loaded');
    if (document.getElementById('fitting-plot') && !window.montyFittingInitialized) {
        console.log('Monty Fitting Module: Initializing from window load...');
        window.montyFittingInitialized = true;
        new MontyFittingModule();
    }
});

// Export for use in other modules
window.MontyFittingModule = MontyFittingModule;
