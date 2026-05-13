async function fetchTargetData(toolId, inputValue) {
    try {
        const response = await fetch(`/api/fetchData?tool=${toolId}&query=${encodeURIComponent(inputValue)}`);
        const text = await response.text(); 
        
        if (text.trim().startsWith('<')) {
            throw new Error("API Route Missing. Ensure you are running this app on your live Vercel deployment.");
        }

        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.error || `HTTP Error: ${response.status}`);
        }
        return data;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

function displayResults(data, toolId, inputValue) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
    
    const mainGrid = document.createElement('div');
    mainGrid.className = 'bento-container'; 
    resultsDiv.appendChild(mainGrid);
    
    let delay = 0;

    function parseData(obj, container) {
        for (const [key, value] of Object.entries(obj)) {
            const kStr = key.toLowerCase();
            let vStr = (typeof value === 'string') ? value.trim() : String(value);
            const vStrLow = vStr.toLowerCase();
            
            if (kStr.includes('developer') || kStr.includes('proportalx') || vStrLow.includes('@proportalx') || kStr.includes('channel') || vStrLow === '@') continue;

            if (value !== null && typeof value === 'object') {
                const fDiv = document.createElement('div');
                fDiv.className = 'nested-folder'; 
                fDiv.style.animationDelay = `${delay}s`;
                delay += 0.05;
                
                const folderName = key.replace(/([A-Z])/g, ' $1').toUpperCase().replace(/_/g, ' ');
                fDiv.innerHTML = `<div class="folder-title">${folderName}</div>`;
                
                const sGrid = document.createElement('div');
                sGrid.className = 'bento-container';
                parseData(value, sGrid);
                fDiv.appendChild(sGrid);
                container.appendChild(fDiv);
            } else {
                
                const isNumericKey = !isNaN(key) && parseInt(key) >= 0;
                let fKey = key.replace(/([A-Z])/g, ' $1').toUpperCase().replace(/_/g, ' ');
                let finalValue = (value !== null && value !== '') ? value : 'N/A';

                // ✨ SMART PARSER: Automatically splits array strings like "Full Name: Aditya" into Title and Value
                if (isNumericKey && typeof value === 'string' && value.includes(':')) {
                    const parts = value.split(':');
                    fKey = parts.shift().trim().toUpperCase(); 
                    finalValue = parts.join(':').trim(); 
                } else if (isNumericKey) {
                    fKey = `RECORD ${parseInt(key) + 1}`;
                }

                const searchString = (fKey + " " + finalValue).toLowerCase();
                const isLong = finalValue.length > 25 || searchString.includes('address') || searchString.includes('location') || searchString.includes('msg') || searchString.includes('desc') || searchString.includes('name') || searchString.includes('email');
                const spanClass = isLong ? 'span-2' : '';
                
                // ✨ INTELLIGENT ICON ROUTING: Scans the final parsed text to assign the perfect icon
                let svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`; // Default Info
                
                if (searchString.includes('name') || searchString.includes('father') || searchString.includes('owner') || searchString.includes('gender')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                } else if (searchString.includes('address') || searchString.includes('loc') || searchString.includes('city') || searchString.includes('state') || searchString.includes('pin') || searchString.includes('region') || searchString.includes('area')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
                } else if (searchString.includes('phone') || searchString.includes('mobile') || searchString.includes('num') || searchString.includes('sim') || searchString.includes('tele')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;
                } else if (searchString.includes('id') || searchString.includes('code') || searchString.includes('gst') || searchString.includes('passport') || searchString.includes('aadhar') || searchString.includes('pan')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
                } else if (searchString.includes('date') || searchString.includes('time') || searchString.includes('year') || searchString.includes('dob')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
                } else if (searchString.includes('bank') || searchString.includes('ifsc') || searchString.includes('account')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
                } else if (searchString.includes('email') || searchString.includes('mail')) {
                    svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
                }

                const card = document.createElement('div');
                card.className = `result-widget ${spanClass} appear-anim`;
                card.style.animationDelay = `${delay}s`;
                delay += 0.02; 
                
                card.innerHTML = `
                    <div class="icon-plate glow-icon">${svgIcon}</div>
                    <div class="widget-text">
                        <h3>${fKey}</h3>
                        <p class="result-value">${finalValue}</p>
                    </div>
                `;
                container.appendChild(card);
            }
        }
    }
    parseData(data, mainGrid);

    const exportBtn = document.createElement('button');
    exportBtn.className = 'apple-btn extract-btn appear-anim';
    exportBtn.style.animationDelay = `${delay + 0.1}s`;
    exportBtn.style.margin = '1.5rem auto 3rem auto';
    exportBtn.style.display = 'flex';
    exportBtn.style.maxWidth = '300px';
    exportBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> EXPORT JSON`;
    
    exportBtn.onclick = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `DH_${toolId.toUpperCase()}_${inputValue}.json`);
        dlAnchorElem.click();
    };
    
    resultsDiv.appendChild(exportBtn);
}
