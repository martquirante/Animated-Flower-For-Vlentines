const questionContainer = document.getElementById('question-container');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const music = document.getElementById('bgMusic');
const lyricText = document.getElementById('lyric-text');
const lyricsContainer = document.getElementById('lyrics-container');
const gardenContainer = document.getElementById('garden-container');
const bouquetContainer = document.getElementById('bouquet-container');
const bgFallingContainer = document.getElementById('bg-falling-container');
const butterflyContainer = document.getElementById('butterfly-container');

// Assets
const gardenLotties = [
    'https://lottie.host/1366a04a-d746-44f1-983e-6c44420e38c5/r3ElBDNk7a.lottie',
    'https://lottie.host/a6bb0bab-74a9-4365-a759-4affffa0ae2b/AXYbkzCX0b.lottie',
    'https://lottie.host/b9d1fccc-7000-42b9-8950-0baf24c9b010/MtQ1VXHzR8.lottie'
];
const butterflyUrl = 'https://lottie.host/2f306c21-0ede-4f7f-ad5e-7083d2527de9/4cQwTs3u7E.lottie';

// BOUQUET ASSETS (Local Files)
const bouquetAssets = [
    'flower1.png',
    'flower2.png',
];

let isChorus = true;

// --- NO BUTTON LOGIC (KULIT MODE: Moving Button) ---
function moveButton() {
    // Kinukuha ang lapad at taas ng screen minus ang size ng button
    // para hindi lumampas sa screen
    const maxWidth = window.innerWidth - noBtn.offsetWidth - 20;
    const maxHeight = window.innerHeight - noBtn.offsetHeight - 20;
    
    // Random position
    const x = Math.max(10, Math.random() * maxWidth);
    const y = Math.max(10, Math.random() * maxHeight);
    
    noBtn.style.position = 'fixed'; // Gagawin nating fixed para makagalaw kahit saan
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

// Kapag sinubukan i-click, tatakbo siya
noBtn.addEventListener('click', (e) => { 
    e.preventDefault(); 
    moveButton(); 
});
// (Optional) Pwede mo rin dagdagan ng 'mouseover' para mas mahirap hulihin sa desktop
noBtn.addEventListener('mouseover', () => {
    if(window.innerWidth > 768) { // Sa desktop lang para hindi mahirap sa mobile
        moveButton();
    }
});


// --- YES BUTTON LOGIC ---
yesBtn.addEventListener('click', () => {
    music.volume = 1.0;
    music.play().then(() => {
        questionContainer.style.opacity = '0';
        questionContainer.style.transform = 'scale(0.9)';
        setTimeout(() => {
            questionContainer.style.display = 'none';
            lyricsContainer.classList.remove('hidden');
            bgFallingContainer.style.opacity = '1';
            
            growGarden();
            spawnButterfly();
        }, 800);
    }).catch((err) => {
        alert("Tap screen to enable music!");
    });
});


// --- GROW GARDEN ---
function growGarden() {
    gardenContainer.innerHTML = '';
    const flowerCount = window.innerWidth < 768 ? 3 : 5; 

    for (let i = 0; i < flowerCount; i++) {
        const url = gardenLotties[i % gardenLotties.length];
        const wrapper = document.createElement('div');
        wrapper.className = 'flower-wrapper';
        
        const leftPos = (i + 1) * (100 / (flowerCount + 1));
        wrapper.style.left = `${leftPos}%`; 

        const stem = document.createElement('div');
        stem.className = 'stem';
        
        const leafL = document.createElement('div');
        leafL.className = 'leaf left';
        const leafR = document.createElement('div');
        leafR.className = 'leaf right';
        stem.appendChild(leafL);
        stem.appendChild(leafR);

        const lottie = document.createElement('dotlottie-wc');
        lottie.setAttribute('src', url);
        lottie.setAttribute('autoplay', '');
        lottie.setAttribute('loop', '');
        lottie.className = 'flower'; 
        
        stem.appendChild(lottie);
        wrapper.appendChild(stem);
        gardenContainer.appendChild(wrapper);

        const delay = i * 200; 
        
        setTimeout(() => {
            const minHeight = window.innerWidth < 768 ? 150 : 250;
            const variance = window.innerWidth < 768 ? 100 : 200;
            const finalHeight = Math.floor(Math.random() * variance) + minHeight;
            
            stem.style.height = `${finalHeight}px`;
            stem.classList.add('grown');
            
            requestAnimationFrame(() => {
                lottie.classList.add('bloomed');
            });

        }, delay);
    }
}


// --- BUTTERFLY ---
function spawnButterfly() {
    butterflyContainer.innerHTML = '';
    const lottie = document.createElement('dotlottie-wc');
    lottie.setAttribute('src', butterflyUrl);
    lottie.setAttribute('autoplay', '');
    lottie.setAttribute('loop', '');
    lottie.className = 'flying-butterfly';
    
    butterflyContainer.appendChild(lottie);
    setTimeout(() => { butterflyContainer.style.opacity = '1'; }, 500);

    function flyRandomly() {
        const butterflySize = window.innerWidth < 768 ? 60 : 80;
        const maxX = window.innerWidth - butterflySize;
        const maxY = window.innerHeight - butterflySize;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        const randomRotate = (Math.random() * 60) - 30; 

        // Landing logic
        const isLanding = Math.random() > 0.7;
        const duration = isLanding ? 5000 : 3000; 

        lottie.style.transition = `all ${duration}ms ease-in-out`;
        lottie.style.left = `${randomX}px`;
        lottie.style.top = `${randomY}px`;
        lottie.style.transform = `rotate(${randomRotate}deg)`;

        setTimeout(flyRandomly, duration);
    }
    setTimeout(flyRandomly, 100);
}


// --- BOUQUET LOGIC ---
function showBouquet() {
    if(!bouquetContainer.classList.contains('hidden')) return;
    
    bouquetContainer.classList.remove('hidden');
    bouquetContainer.innerHTML = '';
    
    const img = document.createElement('img');
    const randomSrc = bouquetAssets[Math.floor(Math.random() * bouquetAssets.length)];
    
    img.src = randomSrc;
    img.classList.add('big-bouquet-img');
    
    img.onerror = function() {
        console.error("Hindi makita ang image:", randomSrc);
        // Fallback image (Online link) just in case
        img.src = "https://png.pngtree.com/png-clipart/20220911/original/pngtree-bouquet-of-red-roses-flowers-png-image_8539659.png";
    };

    bouquetContainer.appendChild(img);
}

function hideBouquet() {
    bouquetContainer.classList.add('hidden');
    bouquetContainer.innerHTML = '';
}


// --- LYRICS & TIMING ---
const offset = 0.5;

const rawLyrics = [
    { time: 13.29, text: "Same bed but it feels just a little bit bigger now" },
    { time: 19.96, text: "Our song on the radio but it don't sound the same" },
    { time: 26.44, text: "When our friends talk about you, all it does is just tear me down" },
    { time: 33.06, text: "'Cause my heart breaks a little when I hear your name" },
    { time: 37.45, text: "It all just sounds like ooh-ooh, ooh-ooh" },
    { time: 45.56, text: "Mmm, too young, too dumb to realize" },
    
    // Chorus 1
    { time: 50.43, text: "That I should've bought you flowers 🌹", chorus: true },
    { time: 54.71, text: "And held your hand", chorus: true },
    { time: 57.10, text: "Should've gave you all my hours", chorus: true },
    { time: 61.10, text: "When I had the chance", chorus: true },
    { time: 63.79, text: "Take you to every party", chorus: true },
    { time: 66.23, text: "'Cause all you wanted to do was dance", chorus: true },
    
    { time: 70.49, text: "Now my baby's dancing" },
    { time: 73.56, text: "But she's dancing with another man" },
    
    { time: 82.45, text: "My pride, my ego, my needs, and my selfish ways" },
    { time: 89.01, text: "Caused a good strong woman like you to walk out my life" },
    { time: 94.62, text: "Now I never, never get to clean up the mess I made" },
    { time: 102.18, text: "And it haunts me every time I close my eyes" },
    { time: 106.56, text: "It all just sounds like ooh-ooh, ooh-ooh" },
    { time: 114.69, text: "Mmm, too young, too dumb to realize" },
    
    // Chorus 2
    { time: 119.45, text: "That I should've bought you flowers 🌹", chorus: true },
    { time: 123.79, text: "And held your hand", chorus: true },
    { time: 126.11, text: "Should've gave you all my hours", chorus: true },
    { time: 130.12, text: "When I had the chance", chorus: true },
    { time: 132.71, text: "Take you to every party", chorus: true },
    { time: 135.26, text: "'Cause all you wanted to do was dance", chorus: true },
    
    { time: 139.45, text: "Now my baby's dancing" },
    { time: 142.57, text: "But she's dancing with another man" },
    
    { time: 146.80, text: "Although it hurts" },
    { time: 149.96, text: "I'll be the first to say that I was wrong" },
    { time: 159.68, text: "Oh, I know I'm probably much too late" },
    { time: 163.14, text: "To try and apologize for my mistakes" },
    { time: 166.57, text: "But I just want you to know" },
    
    // Chorus 3
    { time: 172.04, text: "I hope he buys you flowers 🌹", chorus: true },
    { time: 176.09, text: "I hope he holds your hand", chorus: true },
    { time: 179.40, text: "Give you all his hours", chorus: true },
    { time: 183.00, text: "When he has the chance", chorus: true },
    { time: 186.21, text: "Take you to every party", chorus: true },
    { time: 188.44, text: "'Cause I remember how much you loved to dance", chorus: true },
    
    { time: 192.50, text: "Do all the things I should have done" },
    { time: 196.70, text: "When I was your man" },
    { time: 199.23, text: "Do all the things I should have done" },
    { time: 204.53, text: "When I was your man" },
    
    { time: 212.00, text: "Happy Valentine's Day! ❤️" }
];

const lyricsData = rawLyrics.map(line => ({ ...line, time: line.time + offset }));
let currentIndex = 0;

music.addEventListener('timeupdate', () => {
    const time = music.currentTime;
    
    if (currentIndex < lyricsData.length && time >= lyricsData[currentIndex].time) {
        const data = lyricsData[currentIndex];
        
        lyricText.style.opacity = 0;
        setTimeout(() => {
            lyricText.innerText = data.text;
            lyricText.style.opacity = 1;
        }, 200);

        if (data.chorus && !isChorus) {
            isChorus = true;
            showBouquet();
        } else if (!data.chorus && isChorus) {
            isChorus = false;
            hideBouquet();
        }
        currentIndex++;
    }
});