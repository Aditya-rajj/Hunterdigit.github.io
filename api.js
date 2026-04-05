// File: api.js (Frontend Fetch Engine)

async function fetchTargetData(toolId, inputValue) {
    try {
        // Ask our own secure Vercel backend for the data
        const response = await fetch(`/api/fetchData?tool=${toolId}&query=${encodeURIComponent(inputValue)}`);
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        throw new Error(`Server Connection Failed: ${error.message}`);
    }
}

// --- RESULTS DISPLAY ENGINE (Unchanged, optimized for Glassmorphism) ---
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    
    const mainGrid = document.createElement('div');
    mainGrid.className = 'grid-container';
    resultsDiv.appendChild(mainGrid);
    
    let delay = 0;

    function parseData(obj, container) {
        for (const [key, value] of Object.entries(obj)) {
            const kStr = key.toLowerCase();
            const vStr = (typeof value === 'string') ? value.trim().toLowerCase() : '';
            
            if (kStr.includes('developer') || kStr.includes('proportalx') || vStr.includes('@proportalx') || kStr.includes('channel') || vStr === '@') continue;

            const fKey = key.replace(/([A-Z])/g, ' $1').toUpperCase().replace(/_/g, ' ');
            
            if (value !== null && typeof value === 'object') {
                const fDiv = document.createElement('div');
                fDiv.className = 'nested-folder glass-panel';
                fDiv.style.animationDelay = `${delay}s`;
                delay += 0.05;
                fDiv.innerHTML = `<div class="folder-title">${fKey}</div>`;
                const sGrid = document.createElement('div');
                sGrid.className = 'grid-container';
                parseData(value, sGrid);
                fDiv.appendChild(sGrid);
                container.appendChild(fDiv);
            } else {
                const card = document.createElement('div');
                card.className = 'data-card glass-panel';
                card.style.animationDelay = `${delay}s`;
                delay += 0.02; 
                card.innerHTML = `<div class="card-label">${fKey}</div><div class="card-value">${(value !== null && value !== '') ? value : 'N/A'}</div>`;
                container.appendChild(card);
            }
        }
    }
    parseData(data, mainGrid);
}
