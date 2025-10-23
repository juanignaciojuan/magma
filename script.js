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

/* ---------- AUDIO ---------- */
// Global volumes you can tweak (see also CSS variables for card sizes)
const SETTINGS = {
    ambientVol: 1,  // ambient soundtrack default volume when ON
    hoverVol: 0.5,    // UI hover sound volume
    clickVol: 0.5,    // UI click sound volume
    videoVol: 0.5     // default video volume if a clip doesn't specify one
};
const ambient = new Audio("audio/ambient.mp3");
ambient.loop = true;
ambient.volume = SETTINGS.ambientVol;

const hoverSound = new Audio("audio/hover.mp3");
hoverSound.volume = SETTINGS.hoverVol;
const clickSound = new Audio("audio/click.mp3");
clickSound.volume = SETTINGS.clickVol;

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
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    if (ambient.paused) ambient.play().catch(() => {});
    ambient.volume = SETTINGS.ambientVol;
    ambientOn = true;
    toggleAmbient.textContent = '♫';
    startOverlay.style.display = 'none';
});

// One-time unlock for audio on first pointer interaction (improves mobile)
function unlockAudioOnFirstGesture() {
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
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
// Particle background disabled; using film-grain instead.
// let mouseX = 0; let mouseY = 0;

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
    Object.assign(CONFIG, {
        grainCount: 1600,   // number of grain dots (more visible)
        grainSizeMin: 1,    // min size in px
        grainSizeMax: 2,    // max size in px
        grainSpeed: 0.06,   // vertical speed multiplier
        grainOpacity: 0.18, // base alpha for grains (visible)
        backgroundImage: null  // optional background image path (null = plain dark)
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
    // dark base
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // draw grains
    for (let i = 0; i < grains.length; i++) {
        const g = grains[i];
        // vertical drift
        const yy = (g.y + t * g.speed * 60) % h;
        const flick = 0.5 + 0.5 * Math.sin((t + i) * 4 + (i % 7));
        const a = Math.max(0, Math.min(1, g.alpha * flick));
        ctx.fillStyle = `rgba(230,230,230,${a})`;
        // draw small rectangle as grain
        ctx.fillRect(Math.floor(g.x), Math.floor(yy), Math.ceil(g.r), Math.ceil(g.r));
    }

    // subtle full-screen noise overlay (very low alpha)
    ctx.fillStyle = `rgba(255,255,255,${CONFIG.backgroundGlow * 0.02})`;
    ctx.fillRect(0, 0, w, h);

    t += 0.5;
    requestAnimationFrame(drawNoise);
}

window.addEventListener('resize', () => { generateGrains(); });
generateGrains();
drawNoise();
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
        card.dataset.volume = (p.volume != null ? p.volume : 1);
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
        frag.appendChild(card);
    });
    // append fragment for better performance when many cards
    gallery.appendChild(frag);

    // Add interactions after cards are created
    const HOVER_CAPABLE = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    gallery.querySelectorAll('.card').forEach(card => {
        if (HOVER_CAPABLE) {
            card.addEventListener('mouseenter', () => playSound(hoverSound));
        }
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
    buildGallery();
    // Re-observe all new thumbnails so they load and aspect ratios are measured
    document.querySelectorAll('.thumb').forEach(i => thumbObserver.observe(i));
});

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

    const wasOpen = videoModal.classList.contains('open');
    const newSrc = card.dataset.video;

    // Prepare player: hide visual; ambient continues until video actually plays
    try { player.pause(); } catch (e) {}
    player.classList.add('fade-out');
    player.style.visibility = 'hidden';

    // Open modal early so the browser eagerly starts networking
    if (!wasOpen) videoModal.classList.add('open');

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

function closeModal() {
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

closeVideo.addEventListener('click', closeModal);

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

/* ---------- AUDIO UTILITIES ---------- */
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function getClipVolume(card) {
    // SETTINGS has priority: if global videoVol is 0, force silence regardless of per-clip
    if (SETTINGS.videoVol === 0) return 0;
    const clip = parseFloat(card?.dataset?.volume ?? '');
    const hasClip = !Number.isNaN(clip);
    const base = hasClip ? clip : SETTINGS.videoVol;
    return clamp01(base);
}
