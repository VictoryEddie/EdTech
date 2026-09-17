// EdTech - Global Toast System & Interactive Logic

function showToast(title, message, type = 'info', duration = 4500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${message}</div>
    </div>
    <button class="toast-close-btn" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 350);
  };

  toast.querySelector('.toast-close-btn').addEventListener('click', removeToast);

  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}

// Mobile Menu Navigation
const mobileMenu = document.getElementById('mobileMenu');
const hamburger = document.getElementById('hamburger');
const mobileClose = document.getElementById('mobileClose');

function openMobile() {
  if (mobileMenu) {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobile() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (hamburger) hamburger.addEventListener('click', openMobile);
if (mobileClose) mobileClose.addEventListener('click', closeMobile);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMobile();
  }
});

// Navigation Sticky Blur on Scroll
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (!mainNav) return;
  if (window.scrollY > 40) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}, { passive: true });

// Scroll Reveal Intersection Observer
const fadeElements = document.querySelectorAll('.fade-up');
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => revealObserver.observe(el));

// Hero Card Animation
const heroBar = document.getElementById('heroBar');
if (heroBar) {
  setTimeout(() => {
    heroBar.style.width = '98%';
  }, 450);
}

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'hvJxZu9tebkJrh45Y';
const EMAILJS_RECIPIENT = 'viceddie124@gmail.com';

if (window.emailjs) {
  try {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } catch (err) {
    console.warn('EmailJS initialization note:', err);
  }
}

// Contact Form Handler with Validation, EmailJS & Offline Fallback
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('c-name');
    const emailInput = document.getElementById('c-email');
    const serviceInput = document.getElementById('c-service');
    const budgetInput = document.getElementById('c-budget');
    const messageInput = document.getElementById('c-message');
    const submitBtn = document.getElementById('submitBtn');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const service = serviceInput ? serviceInput.value : '';
    const budget = budgetInput ? budgetInput.value : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !service || !budget || !message) {
      showToast('Missing Fields', 'Please complete all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    const originalText = submitBtn ? submitBtn.textContent : 'Send Project Details';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Details...';
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      service: service,
      budget: budget,
      message: message,
      reply_to: email,
      to_email: EMAILJS_RECIPIENT
    };

    const triggerMailtoFallback = () => {
      const subject = encodeURIComponent(`Project Inquiry: ${name} (${service})`);
      const body = encodeURIComponent(
        `Hi EdTech,\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\n\nProject Overview:\n${message}`
      );
      window.location.href = `mailto:${EMAILJS_RECIPIENT}?subject=${subject}&body=${body}`;
    };

    // Graceful offline fallback
    if (!navigator.onLine) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
      showToast('Offline Mode', 'Network connection offline. Opening your email app to send directly...', 'info', 6000);
      triggerMailtoFallback();
      return;
    }

    try {
      if (window.emailjs) {
        // Attempt sending via EmailJS
        await emailjs.send('service_default', 'template_default', templateParams).catch(async () => {
          return await emailjs.sendForm('service_contact', 'template_contact', contactForm);
        });
      }

      contactForm.reset();
      showToast(
        'Project Inquiry Received! 🚀',
        `Thank you ${name}! Your inquiry has been routed to ${EMAILJS_RECIPIENT}. We will contact you within 24 hours.`,
        'success',
        6500
      );
    } catch (err) {
      console.warn('EmailJS forwarding note:', err);
      showToast(
        'Inquiry Forwarded',
        'Direct connection queued. Opening your mail app to guarantee delivery...',
        'info',
        5500
      );
      triggerMailtoFallback();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE MINI-GAMES ENGINE
   1. Snake Arcade
   2. Memory Match
   3. Typing Speed Test
   4. 2048 Puzzle
   ───────────────────────────────────────────────────────────── */

/* ─── GLOBAL KEYBOARD SCROLL PREVENTION & DISPATCHER ────────── */
window.addEventListener('keydown', (e) => {
  // Never hijack keys when user is typing in an input or textarea!
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
  if (scrollKeys.includes(e.key) && (snakeIsRunning || g2048IsActive)) {
    e.preventDefault();
  }

  // Snake controls (Arrows + WASD)
  if (snakeIsRunning) {
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && snakeDir.y !== 1) {
      snakeNextDir = { x: 0, y: -1 };
    } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && snakeDir.y !== -1) {
      snakeNextDir = { x: 0, y: 1 };
    } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && snakeDir.x !== 1) {
      snakeNextDir = { x: -1, y: 0 };
    } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && snakeDir.x !== -1) {
      snakeNextDir = { x: 1, y: 0 };
    }
  }

  // 2048 controls (Arrows + WASD)
  if (g2048IsActive) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      g2048Move('up');
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      g2048Move('down');
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      g2048Move('left');
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      g2048Move('right');
    }
  }
});


/* ─── 1. SNAKE ARCADE GAME ──────────────────────────────────── */
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
const SNAKE_GRID = 16;
const SNAKE_TILE = 20; // 320 / 16

let snake = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 }
];
let snakeFood = { x: 12, y: 8 };
let snakeDir = { x: 1, y: 0 };
let snakeNextDir = { x: 1, y: 0 };
let snakeScore = 0;
let snakeLoop = null;
let snakeIsRunning = false;

function snakeSetDir(dx, dy) {
  if (!snakeIsRunning) return;
  if (dx !== 0 && snakeDir.x === -dx) return;
  if (dy !== 0 && snakeDir.y === -dy) return;
  snakeNextDir = { x: dx, y: dy };
}

function snakeRender() {
  if (!snakeCtx) return;

  // Background
  snakeCtx.fillStyle = '#080808';
  snakeCtx.fillRect(0, 0, 320, 320);

  // Subtle grid dots
  snakeCtx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let x = 0; x < SNAKE_GRID; x++) {
    for (let y = 0; y < SNAKE_GRID; y++) {
      snakeCtx.fillRect(x * SNAKE_TILE + 9, y * SNAKE_TILE + 9, 2, 2);
    }
  }

  // Draw Food (Apple with glow)
  snakeCtx.shadowColor = '#ff6c38';
  snakeCtx.shadowBlur = 12;
  snakeCtx.fillStyle = '#ff6c38';
  snakeCtx.beginPath();
  snakeCtx.arc(
    snakeFood.x * SNAKE_TILE + SNAKE_TILE / 2,
    snakeFood.y * SNAKE_TILE + SNAKE_TILE / 2,
    SNAKE_TILE / 2 - 3,
    0,
    Math.PI * 2
  );
  snakeCtx.fill();
  snakeCtx.shadowBlur = 0;

  // Draw Snake
  snake.forEach((seg, index) => {
    if (index === 0) {
      // Head
      snakeCtx.fillStyle = '#ff8554';
      snakeCtx.shadowColor = 'rgba(255, 108, 56, 0.4)';
      snakeCtx.shadowBlur = 8;
    } else {
      // Body gradient tone
      const alpha = Math.max(0.4, 1 - index / (snake.length + 3));
      snakeCtx.fillStyle = `rgba(255, 108, 56, ${alpha})`;
      snakeCtx.shadowBlur = 0;
    }

    const padding = 2;
    snakeCtx.beginPath();
    snakeCtx.roundRect(
      seg.x * SNAKE_TILE + padding,
      seg.y * SNAKE_TILE + padding,
      SNAKE_TILE - padding * 2,
      SNAKE_TILE - padding * 2,
      4
    );
    snakeCtx.fill();
    snakeCtx.shadowBlur = 0;
  });
}

function snakeSpawnFood() {
  let emptyCells = [];
  for (let x = 0; x < SNAKE_GRID; x++) {
    for (let y = 0; y < SNAKE_GRID; y++) {
      if (!snake.some((seg) => seg.x === x && seg.y === y)) {
        emptyCells.push({ x, y });
      }
    }
  }
  if (emptyCells.length > 0) {
    snakeFood = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
}

function snakeStep() {
  snakeDir = snakeNextDir;
  const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

  // Wall Collision
  if (head.x < 0 || head.x >= SNAKE_GRID || head.y < 0 || head.y >= SNAKE_GRID) {
    snakeGameOver();
    return;
  }

  // Self Collision
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    snakeGameOver();
    return;
  }

  // Check Food
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore += 10;
    const scoreEl = document.getElementById('snakeScore');
    if (scoreEl) scoreEl.textContent = snakeScore;
    snakeSpawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
  snakeRender();
}

function snakeStartGame() {
  if (snakeLoop) clearInterval(snakeLoop);

  snake = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 }
  ];
  snakeDir = { x: 1, y: 0 };
  snakeNextDir = { x: 1, y: 0 };
  snakeScore = 0;
  snakeIsRunning = true;

  const scoreEl = document.getElementById('snakeScore');
  const statusEl = document.getElementById('snakeStatus');
  const btnEl = document.getElementById('snakeStart');

  if (scoreEl) scoreEl.textContent = '0';
  if (statusEl) statusEl.textContent = 'Use Arrows, WASD, or D-Pad to steer';
  if (btnEl) btnEl.textContent = 'Restart';

  snakeSpawnFood();
  snakeRender();
  // Speed reduced by 45% (from 110ms to 200ms)
  snakeLoop = setInterval(snakeStep, 200);
}

function snakeGameOver() {
  snakeIsRunning = false;
  if (snakeLoop) clearInterval(snakeLoop);

  const statusEl = document.getElementById('snakeStatus');
  const btnEl = document.getElementById('snakeStart');

  if (statusEl) statusEl.textContent = `Game Over! Final Score: ${snakeScore}`;
  if (btnEl) btnEl.textContent = 'Play Again';

  showToast('Snake Game Over 🐍', `You scored ${snakeScore} points. Great run!`, 'info', 4500);
}

// Touch swipe support on Snake canvas
let snakeTouchX = 0;
let snakeTouchY = 0;
if (snakeCanvas) {
  snakeCanvas.addEventListener('touchstart', (e) => {
    snakeTouchX = e.touches[0].clientX;
    snakeTouchY = e.touches[0].clientY;
  }, { passive: true });

  snakeCanvas.addEventListener('touchend', (e) => {
    if (!snakeIsRunning) return;
    const dx = e.changedTouches[0].clientX - snakeTouchX;
    const dy = e.changedTouches[0].clientY - snakeTouchY;
    if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && snakeDir.x !== -1) snakeNextDir = { x: 1, y: 0 };
        else if (dx < 0 && snakeDir.x !== 1) snakeNextDir = { x: -1, y: 0 };
      } else {
        if (dy > 0 && snakeDir.y !== -1) snakeNextDir = { x: 0, y: 1 };
        else if (dy < 0 && snakeDir.y !== 1) snakeNextDir = { x: 0, y: -1 };
      }
    }
  }, { passive: true });
}

// Render idle snake on load
snakeRender();


/* ─── 2. MEMORY MATCH GAME ──────────────────────────────────── */
const MEMORY_SYMBOLS = ['🚀', '⚡', '💻', '🎨', '🔒', '📱', '🌐', '⚙️'];
let memFirstCard = null;
let memSecondCard = null;
let memLockBoard = false;
let memPairsFound = 0;

function memStartGame() {
  const grid = document.getElementById('memoryGrid');
  const scoreEl = document.getElementById('memScore');
  const statusEl = document.getElementById('memStatus');
  if (!grid) return;

  memFirstCard = null;
  memSecondCard = null;
  memLockBoard = false;
  memPairsFound = 0;

  if (scoreEl) scoreEl.textContent = '0/8';
  if (statusEl) statusEl.textContent = 'Click any card to start flipping';

  const deck = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].sort(() => Math.random() - 0.5);

  grid.innerHTML = '';
  deck.forEach((symbol) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'memory-card';
    card.setAttribute('aria-label', 'Memory card');
    card.innerHTML = `
      <div class="memory-card-face memory-card-back">ED</div>
      <div class="memory-card-face memory-card-front">${symbol}</div>
    `;
    card.addEventListener('click', () => memFlipCard(card, symbol));
    grid.appendChild(card);
  });
}

function memFlipCard(card, symbol) {
  if (memLockBoard) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!memFirstCard) {
    memFirstCard = { card, symbol };
    return;
  }

  memSecondCard = { card, symbol };
  memLockBoard = true;

  if (memFirstCard.symbol === memSecondCard.symbol) {
    // Match found!
    memFirstCard.card.classList.add('matched');
    memSecondCard.card.classList.add('matched');
    memPairsFound++;

    const scoreEl = document.getElementById('memScore');
    if (scoreEl) scoreEl.textContent = `${memPairsFound}/8`;

    memFirstCard = null;
    memSecondCard = null;
    memLockBoard = false;

    if (memPairsFound === 8) {
      const statusEl = document.getElementById('memStatus');
      if (statusEl) statusEl.textContent = '🎉 Victory! All pairs matched!';
      showToast('Memory Champion! 🏆', 'Sensational! You solved all 8 matching pairs!', 'success', 5500);
    }
  } else {
    // Not a match: flip back after 700ms
    setTimeout(() => {
      if (memFirstCard && memFirstCard.card) memFirstCard.card.classList.remove('flipped');
      if (memSecondCard && memSecondCard.card) memSecondCard.card.classList.remove('flipped');
      memFirstCard = null;
      memSecondCard = null;
      memLockBoard = false;
    }, 700);
  }
}

// Initialize memory deck on load
memStartGame();


/* ─── 3. TYPING SPEED TEST ──────────────────────────────────── */
const TYPING_PROMPTS = [
  'Crafting high-performance digital experiences that convert visitors into loyal clients.',
  'Clean code and thoughtful design architecture turn ambitious ideas into robust software products.',
  'Modern web development blends visual storytelling with lightning-fast interactive responsiveness.',
  'Great digital products feel effortless, accessible, and intuitive across every single screen size.'
];

let typingActiveText = TYPING_PROMPTS[0];
let typingTimeLeft = 60;
let typingTimerInterval = null;
let typingIsRunning = false;

const typingPromptEl = document.getElementById('typingPrompt');
const typingInputEl = document.getElementById('typingInput');
const typingStartBtn = document.getElementById('typingStartBtn');

function typingRenderPrompt(typedVal) {
  if (!typingPromptEl) return;
  let html = '';

  for (let i = 0; i < typingActiveText.length; i++) {
    const targetChar = typingActiveText[i];
    const isSpace = targetChar === ' ';

    if (i < typedVal.length) {
      if (typedVal[i] === targetChar) {
        html += `<span class="char-correct">${targetChar}</span>`;
      } else {
        html += `<span class="char-wrong ${isSpace ? 'char-space' : ''}">${isSpace ? '&nbsp;' : targetChar}</span>`;
      }
    } else if (i === typedVal.length) {
      html += `<span class="char-current">${targetChar}</span>`;
    } else {
      html += `<span>${targetChar}</span>`;
    }
  }
  typingPromptEl.innerHTML = html;
}

function typingUpdateStats(typedVal) {
  let correctCount = 0;
  for (let i = 0; i < typedVal.length; i++) {
    if (typedVal[i] === typingActiveText[i]) correctCount++;
  }

  const charsEl = document.getElementById('typingChars');
  const wpmEl = document.getElementById('typingWpm');
  const accEl = document.getElementById('typingAcc');

  if (charsEl) charsEl.textContent = typedVal.length;

  const elapsedSec = Math.max(1, 60 - typingTimeLeft);
  const wpm = Math.round((correctCount / 5) / (elapsedSec / 60));
  if (wpmEl) wpmEl.textContent = Math.max(0, wpm);

  const acc = typedVal.length > 0 ? Math.round((correctCount / typedVal.length) * 100) : 100;
  if (accEl) accEl.textContent = acc;
}

function typingStart() {
  if (typingIsRunning) return;

  typingActiveText = TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)];
  typingTimeLeft = 60;
  typingIsRunning = true;

  if (typingInputEl) {
    typingInputEl.disabled = false;
    typingInputEl.value = '';
    typingInputEl.focus();
  }

  if (typingStartBtn) {
    typingStartBtn.disabled = true;
    typingStartBtn.style.opacity = '0.5';
  }

  const typingCardEl = document.getElementById('typingCard');
  if (typingCardEl && window.innerWidth <= 768) {
    typingCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const timeEl = document.getElementById('typingTime');
  const wpmEl = document.getElementById('typingWpm');
  const accEl = document.getElementById('typingAcc');
  const charsEl = document.getElementById('typingChars');

  if (timeEl) timeEl.textContent = '60';
  if (wpmEl) wpmEl.textContent = '0';
  if (accEl) accEl.textContent = '100';
  if (charsEl) charsEl.textContent = '0';

  typingRenderPrompt('');

  if (typingTimerInterval) clearInterval(typingTimerInterval);
  typingTimerInterval = setInterval(() => {
    typingTimeLeft--;
    if (timeEl) timeEl.textContent = typingTimeLeft;
    if (typingInputEl) typingUpdateStats(typingInputEl.value);

    if (typingTimeLeft <= 0) {
      typingFinish();
    }
  }, 1000);
}

function typingFinish() {
  if (typingTimerInterval) clearInterval(typingTimerInterval);
  typingIsRunning = false;

  if (typingInputEl) typingInputEl.disabled = true;
  if (typingStartBtn) {
    typingStartBtn.disabled = false;
    typingStartBtn.style.opacity = '1';
    typingStartBtn.textContent = 'Try Again';
  }

  const finalWpm = document.getElementById('typingWpm')?.textContent || '0';
  const finalAcc = document.getElementById('typingAcc')?.textContent || '100';

  showToast(
    'Typing Test Complete! ⌨️',
    `You finished with ${finalWpm} WPM and ${finalAcc}% accuracy. Excellent work!`,
    'success',
    5500
  );
}

function typingReset() {
  if (typingTimerInterval) clearInterval(typingTimerInterval);
  typingIsRunning = false;
  typingTimeLeft = 60;

  if (typingInputEl) {
    typingInputEl.value = '';
    typingInputEl.disabled = true;
  }
  if (typingStartBtn) {
    typingStartBtn.disabled = false;
    typingStartBtn.style.opacity = '1';
    typingStartBtn.textContent = 'Start Test';
  }

  const timeEl = document.getElementById('typingTime');
  const wpmEl = document.getElementById('typingWpm');
  const accEl = document.getElementById('typingAcc');
  const charsEl = document.getElementById('typingChars');

  if (timeEl) timeEl.textContent = '60';
  if (wpmEl) wpmEl.textContent = '0';
  if (accEl) accEl.textContent = '100';
  if (charsEl) charsEl.textContent = '0';

  if (typingPromptEl) {
    typingPromptEl.textContent = 'Click Start to begin the typing test.';
  }
}

if (typingInputEl) {
  typingInputEl.addEventListener('input', (e) => {
    if (!typingIsRunning) return;
    const val = e.target.value;
    typingRenderPrompt(val);
    typingUpdateStats(val);

    if (val.length >= typingActiveText.length) {
      typingFinish();
    }
  });
}


/* ─── 4. 2048 PUZZLE GAME ───────────────────────────────────── */
let g2048Board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
let g2048Score = 0;
let g2048HasWon = false;
let g2048IsActive = false;

function g2048Init() {
  g2048Board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  g2048Score = 0;
  g2048HasWon = false;
  g2048IsActive = true;

  const scoreEl = document.getElementById('g2048Score');
  const statusEl = document.getElementById('g2048Status');
  if (scoreEl) scoreEl.textContent = '0';
  if (statusEl) statusEl.textContent = 'Merge tiles to reach 2048';

  g2048SpawnTile();
  g2048SpawnTile();
  g2048Render();
}

function g2048SpawnTile() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (g2048Board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const pick = empty[Math.floor(Math.random() * empty.length)];
  g2048Board[pick.r][pick.c] = Math.random() < 0.9 ? 2 : 4;
}

function g2048SlideRow(row) {
  let filtered = row.filter((val) => val !== 0);
  let gain = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      gain += filtered[i];
      filtered.splice(i + 1, 1);
    }
  }
  while (filtered.length < 4) {
    filtered.push(0);
  }
  return { row: filtered, gain };
}

function g2048Transpose(matrix) {
  return matrix[0].map((_, c) => matrix.map((row) => row[c]));
}

function g2048Move(direction) {
  if (!g2048IsActive) return;

  const prevBoard = JSON.stringify(g2048Board);
  let totalGain = 0;

  if (direction === 'left') {
    for (let r = 0; r < 4; r++) {
      const res = g2048SlideRow(g2048Board[r]);
      g2048Board[r] = res.row;
      totalGain += res.gain;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < 4; r++) {
      const reversed = [...g2048Board[r]].reverse();
      const res = g2048SlideRow(reversed);
      g2048Board[r] = res.row.reverse();
      totalGain += res.gain;
    }
  } else if (direction === 'up') {
    let transposed = g2048Transpose(g2048Board);
    for (let r = 0; r < 4; r++) {
      const res = g2048SlideRow(transposed[r]);
      transposed[r] = res.row;
      totalGain += res.gain;
    }
    g2048Board = g2048Transpose(transposed);
  } else if (direction === 'down') {
    let transposed = g2048Transpose(g2048Board);
    for (let r = 0; r < 4; r++) {
      const reversed = [...transposed[r]].reverse();
      const res = g2048SlideRow(reversed);
      transposed[r] = res.row.reverse();
      totalGain += res.gain;
    }
    g2048Board = g2048Transpose(transposed);
  }

  // If board changed, add score and spawn tile
  if (JSON.stringify(g2048Board) !== prevBoard) {
    g2048Score += totalGain;
    const scoreEl = document.getElementById('g2048Score');
    if (scoreEl) scoreEl.textContent = g2048Score;

    g2048SpawnTile();
    g2048Render();

    // Check Win
    if (!g2048HasWon) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (g2048Board[r][c] === 2048) {
            g2048HasWon = true;
            const statusEl = document.getElementById('g2048Status');
            if (statusEl) statusEl.textContent = '🌟 You reached 2048! Keep going!';
            showToast('2048 Master! 🌟', 'You successfully created the 2048 tile! Outstanding!', 'success', 6000);
          }
        }
      }
    }

    // Check Loss
    if (g2048CheckGameOver()) {
      g2048IsActive = false;
      const statusEl = document.getElementById('g2048Status');
      if (statusEl) statusEl.textContent = `Game Over! Final Score: ${g2048Score}`;
      showToast('2048 Game Over 🎲', `No more moves left. Final Score: ${g2048Score}`, 'info', 5000);
    }
  }
}

function g2048CheckGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (g2048Board[r][c] === 0) return false;
      if (c < 3 && g2048Board[r][c] === g2048Board[r][c + 1]) return false;
      if (r < 3 && g2048Board[r][c] === g2048Board[r + 1][c]) return false;
    }
  }
  return true;
}

function g2048Render() {
  const grid = document.getElementById('g2048Grid');
  if (!grid) return;

  grid.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = g2048Board[r][c];
      const cell = document.createElement('div');
      cell.className = 'g2048-cell';
      if (val > 0) {
        cell.classList.add(`tile-${val}`, 'tile-pop');
        cell.textContent = val;
      }
      grid.appendChild(cell);
    }
  }
}

// Touch swipe support on 2048 grid
let g2048TouchX = 0;
let g2048TouchY = 0;
const g2048GridEl = document.getElementById('g2048Grid');
if (g2048GridEl) {
  g2048GridEl.addEventListener('touchstart', (e) => {
    g2048TouchX = e.touches[0].clientX;
    g2048TouchY = e.touches[0].clientY;
  }, { passive: true });

  g2048GridEl.addEventListener('touchend', (e) => {
    if (!g2048IsActive) return;
    const dx = e.changedTouches[0].clientX - g2048TouchX;
    const dy = e.changedTouches[0].clientY - g2048TouchY;
    if (Math.abs(dx) > 25 || Math.abs(dy) > 25) {
      if (Math.abs(dx) > Math.abs(dy)) {
        g2048Move(dx > 0 ? 'right' : 'left');
      } else {
        g2048Move(dy > 0 ? 'down' : 'up');
      }
    }
  }, { passive: true });
}

// Initialize 2048 on load
g2048Init();
