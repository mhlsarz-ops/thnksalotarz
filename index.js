const audio = document.getElementById("audio-player");
const playerCard = document.getElementById("player-card");
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon"); 

const creditWrapper = document.getElementById("credit-wrapper");
const creditTextElement = document.getElementById("credit-text");
const walkingGif = document.getElementById("walking-gif");
const creditString = "Created by Nofanadi, assisted by Gemini";
let charIndex = 0;

const frame1 = document.getElementById("frame-1");
const frame2 = document.getElementById("frame-2");
const img1 = document.getElementById("img-1");
const img2 = document.getElementById("img-2");
const lyric1 = document.getElementById("lyric-1");
const lyric2 = document.getElementById("lyric-2");
let isFrame1Active = true; 

const filmBg = document.getElementById("film-bg");
const progressBarFill = document.getElementById("progress-bar-fill");
const currentTimeDisplay = document.getElementById("current-time");

const chatContainer = document.getElementById("chat-container");
let chatInterval;

const chatImages = [];
for (let i = 1; i <= 23; i++) {
    chatImages.push(`chat${i}.png`);
}

const syncData = [
    { time: 0.0,   text: "I", img: "foto1.jpg" },
    { time: 7.5,   text: "Know a place", img: "foto2.jpg" },
    { time: 13.5,  text: "It's somewhere I go when I need to remember your face", img: "foto3.jpg" }, 
    { time: 21.0,  text: "We get married", img: "foto4.jpg" },
    { time: 27.5,  text: "In our heads", img: "foto5.jpg" },
    { time: 34.5,  text: "Something to do while we try to recall how we met", img: "foto6.jpg" },
    { time: 41.5,  text: "Do you think I have forgotten?", img: "foto7.jpg" },
    { time: 47.5,  text: "Do you think I have forgotten?", img: "foto8.jpg" },
    { time: 53.5,  text: "Do you think I have forgotten", img: "foto9.jpg" },
    { time: 59.0,  text: "About you?", img: "foto10.jpg" }
];

function typeWriter() {
    if (charIndex < creditString.length) {
        creditTextElement.textContent += creditString.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 120); 
    }
}

window.onload = () => {
    setTimeout(typeWriter, 500);
};

function buildFilmBackground() {
    let imagesHTML = "";
    for (let j = 0; j < 5; j++) {
        syncData.forEach(item => {
            imagesHTML += `<img src="${item.img}" data-img="${item.img}" class="bg-roll-img">`;
        });
    }
    filmBg.innerHTML = imagesHTML;
}
buildFilmBackground();

function buildPuzzle(container, imgSrc) {
    container.innerHTML = ""; 
    const cols = 5; 
    const rows = 4; 

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let piece = document.createElement("div");
            piece.className = "puzzle-piece";
            piece.style.backgroundImage = `url('${imgSrc}')`;
            piece.style.width = `${100 / cols}%`;
            piece.style.height = `${100 / rows}%`;
            piece.style.left = `${c * (100 / cols)}%`;
            piece.style.top = `${r * (100 / rows)}%`;
            piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
            piece.style.backgroundPosition = `${c * (100 / (cols - 1))}% ${r * (100 / (rows - 1))}%`;
            let delay = Math.random() * 0.8; 
            piece.style.animationDelay = `${delay}s`;
            container.appendChild(piece);
        }
    }
}

function spawnChat() {
    if (!isPlaying) return;

    const chatSrc = chatImages[Math.floor(Math.random() * chatImages.length)];
    const floatContainer = document.createElement("div");
    floatContainer.className = "floating-chat";

    const isLeft = Math.random() > 0.5;
    const randomEdge = Math.random() * 35 + 5; 

    if (isLeft) {
        floatContainer.style.left = `${randomEdge}vw`;
    } else {
        floatContainer.style.right = `${randomEdge}vw`;
    }

    const randomY = Math.random() * 60 + 10; 
    floatContainer.style.top = `${randomY}vh`;

    const rot = (Math.random() - 0.5) * 30; 
    floatContainer.style.setProperty('--rot', `rotate(${rot}deg)`);

    const innerWrapper = document.createElement("div");
    innerWrapper.className = "chat-inner";
    innerWrapper.style.webkitMaskImage = `url('${chatSrc}')`;
    innerWrapper.style.maskImage = `url('${chatSrc}')`;

    const chatImg = document.createElement("img");
    chatImg.src = chatSrc;

    const chatShimmer = document.createElement("div");
    chatShimmer.className = "chat-shimmer";

    innerWrapper.appendChild(chatImg);
    innerWrapper.appendChild(chatShimmer);
    floatContainer.appendChild(innerWrapper);
    
    chatContainer.appendChild(floatContainer);

    setTimeout(() => {
        floatContainer.remove();
    }, 8000);
}

let isPlaying = false;
let currentIndex = -1;
let isIntroDone = false; 
let hasStarted = false; 

playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        if (audio.ended || !hasStarted) {
            audio.currentTime = 0;
            currentIndex = -1;
            isIntroDone = false;
            hasStarted = true;
            
            frame1.className = "slideshow-container hidden";
            frame2.className = "slideshow-container hidden";
            
            creditWrapper.classList.add("hidden");
            walkingGif.classList.add("hidden");
            
            audio.play();
            playIcon.textContent = "pause";
            playerCard.classList.add("mini"); 
            
            clearInterval(chatInterval);
            chatInterval = setInterval(spawnChat, 1500);
            
            setTimeout(() => {
                currentIndex = 0; 
                triggerPhotoSteal(0, true);
                isIntroDone = true; 
            }, 2000); 
            
        } else {
            audio.play();
            playIcon.textContent = "pause";
            clearInterval(chatInterval);
            chatInterval = setInterval(spawnChat, 1500);
        }
        isPlaying = true;
    } else {
        audio.pause();
        playIcon.textContent = "play_arrow";
        isPlaying = false;
        clearInterval(chatInterval); 
    }
});

audio.addEventListener("ended", () => {
    isPlaying = false;
    hasStarted = false; 
    playIcon.textContent = "replay"; 
    
    creditWrapper.classList.remove("hidden");
    walkingGif.classList.remove("hidden");
    clearInterval(chatInterval); 
});

audio.addEventListener("timeupdate", () => {
    let currentTime = audio.currentTime;
    
    if(audio.duration) {
        let progressPercent = (currentTime / audio.duration) * 100;
        progressBarFill.style.width = progressPercent + "%";
        
        let currentMins = Math.floor(currentTime / 60);
        let currentSecs = Math.floor(currentTime % 60);
        if(currentSecs < 10) currentSecs = "0" + currentSecs;
        currentTimeDisplay.innerText = currentMins + ":" + currentSecs;
    }

    if (!isIntroDone) return; 

    let activeIndex = -1;
    for (let i = 0; i < syncData.length; i++) {
        if (currentTime >= syncData[i].time) {
            activeIndex = i;
        } else {
            break;
        }
    }

    if (activeIndex !== currentIndex && activeIndex !== -1 && activeIndex > 0) {
        currentIndex = activeIndex;
        triggerPhotoSteal(currentIndex, false);
    }
});

function triggerPhotoSteal(index, isFirst = false) {
    let targetImgSrc = syncData[index].img;
    let targetText = syncData[index].text;

    document.querySelectorAll('.bg-roll-img').forEach(img => {
        img.classList.remove("missing-from-roll");
    });
    document.querySelectorAll(`.bg-roll-img[data-img="${targetImgSrc}"]`).forEach(matchImg => {
        matchImg.classList.add("missing-from-roll");
    });

    if (isFirst) {
        buildPuzzle(img1, targetImgSrc);
        lyric1.textContent = targetText;
        
        frame1.className = "slideshow-container";
        void frame1.offsetWidth; 
        frame1.className = "slideshow-container first-entry";
        return; 
    }

    if (isFrame1Active) {
        buildPuzzle(img2, targetImgSrc); 
        lyric2.textContent = targetText;
        
        frame2.className = "slideshow-container";
        frame1.className = "slideshow-container";
        void frame2.offsetWidth; 
        void frame1.offsetWidth; 

        frame2.className = "slideshow-container track-in"; 
        frame1.className = "slideshow-container track-out"; 
    } else {
        buildPuzzle(img1, targetImgSrc); 
        lyric1.textContent = targetText;
        
        frame1.className = "slideshow-container";
        frame2.className = "slideshow-container";
        void frame1.offsetWidth; 
        void frame2.offsetWidth; 

        frame1.className = "slideshow-container track-in"; 
        frame2.className = "slideshow-container track-out"; 
    }
    
    isFrame1Active = !isFrame1Active;
}

// =========================================
// INISIALISASI LOTTIE JSON
// =========================================

// 1. Kotak Biru (Kanan Atas)
lottie.loadAnimation({
    container: document.getElementById('lottie-digital-love'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: "DigitalLove.json"
});

// 2. Kotak Hijau (Kiri Bawah) - Sudah diturunkan
lottie.loadAnimation({
    container: document.getElementById('lottie-dancing'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: "Valentine's Day Love Dancing.json"
});

// 3. Garis Ungu (Bawah menjalar)
lottie.loadAnimation({
    container: document.getElementById('lottie-particles-bottom'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: "Heart Particles.json" 
});
