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
// Map UI elements
const openMapBtn = document.getElementById('openMapBtn');
const mapModal = document.getElementById('mapModal');
const closeMapBtn = document.getElementById('closeMap');
const mapImage = document.getElementById('mapImage');
const schedulePane = document.getElementById('schedulePane');
const scheduleList = document.getElementById('scheduleList');
const openScheduleBtn = document.getElementById('openScheduleBtn');
const openMapViewBtn = document.getElementById('openMapViewBtn');
// Info UI elements
const openInfoBtn = document.getElementById('openInfoBtn');
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
const MAP_IMAGE_SRC = 'img/noise1.png';
const MAP_VIDEO_LOW_VOL = 0.02; // lower target so fade-down is clearly perceptible
let mapOpenedFromVideo = false;
let mapPrevVideoVol = null;
let playerVolFadeInterval = null;

function fadePlayerVolume(toVol, duration = 300) {
    try {
        if (playerVolFadeInterval) clearInterval(playerVolFadeInterval);
        const start = Math.max(0, Math.min(1, player.volume || 0));
        const target = Math.max(0, Math.min(1, toVol));
        const steps = Math.max(1, Math.round(duration / 30));
        const step = (target - start) / steps;
        let n = 0;
        playerVolFadeInterval = setInterval(() => {
            n++;
            const v = start + step * n;
            player.volume = Math.max(0, Math.min(1, v));
            if (n >= steps) {
                player.volume = target;
                clearInterval(playerVolFadeInterval);
                playerVolFadeInterval = null;
            }
        }, 30);
    } catch (_) { /* ignore */ }
}

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
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    if (ambient.paused) ambient.play().catch(() => {});
    ambient.volume = SETTINGS.ambientVol;
    ambientOn = true;
    toggleAmbient.textContent = '♫';
        startOverlay.style.display = 'none';
        try { document.body.classList.remove('locked'); } catch (_) {}
});

// One-time unlock for audio on first pointer interaction (improves mobile)
function unlockAudioOnFirstGesture() {
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    // Also kick off auto-scroll on first user gesture if enabled
    try {
        if (CONFIG.autoScroll && CONFIG.autoScroll.enabled && !autoScrollState.running) startAutoScroll();
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

function buildGallery() {
    // clear existing
    gallery.innerHTML = '';
    const shuffledProjects = shuffleArray(projects);
    const frag = document.createDocumentFragment();
    shuffledProjects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.video = p.video;
    // Only set per-clip volume if provided in data.js. If absent, we don't
    // write a value so getClipVolume() will fall back to SETTINGS.videoVol.
    if (p.volume != null) card.dataset.volume = p.volume;
        card.dataset.title = p.title;
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
}

// build initially
buildGallery();

// Lazy-load thumbnails and pre-measure video aspect ratios when thumbnails enter view
const thumbObserver = new IntersectionObserver((entries) => {
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

// observe all thumbs
document.querySelectorAll('.thumb').forEach(i => thumbObserver.observe(i));

// reshuffle button
const reshuffleBtn = document.getElementById('reshuffleBtn');
if (reshuffleBtn) reshuffleBtn.addEventListener('click', () => {
    playSound(clickSound);
    buildGallery();
    // Re-observe all new thumbnails so they load and aspect ratios are measured
    document.querySelectorAll('.thumb').forEach(i => thumbObserver.observe(i));
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

/* ---------- MAP MODAL ---------- */
function openMap(opts = {}) {
    playSound(clickSound);
    // Load the map image and open the overlay
    try { mapImage.src = MAP_IMAGE_SRC; } catch (_) {}
    if (mapModal && !mapModal.classList.contains('open')) mapModal.classList.add('open');
    // Set default view per caller: 'schedule' or 'map' (default 'map')
    try {
        const def = opts.defaultView === 'schedule' ? 'schedule' : 'map';
        if (def === 'schedule') {
            if (schedulePane) {
                renderSchedule();
                schedulePane.classList.add('open');
            }
        } else {
            if (schedulePane) schedulePane.classList.remove('open');
        }
    } catch (_) {}
    // If the map is opened from inside the video modal, fade the video's volume down
    const fromVideo = !!opts.fromVideo;
    if (fromVideo && videoModal && videoModal.classList.contains('open')) {
        mapOpenedFromVideo = true;
        try { mapPrevVideoVol = player.volume; } catch (_) { mapPrevVideoVol = null; }
        if (typeof mapPrevVideoVol === 'number') fadePlayerVolume(MAP_VIDEO_LOW_VOL, 600);
    } else {
        mapOpenedFromVideo = false;
    }
    scheduleInactivity();
}

function closeMap(opts = {}) {
    const silent = !!opts.silent;
    if (!silent) playSound(clickSound);
    // Clear image to free memory for big PNGs
    try { mapImage.src = ''; } catch (_) {}
    if (mapModal) mapModal.classList.remove('open');
    // If we lowered the video's volume when opening the map, restore it smoothly
    if (mapOpenedFromVideo && videoModal && videoModal.classList.contains('open')) {
        if (typeof mapPrevVideoVol === 'number') fadePlayerVolume(mapPrevVideoVol, 250);
    }
}

// Header "map" opens with schedule as default view
if (openMapBtn) openMapBtn.addEventListener('click', () => openMap({ defaultView: 'schedule' }));
if (closeMapBtn) closeMapBtn.addEventListener('click', () => closeMap());
if (mapModal) mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) closeMap();
});
// Footer actions in map modal
if (openScheduleBtn) openScheduleBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (!schedulePane) return;
    // Always open schedule view
    try { renderSchedule(); } catch (_) {}
    schedulePane.classList.add('open');
});
if (openMapViewBtn) openMapViewBtn.addEventListener('click', () => {
    playSound(clickSound);
    if (schedulePane) schedulePane.classList.remove('open');
});

function renderSchedule() {
    if (!scheduleList) return;
    const items = Array.isArray(window.scheduleProjects) ? window.scheduleProjects : [];
    // Only re-render if empty to avoid duplicates
    if (scheduleList.childElementCount > 0) return;
    const frag = document.createDocumentFragment();
    items.forEach(it => {
        const wrap = document.createElement('div');
        wrap.className = 'schedule-item';
        const h = document.createElement('h3');
        h.textContent = it.title || '';
        const p = document.createElement('p');
        p.textContent = it.desc || '';
        wrap.appendChild(h); wrap.appendChild(p);
        frag.appendChild(wrap);
    });
    // Fallback if no items available
    if (!items.length) {
        const p = document.createElement('p');
        p.textContent = 'Próximamente: guía y cronograma.';
        frag.appendChild(p);
    }
    scheduleList.innerHTML = '';
    scheduleList.appendChild(frag);
}

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
if (openInfoBtn) openInfoBtn.addEventListener('click', openInfo);
if (closeInfoBtn) closeInfoBtn.addEventListener('click', closeInfo);
if (infoModal) infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfo(); });

/* ---------- VIDEO MODAL ---------- */
function openVideo(card) {
    // Update meta
    const titleEl = document.getElementById('videoTitle');
    const descEl = document.getElementById('videoDesc');
    const tagContainer = document.getElementById('videoTags');

    titleEl.textContent = card.dataset.title;
    descEl.textContent = card.dataset.desc;
    tagContainer.innerHTML = '';
    const tags = JSON.parse(card.dataset.tags || '[]');
    tags.forEach(tag => {
        const t = document.createElement('span');
        t.className = 'tag';
        t.textContent = tag;
        t.onclick = (e) => { e.stopPropagation(); openTag(tag); };
        tagContainer.appendChild(t);
    });
    // Orange "Mapa" button to the right of tags (opens the same map modal)
    const mapBtn = document.createElement('button');
    mapBtn.type = 'button';
    mapBtn.className = 'tag map-btn';
    mapBtn.textContent = 'mapa';
    // Open map from video: default to map view, and fade video volume
    mapBtn.onclick = (e) => { e.stopPropagation(); openMap({ fromVideo: true, defaultView: 'map' }); };
    tagContainer.appendChild(mapBtn);

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
function openTag(tag) {
    const cards = Array.from(document.querySelectorAll('.card'));
    const matches = cards.filter(c => JSON.parse(c.dataset.tags || "[]").includes(tag));
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
           (mapModal && mapModal.classList.contains('open')) ||
           (infoModal && infoModal.classList.contains('open'));
}

function scheduleInactivity() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (!anyModalOpen()) return;
    inactivityTimer = setTimeout(() => {
        if (videoModal && videoModal.classList.contains('open')) closeModal({ silent: true });
        if (mapModal && mapModal.classList.contains('open')) closeMap({ silent: true });
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
