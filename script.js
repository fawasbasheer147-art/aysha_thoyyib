document.addEventListener('DOMContentLoaded', () => {

    const video = document.getElementById('curtainVideo');
    const playOverlay = document.getElementById('playOverlay');
    const textOverlay = document.getElementById('textOverlay');
    const music = document.getElementById('bgMusic');

    video.poster = 'assests/images/first.jpg';

    if (music) {
        music.volume = 0.3;
    }

    // AUTO SCROLL VARIABLES
    // AUTO SCROLL VARIABLES
// AUTO SCROLL VARIABLES
let autoScrolling = false;
let userInteracted = false;

// SMOOTH AUTO SCROLL
function startAutoScroll() {

    if (userInteracted) return;

    autoScrolling = true;

    function scrollStep() {

        // STOP IF USER INTERACTED
        if (!autoScrolling || userInteracted) return;

        // STOP AT PAGE END
        if (
            window.innerHeight + window.scrollY >=
            document.body.scrollHeight - 5
        ) {
            autoScrolling = false;
            return;
        }

        window.scrollBy(0, 0.8);

        requestAnimationFrame(scrollStep);
    }

    requestAnimationFrame(scrollStep);
}

// STOP AUTO SCROLL
let inactivityTimer;

// STOP AUTO SCROLL
function stopAutoScroll() {

    autoScrolling = false;

    // clear previous timer
    clearTimeout(inactivityTimer);

    // restart auto scroll after 5 sec inactivity
    inactivityTimer = setTimeout(() => {

        userInteracted = false;

        startAutoScroll();

    }, 5000);
}

// START EXPERIENCE
const startExperience = () => {

    playOverlay.style.opacity = '0';

    setTimeout(() => {
        playOverlay.style.display = 'none';
    }, 500);

    // PLAY MUSIC
    if (music) {

        music.play().then(() => {

            const mIcon = document.getElementById('musicIcon');

            if (mIcon) {
                mIcon.textContent = '🔊';
            }

            try {
                isPlaying = true;
            } catch (e) { }

        }).catch(error => {
            console.error("Music playback failed:", error);
        });
    }

    // PLAY VIDEO
    video.play().catch(error => {
        console.error("Video playback failed:", error);
    });

    // START AUTO SCROLL AFTER 5 SEC
    setTimeout(() => {
document.body.style.overflowY = 'auto';
        if (!userInteracted) {
            startAutoScroll();
        }

    }, 5000);
};


// STOP WHEN USER TOUCHES / SCROLLS
// STOP ONLY AFTER AUTO SCROLL STARTS
window.addEventListener('touchmove', () => {
    if (autoScrolling) stopAutoScroll();
}, { passive: true });

window.addEventListener('wheel', () => {
    if (autoScrolling) stopAutoScroll();
}, { passive: true });

window.addEventListener('mousedown', () => {
    if (autoScrolling) stopAutoScroll();
});
    // START EVENTS
    playOverlay.addEventListener('click', startExperience);
    playOverlay.addEventListener('touchstart', startExperience, { passive: true });

    // TEXT REVEAL
    video.addEventListener('timeupdate', () => {

        if (video.currentTime > 0.5) {

            if (textOverlay && !textOverlay.classList.contains('reveal')) {
                textOverlay.classList.add('reveal');
            }
        }
    });

    // HERO VIDEO END
    video.addEventListener('ended', () => {

        const heroSection = document.querySelector('.hero-section');

        if (heroSection) {

            heroSection.style.opacity = '0';
            heroSection.style.visibility = 'hidden';

            setTimeout(() => {

                heroSection.style.display = 'none';
                document.body.style.overflow = 'auto';

            }, 1500);

        } else {

            document.body.style.overflow = 'auto';
        }
    });

    // SCROLL ANIMATIONS
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });

    }, {
        threshold: 0.15
    });

    const scrollElements = document.querySelectorAll('.scroll-animate, .stagger-anim');

    scrollElements.forEach(el => observer.observe(el));

    // INIT FUNCTIONS
    setupScratchCards();
    setupCountdown();
});


// SCRATCH CARDS
function setupScratchCards() {

    const canvases = document.querySelectorAll('.scratch-canvas');

    let completedCount = 0;
    let videoPlayed = false;

    function playScratchVideo() {

        if (!videoPlayed) {

            const scratchVid = document.getElementById('scratchVideo');

            if (scratchVid) {

                scratchVid.play().catch(e => console.log('Video play failed', e));

                videoPlayed = true;
            }
        }
    }

    canvases.forEach(canvas => {

        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        let isDrawing = false;
        let isCompleted = false;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        let gradient;

        if (ctx.createConicGradient) {

            gradient = ctx.createConicGradient(0, cx, cy);

            gradient.addColorStop(0, "#e8c37d");
            gradient.addColorStop(0.125, "#fff2b2");
            gradient.addColorStop(0.25, "#d4af37");
            gradient.addColorStop(0.375, "#ca9a2b");
            gradient.addColorStop(0.5, "#fcefba");
            gradient.addColorStop(0.625, "#e8c37d");
            gradient.addColorStop(0.75, "#d4af37");
            gradient.addColorStop(0.875, "#fff2b2");
            gradient.addColorStop(1, "#e8c37d");

        } else {

            gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, cx);

            gradient.addColorStop(0, "#fcefba");
            gradient.addColorStop(1, "#d4af37");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255,255,255,0.05)";

        for (let i = 0; i < 400; i++) {

            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1,
                1
            );
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 18;

        let lastX = 0;
        let lastY = 0;

        function getMousePos(e) {

            const rect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            let clientX = e.clientX;
            let clientY = e.clientY;

            if (e.touches && e.touches.length > 0) {

                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;

            } else if (e.changedTouches && e.changedTouches.length > 0) {

                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        function scratch(e) {

            if (!isDrawing || isCompleted) return;

            e.preventDefault();

            const pos = getMousePos(e);

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            lastX = pos.x;
            lastY = pos.y;

            checkCompletion();
        }

        canvas.addEventListener('mousedown', (e) => {

            isDrawing = true;

            playScratchVideo();

            const pos = getMousePos(e);

            lastX = pos.x;
            lastY = pos.y;
        });

        canvas.addEventListener('mousemove', scratch);

        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        canvas.addEventListener('touchstart', (e) => {

            isDrawing = true;

            playScratchVideo();

            const pos = getMousePos(e);

            lastX = pos.x;
            lastY = pos.y;

        }, { passive: false });

        canvas.addEventListener('touchmove', scratch, { passive: false });

        window.addEventListener('touchend', () => {
            isDrawing = false;
        });

        function checkCompletion() {

            if (isCompleted) return;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            let transparentPixels = 0;

            const totalPixels = imageData.data.length / 4;

            for (let i = 3; i < imageData.data.length; i += 16) {

                if (imageData.data[i] < 50) {
                    transparentPixels++;
                }
            }

            const transparentRatio = transparentPixels / (totalPixels / 4);

            if (transparentRatio > 0.05) {

                isCompleted = true;

                canvas.style.transition = 'opacity 0.3s ease';
                canvas.style.opacity = '0';

                const base = canvas.parentElement.querySelector('.scratch-base');

                if (base) {
                    base.classList.add('scratched-pop');
                }

                setTimeout(() => {
                    canvas.style.display = 'none';
                }, 300);

                completedCount++;

                if (completedCount === 3) {
                    onAllScratched();
                }
            }
        }
    });

    function onAllScratched() {

        const scratchContainer = document.querySelector('.scratch-container');

        let originY = 0.5;
        let originX = 0.5;

        if (scratchContainer) {

            const rect = scratchContainer.getBoundingClientRect();

            originY = (rect.top + rect.height / 2) / window.innerHeight;
            originX = (rect.left + rect.width / 2) / window.innerWidth;
        }

        if (typeof confetti === 'function') {

            confetti({
                particleCount: 150,
                spread: 80,
                origin: { x: originX, y: originY },
                colors: ['#D4AF37', '#ffffff', '#e12a2a'],
                zIndex: 9999
            });
        }
    }
}


// COUNTDOWN
function setupCountdown() {

    const countdownDate = new Date("July 25, 2026 16:00:00").getTime();

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    const timer = setInterval(() => {

        const now = new Date().getTime();

        const distance = countdownDate - now;

        if (distance < 0) {

            clearInterval(timer);
            return;
        }

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        days = days < 10 ? '0' + days : days;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        if (dEl) dEl.innerHTML = days;
        if (hEl) hEl.innerHTML = hours;
        if (mEl) mEl.innerHTML = minutes;
        if (sEl) sEl.innerHTML = seconds;

    }, 1000);
}