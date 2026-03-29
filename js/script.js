/* =============================================
   LUMIÈRE HAIR & BEAUTY – SCRIPT.JS
   ============================================= */

/* ==========================================
   1. NAVBAR — scroll + hamburguer
   ========================================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (!navbar) return;

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking a nav link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Animate hamburger lines into X when active
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `;
  document.head.appendChild(style);
})();

/* ==========================================
   2. CART — Storage helpers
   ========================================== */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('lumiere_cart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('lumiere_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast('Adicionado ao carrinho!', product.name, 'fa-solid fa-bag-shopping');
}

/* ==========================================
   3. TOAST NOTIFICATIONS
   ========================================== */
function showToast(title, message, iconClass) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true"><i class="${iconClass}"></i></div>
    <div class="toast-text">
      <p class="toast-title">${title}</p>
      ${message ? `<p class="toast-msg">${message}</p>` : ''}
    </div>
  `;
  container.appendChild(toast);

  // Auto-remove
  const remove = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  const timer = setTimeout(remove, 3200);
  toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
}

/* ==========================================
   4. NEWSLETTER FORM
   ========================================== */
function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletter-email');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    showToast('E-mail inválido', 'Por favor, insira um e-mail válido.', 'fa-solid fa-triangle-exclamation');
    return;
  }
  showToast('Inscrição realizada!', 'Obrigada! Você receberá nossas novidades em breve.', 'fa-solid fa-envelope');
  input.value = '';
}

/* ==========================================
   5. SMOOTH SCROLL para âncoras internas
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 90;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ==========================================
   6. INTERSECTION OBSERVER – animação reveal
   ========================================== */
(function initReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.product-card, .solution-card, .dep-card, .pilar, .section-tag, .sobre-card-main'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ==========================================
   7. INICIALIZAÇÃO
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

// Também atualizar imediatamente (para páginas sem DOMContentLoaded perdido)
updateCartBadge();

/* ==========================================
   8. EASTER EGG — "bad apple"
   ==========================================
   Digite "bad apple" em qualquer input do site
   para ativar o easter egg. Pressione Esc ou
   clique para fechar.
   ========================================== */
(function initEasterEgg() {
  const TRIGGER = 'bad apple';
  let buffer = '';
  let eggActive = false;

  // Ouve TODOS os inputs/textareas da página
  document.addEventListener('input', function (e) {
    const el = e.target;
    if (!el || !['INPUT', 'TEXTAREA'].includes(el.tagName)) return;
    buffer = (el.value || '').toLowerCase();
    if (buffer.includes(TRIGGER) && !eggActive) {
      triggerEasterEgg();
    }
  }, true);

  function triggerEasterEgg() {
    eggActive = true;

    // Overlay fullscreen
    const overlay = document.createElement('div');
    overlay.id = 'easter-egg-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Easter egg ativado! Pressione Esc para fechar.');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.6s ease;
      cursor: pointer;
    `;

    // Vídeo
    const video = document.createElement('video');
    video.src = 'assets/easteregg.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = false;
    video.controls = false;
    video.playsInline = true;
    video.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 100vw;
      max-height: 100vh;
    `;

    // Botão fechar
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.setAttribute('aria-label', 'Fechar easter egg');
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      color: #fff;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
      font-family: inherit;
    `;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.28)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.15)';
    });

    // Dica de fechar
    const hint = document.createElement('p');
    hint.textContent = 'Pressione Esc ou clique para fechar';
    hint.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.45);
      font-size: 0.78rem;
      letter-spacing: 0.1em;
      pointer-events: none;
      font-family: 'Jost', sans-serif;
      white-space: nowrap;
    `;

    overlay.appendChild(video);
    overlay.appendChild(closeBtn);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });
    });

    // Toca o vídeo
    video.play().catch(() => {
      // Autoplay bloqueado — desmuta para tentar novamente com interação
      video.muted = true;
      video.play();
    });

    showToast('🍎 Easter Egg!', 'Bad Apple!! encontrado. Clique ou pressione Esc para sair.', 'fa-solid fa-circle-play');

    function closeEgg() {
      overlay.style.opacity = '0';
      video.pause();
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        eggActive = false;
        buffer = '';
      }, 500);
    }

    // Fechar com Esc
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        closeEgg();
        document.removeEventListener('keydown', onKeyDown);
      }
    }
    document.addEventListener('keydown', onKeyDown);

    // Fechar com clique no overlay (mas não no vídeo em si)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === closeBtn || e.target.closest('button') === closeBtn) {
        closeEgg();
        document.removeEventListener('keydown', onKeyDown);
      }
    });

    // Fechar com toque (mobile)
    overlay.addEventListener('touchend', (e) => {
      if (e.target === overlay || e.target === closeBtn) {
        e.preventDefault();
        closeEgg();
        document.removeEventListener('keydown', onKeyDown);
      }
    });
  }
})();