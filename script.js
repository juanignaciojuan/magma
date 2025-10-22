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
// Using a single video player (`player`) — avoid dual-player logic entirely.

/* ---------- AUDIO ---------- */
const ambient = new Audio("audio/ambient.mp3");
ambient.loop = true;
ambient.volume = 0.25;

const hoverSound = new Audio("audio/hover.mp3");
hoverSound.volume = 0.5;
const clickSound = new Audio("audio/click.mp3");
clickSound.volume = 0.5;

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
    fadeAmbient(ambientOn ? 0 : 0.25, 500);
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

/* ---------- PARTICLE BACKGROUND ---------- */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let t = 0, mouseX = 0, mouseY = 0;
// Grain animation state
let grains = [];

// Config - tweak these values to change visual/audio behaviour
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

// Replace the previous interactive noise with a simple film-grain animation
// that does not react to the mouse. This simulates an old cinema grain.
// Grain parameters are in CONFIG (below added if not present).
// We'll generate a set of grains on resize and animate them with a subtle vertical
// drift and flicker.

// extend CONFIG with grain params (safe-guard: only add if absent)
if (typeof CONFIG.grainCount === 'undefined') {
    Object.assign(CONFIG, {
        grainCount: 1200,      // number of grain dots (more visible)
        grainSizeMin: 1,       // min size in px
        grainSizeMax: 3,       // max size in px (slightly bigger)
        grainSpeed: 0.04,      // vertical speed multiplier
        grainOpacity: 0.10,    // base alpha for grains (more visible)
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

    // optional background image (if provided and cached)
    if (CONFIG.backgroundImage) {
        // draw as subtle background if image exists
        try {
            const img = document.getElementById('bgImgRef');
            if (img && img.complete) ctx.drawImage(img, 0, 0, w, h);
        } catch (e) {}
    }

    // draw grains
    ctx.beginPath();
    for (let i = 0; i < grains.length; i++) {
        const g = grains[i];
        // vertical drift
        const yy = (g.y + t * g.speed * 60) % h;
        const flick = 0.6 + 0.4 * Math.sin((t + i) * 6 + (i % 7));
        const a = Math.max(0, Math.min(1, g.alpha * flick));
        ctx.fillStyle = `rgba(220,220,220,${a})`;
        // draw small rectangle as grain
        ctx.fillRect(Math.floor(g.x), Math.floor(yy), Math.ceil(g.r), Math.ceil(g.r));
    }

    // subtle full-screen noise overlay (very low alpha)
    ctx.fillStyle = `rgba(255,255,255,${CONFIG.backgroundGlow * 0.02})`;
    ctx.fillRect(0, 0, w, h);

    t += 0.6;
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
    shuffledProjects.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.video = p.video;
        card.dataset.volume = (p.volume != null ? p.volume : 1);
        card.dataset.title = p.title;
        card.dataset.desc = p.desc;
        card.dataset.tags = JSON.stringify(p.tags);
        card.innerHTML = `<img src="${p.img}" draggable="false">`;
        gallery.appendChild(card);
    });

    // Add interactions after cards are created
    gallery.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => playSound(hoverSound));
        card.addEventListener('click', () => {
            playSound(clickSound);
            openVideo(card);
        });
    });
}

// build initially
buildGallery();

// reshuffle button
const reshuffleBtn = document.getElementById('reshuffleBtn');
if (reshuffleBtn) reshuffleBtn.addEventListener('click', () => buildGallery());

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

    const revealAndPlay = () => {
        if (!videoModal.classList.contains('open')) return; // closed meanwhile
        // Fade out ambient when actual playback begins
        player.addEventListener('playing', () => { if (ambientOn) fadeAmbient(0, 300); }, { once: true });
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
    const vol = Math.max(0, Math.min(1, parseFloat(card.dataset.volume || '1')));
    player.volume = isNaN(vol) ? 1 : vol;
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
        fadeAmbient(0.25, 400);
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
