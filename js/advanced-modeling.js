// Advanced Modeling Module for G-WAC Short Course
console.log('Advanced Modeling Module: Script file loaded successfully!');

class AdvancedModelingModule {
    constructor() {
        console.log('Advanced Modeling Module: Constructor called');
        this.uncertaintyResults = null;
        this.canvases = {};
        this.init();
    }

    init() {
        console.log('Advanced Modeling Module: Initializing...');
        this.setupEventListeners();
        this.setupCanvases();
        this.initializeUncertaintyExplorer();
        console.log('Advanced Modeling Module: Initialization complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Uncertainty controls
        const controls = [
            'beta-mean', 'beta-sd', 'gamma-mean', 'gamma-sd',
            'n-simulations', 'time-horizon'
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
        const runButton = document.getElementById('run-uncertainty');
        const resetButton = document.getElementById('reset-uncertainty');
        const downloadButton = document.getElementById('download-certificate');

        if (runButton) {
            console.log('Run button found');
            runButton.addEventListener('click', () => this.runUncertaintyAnalysis());
        } else {
            console.log('Run button not found');
        }

        if (resetButton) {
            console.log('Reset button found');
            resetButton.addEventListener('click', () => this.resetUncertainty());
        } else {
            console.log('Reset button not found');
        }

        if (downloadButton) {
            console.log('Download button found');
            downloadButton.addEventListener('click', () => this.generateCertificate());
        } else {
            console.log('Download button not found');
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
        const canvasIds = [
            'uncertainty-plot', 'beta-dist-plot', 'gamma-dist-plot'
        ];

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
        canvas.getContext('2d').scale(dpr, dpr);
        
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(btn => btn.classList.add('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updateControlValue(controlId, value) {
        const valueElement = document.getElementById(`${controlId}-value`);
        if (valueElement) {
            valueElement.textContent = value;
        }
    }

    initializeUncertaintyExplorer() {
        // Set initial values
        this.updateControlValue('beta-mean', '0.3');
        this.updateControlValue('beta-sd', '0.05');
        this.updateControlValue('gamma-mean', '0.1');
        this.updateControlValue('gamma-sd', '0.02');
        this.updateControlValue('n-simulations', '500');
        this.updateControlValue('time-horizon', '100');
    }

    resetUncertainty() {
        // Reset sliders to default values
        const defaults = {
            'beta-mean': 0.3, 'beta-sd': 0.05,
            'gamma-mean': 0.1, 'gamma-sd': 0.02,
            'n-simulations': 500, 'time-horizon': 100
        };

        Object.entries(defaults).forEach(([id, value]) => {
            const control = document.getElementById(id);
            if (control) {
                control.value = value;
                this.updateControlValue(id, value);
            }
        });

        // Clear results
        this.uncertaintyResults = null;
        this.clearPlots();
    }

    runUncertaintyAnalysis() {
        const params = this.getUncertaintyParameters();
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate processing time
        setTimeout(() => {
            this.uncertaintyResults = this.runMonteCarloSimulation(params);
            this.displayUncertaintyResults();
        }, 1000);
    }

    getUncertaintyParameters() {
        return {
            betaMean: parseFloat(document.getElementById('beta-mean').value),
            betaSd: parseFloat(document.getElementById('beta-sd').value),
            gammaMean: parseFloat(document.getElementById('gamma-mean').value),
            gammaSd: parseFloat(document.getElementById('gamma-sd').value),
            nSimulations: parseInt(document.getElementById('n-simulations').value),
            timeHorizon: parseInt(document.getElementById('time-horizon').value)
        };
    }

    runMonteCarloSimulation(params) {
        const results = {
            simulations: [],
            timePoints: Array.from({length: params.timeHorizon + 1}, (_, i) => i),
            betaSamples: [],
            gammaSamples: [],
            peakInfections: [],
            peakTiming: [],
            finalSizes: []
        };

        for (let i = 0; i < params.nSimulations; i++) {
            // Sample parameters from normal distributions
            const beta = this.sampleNormal(params.betaMean, params.betaSd);
            const gamma = this.sampleNormal(params.gammaMean, params.gammaSd);
            
            // Ensure parameters are positive
            const betaPos = Math.max(0.01, beta);
            const gammaPos = Math.max(0.01, gamma);
            
            results.betaSamples.push(betaPos);
            results.gammaSamples.push(gammaPos);
            
            // Run SIR simulation
            const simulation = this.runSIRSimulation(betaPos, gammaPos, params.timeHorizon);
            results.simulations.push(simulation);
            
            // Extract key metrics
            const peakIndex = simulation.I.indexOf(Math.max(...simulation.I));
            results.peakInfections.push(simulation.I[peakIndex]);
            results.peakTiming.push(peakIndex);
            results.finalSizes.push(simulation.R[simulation.R.length - 1]);
        }

        return results;
    }

    sampleNormal(mean, sd) {
        // Box-Muller transform for normal distribution
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    runSIRSimulation(beta, gamma, timeHorizon) {
        const N = 1000;
        const I0 = 10;
        const S0 = N - I0;
        const R0 = 0;
        
        const dt = 1;
        const steps = Math.floor(timeHorizon / dt);
        
        const S = [S0];
        const I = [I0];
        const R = [R0];
        
        for (let i = 1; i <= steps; i++) {
            const prevS = S[i - 1];
            const prevI = I[i - 1];
            const prevR = R[i - 1];
            
            const dS = -beta * prevS * prevI / N;
            const dI = beta * prevS * prevI / N - gamma * prevI;
            const dR = gamma * prevI;
            
            S.push(Math.max(0, prevS + dS * dt));
            I.push(Math.max(0, prevI + dI * dt));
            R.push(Math.max(0, prevR + dR * dt));
        }
        
        return { S, I, R };
    }

    showLoadingState() {
        const plotContainer = document.getElementById('uncertainty-plot-tab');
        if (plotContainer) {
            plotContainer.innerHTML = `
                <div class="loading-container">
                    <div class="loading-animation">🎲</div>
                    <h4>Running Monte Carlo Simulations...</h4>
                    <p>This may take a few moments depending on the number of simulations.</p>
                </div>
            `;
        }
    }

    clearPlots() {
        // Clear all plot canvases
        Object.values(this.canvases).forEach(canvas => {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }

    displayUncertaintyResults() {
        if (!this.uncertaintyResults) return;
        
        this.plotUncertaintyBands();
        this.plotParameterDistributions();
        this.updateStatistics();
        this.restorePlotContainer();
    }

    restorePlotContainer() {
        const plotContainer = document.getElementById('uncertainty-plot-tab');
        if (plotContainer) {
            plotContainer.innerHTML = `
                <div class="plot-container">
                    <canvas id="uncertainty-plot" width="800" height="400"></canvas>
                </div>
            `;
            // Re-setup the canvas
            const canvas = document.getElementById('uncertainty-plot');
            if (canvas) {
                this.canvases['uncertainty-plot'] = canvas;
                this.setupCanvas(canvas);
                this.plotUncertaintyBands();
            }
        }
    }

    plotUncertaintyBands() {
        const canvas = this.canvases['uncertainty-plot'];
        if (!canvas || !this.uncertaintyResults) return;
        
        const ctx = canvas.getContext('2d');
        const { timePoints, simulations } = this.uncertaintyResults;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;
        
        // Calculate percentiles for each time point
        const percentiles = this.calculatePercentiles(simulations, timePoints.length);
        
        // Draw axes
        this.drawAxes(ctx, width, height, padding, plotWidth, plotHeight);
        
        // Draw uncertainty bands
        this.drawUncertaintyBands(ctx, timePoints, percentiles, padding, plotWidth, plotHeight);
        
        // Draw median line
        const maxTime = Math.max(...timePoints);
        const maxValue = Math.max(...percentiles.p97_5);
        this.drawMedianLine(ctx, timePoints, percentiles.median, padding, plotWidth, plotHeight, maxTime, maxValue);
        
        // Draw legend
        this.drawUncertaintyLegend(ctx);
    }

    calculatePercentiles(simulations, nTimePoints) {
        const percentiles = {
            p2_5: new Array(nTimePoints).fill(0),
            p25: new Array(nTimePoints).fill(0),
            median: new Array(nTimePoints).fill(0),
            p75: new Array(nTimePoints).fill(0),
            p97_5: new Array(nTimePoints).fill(0)
        };
        
        for (let t = 0; t < nTimePoints; t++) {
            const values = simulations.map(sim => sim.I[t]).sort((a, b) => a - b);
            percentiles.p2_5[t] = values[Math.floor(0.025 * values.length)];
            percentiles.p25[t] = values[Math.floor(0.25 * values.length)];
            percentiles.median[t] = values[Math.floor(0.5 * values.length)];
            percentiles.p75[t] = values[Math.floor(0.75 * values.length)];
            percentiles.p97_5[t] = values[Math.floor(0.975 * values.length)];
        }
        
        return percentiles;
    }

    drawAxes(ctx, width, height, padding, plotWidth, plotHeight) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#333';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Time (days)', width / 2, height - 20);
        
        ctx.save();
        ctx.translate(20, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Number of Infected', 0, 0);
        ctx.restore();
    }

    drawUncertaintyBands(ctx, timePoints, percentiles, padding, plotWidth, plotHeight) {
        const maxTime = Math.max(...timePoints);
        const maxValue = Math.max(...percentiles.p97_5);
        
        // 95% confidence interval (light blue)
        ctx.fillStyle = 'rgba(135, 206, 250, 0.3)';
        this.fillBand(ctx, timePoints, percentiles.p2_5, percentiles.p97_5, padding, plotWidth, plotHeight, maxTime, maxValue);
        
        // 50% confidence interval (medium blue)
        ctx.fillStyle = 'rgba(100, 149, 237, 0.5)';
        this.fillBand(ctx, timePoints, percentiles.p25, percentiles.p75, padding, plotWidth, plotHeight, maxTime, maxValue);
    }

    fillBand(ctx, timePoints, lower, upper, padding, plotWidth, plotHeight, maxTime, maxValue) {
        ctx.beginPath();
        
        // Draw upper bound
        for (let i = 0; i < timePoints.length; i++) {
            const x = padding + (timePoints[i] / maxTime) * plotWidth;
            const y = padding + (1 - upper[i] / maxValue) * plotHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        // Draw lower bound in reverse
        for (let i = timePoints.length - 1; i >= 0; i--) {
            const x = padding + (timePoints[i] / maxTime) * plotWidth;
            const y = padding + (1 - lower[i] / maxValue) * plotHeight;
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.fill();
    }

    drawMedianLine(ctx, timePoints, median, padding, plotWidth, plotHeight, maxTime, maxValue) {
        const maxTime = Math.max(...timePoints);
        const maxValue = Math.max(...median);
        
        ctx.strokeStyle = '#1e90ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < timePoints.length; i++) {
            const x = padding + (timePoints[i] / maxTime) * plotWidth;
            const y = padding + (1 - median[i] / maxValue) * plotHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }

    drawUncertaintyLegend(ctx) {
        const legendItems = [
            { color: 'rgba(135, 206, 250, 0.3)', label: '95% Confidence Interval' },
            { color: 'rgba(100, 149, 237, 0.5)', label: '50% Confidence Interval' },
            { color: '#1e90ff', label: 'Median' }
        ];
        
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        
        legendItems.forEach((item, index) => {
            const y = 30 + index * 20;
            
            if (item.color.includes('rgba')) {
                ctx.fillStyle = item.color;
                ctx.fillRect(20, y - 8, 16, 16);
            } else {
                ctx.strokeStyle = item.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(20, y);
                ctx.lineTo(36, y);
                ctx.stroke();
            }
            
            ctx.fillStyle = '#333';
            ctx.fillText(item.label, 45, y + 4);
        });
    }

    plotParameterDistributions() {
        this.plotDistribution('beta-dist-plot', this.uncertaintyResults.betaSamples, 'β (Transmission Rate)');
        this.plotDistribution('gamma-dist-plot', this.uncertaintyResults.gammaSamples, 'γ (Recovery Rate)');
    }

    plotDistribution(canvasId, data, title) {
        const canvas = this.canvases[canvasId];
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create histogram
        const histogram = this.createHistogram(data, 20);
        const maxCount = Math.max(...histogram.counts);
        
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;
        
        // Draw histogram bars
        ctx.fillStyle = '#4CAF50';
        histogram.bins.forEach((bin, i) => {
            const x = padding + (i / histogram.bins.length) * plotWidth;
            const barWidth = plotWidth / histogram.bins.length;
            const barHeight = (histogram.counts[i] / maxCount) * plotHeight;
            const y = height - padding - barHeight;
            
            ctx.fillRect(x, y, barWidth, barHeight);
        });
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Add title
        ctx.fillStyle = '#333';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 20);
    }

    createHistogram(data, nBins) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / nBins;
        
        const bins = new Array(nBins).fill(0).map((_, i) => min + i * binWidth);
        const counts = new Array(nBins).fill(0);
        
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), nBins - 1);
            counts[binIndex]++;
        });
        
        return { bins, counts };
    }

    updateStatistics() {
        if (!this.uncertaintyResults) return;
        
        const { peakInfections, peakTiming, finalSizes } = this.uncertaintyResults;
        
        // Calculate statistics
        const peakStats = this.calculateStatistics(peakInfections);
        const timingStats = this.calculateStatistics(peakTiming);
        const sizeStats = this.calculateStatistics(finalSizes);
        
        // Update display
        document.getElementById('peak-mean').textContent = `Mean: ${peakStats.mean.toFixed(0)}`;
        document.getElementById('peak-ci').textContent = `95% CI: [${peakStats.ci95[0].toFixed(0)}, ${peakStats.ci95[1].toFixed(0)}]`;
        
        document.getElementById('timing-mean').textContent = `Mean: ${timingStats.mean.toFixed(1)}`;
        document.getElementById('timing-ci').textContent = `95% CI: [${timingStats.ci95[0].toFixed(1)}, ${timingStats.ci95[1].toFixed(1)}]`;
        
        document.getElementById('size-mean').textContent = `Mean: ${sizeStats.mean.toFixed(0)}`;
        document.getElementById('size-ci').textContent = `95% CI: [${sizeStats.ci95[0].toFixed(0)}, ${sizeStats.ci95[1].toFixed(0)}]`;
    }

    calculateStatistics(data) {
        const sorted = [...data].sort((a, b) => a - b);
        const n = sorted.length;
        
        const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
        const median = sorted[Math.floor(n / 2)];
        const p2_5 = sorted[Math.floor(0.025 * n)];
        const p97_5 = sorted[Math.floor(0.975 * n)];
        
        return {
            mean,
            median,
            ci95: [p2_5, p97_5]
        };
    }

    clearPlots() {
        Object.values(this.canvases).forEach(canvas => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    generateCertificate() {
        // Create a simple certificate
        const certificate = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>G-WAC Course Certificate</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
                    .certificate { border: 3px solid #1a5f7a; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .title { color: #1a5f7a; font-size: 32px; margin-bottom: 20px; }
                    .subtitle { color: #e67e22; font-size: 20px; margin-bottom: 30px; }
                    .content { font-size: 18px; line-height: 1.6; margin-bottom: 30px; }
                    .signature { margin-top: 50px; }
                    .date { margin-top: 30px; color: #666; }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="title">🎓 Certificate of Completion</div>
                    <div class="subtitle">G-WAC Short Course</div>
                    <div class="content">
                        This is to certify that the participant has successfully completed the<br>
                        <strong>Git, GitHub & Infectious Disease Modeling</strong> course,<br>
                        covering both theoretical concepts and practical applications.
                    </div>
                    <div class="signature">
                        <strong>Course Director</strong><br>
                        G-WAC Team
                    </div>
                    <div class="date">
                        Date: ${new Date().toLocaleDateString()}
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Create download link
        const blob = new Blob([certificate], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'g-wac-course-certificate.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the module when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Advanced Modeling Module: DOM loaded');
    if (document.getElementById('uncertainty-plot')) {
        console.log('Advanced Modeling Module: Initializing...');
        new AdvancedModelingModule();
    } else {
        console.log('Advanced Modeling Module: uncertainty-plot not found');
    }
});

// Also try to initialize when window loads
window.addEventListener('load', () => {
    console.log('Advanced Modeling Module: Window loaded');
    if (document.getElementById('uncertainty-plot') && !window.advancedModelingInitialized) {
        console.log('Advanced Modeling Module: Initializing from window load...');
        window.advancedModelingInitialized = true;
        new AdvancedModelingModule();
    }
});

// Export for use in other modules
window.AdvancedModelingModule = AdvancedModelingModule;
