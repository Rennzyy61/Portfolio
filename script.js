// --- 1. KURSOR KUSTOM ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', function (e) {
    const posX = e.clientX; const posY = e.clientY;
    cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({
        left: `${posX - 20}px`, top: `${posY - 20}px`
    }, { duration: 500, fill: "forwards" });
});

function bindCursorEvents() {
    const clickables = document.querySelectorAll('.cyber-btn, .close-btn, .cat-btn, .gallery-item, .lightbox-close, .cf-btn, .cf-item, .comic-panel, .video-card, .ai-video-card, .ctrl-btn, .progress-bar-container, .uiux-card, .uiux-btn, .chip-btn, .video-edit-card, .poster-card, .vedit-preview, .catalog-card');
    
    clickables.forEach(item => {
        item.removeEventListener('mouseenter', expandCursor);
        item.removeEventListener('mouseleave', shrinkCursor);
        
        item.addEventListener('mouseenter', expandCursor);
        item.addEventListener('mouseleave', shrinkCursor);
    });
}

function expandCursor() {
    cursorOutline.style.width = '70px'; cursorOutline.style.height = '70px';
    cursorOutline.style.background = 'var(--theme-main)';
    cursorOutline.style.opacity = '0.3';
}

function shrinkCursor() {
    cursorOutline.style.width = '40px'; cursorOutline.style.height = '40px';
    cursorOutline.style.background = 'transparent';
    cursorOutline.style.opacity = '1';
}

// --- 2. BUKA TUTUP PANEL & TEMA ---
const dashboard = document.getElementById('main-dashboard');
const panels = document.querySelectorAll('.content-panel');

function openPanel(panelId) {
    dashboard.classList.add('hidden');
    document.getElementById(panelId).classList.add('active');
}

function closePanels() {
    dashboard.classList.remove('hidden');
    panels.forEach(panel => panel.classList.remove('active'));
    document.body.setAttribute('data-theme', 'theme-cyber');
}

function switchCategory(event, categoryId, themeName) {
    document.body.setAttribute('data-theme', themeName);
    
    const tabBtns = document.querySelectorAll('.cat-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const grids = document.querySelectorAll('.gallery-grid');
    grids.forEach(grid => grid.classList.remove('active-grid'));
    document.getElementById(categoryId).classList.add('active-grid');
}

// --- 3. SISTEM LIGHTBOX TERPUSAT & CYBER-PLAYER ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const cyberPlayerWrapper = document.getElementById('cyber-player-wrapper');

const btnPlayPause = document.getElementById('btn-play-pause');
const btnMute = document.getElementById('btn-mute');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const timeDisplay = document.getElementById('time-display');

function openLightbox(src, isVideo = false) {
    if (!lightbox) return;

    if (isVideo && lightboxVideo && cyberPlayerWrapper) {
        if (lightboxImg) lightboxImg.style.display = 'none';
        
        cyberPlayerWrapper.style.display = 'flex';
        lightboxVideo.src = src;
        lightboxVideo.muted = false; 
        lightboxVideo.play();
        
        if(btnPlayPause) btnPlayPause.innerText = "[ || ] PAUSE";
        if(btnMute) btnMute.innerText = "[ 🔊 ] MUTE";
    } else if (lightboxImg) {
        if (cyberPlayerWrapper) cyberPlayerWrapper.style.display = 'none';
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
    }

    lightbox.classList.add('active');
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');

    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
    }
    if (cyberPlayerWrapper) cyberPlayerWrapper.style.display = 'none';
    if (lightboxImg) {
        lightboxImg.src = '';
        lightboxImg.style.display = 'none';
    }

    shrinkCursor();
    if (cursorDot && cursorOutline) {
        cursorDot.style.display = 'block';
        cursorOutline.style.display = 'block';
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    }
}

document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('lightbox-close') || e.target.id === 'lightbox') {
        closeLightbox();
        return;
    }

    const cfItem = e.target.closest('.cf-item');
    if (cfItem) {
        const index = Array.from(document.querySelectorAll('.cf-item')).indexOf(cfItem);
        if (index !== currentCfIndex) {
            currentCfIndex = index;
            initCoverflow();
        } else {
            const img = cfItem.querySelector('img');
            if (img) openLightbox(img.src, false);
        }
        return;
    }

    const galleryItem = e.target.closest('.comic-panel') || e.target.closest('.gallery-item') || e.target.closest('.poster-card') || e.target.closest('.catalog-card');
    if (galleryItem) {
        const img = galleryItem.querySelector('img');
        if (img && !galleryItem.classList.contains('video-card') && !galleryItem.classList.contains('ai-video-card') && !galleryItem.classList.contains('video-edit-card')) {
            openLightbox(img.src, false);
            return;
        }
    }

    const videoCard = e.target.closest('.video-card') || e.target.closest('.ai-video-card') || e.target.closest('.video-edit-card');
    if (videoCard) {
        const video = videoCard.querySelector('video');
        const source = videoCard.querySelector('source');
        const videoSrc = source ? source.src : (video ? video.src : null);
        if (videoSrc) {
            openLightbox(videoSrc, true); 
        }
        return;
    }
});

if (btnPlayPause && lightboxVideo) {
    btnPlayPause.addEventListener('click', function() {
        if (lightboxVideo.paused) {
            lightboxVideo.play();
            btnPlayPause.innerText = "[ || ] PAUSE";
        } else {
            lightboxVideo.pause();
            btnPlayPause.innerText = "[ ▶ ] PLAY";
        }
    });
}

if (btnMute && lightboxVideo) {
    btnMute.addEventListener('click', function() {
        if (lightboxVideo.muted) {
            lightboxVideo.muted = false;
            btnMute.innerText = "[ 🔊 ] MUTE";
        } else {
            lightboxVideo.muted = true;
            btnMute.innerText = "[ 🔇 ] UNMUTE";
        }
    });
}

if (lightboxVideo) {
    lightboxVideo.addEventListener('timeupdate', function() {
        const current = lightboxVideo.currentTime;
        const duration = lightboxVideo.duration;

        if (duration) {
            const progressPercent = (current / duration) * 100;
            if (progressFill) progressFill.style.width = `${progressPercent}%`;

            let curMins = Math.floor(current / 60);
            let curSecs = Math.floor(current - curMins * 60);
            let durMins = Math.floor(duration / 60);
            let durSecs = Math.floor(duration - durMins * 60);

            if(curSecs < 10) curSecs = "0" + curSecs;
            if(durSecs < 10) durSecs = "0" + durSecs;
            if(curMins < 10) curMins = "0" + curMins;
            if(durMins < 10) durMins = "0" + durMins;

            if (timeDisplay) timeDisplay.innerText = `${curMins}:${curSecs} / ${durMins}:${durSecs}`;
        }
    });

    if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = lightboxVideo.duration;

            if (duration) {
                lightboxVideo.currentTime = (clickX / width) * duration;
            }
        });
    }
}

// --- 4. MESIN 3D COVERFLOW (FEED_IG) ---
let currentCfIndex = 0;
const cfItems = document.querySelectorAll('.cf-item');

function initCoverflow() {
    if (!cfItems.length) return;
    
    cfItems.forEach((item, i) => {
        let offset = i - currentCfIndex;
        let absOffset = Math.abs(offset);
        
        let scale = 1 - (absOffset * 0.15); 
        let translateX = offset * 130; 
        let zIndex = 100 - absOffset;
        let opacity = absOffset > 3 ? 0 : 1 - (absOffset * 0.2);

        item.style.transform = `translateX(${translateX}px) scale(${scale})`;
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;
        
        if(offset === 0) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function moveCoverflow(step) {
    currentCfIndex += step;
    if (currentCfIndex < 0) currentCfIndex = 0;
    if (currentCfIndex >= cfItems.length) currentCfIndex = cfItems.length - 1;
    initCoverflow();
}

setTimeout(initCoverflow, 100); 
bindCursorEvents();