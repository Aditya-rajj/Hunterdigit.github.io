// File: api.js (Frontend Fetch & Bento Display Engine)

async function fetchTargetData(toolId, inputValue) {
    try {
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

// --- INTELLIGENT BENTO RESULTS DISPLAY ENGINE ---
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    
    const mainGrid = document.createElement('div');
    mainGrid.className = 'bento-container'; // Uses the same 2-column CSS grid as the Home Screen!
    resultsDiv.appendChild(mainGrid);
    
    let delay = 0;

    function parseData(obj, container) {
        for (const [key, value] of Object.entries(obj)) {
            const kStr = key.toLowerCase();
            const vStr = (typeof value === 'string') ? value.trim() : '';
            const vStrLow = vStr.toLowerCase();
            
            // Skip promotional elements injected by third-party APIs
            if (kStr.includes('developer') || kStr.includes('proportalx') || vStrLow.includes('@proportalx') || kStr.includes('channel') || vStrLow === '@') continue;

            const isNumericKey = !isNaN(key) && parseInt(key) >= 0;
            const fKey = isNumericKey ? `RECORD ${parseInt(key) + 1}` : key.replace(/([A-Z])/g, ' $1').toUpperCase().replace(/_/g, ' ');
            
            if (value !== null && typeof value === 'object') {
                const fDiv = document.createElement('div');
                fDiv.className = 'nested-folder'; 
                fDiv.style.animationDelay = `${delay}s`;
                delay += 0.05;
                
                fDiv.innerHTML = `<div class="folder-title">${fKey}</div>`;
                
                const sGrid = document.createElement('div');
                sGrid.className = 'bento-container';
                parseData(value, sGrid);
                fDiv.appendChild(sGrid);
                container.appendChild(fDiv);
            } else {
                // 1. DYNAMIC WIDTH LOGIC: Make addresses and long data take up the full screen width (span-2)
                const isLong = vStr.length > 25 || kStr.includes('address') || kStr.includes('location') || kStr.includes('msg') || kStr.includes('desc');
                const spanClass = isLong ? 'span-2' : '';
                
                // 2. DYNAMIC ICON ENGINE: Assign beautiful SVGs based on data type
                let svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`; // Default Info Icon
                
                if(kStr.includes('name') || kStr.includes('father') || kStr.includes('owner')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                } else if(kStr.includes('address') || kStr.includes('loc') || kStr.includes('circle') || kStr.includes('city') || kStr.includes('state') || kStr.includes('pin')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
                } else if(kStr.includes('phone') || kStr.includes('mobile') || kStr.includes('num')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;
                } else if(kStr.includes('id') || kStr.includes('code') || kStr.includes('gst')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
                } else if(kStr.includes('date') || kStr.includes('time') || kStr.includes('year')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
                } else if(kStr.includes('bank') || kStr.includes('ifsc')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
                }

                // 3. GENERATE BENTO CARD
                const card = document.createElement('div');
                card.className = `result-widget ${spanClass}`;
                card.style.animationDelay = `${delay}s`;
                delay += 0.02; 
                
                card.innerHTML = `
                    <div class="icon-plate">${svgIcon}</div>
                    <div class="widget-text">
                        <h3>${fKey}</h3>
                        <p class="result-value">${(value !== null && value !== '') ? value : 'N/A'}</p>
                    </div>
                `;
                container.appendChild(card);
            }
        }
    }
    parseData(data, mainGrid);
}
