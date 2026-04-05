// ==========================================
// 🛠️ CUSTOMIZATION ZONE 
// ==========================================

const VALID_TOKEN = "INCOGNITO";
const BLOCKED_NUMBERS = ["8252584063", "8298709184" , "7050644110"];
const NUMBER_PROTECTION_MESSAGE = "You really typed This number...and expected success? Interesting."; 

const loaderMessages = [
    "Authenticating...",
    "Fetching Data...",
    "Bypassing Proxy...",
    "Hold My Beer...",
    "Tracing Node...",
    "Almost There..."
];

const rejectionMessages = [
    "Nice try. That token is as fake as your chances—come back with a real one or disappear.",
    "Nice try. That token expired before your confidence did. Try again… or don’t.",
    "Invalid token detected. Just like your effort—almost there, but still useless.",
    "That token isn’t valid… but your audacity is impressive. Unfortunately, both are not accepted here.",
    "Ladle Access denied. Even the system is tired of your guesses. Meow Ghop Ghop Ghop",
    "Wrong token. Right attitude… just aimed at the wrong place....Moye Moye"
];

// ==========================================
// 🚀 SYSTEM LOGIC (DO NOT TOUCH BELOW THIS LINE)
// ==========================================

const haptic = {
    light: () => { if (navigator.vibrate) navigator.vibrate(40); },
    success: () => { if (navigator.vibrate) navigator.vibrate([70, 50, 70]); },
    error: () => { if (navigator.vibrate) navigator.vibrate([50, 80, 50, 80, 50]); }
};

document.addEventListener('pointerdown', (e) => {
    const interactable = e.target.closest('button, a, .bento-widget, input, .back-btn');
    if (interactable) haptic.light();
});

let activeToolId = ''; 
const warningIconSVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

// --- 1. TWO-STEP MODAL LOGIC ---
function showAuthView() {
    document.getElementById('warningView').style.display = 'none';
    document.getElementById('warningModal').classList.add('auth-mode');
    document.getElementById('authView').style.display = 'block';
}

function verifyToken() {
    const inputToken = document.getElementById('modalToken').value.trim();
    const errorDiv = document.getElementById('modalError');
    
    if (inputToken === VALID_TOKEN) {
        haptic.success(); 
        document.getElementById('warningModal').style.opacity = '0';
        setTimeout(() => { document.getElementById('warningModal').style.display = 'none'; }, 400);
    } else {
        haptic.error(); 
        const randomMsg = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
        errorDiv.style.display = 'block';
        errorDiv.innerText = randomMsg;
        
        const authView = document.getElementById('authView');
        authView.style.transform = 'translateX(-10px)';
        setTimeout(() => authView.style.transform = 'translateX(10px)', 50);
        setTimeout(() => authView.style.transform = 'translateX(0)', 100);
    }
}

// --- 2. SINGLE PAGE APP LOGIC & HERO ANIMATIONS ---
function openTool(toolId, title, placeholderText, clickedElement) {
    activeToolId = toolId; 

    document.querySelectorAll('.appear-anim').forEach(el => {
        el.classList.remove('appear-anim', 'delay-1', 'delay-2');
    });

    const updateDOM = () => {
        if(clickedElement) {
            document.getElementById('activeToolIcon').innerHTML = clickedElement.querySelector('.icon-plate').innerHTML;
        }
        document.getElementById('activeToolTitle').innerText = title;
        document.getElementById('targetInput').placeholder = placeholderText;
        document.getElementById('targetInput').value = ''; 
        document.getElementById('results').innerHTML = ''; 
        document.getElementById('results').style.display = 'none';

        const searchBtn = document.getElementById('searchBtn');
        searchBtn.disabled = false;
        searchBtn.innerText = 'EXTRACT DATA';
        searchBtn.classList.remove('loading-pulse', 'success-state');

        document.getElementById('bentoView').style.display = 'none';
        document.getElementById('toolView').style.display = 'flex';

        history.pushState({ view: 'tool', toolId: toolId }, '', '#tool');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!document.startViewTransition || !clickedElement) {
        updateDOM();
        return;
    }

    const iconSource = clickedElement.querySelector('.icon-plate');
    const titleSource = clickedElement.querySelector('h3');
    
    iconSource.style.viewTransitionName = 'hero-icon';
    titleSource.style.viewTransitionName = 'hero-title';
    document.getElementById('activeToolIcon').style.viewTransitionName = 'hero-icon';
    document.getElementById('activeToolTitle').style.viewTransitionName = 'hero-title';

    const transition = document.startViewTransition(() => updateDOM());

    transition.finished.finally(() => {
        iconSource.style.viewTransitionName = '';
        titleSource.style.viewTransitionName = '';
        document.getElementById('activeToolIcon').style.viewTransitionName = '';
        document.getElementById('activeToolTitle').style.viewTransitionName = '';
    });
}

function closeTool() {
    if (history.state && history.state.view === 'tool') {
        history.back(); 
    } else {
        executeCloseTool();
    }
}

function executeCloseTool() {
    const updateDOM = () => {
        document.getElementById('results').innerHTML = '';
        document.getElementById('results').style.display = 'none';
        document.getElementById('toolView').style.display = 'none';
        document.getElementById('bentoView').style.display = 'grid'; 
    };

    if (!document.startViewTransition || !activeToolId) {
        activeToolId = '';
        updateDOM();
        return;
    }

    const targetWidget = document.querySelector(`.bento-widget[data-tool="${activeToolId}"]`);
    
    if (targetWidget) {
        targetWidget.querySelector('.icon-plate').style.viewTransitionName = 'hero-icon';
        targetWidget.querySelector('h3').style.viewTransitionName = 'hero-title';
        document.getElementById('activeToolIcon').style.viewTransitionName = 'hero-icon';
        document.getElementById('activeToolTitle').style.viewTransitionName = 'hero-title';
    }

    const transition = document.startViewTransition(() => {
        updateDOM();
        activeToolId = ''; 
    });

    transition.finished.finally(() => {
        if (targetWidget) {
            targetWidget.querySelector('.icon-plate').style.viewTransitionName = '';
            targetWidget.querySelector('h3').style.viewTransitionName = '';
        }
        document.getElementById('activeToolIcon').style.viewTransitionName = '';
        document.getElementById('activeToolTitle').style.viewTransitionName = '';
    });
}

window.addEventListener('popstate', (e) => {
    if (!e.state || e.state.view !== 'tool') {
        executeCloseTool();
    }
});

// --- 3. DYNAMIC EXTRACTION ENGINE ---
async function performLookup() {
    const inputValue = document.getElementById('targetInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const searchBtn = document.getElementById('searchBtn');

    function showError(message) {
        haptic.error();
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `
            <div class="glass-error compact-error appear-anim">
                <div class="error-icon">${warningIconSVG}</div>
                <div class="error-text">${message}</div>
            </div>`;
        
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading-pulse');
        searchBtn.innerText = 'EXTRACT DATA';
    }

    if (!inputValue) { 
        showError("Input Required. Please enter valid target data.");
        return; 
    }

    if (BLOCKED_NUMBERS.some(num => inputValue.includes(num))) {
        showError(NUMBER_PROTECTION_MESSAGE);
        return;
    }

    resultsDiv.style.display = 'none';
    searchBtn.disabled = true;
    searchBtn.classList.add('loading-pulse');
    document.getElementById('targetInput').blur(); 

    let msgIndex = 0;
    searchBtn.innerText = loaderMessages[msgIndex];
    const loaderInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loaderMessages.length;
        searchBtn.innerText = loaderMessages[msgIndex];
    }, 1500); // Faster pulse for dynamic button

    try {
        const data = await fetchTargetData(activeToolId, inputValue); 
        displayResults(data); 
        haptic.success(); 
        
        clearInterval(loaderInterval); 
        searchBtn.classList.remove('loading-pulse');
        searchBtn.classList.add('success-state');
        searchBtn.innerText = "✓ SUCCESS";

        setTimeout(() => { resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);

        setTimeout(() => {
            searchBtn.classList.remove('success-state');
            searchBtn.innerText = "EXTRACT DATA";
            searchBtn.disabled = false;
        }, 2500);

    } catch (error) {
        clearInterval(loaderInterval); 
        showError(`System Protocol Error: ${error.message}`);
    } 
}

// --- INITIAL SPLASH LOADER (ROCKET LAUNCH + HAPTICS) ---
window.addEventListener('load', () => {
    const splash = document.getElementById('splashLoader');
    if (!splash) return;

    const rocket = document.querySelector('.rocket-wrapper');
    const text = document.querySelector('.splash-text');
    const bar = document.querySelector('.loading-bar-container');
    const speedLines = document.querySelectorAll('.speed-line');

    let rumbleInterval = setInterval(() => {
        if (navigator.vibrate) navigator.vibrate(30); 
    }, 800);

    setTimeout(() => {
        clearInterval(rumbleInterval); 
        if (navigator.vibrate) navigator.vibrate([100, 50, 150, 50, 300]); 
        
        if (rocket) rocket.classList.add('rocket-launch-active');
        if (text) text.classList.add('fade-out-fast');
        if (bar) bar.classList.add('fade-out-fast');
        speedLines.forEach(line => line.classList.add('fade-out-fast'));
    }, 4200);

    setTimeout(() => {
        splash.classList.add('splash-hidden');
        haptic.light(); 
        setTimeout(() => { splash.remove(); }, 800);
    }, 5000); 
});
