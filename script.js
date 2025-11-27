/* ---------- DOM ELEMENTS ---------- */
const startBtn = document.getElementById('startBtn');
const toggleAmbient = document.getElementById('toggleAmbient');
const videoModal = document.getElementById('videoModal');
const player = document.getElementById('player');
const closeVideo = document.getElementById('closeVideo');
const startOverlay = document.getElementById('startOverlay');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const gallery = document.getElementById('gallery');
const goBackBtn = document.getElementById('goBackBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const siteTitle = document.getElementById('siteTitle');
const mainMenuPage = document.getElementById('mainMenuPage');
const chooseMapPage = document.getElementById('chooseMapPage');
const schedulePage = document.getElementById('schedulePage');
const plantaAltaMapPage = document.getElementById('plantaAltaMapPage');
const plantaBajaMapPage = document.getElementById('plantaBajaMapPage');
const subsueloMapPage = document.getElementById('subsueloMapPage');
const roomPage = document.getElementById('roomPage');
const goToMapBtn = document.getElementById('goToMapBtn');
const goToScheduleBtn = document.getElementById('goToScheduleBtn');
const plantaAltaBtn = document.getElementById('plantaAltaBtn');
const plantaBajaBtn = document.getElementById('plantaBajaBtn');
const subsueloBtn = document.getElementById('subsueloBtn');
const scheduleContainer = document.getElementById('scheduleContainer');
const MAP_VIEW_CONFIG = {
    plantaAltaMap: {
        wrapper: document.querySelector('.map-wrapper[data-map-view="planta-alta"]'),
        image: document.getElementById('mapPlantaAltaImage'),
        hotspots: document.getElementById('mapPlantaAltaHotspots')
    },
    plantaBajaMap: {
        wrapper: document.querySelector('.map-wrapper[data-map-view="planta-baja"]'),
        image: document.getElementById('mapPlantaBajaImage'),
        hotspots: document.getElementById('mapPlantaBajaHotspots')
    },
    subsueloMap: {
        wrapper: document.querySelector('.map-wrapper[data-map-view="subsuelo"]'),
        image: document.getElementById('mapSubsueloImage'),
        hotspots: document.getElementById('mapSubsueloHotspots')
    }
};
const MAP_VIEW_KEYS = new Set(Object.keys(MAP_VIEW_CONFIG));
const roomTitleEl = document.getElementById('roomTitle');
const roomDescriptionEl = document.getElementById('roomDescription');
const roomEmptyMessage = document.getElementById('roomEmptyMessage');
let currentView = 'start';
let currentRoomId = null;
const viewHistory = [];
const VIEW_HISTORY_LIMIT = 20;
const VIEW_SECTIONS = {
    menu: mainMenuPage,
    chooseMap: chooseMapPage,
    plantaAltaMap: plantaAltaMapPage,
    plantaBajaMap: plantaBajaMapPage,
    subsueloMap: subsueloMapPage,
    schedule: schedulePage,
    room: roomPage
};
// Info UI elements
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = document.getElementById('closeInfo');

/* ---------- AUDIO ---------- */
// Global volumes you can tweak (see also CSS variables for card sizes)
const SETTINGS = {
    ambientVol: 0.4,  // ambient soundtrack default volume when ON
    hoverVol: 0.5,    // UI hover sound volume
    clickVol: 0.5,    // UI click sound volume
    videoVol: 0.2     // default video volume if a clip doesn't specify one
};
const ambient = new Audio("audio/ambient.mp3");
ambient.loop = true;
ambient.volume = SETTINGS.ambientVol;

const hoverSound = new Audio("audio/hover.mp3");
hoverSound.volume = SETTINGS.hoverVol;
const clickSound = new Audio("audio/click.mp3");
clickSound.volume = SETTINGS.clickVol;

// Path to your event map image (put your file at this path)
const MAP_IMAGE_SOURCES = {
    default: 'img/map.png',
    plantaAltaMap: 'img/map.png',
    plantaBajaMap: 'img/map.png',
    subsueloMap: 'img/map.png',
};

// Runtime feature flags
const HOTSPOT_SHRINK_ENABLED = false; // set to true to re-enable JS shrink logic

MAP_VIEW_KEYS.forEach(viewKey => {
    const config = MAP_VIEW_CONFIG[viewKey];
    if (!config) return;
    const img = config.image;
    const src = MAP_IMAGE_SOURCES[viewKey] || MAP_IMAGE_SOURCES.default;
    if (img && src) img.src = src;
});

// For mobile autoplay policies: create an AudioContext to unlock audio on first gesture
let audioCtx = null;
function ensureAudioContext() {
    if (audioCtx) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    } catch (e) { audioCtx = null; }
}

let ambientOn = false;
let ambientFadeInterval = null;

function fadeAmbient(toVol, duration = 600) {
    if (ambientFadeInterval) clearInterval(ambientFadeInterval);
    const start = ambient.volume;
    const steps = Math.max(1, Math.round(duration / 30));
    const step = (toVol - start) / steps;
    if (toVol > 0 && ambient.paused) ambient.play();
    let currentStep = 0;
    ambientFadeInterval = setInterval(() => {
        currentStep++;
        ambient.volume = Math.min(1, Math.max(0, start + step * currentStep));
        if (currentStep >= steps) {
            ambient.volume = toVol;
            clearInterval(ambientFadeInterval);
            ambientFadeInterval = null;
            if (toVol === 0) ambient.pause();
        }
    }, 30);
}

toggleAmbient.addEventListener('click', () => {
    playSound(clickSound);
    fadeAmbient(ambientOn ? 0 : SETTINGS.ambientVol, 600);
    ambientOn = !ambientOn;
});

function playSound(sound) {
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    try {
        const clone = sound.cloneNode();
        clone.volume = sound.volume;
        clone.currentTime = 0;
        clone.play().catch(() => {});
    } catch (e) {
        try { sound.currentTime = 0; sound.play().catch(() => {}); } catch (e) {}
    }
}

/* ---------- START BUTTON ---------- */
startBtn.addEventListener('click', () => {
    playSound(clickSound);
    ensureAudioContext();
    // User must opt-in to audio
    ambientOn = false;
    toggleAmbient.textContent = '♫';
    hideStartOverlay();
});

// One-time unlock for audio on first pointer interaction (improves mobile)
function unlockAudioOnFirstGesture() {
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    // Also kick off auto-scroll on first user gesture if enabled
    try {
        if (CONFIG.autoScroll && CONFIG.autoScroll.enabled && currentView === 'room' && !autoScrollState.running) startAutoScroll();
    } catch (_) {}
    document.removeEventListener('pointerdown', unlockAudioOnFirstGesture);
}
document.addEventListener('pointerdown', unlockAudioOnFirstGesture);

/* ---------- BACKGROUND CANVAS (Film-grain) ---------- */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let t = 0;

// Grain animation state
let grains = [];

// Config - tweak these values to change visual behaviour
const CONFIG = {
    blobCount: 4,                // number of blobs (was 6)
    blobBaseRadius: 30,          // base radius for blobs (px)
    blobMovementScale: 40,       // how far blobs drift from mouse (px)
    blobOpacityBase: 0.05,       // base opacity for blob centers
    backgroundGlow: 0.06         // background glow strength (slightly higher so grain shows)
};

window.addEventListener("mousemove", e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function noise(x, y) {
    return (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
}

// extend CONFIG with grain params (safe-guard: only add if absent)
if (typeof CONFIG.grainCount === 'undefined') {
    /*
     * EDITABLE: Background particles / film-grain settings
     *
     * Tweak these values to change how visible/dark the grains appear over the white background.
     *
     * Quick tips to make grains DARKER / more visible:
     * - Increase grainOpacity (e.g., 0.35 – 0.55)
     * - Increase grainCount for denser grain (e.g., 2200 – 3200)
     * - Increase grainSizeMax for chunkier specks (e.g., 3 – 4)
     * - Increase overlayAlpha for a subtle dark veil over the whole screen (e.g., 0.03 – 0.07)
     */
    Object.assign(CONFIG, {
        grainCount: 2200,     // total number of grain dots
        grainSizeMin: 1,      // minimum dot size (px)
        grainSizeMax: 3,      // maximum dot size (px)
        grainSpeed: 0.06,     // vertical drift speed multiplier
        grainOpacity: 0.4,    // base alpha for each dot (higher = darker dots)
        overlayAlpha: 0.0,   // subtle dark veil over entire screen (0 = none; higher = darker)
        backgroundImage: null // optional background image path (null = none)
    });
}

// EDITABLE: Automatic vertical scroll behavior
// Tweak these to control speed and behavior of the auto-scroll.
// - enabled: turn auto-scroll on/off
// - speedPxPerSec: velocity in pixels per second (e.g., 20–120)
// - pauseAfterUserMs: pause duration after user interaction (wheel/touch/keys)
// - loopToTop: when reaching the bottom, jump back to the top and continue
// - disableWhenModalOpen: don't scroll while a modal (video/map/info) is open
if (typeof CONFIG.autoScroll === 'undefined') {
    CONFIG.autoScroll = {
        enabled: true,
        speedPxPerSec: 40,
        pauseAfterUserMs: 3000,
        loopToTop: true,
        disableWhenModalOpen: true
    };
}

/* ---------- ROOM DEFINITIONS (placeholder layout) ---------- */
const ROOM_DEFINITIONS = [
    {
        id: 'room-patio',
        roomTag: 'patio',
        views: ['plantaBajaMap'],
        title: 'Patio',
        shortLabel: 'patio',
        description: 'Patio principal.',
        area: { top: '71.4%', left: '41.5%', width: '47%', height: '24.2%' },
        img: 'img/patio.png',
        /* special behavior: when clicked go to schedule */
        linkTo: 'schedule'
    },
    {
        id: 'room-nomade',
        roomTag: 'nomade',
        // moved to Planta Baja as requested
        views: ['plantaBajaMap'],
        title: 'Nómade',
        shortLabel: 'nómade',
        description: 'Espacio Nómade.',
        area: { top: '73%', left: '25%', width: '22%', height: '20.5%' },
        img: 'img/nomade.png',
        /* special behavior: when clicked go to schedule */
        linkTo: 'schedule'
    },
    {
        id: 'room-patio-sur',
        roomTag: 'patio-sur',
        views: ['plantaBajaMap'],
        title: 'Patio Sur',
        shortLabel: 'patio sur',
        description: 'Patio Sur.',
        area: { top: '63.6%', left: '6.2%', width: '24%', height: '30%' },
        img: 'img/patio-sur.png',
        // nudge label up into the white area beside the patio
        labelOffset: { transform: 'translateY(-30px)' },
        /* special behavior: when clicked go to schedule */
        linkTo: 'schedule'
    },
    // `room-banos` removed per request; baños page deleted
    {
        id: 'room-app',
        roomTag: 'app',
        views: ['plantaBajaMap'],
        title: 'App',
        shortLabel: 'app',
        description: 'Animación, videojuegos y cruces con tecnología.',
        area: { top: '45.8%', left: '29.8%', width: '12%', height: '18%' },
        img: 'img/app-room.png',
        /*color: 'rgba(140, 0, 255, 0.7)',
        restColor: 'rgba(140, 0, 255, 0.2)',
        hoverColor: 'rgba(140, 0, 255, 0.46)',*/
    },
    {
        id: 'room-planetario',
        roomTag: 'planetario',
        views: ['plantaBajaMap'],
        title: 'Planetario',
        shortLabel: 'planetario',
        description: 'Acciones performáticas y piezas centradas en el sonido.',
        area: { top: '36.8%', left: '40.8%', width: '24%', height: '37%' },
        img: 'img/planetario.png',
        /*color: 'rgba(255, 60, 0, 0.7)',
        restColor: 'rgba(255, 60, 0, 0.18)',
        hoverColor: 'rgba(255, 60, 0, 0.42)',*/
    },
    {
        id: 'room-tapete',
        roomTag: 'tapete',
        views: ['plantaBajaMap'],
        title: 'Tapete',
        shortLabel: 'tapete',
        description: 'Narrativas audiovisuales y piezas experimentales.',
        area: { top: '45.5%', left: '63.5%', width: '25%', height: '28%' },
        img: 'img/tapete.png',
        /*color: 'rgba(0, 200, 180, 0.74)',
        restColor: 'rgba(0, 200, 180, 0.2)',
        hoverColor: 'rgba(0, 200, 180, 0.46)',*/
    },
    {
        id: 'room-caldera',
        roomTag: 'caldera',
        views: ['plantaBajaMap'],
        title: 'Caldera',
        shortLabel: 'caldera',
        description: 'Acciones performáticas y piezas centradas en el sonido.',
        area: { top: '26%', left: '48%', width: '18%', height: '12%' },
        img: 'img/caldera.png',
        /*color: 'rgba(80, 200, 0, 0.7)',
        restColor: 'rgba(80, 200, 0, 0.18)',
        hoverColor: 'rgba(80, 200, 0, 0.42)',*/
    },
    {
        id: 'room-tatrajo',
        roomTag: 'tatrajo',
        views: ['plantaBajaMap'],
        title: 'Tatrajo',
        shortLabel: 'tatrajo',
        description: 'Acciones performáticas y piezas centradas en el sonido.',
        area: { top: '7%', left: '37.8%', width: '29%', height: '19%' },
        img: 'img/tatrajo.png',
        labelOffset: { transform: 'translateY(20px)'},
        /*color: 'rgba(60, 0, 20, 0.7)',
        restColor: 'rgba(60, 0, 20, 0.18)',
        hoverColor: 'rgba(60, 0, 20, 0.42)',*/
    },
    {
        id: 'room-circo',
        roomTag: 'circo',
        views: ['plantaAltaMap'],
        title: 'Circo',
        shortLabel: 'circo',
        description: 'Instalaciones y recorridos inmersivos.',
        area: { top: '30%', left: '40%', width: '25%', height: '50%' },
        img: 'img/circo.png',
        /*color: 'rgba(0, 149, 255, 0.7)',
        restColor: 'rgba(0, 149, 255, 0.18)',
        hoverColor: 'rgba(0, 149, 255, 0.4)',*/
    },
    {
        id: 'room-colectivo',
        roomTag: 'colectivo',
        views: ['plantaAltaMap'],
        title: 'Colectivo',
        shortLabel: 'colectivo',
        description: 'Todos los proyectos disponibles.',
        area: { top: '46%', left: '64%', width: '27%', height: '29%' },
        img: 'img/colectivo.png',
        /*color: 'rgba(30, 30, 30, 0.75)',
        restColor: 'rgba(30, 30, 30, 0.16)',
        hoverColor: 'rgba(30, 30, 30, 0.42)',*/
    },
    {
        id: 'room-taller',
        roomTag: 'taller',
        views: ['plantaAltaMap'],
        title: 'Taller',
        shortLabel: 'taller',
        description: 'Todos los proyectos disponibles.',
        area: { top: '37.8%', left: '3%', width: '25%', height: '35%' },
        img: 'img/taller.png',
        /*color: 'rgba(30, 30, 30, 0.75)',
        restColor: 'rgba(30, 30, 30, 0.16)',
        hoverColor: 'rgba(30, 30, 30, 0.42)',*/
    },
        {
        id: 'room-tecnico',
        roomTag: 'tecnico',
        views: ['plantaAltaMap'],
        title: 'Tecnico',
        shortLabel: 'técnico',
        description: 'Todos los proyectos disponibles.',
        area: { top: '46.2%', left: '24.2%', width: '20%', height: '27%' },
        img: 'img/tecnico.png',
        // nudge label up into the white gap and slightly left
        labelOffset: { transform: 'translateY(-32px)', translateX: '-3px' },
        /*color: 'rgba(177, 92, 12, 0.75)',
        restColor: 'rgba(177, 92, 12, 0.16)',
        hoverColor: 'rgba(177, 92, 12, 0.42)',*/
    },
    {
        id: 'room-subsuelo',
        roomTag: 'subsuelo',
        views: ['subsueloMap'],
        title: 'Subsuelo',
        shortLabel: 'subsuelo',
        description: 'Todos los proyectos disponibles.',
        area: { top: '30%', left: '25%', width: '50%', height: '40%' },
        img: 'img/subsuelo.png',
        /*color: 'rgba(30, 30, 30, 0.75)',
        restColor: 'rgba(30, 30, 30, 0.16)',
        hoverColor: 'rgba(30, 30, 30, 0.42)',*/
    },
];

const ROOM_LOOKUP = ROOM_DEFINITIONS.reduce((acc, room) => {
    acc[room.id] = room;
    return acc;
}, {});

function getRoomProjects(room) {
    const list = Array.isArray(projects) ? projects.slice() : [];
    if (!room || !room.roomTag) return list;
    return list.filter(p => p.roomTag === room.roomTag);
}

function getRoomsForView(viewKey) {
    if (!viewKey) return ROOM_DEFINITIONS.slice();
    return ROOM_DEFINITIONS.filter(room => {
        const views = Array.isArray(room.views) ? room.views : null;
        if (!views || views.length === 0) return true;
        return views.includes(viewKey);
    });
}

function generateGrains() {
    grains = [];
    const w = canvas.width;
    const h = canvas.height;
    for (let i = 0; i < CONFIG.grainCount; i++) {
        grains.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: CONFIG.grainSizeMin + Math.random() * (CONFIG.grainSizeMax - CONFIG.grainSizeMin),
            speed: CONFIG.grainSpeed * (0.5 + Math.random()),
            alpha: CONFIG.grainOpacity * (0.6 + Math.random() * 0.8)
        });
    }
}

function drawNoise() {
    const w = canvas.width, h = canvas.height;
    // white base so the background appears white behind cards
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    // draw grains
    for (let i = 0; i < grains.length; i++) {
        const g = grains[i];
        // vertical drift
        const yy = (g.y + t * g.speed * 60) % h;
        const flick = 0.5 + 0.5 * Math.sin((t + i) * 4 + (i % 7));
        const a = Math.max(0, Math.min(1, g.alpha * flick));
        // dark grains on white background
        ctx.fillStyle = `rgba(0,0,0,${a})`;
        // draw small rectangle as grain
        ctx.fillRect(Math.floor(g.x), Math.floor(yy), Math.ceil(g.r), Math.ceil(g.r));
    }

    // subtle full-screen noise overlay (use overlayAlpha when provided)
    const overlayA = typeof CONFIG.overlayAlpha === 'number' ? CONFIG.overlayAlpha : (CONFIG.backgroundGlow * 0.02);
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0, Math.min(1, overlayA))})`;
    ctx.fillRect(0, 0, w, h);

    // Mask the header area so no grains ever appear between header and the right screen edge
    // (prevents visible particles in any tiny gap due to scrollbars or rounding)
    try {
        const header = document.querySelector('header.site-header');
        const hh = header ? header.offsetHeight : 0;
        if (hh > 0) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, w, Math.ceil(hh));
        }
    } catch (_) { /* ignore */ }

    t += 0.5;
    requestAnimationFrame(drawNoise);
}

window.addEventListener('resize', () => { generateGrains(); });
generateGrains();
drawNoise();

/* ---------- AUTO SCROLL (customizable velocity) ---------- */
const autoScrollState = {
    running: false,
    rafId: 0,
    lastTs: 0,
    pausedUntil: 0,
    accumulatedY: 0  // accumulate fractional pixels until we can scroll by whole pixels
};

function autoScrollShouldRun() {
    if (currentView !== 'room') return false;
    if (!(CONFIG.autoScroll && CONFIG.autoScroll.enabled)) return false;
    // Don't scroll when the start overlay locks the UI
    if (document.body.classList.contains('locked')) return false;
    // Optionally suspend while any modal is open
    if (CONFIG.autoScroll.disableWhenModalOpen && anyModalOpen()) return false;
    // Pause temporarily after user input
    if (Date.now() < autoScrollState.pausedUntil) return false;
    return true;
}

function autoScrollStep(ts) {
    if (!autoScrollState.running) return;
    if (!autoScrollShouldRun()) {
        autoScrollState.lastTs = ts;
        autoScrollState.rafId = requestAnimationFrame(autoScrollStep);
        return;
    }

    if (!autoScrollState.lastTs) autoScrollState.lastTs = ts;
    const dt = Math.max(0, ts - autoScrollState.lastTs);
    autoScrollState.lastTs = ts;

    const speed = Math.max(0, CONFIG.autoScroll.speedPxPerSec || 0);
    const dy = (speed * dt) / 1000; // pixels per frame based on dt

    // Use the canonical scrolling element for reliability across browsers
    const scroller = document.scrollingElement || document.documentElement || document.body;
    const prevY = scroller.scrollTop || 0;
    
    // Accumulate fractional pixels until we have at least 1 pixel to scroll
    autoScrollState.accumulatedY += dy;
    const scrollAmount = Math.floor(autoScrollState.accumulatedY);
    
    if (scrollAmount >= 1) {
        scroller.scrollTop = prevY + scrollAmount;
        autoScrollState.accumulatedY -= scrollAmount; // keep the remainder for next frame
    }
    
    const newY = scroller.scrollTop || 0;
    
    // Debug: log scroll progress occasionally
    if (Math.random() < 0.01) console.log('Auto-scroll: from', prevY, 'to', newY, 'accumulated:', autoScrollState.accumulatedY.toFixed(2), 'scrollAmount:', scrollAmount);

    const atBottom = (scroller.clientHeight + Math.ceil(newY)) >= scroller.scrollHeight;
    const didnMove = Math.abs(newY - prevY) < 0.5; // guard for overscroll/OS behavior

    if ((atBottom || didnMove) && CONFIG.autoScroll.loopToTop) {
        // Use a broadly compatible jump-to-top
    scroller.scrollTop = 0;
    }

    autoScrollState.rafId = requestAnimationFrame(autoScrollStep);
}

function startAutoScroll() {
    if (autoScrollState.running) return;
    if (!autoScrollShouldRun()) return;
    autoScrollState.running = true;
    autoScrollState.lastTs = 0;
    autoScrollState.accumulatedY = 0; // reset accumulator
    // Debug: log scroll capabilities
    console.log('Starting auto-scroll. Page scroll height:', document.documentElement.scrollHeight, 'Window height:', window.innerHeight);
    autoScrollState.rafId = requestAnimationFrame(autoScrollStep);
}

function stopAutoScroll() {
    if (!autoScrollState.running) return;
    autoScrollState.running = false;
    if (autoScrollState.rafId) cancelAnimationFrame(autoScrollState.rafId);
    autoScrollState.rafId = 0;
}

// Pause on user interaction (wheel/touch/keys)
function pauseAutoScrollOnUser(e) {
    if (!(CONFIG.autoScroll && CONFIG.autoScroll.enabled)) return;
    // Don't pause when the user presses Space if we use it to toggle play/pause
    if (e && e.type === 'keydown' && (e.code === 'Space' || e.key === ' ')) return;
    autoScrollState.pausedUntil = Date.now() + (CONFIG.autoScroll.pauseAfterUserMs || 0);
}
['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(ev => {
    window.addEventListener(ev, pauseAutoScrollOnUser, { passive: true });
});

// Start after Start button (overlay dismissed). If no overlay, start on load.
try {
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (CONFIG.autoScroll && CONFIG.autoScroll.enabled) startAutoScroll();
        });
    } else {
    // No overlay present
    if (CONFIG.autoScroll && CONFIG.autoScroll.enabled) startAutoScroll();
    }
} catch (_) {}

// Also attempt to start on window load to be resilient (will idle if locked)
window.addEventListener('load', () => {
    try {
        if (CONFIG.autoScroll && CONFIG.autoScroll.enabled && !autoScrollState.running) startAutoScroll();
    } catch (_) {}
});
// Fallback: try again shortly after load to ensure layout is ready
setTimeout(() => {
    try {
        if (CONFIG.autoScroll && CONFIG.autoScroll.enabled && !autoScrollState.running) startAutoScroll();
    } catch (_) {}
}, 600);

// Helper: detect if page can scroll
function isPageScrollable() {
    const sh = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    return sh > (window.innerHeight + 1);
}

// Space bar: toggle play/stop
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        // Ignore when typing in inputs/textareas or contentEditable elements
        const el = e.target;
        const tag = (el && el.tagName) ? el.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || (el && el.isContentEditable)) return;
        // Prevent page from jumping
        e.preventDefault();
        // If video modal is open, toggle video playback; otherwise toggle auto-scroll
        try {
            if (videoModal && videoModal.classList.contains('open')) {
                if (player.paused) {
                    player.play().catch(() => {});
                } else {
                    player.pause();
                }
                return;
            }
        } catch (_) {}

        if (autoScrollState.running) {
            stopAutoScroll();
        } else if (CONFIG.autoScroll && CONFIG.autoScroll.enabled) {
            startAutoScroll();
        }
    }
}, { passive: false });

// Capture-phase fallback to reliably detect Space across nested elements
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        const el = e.target;
        const tag = (el && el.tagName) ? el.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || (el && el.isContentEditable)) return;
        e.preventDefault();
        try {
            if (videoModal && videoModal.classList.contains('open')) {
                if (player.paused) { player.play().catch(() => {}); } else { player.pause(); }
                return;
            }
        } catch (_) {}
    if (autoScrollState.running) { stopAutoScroll(); } else if (CONFIG.autoScroll && CONFIG.autoScroll.enabled) { startAutoScroll(); }
    }
}, { passive: false, capture: true });
/* ---------- CARD GENERATION ---------- */
// Shuffle projects each load so card order is random (Fisher-Yates)
function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildGallery(roomId = null) {
    if (!gallery) return;
    // clear existing
    gallery.innerHTML = '';

    const room = roomId ? ROOM_LOOKUP[roomId] : null;
    const sourceProjects = room ? getRoomProjects(room) : (Array.isArray(projects) ? projects.slice() : []);
    if (!sourceProjects.length) {
        if (roomEmptyMessage) roomEmptyMessage.hidden = false;
        revealAppSoon();
        return;
    }
    if (roomEmptyMessage) roomEmptyMessage.hidden = true;

    const shuffledProjects = shuffleArray(sourceProjects);
    const frag = document.createDocumentFragment();
    shuffledProjects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.video = p.video;
        if (p.roomTag) {
            card.dataset.roomTag = p.roomTag;
            const roomIdForProject = getRoomIdForTag(p.roomTag);
            if (roomIdForProject) card.dataset.roomId = roomIdForProject;
        }
    // Only set per-clip volume if provided in data.js. If absent, we don't
    // write a value so getClipVolume() will fall back to SETTINGS.videoVol.
    if (p.volume != null) card.dataset.volume = p.volume;
        card.dataset.title = p.title;
        card.dataset.artist = p.artist || '';
        card.dataset.desc = p.desc;
        card.dataset.tags = JSON.stringify(p.tags);

    // Create thumbnail image lazily and keep markup minimal
        const img = document.createElement('img');
    // Set a transparent placeholder src to avoid broken image icons in some browsers
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    img.dataset.src = p.img; // actual src will be applied when observed
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = p.title || 'project';
        img.draggable = false;
        img.className = 'thumb';
        card.appendChild(img);

        // Title overlay for hover/focus
        const titleOverlay = document.createElement('div');
        titleOverlay.className = 'card-title';
        titleOverlay.textContent = p.title || '';
        card.appendChild(titleOverlay);
        frag.appendChild(card);
    });
    // append fragment for better performance when many cards
        // Reveal the app UI shortly after gallery is in the DOM (avoids header flash)
        revealAppSoon();
    gallery.appendChild(frag);
    // After inserting cards, apply a layout helper so rooms with fewer
    // items keep the same card dimensions as full grids and appear centered.
    try {
        const projCount = shuffledProjects.length;
        if (projCount >= 2 && projCount < 5) {
            gallery.classList.add('few-projects');
            gallery.style.setProperty('--few-cols', '5');
        } else {
            gallery.classList.remove('few-projects');
            gallery.style.removeProperty('--few-cols');
        }

        // Compute columns based on current viewport to match CSS breakpoints
        const computeCols = () => {
            const w = window.innerWidth;
            // Match CSS breakpoints: <=450 -> 2 cols; 451-1241 -> 4 cols; >=1242 ->5 cols
            if (w <= 450) return 2;
            if (w <= 1241) return 4;
            return 5;
        };

        const cols = computeCols();
        const cards = Array.from(gallery.querySelectorAll('.card'));

        // If fewer cards than columns, center them inside the grid by
        // shifting their `grid-column-start`. This keeps card sizes
        // identical to the full-grid case but visually centered.
        if (cards.length > 0 && cards.length < cols) {
            const start = Math.floor((cols - cards.length) / 2) + 1;
            for (let i = 0; i < cards.length; i++) {
                const c = cards[i];
                c.style.gridColumnStart = (start + i).toString();
                c.style.justifySelf = 'center';
            }
        } else {
            // Clear any previous overrides
            cards.forEach(c => {
                c.style.removeProperty('grid-column-start');
                c.style.removeProperty('justify-self');
            });
        }
    } catch (e) { /* ignore layout tuning failure */ }

    // Add interactions after cards are created
    gallery.querySelectorAll('.card').forEach(card => {
        // Play hover sound on real mouse hover; avoid on touch to prevent double sounds
        card.addEventListener('pointerenter', (ev) => {
            if (ev.pointerType === 'mouse') playSound(hoverSound);
        }, { passive: true });
        card.addEventListener('click', () => {
            playSound(clickSound);
            openVideo(card);
        });
    });

    // Observe thumbnails for lazy loading after inserting into DOM
    if (thumbObserver) {
        gallery.querySelectorAll('.thumb').forEach(img => thumbObserver.observe(img));
    }
}

// Lazy-load thumbnails and pre-measure video aspect ratios when thumbnails enter view
let thumbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        // Apply the real image source and reveal only after it loads
        const realSrc = img.dataset.src;
        if (realSrc) {
            // add load/error handlers to control visibility
            img.addEventListener('load', () => {
                img.classList.add('loaded'); // CSS will fade it in
            }, { once: true });
            img.addEventListener('error', () => {
                // Keep black; do not swap to an error graphic
                img.classList.remove('loaded');
            }, { once: true });
            img.src = realSrc;
        }

        // Do not change card aspect ratio; cards remain square

        thumbObserver.unobserve(img);
    });
}, { rootMargin: '200px' });

// reshuffle button
const reshuffleBtn = document.getElementById('reshuffleBtn');
if (reshuffleBtn) reshuffleBtn.addEventListener('click', () => {
    if (currentView !== 'room') return;
    playSound(clickSound);
    buildGallery(currentRoomId);
});

    // After the gallery is built (or on next paint), remove the app-loading state
    function revealAppSoon() {
        try {
            if (!document.body.classList.contains('app-loading')) return;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                document.body.classList.remove('app-loading');
            }));
        } catch (_) {}
    }

/* ---------- MAP NAVIGATION ---------- */
function fitMapToViewport(view = currentView) {
    const viewKey = view || currentView;
    if (!MAP_VIEW_KEYS.has(viewKey)) return;

    const config = MAP_VIEW_CONFIG[viewKey];
    if (!config) return;

    const wrapper = config.wrapper || (typeof config.getWrapper === 'function' ? config.getWrapper() : null);
    if (!wrapper) return;

    const image = config.image || (typeof config.getImage === 'function' ? config.getImage() : null);
    if (image && (!image.complete || !image.naturalWidth || !image.naturalHeight)) {
        image.addEventListener('load', () => fitMapToViewport(viewKey), { once: true });
        return;
    }

    wrapper.classList.remove('is-constrained');
    wrapper.style.removeProperty('width');
    wrapper.style.removeProperty('height');

    if (!image || !image.naturalWidth || !image.naturalHeight) return;

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const verticalPadding = 240; // accounts for section padding and breathing room
    const availableHeight = window.innerHeight - headerHeight - verticalPadding;
    if (availableHeight <= 0) return;

    const ratio = image.naturalWidth / Math.max(1, image.naturalHeight);
    // Allow larger maps on very wide screens (TVs). Use a higher cap when
    // the viewport is very wide so the map can take more horizontal space.
    const wideCap = window.innerWidth >= 1600 ? 1400 : 960;
    const maxCssWidth = Math.min(window.innerWidth * 0.96, wideCap);
    const defaultHeight = maxCssWidth / ratio;

    if (defaultHeight <= availableHeight) return;

    const fittedHeight = Math.max(220, availableHeight);
    const fittedWidth = fittedHeight * ratio;
    const finalWidth = Math.min(fittedWidth, maxCssWidth);
    const finalHeight = finalWidth / ratio;

    wrapper.classList.add('is-constrained');
    wrapper.style.width = `${finalWidth}px`;
    wrapper.style.height = `${finalHeight}px`;
}

function hideStartOverlay() {
    if (!startOverlay) return;
    // This function is now only responsible for setting the view
    // The CSS handles showing/hiding the overlay
    setView('menu');
}

function canGoBack() {
    if (viewHistory.length > 0) return true;
    return currentView && currentView !== 'start';
}

function updateNavButtons() {
    if (goBackBtn) goBackBtn.classList.toggle('is-hidden', !canGoBack());
    /*if (backToMenuBtn) backToMenuBtn.classList.toggle('is-hidden', currentView === 'start' || currentView === 'menu')*/;
    if (reshuffleBtn) {
        const inRoom = currentView === 'room';
        reshuffleBtn.classList.toggle('is-hidden', !inRoom);
        reshuffleBtn.disabled = !inRoom;
    }
}

function updateViewSections() {
    Object.entries(VIEW_SECTIONS).forEach(([viewKey, element]) => {
        if (!element) return;
        if (currentView === viewKey) {
            element.style.display = 'flex';
            element.style.flexDirection = 'column';
        } else {
            element.style.display = 'none';
        }
    });
}

function setBodyViewClass(view) {
    const targetClass = `view-${view}`;
    const body = document.body;
    if (!body) return;
    Array.from(body.classList).forEach(cls => {
        if (cls.startsWith('view-') && cls !== targetClass) body.classList.remove(cls);
    });
    if (!body.classList.contains(targetClass)) body.classList.add(targetClass);
}

function setView(view, options = {}) {
    const targetView = view || 'start';
    const { pushHistory = true } = options;

    if (pushHistory && currentView && targetView !== currentView) {
        viewHistory.push(currentView);
        if (viewHistory.length > VIEW_HISTORY_LIMIT) viewHistory.shift();
    }

    currentView = targetView;
    setBodyViewClass(targetView);

    // If leaving a room view, clear the data attribute so per-room CSS doesn't remain active
    try {
        if (targetView !== 'room' && document && document.body && typeof document.body.removeAttribute === 'function') {
            document.body.removeAttribute('data-current-room');
        }
    } catch (_) {}

    if (MAP_VIEW_KEYS.has(targetView)) {
        fitMapToViewport(targetView);
    }

    if (targetView === 'room') {
        if (CONFIG.autoScroll && CONFIG.autoScroll.enabled) startAutoScroll();
    } else {
        stopAutoScroll();
    }

    if (targetView === 'schedule') renderSchedule();

    updateNavButtons();
    updateViewSections();
}

function goBack() {
    if (currentView === 'menu') {
        viewHistory.length = 0;
        setView('start', { pushHistory: false });
        return;
    }

    if (viewHistory.length === 0) {
        if (currentView !== 'start') {
            setView('start', { pushHistory: false });
        } else {
            updateNavButtons();
            updateViewSections();
        }
        return;
    }

    const previousView = viewHistory.pop();
    setView(previousView, { pushHistory: false });
}

function buildMapHotspotsForView(viewKey) {
    if (!MAP_VIEW_KEYS.has(viewKey)) return;
    const config = MAP_VIEW_CONFIG[viewKey];
    if (!config || !config.hotspots) return;

    const container = config.hotspots;
    container.innerHTML = '';
    getRoomsForView(viewKey).forEach(room => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'map-room';
        btn.dataset.roomId = room.id;
        btn.style.setProperty('--room-color', room.color || 'rgba(0, 230, 255, 0.7)');
        if (room.restColor) btn.style.setProperty('--room-rest', room.restColor);
        if (room.hoverColor) btn.style.setProperty('--room-hover', room.hoverColor);
        const area = room.area || {};
        if (area.top) btn.style.top = area.top;
        if (area.left) btn.style.left = area.left;
        if (area.width) btn.style.width = area.width;
        if (area.height) btn.style.height = area.height;
        if (room.cornerRadius) btn.style.borderRadius = room.cornerRadius;
        // Compute a label text used both for the visible label and for
        // the fallback title text (prevents referencing an undefined span).
        const labelText = room.shortLabel || room.title || room.id;

        // If an image is provided for the room, use it as the hotspot visual.
        if (room.img) {
            const rimg = document.createElement('img');
            rimg.className = 'room-map-img';
            rimg.src = room.img;
            rimg.loading = 'lazy';
            rimg.decoding = 'async';
            rimg.alt = room.title || room.id || '';
            rimg.draggable = false;

            // Allow per-room image positioning/size via `imgArea` in the
            // ROOM_DEFINITIONS (top/left/width/height). If not present,
            // image fills the hotspot button.
            const imgArea = room.imgArea || {};
            if (imgArea.top || imgArea.left || imgArea.width || imgArea.height) {
                rimg.style.position = 'absolute';
                if (imgArea.top) rimg.style.top = imgArea.top;
                if (imgArea.left) rimg.style.left = imgArea.left;
                if (imgArea.width) rimg.style.width = imgArea.width;
                if (imgArea.height) rimg.style.height = imgArea.height;
            } else {
                rimg.style.position = 'absolute';
                rimg.style.top = '0';
                rimg.style.left = '0';
                rimg.style.width = '100%';
                rimg.style.height = '100%';
            }

            // object-fit can be customized per-room via `imgFit` (cover|contain)
            // Default to 'contain' so PNG pieces are fully visible and not
            // cropped; use `imgFit: 'cover'` per-room when you need bleed.
            rimg.style.objectFit = room.imgFit || 'contain';
            rimg.style.pointerEvents = 'none';

            btn.appendChild(rimg);
            // Ensure the hotspot button never becomes larger than the
            // image's natural size. When the image loads, compare natural
            // pixels against the rendered button and shrink/recenter the
            // button if needed so it does not overlap the PNG.
            rimg.addEventListener('load', () => {
                try {
                    // Optionally disable the JS shrink logic entirely via flag.
                    if (!HOTSPOT_SHRINK_ENABLED) return;
                    const natW = rimg.naturalWidth || 0;
                    const natH = rimg.naturalHeight || 0;
                    if (!natW || !natH) return;
                    const containerRect = container.getBoundingClientRect();
                    const btnRect = btn.getBoundingClientRect();

                    const natPctW = (natW / Math.max(1, containerRect.width)) * 100;
                    const natPctH = (natH / Math.max(1, containerRect.height)) * 100;

                    // Current button percentages (fallback to computed)
                    let currentWidthPct = null;
                    let currentHeightPct = null;
                    if (area.width && typeof area.width === 'string' && area.width.trim().endsWith('%')) {
                        currentWidthPct = parseFloat(area.width);
                    } else {
                        currentWidthPct = (btnRect.width / Math.max(1, containerRect.width)) * 100;
                    }
                    if (area.height && typeof area.height === 'string' && area.height.trim().endsWith('%')) {
                        currentHeightPct = parseFloat(area.height);
                    } else {
                        currentHeightPct = (btnRect.height / Math.max(1, containerRect.height)) * 100;
                    }

                    // If button is bigger than natural image, shrink it and keep center
                    const needsShrinkW = currentWidthPct > natPctW + 0.1;
                    const needsShrinkH = currentHeightPct > natPctH + 0.1;
                    if (needsShrinkW || needsShrinkH) {
                        const newWidthPct = needsShrinkW ? Math.min(currentWidthPct, natPctW) : currentWidthPct;
                        const newHeightPct = needsShrinkH ? Math.min(currentHeightPct, natPctH) : currentHeightPct;

                        const centerX = btnRect.left + btnRect.width / 2;
                        const centerY = btnRect.top + btnRect.height / 2;
                        const newLeftPct = ((centerX - containerRect.left) / containerRect.width) * 100 - newWidthPct / 2;
                        const newTopPct = ((centerY - containerRect.top) / containerRect.height) * 100 - newHeightPct / 2;

                        // Never shrink hotspots to an unusably small size on tiny screens.
                        // Keep a sensible minimum of ~5% so labels remain readable.
                        btn.style.width = `${Math.max(5, newWidthPct)}%`;
                        btn.style.height = `${Math.max(5, newHeightPct)}%`;
                        btn.style.left = `${Math.max(0, Math.min(100 - newWidthPct, newLeftPct))}%`;
                        btn.style.top = `${Math.max(0, Math.min(100 - newHeightPct, newTopPct))}%`;
                    }
                } catch (e) { /* ignore */ }
            });
            // Add a label overlay for accessibility/legend
            const lbl = document.createElement('span');
            lbl.className = 'map-room-label';
            lbl.textContent = labelText;
            // Apply optional per-room label offsets (allows small nudge without changing button geometry)
            const labelOffset = room.labelOffset || null;
            if (labelOffset) {
                try {
                    if (labelOffset.top) lbl.style.top = labelOffset.top;
                    if (labelOffset.left) lbl.style.left = labelOffset.left;
                    // Support composing transforms: existing transform + independent translateX
                    const transforms = [];
                    if (labelOffset.transform) transforms.push(labelOffset.transform);
                    if (typeof labelOffset.translateX !== 'undefined' && labelOffset.translateX !== null) {
                        transforms.push(`translateX(${labelOffset.translateX})`);
                    }
                    if (transforms.length) lbl.style.transform = transforms.join(' ');
                    if (labelOffset.color) lbl.style.color = labelOffset.color;
                } catch (e) { /* ignore */ }
            }
            btn.appendChild(lbl);
            // mark button as image-backed so CSS can remove colored UI
            btn.classList.add('has-img');
        } else {
            const span = document.createElement('span');
            span.textContent = labelText;
            btn.appendChild(span);
        }
        const count = getRoomProjects(room).length;
        // Keep patio and patio-sur visually the same as other rooms even when empty
        const neverMarkEmpty = ['room-patio', 'room-patio-sur', 'room-nomade'].includes(room.id);
        if (!count && !neverMarkEmpty) btn.dataset.empty = 'true';
        const titleText = room.title || labelText || room.id;
        const descriptive = count
            ? `${titleText} – ${count} proyecto${count === 1 ? '' : 's'}`
            : `${titleText} – sin proyectos asignados todavía`;
        btn.title = descriptive;
        btn.setAttribute('aria-label', descriptive);

        btn.addEventListener('pointerenter', (ev) => {
            if (ev.pointerType === 'mouse') playSound(hoverSound);
        }, { passive: true });
        btn.addEventListener('click', () => {
            playSound(clickSound);
            // If the room defines a special destination, follow it.
            if (room.linkTo === 'schedule') {
                setView('schedule');
                return;
            }
            if (room.linkTo === 'chooseMap') {
                setView('chooseMap');
                return;
            }
            // Default behavior: enter the room (show gallery)
            enterRoom(room.id);
        });

        container.appendChild(btn);
    });
}

function getRoomIdForTag(roomTag) {
    if (!roomTag) return null;
    const match = ROOM_DEFINITIONS.find(r => r.roomTag === roomTag);
    return match ? match.id : null;
}

function enterRoom(roomId) {
    const room = ROOM_LOOKUP[roomId];
    if (!room) return;
    currentRoomId = roomId;
    // Expose the current room on <body> so CSS can target per-room rules
    try {
        if (document && document.body) document.body.dataset.currentRoom = roomId;
    } catch (_) {}
    const projectCount = getRoomProjects(room).length;
    if (roomTitleEl) {
        const baseTitle = room.title || '';
        roomTitleEl.textContent = projectCount
            ? `${baseTitle} · ${projectCount} proyecto${projectCount === 1 ? '' : 's'}`
            : `${baseTitle} · sin proyectos todavía`;
    }
    if (roomDescriptionEl) {
        const desc = room.description || '';
        roomDescriptionEl.textContent = desc;
        roomDescriptionEl.classList.toggle('is-hidden', !desc);
    }
    buildGallery(roomId);
    setView('room');
}

if (goBackBtn) goBackBtn.addEventListener('click', () => {
    playSound(clickSound);
    goBack();
});

if(siteTitle) siteTitle.addEventListener('click', () => {
    playSound(clickSound);
    viewHistory.length = 0;
    currentRoomId = null;
    setView('menu', { pushHistory: false });
});

if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => {
    playSound(clickSound);
    viewHistory.length = 0;
    currentRoomId = null;
    setView('menu', { pushHistory: false });
});

if (goToMapBtn) goToMapBtn.addEventListener('click', () => {
    playSound(clickSound);
    setView('chooseMap');
});

if (goToScheduleBtn) goToScheduleBtn.addEventListener('click', () => {
    playSound(clickSound);
    setView('schedule');
});

if (plantaAltaBtn) plantaAltaBtn.addEventListener('click', () => {
    playSound(clickSound);
    setView('plantaAltaMap');
});

if (plantaBajaBtn) plantaBajaBtn.addEventListener('click', () => {
    playSound(clickSound);
    setView('plantaBajaMap');
});

if (subsueloBtn) subsueloBtn.addEventListener('click', () => {
    playSound(clickSound);
    setView('subsueloMap');
});

// Ensure initial button and view states reflect the default view
updateNavButtons();
updateViewSections();

MAP_VIEW_KEYS.forEach(viewKey => buildMapHotspotsForView(viewKey));

window.addEventListener('resize', () => fitMapToViewport());
window.addEventListener('load', () => fitMapToViewport());
// Set initial view
window.addEventListener('load', () => {
    setView('start', { pushHistory: false });
});

/* ---------- ORIENTATION / ROTATE OVERLAY ---------- */
// Show an overlay prompting mobile users to rotate device to portrait
const rotateOverlay = document.getElementById('rotateOverlay');
function isSmallDeviceLandscape() {
    // treat devices with width <= 900px as 'mobile/tablet' for this purpose
    // and check orientation is landscape
    try {
        const mw = window.innerWidth || document.documentElement.clientWidth;
        const mh = window.innerHeight || document.documentElement.clientHeight;
        const isLandscape = mw > mh;
        // Only show for probable mobile/touch devices (avoid showing on desktop browser when resized)
        const isTouch = (typeof window !== 'undefined') && (('ontouchstart' in window) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches));
        return isLandscape && mw <= 900 && !!isTouch;
    } catch (e) { return false; }
}

let rotateDebounce = null;
function checkRotateOverlay() {
    if (rotateDebounce) clearTimeout(rotateDebounce);
    rotateDebounce = setTimeout(() => {
        const show = isSmallDeviceLandscape();
        if (!rotateOverlay) return;
        if (show) {
            rotateOverlay.setAttribute('aria-hidden', 'false');
            rotateOverlay.classList.add('visible');
            document.body.classList.add('show-rotate');
            // Lock certain behaviors while overlay is shown
            document.body.classList.add('locked');
            // Pause auto-scroll if running
            try { stopAutoScroll(); } catch (_) {}
        } else {
            rotateOverlay.setAttribute('aria-hidden', 'true');
            rotateOverlay.classList.remove('visible');
            document.body.classList.remove('show-rotate');
            document.body.classList.remove('locked');
            // Resume auto-scroll only when appropriate
            try { if (currentView === 'room' && CONFIG.autoScroll && CONFIG.autoScroll.enabled) startAutoScroll(); } catch (_) {}
        }
    }, 120);
}

// Listen for orientation changes and resize events
window.addEventListener('orientationchange', checkRotateOverlay);
window.addEventListener('resize', checkRotateOverlay);
// Also check on load
window.addEventListener('load', () => setTimeout(checkRotateOverlay, 200));

/* ---------- SCHEDULE PAGE ---------- */
function renderSchedule() {
    if (!scheduleContainer || typeof SCHEDULE_DATA === 'undefined') return;
    scheduleContainer.innerHTML = '';

    const frag = document.createDocumentFragment();

    SCHEDULE_DATA.forEach((day, dayIndex) => {
        const dayEl = document.createElement('div');
        dayEl.className = 'schedule-day';

        const dateEl = document.createElement('h3');
        dateEl.className = 'schedule-date';
        dateEl.textContent = `Día ${dayIndex + 1} - ${day.date}`;
        dayEl.appendChild(dateEl);

        // Create a responsive table. For narrow viewports the 3rd/4th columns
        // will be hidden via CSS and the space/block will be shown inside
        // the meta area under the title.
        const table = document.createElement('table');
        table.className = 'schedule-table';

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        ['Hora', 'Título', 'Espacio'].forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        day.events.forEach(event => {
            const tr = document.createElement('tr');
            tr.className = 'schedule-row';

            const tdTime = document.createElement('td');
            tdTime.className = 'schedule-time';
            tdTime.textContent = event.time || '';
            tr.appendChild(tdTime);

            // Title cell contains the title and a hidden meta area with space/block
            const tdTitle = document.createElement('td');
            tdTitle.className = 'schedule-title-cell';
            const titleMain = document.createElement('div');
            titleMain.className = 'schedule-title-main';
            titleMain.textContent = event.title || '';
            tdTitle.appendChild(titleMain);

            // Parse description into space (format: "SPACE — BLOCK").
            // We no longer show the space under the title; space will appear
            // only in the dedicated column to the right.
            let spaceText = '';
            if (event.description) {
                const parts = event.description.split('—').map(s => s.trim());
                spaceText = parts[0] || '';
            }

            tr.appendChild(tdTitle);

            // Separate columns for wider layouts
            const tdSpace = document.createElement('td');
            tdSpace.className = 'schedule-space-col';
            tdSpace.textContent = spaceText;
            tr.appendChild(tdSpace);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        dayEl.appendChild(table);
        frag.appendChild(dayEl);
    });

    scheduleContainer.appendChild(frag);
}

// Pre-render so the schedule is ready the moment the view opens
renderSchedule();

/* ---------- INFO MODAL ---------- */
function openInfo() {
    playSound(clickSound);
    if (infoModal && !infoModal.classList.contains('open')) infoModal.classList.add('open');
    scheduleInactivity();
}
function closeInfo() {
    playSound(clickSound);
    if (infoModal) infoModal.classList.remove('open');
}
if (closeInfoBtn) closeInfoBtn.addEventListener('click', closeInfo);
if (infoModal) infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfo(); });

/* ---------- VIDEO MODAL ---------- */
function openVideo(card) {
    // Update meta
    const titleEl = document.getElementById('videoTitle');
    const artistEl = document.getElementById('videoArtist');
    const descEl = document.getElementById('videoDesc');
    const tagContainer = document.getElementById('videoTags');

    titleEl.textContent = card.dataset.title;
    artistEl.textContent = card.dataset.artist || '';
    descEl.textContent = card.dataset.desc;
    tagContainer.innerHTML = '';
    const tags = JSON.parse(card.dataset.tags || '[]');
    const currentRoomId = card.dataset.roomId; // Get room ID from card

    tags.forEach(tag => {
        const t = document.createElement('span');
        t.className = 'tag';
        t.textContent = tag;
        t.onclick = (e) => { e.stopPropagation(); openTag(tag, currentRoomId); };
        tagContainer.appendChild(t);
    });

    const wasOpen = videoModal.classList.contains('open');
    const newSrc = card.dataset.video;

    // Prepare player: hide visual; ambient continues until video actually plays
    try { player.pause(); } catch (e) {}
    player.classList.add('fade-out');
    player.style.visibility = 'hidden';

    // Open modal early so the browser eagerly starts networking
    if (!wasOpen) videoModal.classList.add('open');
    // Start inactivity watch while a modal is open
    scheduleInactivity();

    // Set source and begin loading
    player.src = newSrc;
    try { player.load(); } catch (e) {}

    // Ensure player has the correct per-clip volume and basic controls
    try {
        const vol = getClipVolume(card);
        player.volume = vol;
        player.muted = false;
        // keep controls minimal (already set in HTML) but ensure PiP disabled programmatically
        try { player.disablePictureInPicture = true; } catch (e) {}
    } catch (e) {}

    const revealAndPlay = () => {
        if (!videoModal.classList.contains('open')) return; // closed meanwhile
        // Fade out ambient when actual playback begins
    // Always fade ambient out when playback actually begins (no-op if already at 0)
    player.addEventListener('playing', () => { fadeAmbient(0, 300); }, { once: true });
        try { player.currentTime = 0; } catch (_) {}
        player.style.visibility = '';
        player.classList.remove('fade-out');
        player.play().catch(() => {});
    };

    // Robust readiness detection: first frame available or canplay, with fallback timer
    let done = false;
    const cleanup = () => {
        player.removeEventListener('loadeddata', onLoadedData);
        player.removeEventListener('loadedmetadata', onLoadedMeta);
        player.removeEventListener('canplay', onCanPlay);
        player.removeEventListener('canplaythrough', onCanPlay);
        player.removeEventListener('error', onError);
        clearTimeout(fallbackTimer);
    };
    const markAndReveal = () => {
        if (done) return; done = true; cleanup(); requestAnimationFrame(revealAndPlay);
    };
    const onLoadedData = () => { if (player.videoWidth > 0) markAndReveal(); };
    const onLoadedMeta = () => {
        if (player.videoWidth > 0) {
            // Set aspect ratio dynamically to match the clip
            try {
                player.style.aspectRatio = `${player.videoWidth} / ${player.videoHeight}`;
            } catch (_) {}
            markAndReveal();
        }
    };
    const onCanPlay = () => { if (player.videoWidth > 0) markAndReveal(); };
    const onError = () => { markAndReveal(); };
    player.addEventListener('loadeddata', onLoadedData);
    player.addEventListener('loadedmetadata', onLoadedMeta);
    player.addEventListener('canplay', onCanPlay);
    player.addEventListener('canplaythrough', onCanPlay);
    player.addEventListener('error', onError, { once: true });
    const fallbackTimer = setTimeout(markAndReveal, 3000);

    // Apply per-clip volume before reveal/play
    const vol = getClipVolume(card);
    player.volume = vol;
}

function closeModal(opts = {}) {
    const silent = !!opts.silent;
    try { player.pause(); } catch (e) {}
    try { player.src = ''; player.load(); } catch (e) {}
    try {
        player.style.visibility = 'hidden';
        player.classList.add('fade-out');
        // Clear dynamic aspect ratio so next clip can set its own
        player.style.aspectRatio = '';
    } catch (e) {}
    videoModal.classList.remove('open');
    // If user wanted ambient, bring it back smoothly
    if (ambientOn) {
        ensureAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        fadeAmbient(SETTINGS.ambientVol, 400);
    }
}

closeVideo.addEventListener('click', () => { playSound(clickSound); closeModal(); });

/* ---------- TAG NAVIGATION ---------- */
function openTag(tag, roomId) {
    const cards = Array.from(document.querySelectorAll('.card'));
    // Filter by tag AND room
    const matches = cards.filter(c => {
        const hasTag = JSON.parse(c.dataset.tags || "[]").includes(tag);
        const inRoom = roomId ? c.dataset.roomId === roomId : true;
        return hasTag && inRoom;
    });
    
    if (!matches.length) return;

    // Use the player's current source to exclude the currently playing card.
    const currentSrc = player.src || '';

    const others = matches.filter(c => {
        // compare filenames/paths; player.src may be absolute URL so compare by
        // ending substring
        try {
            const cv = c.dataset.video || '';
            return !currentSrc.endsWith(cv);
        } catch (e) { return true; }
    });

    // If no other matches, do nothing.
    if (!others.length) return;

    const next = others[Math.floor(Math.random() * others.length)];
    openVideo(next);
}

// Close modal when clicking on backdrop (outside the video-frame)
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeModal();
    }
});

// Ensure videos loop (guard in case of partial DOM)
if (player) player.loop = true;

/* ---------- INACTIVITY AUTO-CLOSE (60s) ---------- */
const INACTIVITY_MS = 60 * 1000; // 60 seconds
let inactivityTimer = null;

function anyModalOpen() {
    return (videoModal && videoModal.classList.contains('open')) ||
           (infoModal && infoModal.classList.contains('open'));
}

function scheduleInactivity() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (!anyModalOpen()) return;
    inactivityTimer = setTimeout(() => {
        if (videoModal && videoModal.classList.contains('open')) closeModal({ silent: true });
    }, INACTIVITY_MS);
}

function resetInactivityOnEvent() {
    if (anyModalOpen()) scheduleInactivity();
}

['pointerdown','mousemove','keydown','wheel','touchstart'].forEach(ev => {
    document.addEventListener(ev, resetInactivityOnEvent, { passive: true });
});

/* ---------- MUTE WHEN PAGE IS NOT VISIBLE ---------- */
let visibilityMuteApplied = false;
let visibilityPrev = { videoMuted: null, ambientVol: null };

function muteForHiddenPage() {
    try {
        visibilityPrev.videoMuted = player.muted;
        player.muted = true; // don't touch player.volume to preserve level
    } catch (_) {}
    try {
        visibilityPrev.ambientVol = ambient.volume;
        // Smoothly bring ambient to 0; pause when it reaches 0
        fadeAmbient(0, 200);
    } catch (_) {}
    visibilityMuteApplied = true;
}

function restoreAfterVisible() {
    if (!visibilityMuteApplied) return;
    // Restore player muted state only if we changed it
    try { if (visibilityPrev.videoMuted === false) player.muted = false; } catch (_) {}
    // Restore ambient only if user has it ON
    try {
        if (ambientOn) fadeAmbient(SETTINGS.ambientVol, 200);
    } catch (_) {}
    visibilityMuteApplied = false;
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) muteForHiddenPage(); else restoreAfterVisible();
});
window.addEventListener('pagehide', muteForHiddenPage);
window.addEventListener('focus', restoreAfterVisible);
window.addEventListener('blur', muteForHiddenPage);

/* ---------- AUDIO UTILITIES ---------- */
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function getClipVolume(card) {
    // Volume rules:
    // 1) Global SETTINGS.videoVol is the default "bus" level for all videos.
    // 2) If a card has a per-clip volume, it overrides the global (except rule 3).
    // 3) If SETTINGS.videoVol === 0, force total silence regardless of per-clip.
    if (SETTINGS.videoVol === 0) return 0;
    const clip = parseFloat((card && card.dataset && card.dataset.volume != null) ? card.dataset.volume : '');
    const hasClip = !Number.isNaN(clip);
    const base = hasClip ? clip : SETTINGS.videoVol;
    return clamp01(base);
}

/* ---------- IN-PAGE DEV TUNER (UI) ---------- */
/* (dev tuner removed) */
