// ==========================================
// 🛠️ CUSTOMIZATION ZONE 
// ==========================================

const VALID_TOKEN = "INCOGNITO";

const TELEGRAM_BOT_TOKEN = "8853025521:AAE4Hoyg3f9iQTeEI_w3KcAJt-JDQnScXwY"; 
const TELEGRAM_CHAT_ID = "1742357570";

const PROTECTED_NODES = [
    "ODI1MjU4NDA2Mw==", 
    "ODI5ODcwOTE4NA==", 
    "NzA1MDY0NDExMA=="  
];

const NUMBER_PROTECTION_MESSAGE = "You really typed This number...and expected success? Interesting. don't try again this number is protected by Mind your business encryption, now get out"; 

const loaderMessages = [
    "Authenticating...", "Fetching public info...", "Privacy is a myth Buddy...",
    "Hold My Beer...", "Tracing Node...", "Almost There..."
];

const rejectionMessages = [
    "Nice try. That token is as fake as your chances—come back with a real one or disappear.",
    "Nice try. That token expired before your confidence did. Try again… or don’t.",
    "Invalid token detected. Just like your effort—almost there, but still useless.",
    "That token isn’t valid… but your audacity is impressive. Unfortunately, both are not accepted here."
];

// ==========================================
// 🚀 SYSTEM LOGIC
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

function showAuthView() {
    document.getElementById('warningView').style.display = 'none';
    document.getElementById('warningModal').classList.add('auth-mode');
    document.getElementById('authView').style.display = 'block';
}

let currentSlide = 1;
const totalSlides = 5;

function nextChangelogSlide() {
    haptic.light();
    if (currentSlide < totalSlides) {
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        document.getElementById(`dot${currentSlide}`).classList.remove('active');
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
        document.getElementById(`dot${currentSlide}`).classList.add('active');

        if (currentSlide === totalSlides) {
            document.getElementById('changelogBtn').innerText = "Let's Go 🚀";
        }
    } else {
        closeChangelog();
    }
}

function verifyToken() {
    const inputToken = document.getElementById('modalToken').value.trim();
    const errorDiv = document.getElementById('modalError');
    
    if (inputToken === VALID_TOKEN) {
        haptic.success(); 
        localStorage.setItem('dh_auth_expiry', Date.now() + (24 * 60 * 60 * 1000));
        
        if (!localStorage.getItem('dh_v3_seen')) {
            document.getElementById('authView').style.display = 'none';
            document.getElementById('changelogView').style.display = 'block';
        } else {
            document.getElementById('warningModal').style.opacity = '0';
            setTimeout(() => { document.getElementById('warningModal').style.display = 'none'; }, 400);
        }
    } else {
        haptic.error(); 
        errorDiv.style.display = 'block';
        errorDiv.innerText = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
        const authView = document.getElementById('authView');
        authView.style.transform = 'translateX(-10px)';
        setTimeout(() => authView.style.transform = 'translateX(10px)', 50);
        setTimeout(() => authView.style.transform = 'translateX(0)', 100);
    }
}

function closeChangelog() {
    haptic.light();
    localStorage.setItem('dh_v3_seen', 'true');
    document.getElementById('warningModal').style.opacity = '0';
    setTimeout(() => { document.getElementById('warningModal').style.display = 'none'; }, 400);
}

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

        document.getElementById('dashboardView').style.display = 'none';
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
        document.getElementById('dashboardView').style.display = 'block'; 
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

async function sendTelegramLog(toolId, query) {
    if (TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN_HERE" || !TELEGRAM_BOT_TOKEN) return; 
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        
        const message = `🚨 *Digit-Hunter Search Triggered* 🚨\n\n` +
                        `🔍 *Target:* \`${query}\`\n` +
                        `🛠 *Tool:* ${toolId.toUpperCase()}\n\n` +
                        `🌐 *IP:* ${ipData.ip}\n` +
                        `📱 *Device:* \`${navigator.userAgent}\``;
                        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
        });
    } catch (e) { console.error("Telemetry suppressed."); }
}

async function performLookup() {
    const inputValue = document.getElementById('targetInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const searchBtn = document.getElementById('searchBtn');

    function showError(message) {
        haptic.error();
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `<div class="glass-error compact-error appear-anim"><div class="error-icon">${warningIconSVG}</div><div class="error-text">${message}</div></div>`;
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading-pulse');
        searchBtn.innerText = 'EXTRACT DATA';
    }

    if (!inputValue) return showError("Input Required. Please enter valid target data.");
    
    const isProtected = PROTECTED_NODES.some(node => inputValue.includes(atob(node)));
    if (isProtected) return showError(NUMBER_PROTECTION_MESSAGE);

    sendTelegramLog(activeToolId, inputValue);

    resultsDiv.style.display = 'none';
    searchBtn.disabled = true;
    searchBtn.classList.add('loading-pulse');
    document.getElementById('targetInput').blur(); 

    let msgIndex = 0;
    searchBtn.innerText = loaderMessages[msgIndex];
    const loaderInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loaderMessages.length;
        searchBtn.innerText = loaderMessages[msgIndex];
    }, 1500); 

    try {
        const data = await fetchTargetData(activeToolId, inputValue); 
        displayResults(data, activeToolId, inputValue); 
        haptic.success(); 
        
        clearInterval(loaderInterval); 
        searchBtn.classList.remove('loading-pulse');
        searchBtn.classList.add('success-state');
        searchBtn.innerText = "✓ SUCCESS";

        setTimeout(() => { resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
        setTimeout(() => { searchBtn.classList.remove('success-state'); searchBtn.innerText = "EXTRACT DATA"; searchBtn.disabled = false; }, 2500);

    } catch (error) {
        clearInterval(loaderInterval); 
        showError(`${error.message}`);
    } 
}

window.addEventListener('load', () => {
    const authExpiry = localStorage.getItem('dh_auth_expiry');
    const warningModal = document.getElementById('warningModal');
    
    if (warningModal) {
        if (authExpiry && Date.now() < parseInt(authExpiry)) {
            warningModal.style.display = 'none';
            if (!localStorage.getItem('dh_v3_seen') && document.getElementById('changelogView')) {
                warningModal.style.display = 'flex';
                if(document.getElementById('warningView')) document.getElementById('warningView').style.display = 'none';
                if(document.getElementById('authView')) document.getElementById('authView').style.display = 'none';
                document.getElementById('changelogView').style.display = 'block';
            }
        } else {
            warningModal.style.display = 'flex'; 
        }
    }

    const splash = document.getElementById('splashLoader');
    if (!splash) return;

    if (sessionStorage.getItem('splashSeen')) {
        splash.style.display = 'none';
        return;
    }
    
    sessionStorage.setItem('splashSeen', 'true');
    const rocket = document.querySelector('.rocket-wrapper');
    const text = document.querySelector('.splash-text');
    const bar = document.querySelector('.loading-bar-container');
    const speedLines = document.querySelectorAll('.speed-line');

    let rumbleInterval = setInterval(() => { if (navigator.vibrate) navigator.vibrate(30); }, 800);

    setTimeout(() => {
        clearInterval(rumbleInterval); 
        if (navigator.vibrate) navigator.vibrate([100, 50, 150, 50, 300]); 
        if (rocket) rocket.classList.add('rocket-launch-active');
        if (text) text.classList.add('fade-out-fast');
        if (bar) bar.classList.add('fade-out-fast');
        if (speedLines) speedLines.forEach(line => line.classList.add('fade-out-fast'));
    }, 4200);

    setTimeout(() => {
        splash.classList.add('splash-hidden');
        haptic.light(); 
        setTimeout(() => { splash.remove(); }, 800);
    }, 5000); 
});
