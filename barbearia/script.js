/* ============================================================
   ROYAL BARBER — SCRIPT.JS
   Estrutura do arquivo:
   1. Utilitários
   2. Navbar: estado "scrolled" + menu mobile
   3. Reveal animations (IntersectionObserver)
   4. Hero: contador animado das estatísticas
   5. Galeria: lightbox
   6. Agendamento: validação do formulário
   7. Depoimentos: carrossel
   8. FAQ: acordeão
   9. Botão voltar ao topo
   10. Rodapé: ano atual
   11. Inicialização
============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. UTILITÁRIOS
  ============================================================ */

  // Verifica se o usuário prefere movimento reduzido (acessibilidade)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pequeno helper para selecionar elementos
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));


  /* ============================================================
     2. NAVBAR: ESTADO "SCROLLED" + MENU MOBILE
  ============================================================ */
  function initNavbar() {
    const navbar = $('#navbar');
    const burger = $('#navBurger');
    const mobileMenu = $('#mobileMenu');

    if (!navbar) return;

    // Adiciona fundo sólido + blur na navbar após rolar um pouco a página
    function handleNavbarScroll() {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // estado inicial

    // Abre/fecha o menu mobile (hambúrguer)
    function toggleMobileMenu() {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : ''; // trava o scroll do body
    }

    if (burger && mobileMenu) {
      burger.addEventListener('click', toggleMobileMenu);

      // Fecha o menu mobile ao clicar em qualquer link
      $$('.mobile-menu__link', mobileMenu).forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('is-open');
          burger.classList.remove('is-active');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }


  /* ============================================================
     3. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  ============================================================ */
  function initRevealAnimations() {
    const revealEls = $$('[data-reveal]');
    if (!revealEls.length) return;

    // Se o usuário preferir menos movimento, mostra tudo direto sem animar
    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // anima uma única vez
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }


  /* ============================================================
     4. HERO: CONTADOR ANIMADO DAS ESTATÍSTICAS
  ============================================================ */
  function initHeroCounters() {
    const hero = $('.hero');
    const counters = $$('[data-count]');
    if (!hero) return;

    // Efeito de "linhas do título subindo" ao carregar a página
    requestAnimationFrame(() => hero.classList.add('is-loaded'));

    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString('pt-BR');
        return;
      }

      const duration = 1600; // ms
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        // easeOutExpo: começa rápido e desacelera no final
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString('pt-BR');

        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('pt-BR');
      }
      requestAnimationFrame(step);
    }

    // Só dispara a contagem quando as estatísticas entram na tela
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          statObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });

    const statsContainer = $('.hero__stats');
    if (statsContainer) statObserver.observe(statsContainer);
  }


  /* ============================================================
     5. GALERIA: LIGHTBOX
  ============================================================ */
  function initGalleryLightbox() {
    const items = $$('.gallery__item');
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxCaption = $('#lightboxCaption');
    const closeBtn = $('#lightboxClose');

    if (!items.length || !lightbox) return;

    function openLightbox(item) {
      // Extrai a URL da imagem do background-image inline definido no HTML
      const bg = item.style.backgroundImage; // formato: url("...")
      const url = bg.slice(5, -2); // remove 'url("' e '")'
      const caption = item.dataset.caption || '';

      lightboxImg.src = url;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    items.forEach(item => item.addEventListener('click', () => openLightbox(item)));
    closeBtn.addEventListener('click', closeLightbox);

    // Fecha clicando fora da imagem ou pressionando Esc
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }


  /* ============================================================
     6. AGENDAMENTO: VALIDAÇÃO DO FORMULÁRIO
  ============================================================ */
  function initBookingForm() {
    const form = $('#bookingForm');
    if (!form) return;

    const successMsg = $('#bookingSuccess');
    const dateInput = $('#date', form);

    // Impede selecionar datas passadas no campo de data
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    // Mensagens de erro amigáveis por campo
    const errorMessages = {
      name: 'Informe seu nome completo.',
      phone: 'Informe um telefone válido com DDD.',
      service: 'Selecione o serviço desejado.',
      date: 'Selecione uma data para o atendimento.',
      time: 'Selecione um horário disponível.'
    };

    function setFieldError(field, message) {
      const wrapper = field.closest('.form-field');
      const errorEl = $(`[data-error-for="${field.name}"]`, form);
      wrapper.classList.toggle('has-error', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    }

    // Validação simples de telefone: aceita formatos comuns BR (10 ou 11 dígitos)
    function isValidPhone(value) {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    }

    function validateForm() {
      let isValid = true;

      const name = $('#name', form);
      if (name.value.trim().length < 3) {
        setFieldError(name, errorMessages.name);
        isValid = false;
      } else {
        setFieldError(name, '');
      }

      const phone = $('#phone', form);
      if (!isValidPhone(phone.value)) {
        setFieldError(phone, errorMessages.phone);
        isValid = false;
      } else {
        setFieldError(phone, '');
      }

      const service = $('#service', form);
      if (!service.value) {
        setFieldError(service, errorMessages.service);
        isValid = false;
      } else {
        setFieldError(service, '');
      }

      const date = $('#date', form);
      if (!date.value) {
        setFieldError(date, errorMessages.date);
        isValid = false;
      } else {
        setFieldError(date, '');
      }

      const time = $('#time', form);
      if (!time.value) {
        setFieldError(time, errorMessages.time);
        isValid = false;
      } else {
        setFieldError(time, '');
      }

      return isValid;
    }

    // Formatação automática do telefone no formato (00) 00000-0000
    const phoneInput = $('#phone', form);
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (digits.length > 6) {
          digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        } else if (digits.length > 2) {
          digits = digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        }
        e.target.value = digits;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        successMsg.textContent = '';
        return;
      }

      // Em produção, aqui seria feita uma chamada a uma API de agendamento.
      // Como é um site estático, simulamos a confirmação visualmente.
      const formData = new FormData(form);
      const name = formData.get('name');
      const date = formData.get('date');
      const time = formData.get('time');

      successMsg.textContent = `Tudo certo, ${name.split(' ')[0]}! Seu horário em ${formatDate(date)} às ${time} foi reservado. Em breve confirmaremos por WhatsApp.`;

      form.reset();
      // Garante que a data mínima continue aplicada após o reset
      if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    });

    // Converte 'AAAA-MM-DD' para 'DD/MM/AAAA' para exibição amigável
    function formatDate(isoDate) {
      const [year, month, day] = isoDate.split('-');
      return `${day}/${month}/${year}`;
    }
  }


  /* ============================================================
     7. DEPOIMENTOS: CARROSSEL
  ============================================================ */
  function initTestimonialsCarousel() {
    const track = $('#testimonialsTrack');
    const prevBtn = $('#testPrev');
    const nextBtn = $('#testNext');
    const dotsWrap = $('#testDots');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = $$('.testimonial-card', track);
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(cards.length - cardsPerView, 0);

    function getCardsPerView() {
      const width = window.innerWidth;
      if (width <= 760) return 1;
      if (width <= 1080) return 2;
      return 3;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot';
        dot.setAttribute('aria-label', `Ir para o grupo de depoimentos ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
      }
      updateDots();
    }

    function updateDots() {
      $$('.testimonials__dot', dotsWrap).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    function updateTrackPosition() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24; // deve refletir o mesmo "gap" definido no CSS (.testimonials__track)
      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
    }

    function goToSlide(index) {
      currentIndex = Math.min(Math.max(index, 0), maxIndex);
      updateTrackPosition();
      updateDots();
    }

    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1 > maxIndex ? 0 : currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1 < 0 ? maxIndex : currentIndex - 1));

    // Recalcula posições e número de cards visíveis ao redimensionar a janela
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cardsPerView = getCardsPerView();
        maxIndex = Math.max(cards.length - cardsPerView, 0);
        currentIndex = Math.min(currentIndex, maxIndex);
        buildDots();
        updateTrackPosition();
      }, 150);
    });

    buildDots();
    updateTrackPosition();
  }


  /* ============================================================
     8. FAQ: ACORDEÃO
  ============================================================ */
  function initFaqAccordion() {
    const items = $$('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const question = $('.faq-item__question', item);
      const answer = $('.faq-item__answer', item);

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Fecha todos os outros itens (comportamento de acordeão clássico)
        items.forEach(other => {
          other.classList.remove('is-open');
          $('.faq-item__question', other).setAttribute('aria-expanded', 'false');
          $('.faq-item__answer', other).style.maxHeight = null;
        });

        // Reabre o item clicado, se ele estava fechado
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }


  /* ============================================================
     9. BOTÃO VOLTAR AO TOPO
  ============================================================ */
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    function toggleVisibility() {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }


  /* ============================================================
     10. RODAPÉ: ANO ATUAL
  ============================================================ */
  function initFooterYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }


  /* ============================================================
     11. INICIALIZAÇÃO
  ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initRevealAnimations();
    initHeroCounters();
    initGalleryLightbox();
    initBookingForm();
    initTestimonialsCarousel();
    initFaqAccordion();
    initBackToTop();
    initFooterYear();
  });

})();