const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;
let loveProgress = 0;

// Add these new functions at the beginning
const memorySymbols = ['❤️', '💖', '💝', '💕', '💗', '💓', '💘', '💞'];
let flippedCards = [];
let matchedPairs = 0;

let isScrollingDown = true;

function updateScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const icon = scrollIndicator.querySelector('i');
    
    if (isScrollingDown) {
        icon.className = 'fas fa-chevron-down';
    } else {
        icon.className = 'fas fa-chevron-up';
    }
}

function handleScroll() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;

    // Hide scroll indicator when memory game is visible
    if (document.getElementById('memoryGame').style.display !== 'none') {
        scrollIndicator.style.display = 'none';
        return;
    }

    scrollIndicator.style.display = 'block';

    if (scrolled + windowHeight >= fullHeight - 10) {
        isScrollingDown = false;
    } else if (scrolled <= 10) {
        isScrollingDown = true;
    }

    updateScrollIndicator();
}

function scrollPage() {
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;

    if (isScrollingDown) {
        window.scrollTo({
            top: scrolled + windowHeight,
            behavior: 'smooth'
        });
    } else {
        window.scrollTo({
            top: scrolled - windowHeight,
            behavior: 'smooth'
        });
    }
}

async function shareWebsite() {
    const url = window.location.href;
    const title = "Will you be my Valentine?";

    try {
        if (navigator.share) {
            await navigator.share({
                title: title,
                url: url
            });
        } else {
            await navigator.clipboard.writeText(url);
            const toast = new bootstrap.Toast(document.getElementById('shareToast'));
            toast.show();
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
}

function initializeMemoryGame() {
    const gameContainer = document.getElementById('memoryCards');
    const isMobile = window.innerWidth <= 480;
    const symbols = isMobile ? 
        [...memorySymbols.slice(0, 6), ...memorySymbols.slice(0, 6)] : 
        [...memorySymbols, ...memorySymbols];
    
    // Shuffle symbols
    symbols.sort(() => Math.random() - 0.5);
    
    symbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="front">?</div>
            <div class="back">${symbol}</div>
        `;
        card.dataset.symbol = symbol;
        card.onclick = () => flipCard(card);
        gameContainer.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        updateProgress();
        if (matchedPairs === memorySymbols.length) {
            setTimeout(showProposal, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function updateProgress() {
    const progress = (matchedPairs / memorySymbols.length) * 100;
    document.getElementById('gameProgress').style.width = `${progress}%`;
}

function showProposal() {
    document.getElementById('memoryGame').style.display = 'none';
    document.querySelector('.valentine-card').classList.add('animate__bounceIn');
    document.querySelector('.buttons').style.display = 'flex';
    
    // Reset and start love meter with delay
    loveProgress = 0;
    const loveBar = document.getElementById('loveBar');
    if (loveBar) {
        loveBar.style.width = '0%';
        // Start love meter after animation completes
        setTimeout(animateLoveMeter, 1000);
    }
}

// Update window load event listener
window.addEventListener('load', () => {
    initHearts();
    const buttons = document.querySelector('.buttons');
    const loveBar = document.getElementById('loveBar');
    
    if (buttons) buttons.style.display = 'none';
    if (loveBar) loveBar.style.width = '0%';
    
    document.getElementById('memoryGame').style.display = 'block';
    initializeMemoryGame();
    updateScrollIndicator();
});

function animateLoveMeter() {
    const loveBar = document.getElementById('loveBar');
    const textElement = document.querySelector('.text-muted');
    
    if (!loveBar || !textElement) return;
    
    textElement.textContent = 'Love-o-meter loading...';
    loveProgress = 0;
    
    const interval = setInterval(() => {
        if (loveProgress < 100) {
            loveProgress += 2; // Faster increment
            loveBar.style.width = `${loveProgress}%`;
            
            // Update text based on progress
            if (loveProgress < 30) {
                textElement.textContent = 'Loading love...';
            } else if (loveProgress < 60) {
                textElement.textContent = 'Almost there...';
            } else if (loveProgress < 90) {
                textElement.textContent = 'So much love!';
            }
        } else {
            clearInterval(interval);
            textElement.textContent = 'Love-o-meter is full! ❤️';
            // Add pulse animation to the text
            textElement.classList.add('animate__animated', 'animate__heartBeat');
        }
    }, 50);
}

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    
    // Make yes button bigger
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.2}px`;
    
    // Add shake animation to the card
    const card = document.querySelector('.valentine-card');
    card.classList.add('animate__shakeX');
    setTimeout(() => card.classList.remove('animate__shakeX'), 1000);
}

function dodgeButton(button) {
    const container = document.querySelector('.buttons');
    const containerRect = container.getBoundingClientRect();
    
    const newX = Math.random() * (containerRect.width - button.offsetWidth);
    const newY = Math.random() * (containerRect.height - button.offsetHeight);
    
    button.style.transform = `translate(${newX}px, ${newY}px)`;
}

function handleYesClick() {
    // Add celebration animation before redirect
    const card = document.querySelector('.valentine-card');
    card.classList.add('animate__bounceOut');
    
    // Create explosion of hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(createHeart, i * 100);
    }
    
    setTimeout(() => {
        window.location.href = "yes_page.html";
    }, 1000);
}

function createHeart() {
    // Only create new hearts if the document is visible
    if (document.hidden) return;
    
    // Limit total number of hearts
    const heartsContainer = document.querySelector('.hearts');
    if (heartsContainer && heartsContainer.children.length > 50) return;

    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 90 + 5 + 'vw';
    heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
    heart.style.opacity = (Math.random() * 0.3 + 0.5);
    heart.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;

    if (heartsContainer) {
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode === heartsContainer) {
                heartsContainer.removeChild(heart);
            }
        }, 5000);
    }
}

// Create hearts less frequently to avoid performance issues
setInterval(createHeart, 500);

function initHearts() {
    if (!document.querySelector('.hearts')) {
        const heartsContainer = document.createElement('div');
        heartsContainer.className = 'hearts';
        document.body.appendChild(heartsContainer);
    }
    // Create initial hearts with delay
    for (let i = 0; i < 5; i++) {
        setTimeout(createHeart, i * 300);
    }
}

// Add event listeners
document.getElementById('scrollIndicator').addEventListener('click', scrollPage);
window.addEventListener('scroll', handleScroll);