// DOM Elements
const homeSection = document.getElementById('home');
const formSection = document.getElementById('form');
const resultPopup = document.getElementById('result-popup');
const resultText = document.getElementById('result-text');
const emojisContainer = document.getElementById('emojis-container');

const getStartedBtn = document.getElementById('get-started');
const calculateBtn = document.getElementById('calculate');
const restartBtn = document.getElementById('restart');
const returnHomeBtn = document.getElementById('return-home');
const messageBox = document.getElementById('message-box');
let messageTimeout = null;

const yourNameInput = document.getElementById('your-name');
const partnerNameInput = document.getElementById('partner-name');
const expectedResultSelect = document.getElementById('expected-result');

const emojiParticles = [];
let emojiAnimationId = null;
const emojiCount = 32;

// Event Listeners
getStartedBtn.addEventListener('click', showForm);
calculateBtn.addEventListener('click', calculateFlames);
restartBtn.addEventListener('click', restart);
returnHomeBtn.addEventListener('click', returnHome);

// Functions
function showForm() {
    formSection.classList.add('active');
    homeSection.classList.add('slide-up');
    setTimeout(() => {
        homeSection.classList.remove('active');
    }, 1000);
}

const defaultExpectedText = 'Let fate decide what it should be...';

function calculateFlames() {
    const yourName = yourNameInput.value.trim().toLowerCase();
    const partnerName = partnerNameInput.value.trim().toLowerCase();
    const expectedValue = expectedResultSelect.value.trim();
    const expected = expectedValue || defaultExpectedText;

    if (!yourName && !partnerName) {
        showMessage("Enter Yours and Your Partner's Name!! 😠");
        return;
    }

    if (!yourName) {
        showMessage('Enter Your Name!! 😠');
        return;
    }

    if (!partnerName) {
        showMessage("Enter Your Partner's Name!! 😠");
        return;
    }

    const result = flamesAlgorithm(yourName, partnerName);
    displayResult(result, expected);
}

function flamesAlgorithm(name1, name2) {
    // Remove common letters
    const letters1 = name1.split('');
    const letters2 = name2.split('');

    for (let i = letters1.length - 1; i >= 0; i--) {
        const index = letters2.indexOf(letters1[i]);
        if (index !== -1) {
            letters1.splice(i, 1);
            letters2.splice(index, 1);
        }
    }

    const remaining = letters1.length + letters2.length;

    const flames = ['Friends', 'Lovers', 'Affection', 'Marriage', 'Enemy', 'Siblings'];
    let index = 0;

    while (flames.length > 1) {
        index = (index + remaining - 1) % flames.length;
        flames.splice(index, 1);
    }

    return flames[0];
}

function displayResult(result, expected) {
    formSection.classList.remove('active');
    resultPopup.classList.add('active');
    emojisContainer.innerHTML = '';
    
    const positiveResults = ['Friends', 'Lovers', 'Affection', 'Marriage'];
    const negativeResults = ['Enemy', 'Siblings'];
    const isPositive = positiveResults.includes(result);
    const isNegative = negativeResults.includes(result);
    const isDefaultExpected = expected === defaultExpectedText;
    const isMatchingExpected = result === expected && !isDefaultExpected;

    if (isDefaultExpected) {
        if (isPositive) {
            resultText.textContent = `Hurray🎉!! You have got ${result}!!`;
            showEmojis(['🎉', '✨', '💖', '😍', '🎊', '😁', '😃', '😄']);
            showPoppers();
        } else if (isNegative) {
            resultText.textContent = `Sorry😰!! You have got ${result}...`;
            showEmojis(['😢', '😭', '😬', '😰', '🤐', '☹️', '😖', '😵', '😵‍💫']);
        }
    } else if (isMatchingExpected) {
        resultText.textContent = `Hurray🎉!! You have got ${result}! I know you're the Luckiest person!! 🍀`;
        showEmojis(['🎉', '✨', '💖', '❤️', '🔥', '😍', '🎊', '😁', '😃', '😄']);
        showPoppers();
    } else {
        resultText.textContent = `Sorry😰!! You have got ${result}. I hoped for ${expected}...`;
        showEmojis(['😢', '😭', '💔', '😬', '😞', '☹️', '😖', '😵', '😵‍💫']);
    }
}

function showPoppers() {
    const popperCount = 15;
    const bounds = { width: window.innerWidth };
    for (let i = 0; i < popperCount; i++) {
        const popper = document.createElement('div');
        popper.className = 'popper';
        popper.textContent = ['🎊', '🎉', '✨', '⭐'][
            Math.floor(Math.random() * 4)
        ];
        const side = i % 2 === 0 ? 'left' : 'right';
        popper.style[side] = Math.random() * (bounds.width - 40) + 'px';
        popper.style.top = '0px';
        popper.style.animationDelay = Math.random() * 0.5 + 's';
        emojisContainer.appendChild(popper);
    }
}

function showMessage(text) {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.classList.add('visible');
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        messageBox.classList.remove('visible');
    }, 3500);
}

function clearMessage() {
    if (!messageBox) return;
    messageBox.classList.remove('visible');
    clearTimeout(messageTimeout);
}

function showEmojis(emojis) {
    clearEmojis();
    const bounds = { width: window.innerWidth, height: window.innerHeight };

    for (let i = 0; i < emojiCount; i++) {
        const emojiEl = document.createElement('div');
        emojiEl.className = 'emoji';
        emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emojiEl.style.left = Math.random() * (bounds.width - 60) + 'px';
        emojiEl.style.top = bounds.height - 80 + 'px';

        emojiParticles.push({
            el: emojiEl,
            x: parseFloat(emojiEl.style.left),
            y: parseFloat(emojiEl.style.top),
            vx: (Math.random() * 1.6 - 0.8) * 1.1,
            vy: -(Math.random() * 0.4 + 0.6)
        });

        emojisContainer.appendChild(emojiEl);
    }
    animateEmojis();
}

function animateEmojis() {
    if (emojiAnimationId) return;

    function step() {
        const bounds = { width: window.innerWidth, height: window.innerHeight };

        emojiParticles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x <= 0) {
                particle.x = 0;
                particle.vx *= -1;
            }
            if (particle.x >= bounds.width - 40) {
                particle.x = bounds.width - 40;
                particle.vx *= -1;
            }
            if (particle.y <= 0) {
                particle.y = 0;
                particle.vy *= -0.9;
            }
            if (particle.y >= bounds.height - 40) {
                particle.y = bounds.height - 40;
                particle.vy *= -0.9;
            }

            particle.el.style.left = `${particle.x}px`;
            particle.el.style.top = `${particle.y}px`;
        });

        emojiAnimationId = requestAnimationFrame(step);
    }

    emojiAnimationId = requestAnimationFrame(step);
}

function clearEmojis() {
    if (emojiAnimationId) {
        cancelAnimationFrame(emojiAnimationId);
        emojiAnimationId = null;
    }
    emojiParticles.length = 0;
    emojisContainer.innerHTML = '';
}

function restart() {
    resultPopup.classList.remove('active');
    formSection.classList.add('active');
    yourNameInput.value = '';
    partnerNameInput.value = '';
    expectedResultSelect.value = '';
    clearEmojis();
    clearMessage();
}

function returnHome() {
    resultPopup.classList.remove('active');
    homeSection.classList.remove('slide-up');
    homeSection.classList.add('active');
    yourNameInput.value = '';
    partnerNameInput.value = '';
    expectedResultSelect.value = '';
    clearEmojis();
    clearMessage();
}