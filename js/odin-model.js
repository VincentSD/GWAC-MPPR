// Interactive odin SIR Model for G-WAC Short Course
class OdinSIRModel {
    constructor() {
        this.canvas = document.getElementById('sir-plot');
        this.ctx = this.canvas.getContext('2d');
        this.parameters = {
            population: 1000,
            transmission: 0.3,
            recovery: 0.1,
            initialInfected: 1
        };
        this.results = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.runSimulation();
    }

    setupEventListeners() {
        // Parameter controls
        const populationSlider = document.getElementById('population');
        const transmissionSlider = document.getElementById('transmission');
        const recoverySlider = document.getElementById('recovery');
        const initialInfectedSlider = document.getElementById('initial-infected');

        if (populationSlider) {
            populationSlider.addEventListener('input', (e) => {
                this.parameters.population = parseInt(e.target.value);
                document.getElementById('population-value').textContent = e.target.value;
                this.updateR0();
            });
        }

        if (transmissionSlider) {
            transmissionSlider.addEventListener('input', (e) => {
                this.parameters.transmission = parseFloat(e.target.value);
                document.getElementById('transmission-value').textContent = e.target.value;
                this.updateR0();
            });
        }

        if (recoverySlider) {
            recoverySlider.addEventListener('input', (e) => {
                this.parameters.recovery = parseFloat(e.target.value);
                document.getElementById('recovery-value').textContent = e.target.value;
                this.updateR0();
            });
        }

        if (initialInfectedSlider) {
            initialInfectedSlider.addEventListener('input', (e) => {
                this.parameters.initialInfected = parseInt(e.target.value);
                document.getElementById('initial-infected-value').textContent = e.target.value;
            });
        }

        // Model controls
        const runButton = document.getElementById('run-model');
        const resetButton = document.getElementById('reset-model');

        if (runButton) {
            runButton.addEventListener('click', () => this.runSimulation());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetParameters());
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });
    }

    setupCanvas() {
        // Set canvas size for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updateR0() {
        const r0 = this.parameters.transmission / this.parameters.recovery;
        document.getElementById('r0-value').textContent = r0.toFixed(2);
    }

    resetParameters() {
        this.parameters = {
            population: 1000,
            transmission: 0.3,
            recovery: 0.1,
            initialInfected: 1
        };

        // Update sliders
        document.getElementById('population').value = 1000;
        document.getElementById('transmission').value = 0.3;
        document.getElementById('recovery').value = 0.1;
        document.getElementById('initial-infected').value = 1;

        // Update display values
        document.getElementById('population-value').textContent = '1000';
        document.getElementById('transmission-value').textContent = '0.3';
        document.getElementById('recovery-value').textContent = '0.1';
        document.getElementById('initial-infected-value').textContent = '1';

        this.updateR0();
        this.runSimulation();
    }

    runSimulation() {
        // Simulate SIR model using numerical integration (Euler method)
        this.results = this.simulateSIR();
        this.plotResults();
        this.updateTable();
        this.updateMetrics();
    }

    simulateSIR() {
        const { population, transmission, recovery, initialInfected } = this.parameters;
        const dt = 0.1; // Time step
        const tMax = 100; // Maximum time
        const steps = Math.floor(tMax / dt);
        
        const results = {
            time: [],
            S: [],
            I: [],
            R: [],
            incidence: []
        };

        // Initial conditions
        let S = population - initialInfected;
        let I = initialInfected;
        let R = 0;

        for (let i = 0; i <= steps; i++) {
            const t = i * dt;
            
            // Store current values
            results.time.push(t);
            results.S.push(S);
            results.I.push(I);
            results.R.push(R);
            results.incidence.push(transmission * S * I / population);

            // Euler integration
            const dS = -transmission * S * I / population;
            const dI = transmission * S * I / population - recovery * I;
            const dR = recovery * I;

            S += dS * dt;
            I += dI * dt;
            R += dR * dt;

            // Ensure non-negative values
            S = Math.max(0, S);
            I = Math.max(0, I);
            R = Math.max(0, R);
        }

        return results;
    }

    plotResults() {
        if (!this.results) return;

        const { time, S, I, R } = this.results;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set canvas dimensions
        const width = this.canvas.width;
        const height = this.canvas.height;
        const padding = 60;
        const plotWidth = width - 2 * padding;
        const plotHeight = height - 2 * padding;

        // Find data ranges
        const maxTime = Math.max(...time);
        const maxValue = Math.max(...S, ...I, ...R);

        // Draw axes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();

        // Draw grid
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * plotWidth;
            const y = padding + (i / 10) * plotHeight;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, padding);
            this.ctx.lineTo(x, height - padding);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - padding, y);
            this.ctx.stroke();
        }

        // Draw curves
        this.drawCurve(time, S, '#2E86AB', 'Susceptible', padding, plotWidth, plotHeight, maxTime, maxValue);
        this.drawCurve(time, I, '#A23B72', 'Infected', padding, plotWidth, plotHeight, maxTime, maxValue);
        this.drawCurve(time, R, '#F18F01', 'Recovered', padding, plotWidth, plotHeight, maxTime, maxValue);

        // Draw legend
        this.drawLegend();
    }

    drawCurve(time, values, color, label, padding, plotWidth, plotHeight, maxTime, maxValue) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        for (let i = 0; i < time.length; i++) {
            const x = padding + (time[i] / maxTime) * plotWidth;
            const y = padding + (1 - values[i] / maxValue) * plotHeight;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();
    }

    drawLegend() {
        const legendItems = [
            { color: '#2E86AB', label: 'Susceptible' },
            { color: '#A23B72', label: 'Infected' },
            { color: '#F18F01', label: 'Recovered' }
        ];

        this.ctx.font = '14px Inter, sans-serif';
        this.ctx.textAlign = 'left';

        legendItems.forEach((item, index) => {
            const y = 30 + index * 25;
            
            // Draw color box
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(20, y - 10, 20, 20);
            
            // Draw label
            this.ctx.fillStyle = '#333';
            this.ctx.fillText(item.label, 50, y + 5);
        });
    }

    updateTable() {
        if (!this.results) return;

        const tableBody = document.getElementById('table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        // Show every 10th data point to avoid overwhelming the table
        for (let i = 0; i < this.results.time.length; i += 10) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.results.time[i].toFixed(1)}</td>
                <td>${Math.round(this.results.S[i])}</td>
                <td>${Math.round(this.results.I[i])}</td>
                <td>${Math.round(this.results.R[i])}</td>
                <td>${Math.round(this.results.incidence[i])}</td>
            `;
            tableBody.appendChild(row);
        }
    }

    updateMetrics() {
        if (!this.results) return;

        const { I, time } = this.results;
        
        // Find peak infections
        const peakInfections = Math.max(...I);
        const peakIndex = I.indexOf(peakInfections);
        const peakDay = time[peakIndex];
        
        // Final epidemic size (total recovered)
        const finalSize = this.results.R[this.results.R.length - 1];

        // Update display
        document.getElementById('peak-infections').textContent = Math.round(peakInfections);
        document.getElementById('peak-day').textContent = peakDay.toFixed(1);
        document.getElementById('final-size').textContent = Math.round(finalSize);
    }
}

// Initialize the model when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sir-plot')) {
        new OdinSIRModel();
    }
});

// Export for use in other modules
window.OdinSIRModel = OdinSIRModel;
