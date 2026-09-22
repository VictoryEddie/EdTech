// EdTech - Global Toast System & Interactive Logic

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO RENDERER — reads from projects.js (PROJECTS array)
   Add / edit / remove projects there. No HTML changes needed.
   ───────────────────────────────────────────────────────────── */
(function renderProjects() {
  const grid = document.getElementById('workGrid');
  if (!grid || typeof PROJECTS === 'undefined' || !PROJECTS.length) return;

  const arrowSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>`;

  grid.innerHTML = PROJECTS.map((p, i) => {
    const delay = i === 0 ? '' : `style="transition-delay:${(i * 0.1).toFixed(1)}s"`;
    return `
      <a href="${p.url}" target="_blank" rel="noopener"
         class="work-card fade-up" data-category="${p.category}" ${delay}>
        <div class="work-img-wrap">
          <img src="${p.image}" alt="${p.alt}" loading="lazy" decoding="async" />
          <div class="work-overlay">${arrowSVG}</div>
        </div>
        <div class="work-info">
          <div class="work-tag">${p.tag}</div>
          <div class="work-title">${p.title}</div>
        </div>
      </a>`;
  }).join('');

  // Re-observe newly created cards for fade-up animation.
  // Deferred so revealObserver (defined later in main.js) is ready.
  setTimeout(() => {
    if (typeof revealObserver !== 'undefined') {
      grid.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));
    }
  }, 0);
})();

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

// ─────────────────────────────────────────────────────────────
// SECURE CONTACT FORM HANDLER (3-Tier Defense & FormSubmit AJAX)
// ─────────────────────────────────────────────────────────────
const RECIPIENT_EMAIL = 'viceddie124@gmail.com';

const ALLOWED_SERVICES = {
  'web-design': 'Web Design & UI Prototyping',
  'web-dev': 'Full-Stack Web Development',
  'business-site': 'Business Marketing Website',
  'web-app': 'SaaS / Web Application',
  'maintenance': 'Monthly Retainer & Support',
  'other': 'Other Digital Solution'
};

const ALLOWED_BUDGETS = {
  'under-500': 'Under $500',
  '500-1k': '$500 – $1,000',
  '1k-5k': '$1,000 – $5,000',
  '5k-plus': '$5,000+'
};

// Input Sanitizer: Strips HTML tags and encodes risky entities
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char] || char))
    .trim();
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Tier 2 Anti-Bot: Timestamp Speed Trap (Records first human interaction)
  let firstInteractionTime = 0;
  const recordInteraction = () => {
    if (!firstInteractionTime) firstInteractionTime = Date.now();
  };
  contactForm.addEventListener('focusin', recordInteraction, { once: true });
  contactForm.addEventListener('keydown', recordInteraction, { once: true });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('c-name');
    const emailInput = document.getElementById('c-email');
    const serviceInput = document.getElementById('c-service');
    const budgetInput = document.getElementById('c-budget');
    const messageInput = document.getElementById('c-message');
    const honeypotInput = document.getElementById('c-honeypot');
    const submitBtn = document.getElementById('submitBtn');

    // ── Tier 2 Defense: Honeypot check (Bots fill hidden fields) ──
    if (honeypotInput && honeypotInput.value.trim().length > 0) {
      // Silently discard bot submission while returning fake success
      contactForm.reset();
      showToast('Project Inquiry Received! 🚀', 'Your inquiry has been logged successfully.', 'success');
      return;
    }

    // ── Tier 2 Defense: Timestamp Speed Trap (Human typists take > 3.5s) ──
    const elapsedSeconds = firstInteractionTime ? (Date.now() - firstInteractionTime) / 1000 : 0;
    if (firstInteractionTime && elapsedSeconds < 3.2) {
      showToast('Action Flagged', 'Submission was too fast. Please take a moment to review your details.', 'warning');
      return;
    }

    // ── Tier 1 Defense: Client Submission Cooldown (60s Rate Limit) ──
    const lastSubmission = sessionStorage.getItem('edtech_form_cooldown');
    if (lastSubmission) {
      const secondsSince = (Date.now() - parseInt(lastSubmission, 10)) / 1000;
      if (secondsSince < 60) {
        const waitTime = Math.ceil(60 - secondsSince);
        showToast('Please Wait', `You recently sent a message. Please wait ${waitTime}s before sending another.`, 'warning');
        return;
      }
    }

    // ── Tier 1 Defense: Sanitize & Validate Inputs ──
    const rawName = nameInput ? nameInput.value : '';
    const rawEmail = emailInput ? emailInput.value : '';
    const serviceKey = serviceInput ? serviceInput.value : '';
    const budgetKey = budgetInput ? budgetInput.value : '';
    const rawMessage = messageInput ? messageInput.value : '';

    const name = sanitizeInput(rawName);
    const email = rawEmail.trim().toLowerCase();
    const message = sanitizeInput(rawMessage);

    // Empty fields check
    if (!name || !email || !serviceKey || !budgetKey || !message) {
      showToast('Missing Fields', 'Please complete all required fields.', 'error');
      return;
    }

    // Length boundaries
    if (name.length < 2 || name.length > 60) {
      showToast('Invalid Name', 'Name must be between 2 and 60 characters.', 'error');
      return;
    }

    if (message.length < 10 || message.length > 3000) {
      showToast('Invalid Message', 'Project overview must be between 10 and 3,000 characters.', 'error');
      return;
    }

    // Email syntax validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email) || email.length > 100) {
      showToast('Invalid Email', 'Please enter a valid, active email address.', 'error');
      return;
    }

    // Dropdown Whitelist Validation
    if (!ALLOWED_SERVICES[serviceKey]) {
      showToast('Invalid Service', 'Please select a valid service option from the list.', 'error');
      return;
    }

    if (!ALLOWED_BUDGETS[budgetKey]) {
      showToast('Invalid Budget', 'Please select an estimated budget from the list.', 'error');
      return;
    }

    const serviceName = ALLOWED_SERVICES[serviceKey];
    const budgetName = ALLOWED_BUDGETS[budgetKey];

    // Trigger Mailto Fallback if network drops
    const triggerMailtoFallback = () => {
      const subject = encodeURIComponent(`Project Inquiry: ${name} (${serviceName})`);
      const body = encodeURIComponent(
        `Hi EdTech,\n\nName: ${name}\nEmail: ${email}\nService: ${serviceName}\nBudget: ${budgetName}\n\nProject Overview:\n${rawMessage}`
      );
      window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
    };

    if (!navigator.onLine) {
      showToast('Offline Mode', 'Network is offline. Opening your email application...', 'info', 6000);
      triggerMailtoFallback();
      return;
    }

    // Button loading state
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Project Details';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Details...';
    }

    // ── Tier 3 Defense & Delivery: FormSubmit AJAX ──
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          service: serviceName,
          budget: budgetName,
          message: message,
          _subject: `New Project Inquiry from ${name} (${serviceName})`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true)) {
        // Enforce cooldown in sessionStorage
        sessionStorage.setItem('edtech_form_cooldown', Date.now().toString());
        firstInteractionTime = 0; // reset speed trap

        contactForm.reset();
        showToast(
          'Project Inquiry Received! 🚀',
          `Thank you ${name}! Your inquiry has been sent to our team. We will review it and reply within 24 hours.`,
          'success',
          7000
        );
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        showToast(
          'Activation Email Sent! 📩',
          'FormSubmit sent a 1-time activation link to viceddie124@gmail.com. Click "Activate Form" in that email once to start receiving submissions!',
          'info',
          9000
        );
      } else if (window.location.protocol === 'file:') {
        showToast(
          'Local Preview Detected',
          'FormSubmit requires a web server (http://localhost or live URL) rather than double-clicking HTML files.',
          'warning',
          7000
        );
        triggerMailtoFallback();
      } else {
        throw new Error(data.message || 'FormSubmit response error');
      }
    } catch (err) {
      console.warn('Form submission delivery notice:', err);
      if (window.location.protocol !== 'file:') {
        showToast(
          'Connecting Direct...',
          'Opening your email app to guarantee your message is delivered directly...',
          'info',
          6000
        );
        triggerMailtoFallback();
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO FILTER TABS
   ───────────────────────────────────────────────────────────── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards  = document.querySelectorAll('#workGrid .work-card');

  if (!filterBtns.length || !workCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active tab
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      workCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Short delay so the fade plays before display:none
          setTimeout(() => {
            if (card.dataset.category !== filter && btn.dataset.filter !== 'all') {
              card.style.display = 'none';
            }
          }, 280);
        }
      });
    });
  });
})();

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
