/* =========================================================================
   POWERFIT — SCRIPT.JS
   Sumário:
   1. Loader inicial
   2. Navbar fixa (efeito de scroll + menu mobile)
   3. Scroll suave em links internos
   4. Fade-in dos elementos ao rolar (Intersection Observer)
   5. Contador animado das estatísticas do hero
   6. Carrossel de depoimentos
   7. Accordion do FAQ
   8. Formulário de contato (validação + feedback)
   9. Botão "voltar ao topo"
   10. Ano atual no rodapé
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =======================================================================
     1. LOADER INICIAL
     Esconde a tela de carregamento assim que a página termina de montar,
     dando uma sensação de entrada premium em vez de um "pulo" brusco.
     ======================================================================= */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
    }, 600); // pequeno delay para a barra de progresso terminar visualmente
  });


  /* =======================================================================
     2. NAVBAR FIXA — efeito de scroll + menu mobile
     ======================================================================= */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  // Adiciona a classe "is-scrolled" quando o usuário desce a página,
  // fazendo a navbar encolher e ganhar fundo sólido com blur.
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // garante o estado correto no load (ex: reload com scroll)

  // Abre/fecha o menu mobile (hambúrguer)
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Fecha o menu mobile automaticamente ao clicar em qualquer link
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* =======================================================================
     3. SCROLL SUAVE EM LINKS INTERNOS
     O CSS já define `scroll-behavior: smooth`, mas tratamos aqui o clique
     manualmente para garantir compatibilidade e também permitir o botão
     de indicador de scroll do hero.
     ======================================================================= */
  function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        event.preventDefault();
        smoothScrollTo(href);
      }
    });
  });

  // Botão de "scroll down" do hero leva até a seção de Benefícios
  const scrollIndicator = document.getElementById('scrollIndicator');
  scrollIndicator.addEventListener('click', () => smoothScrollTo('#beneficios'));


  /* =======================================================================
     4. FADE-IN AO ROLAR A PÁGINA (Intersection Observer)
     Todos os elementos com a classe ".fade-in" ganham a classe
     ".is-visible" quando entram no viewport, disparando a transição
     definida no CSS.
     ======================================================================= */
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target); // anima só uma vez
      }
    });
  }, {
    threshold: 0.15,        // dispara quando 15% do elemento está visível
    rootMargin: '0px 0px -60px 0px'
  });

  fadeElements.forEach((el) => fadeObserver.observe(el));


  /* =======================================================================
     5. CONTADOR ANIMADO DAS ESTATÍSTICAS DO HERO
     Anima os números (ex: 12+, 3500+, 40+) de 0 até o valor final quando
     a seção entra na tela, usando requestAnimationFrame para suavidade.
     ======================================================================= */
  const statNumbers = document.querySelectorAll('.hero__stat-number');

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600; // duração total da contagem, em ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo: começa rápido e desacelera no final — fica mais natural
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // garante o valor exato ao final
      }
    }
    requestAnimationFrame(step);
  }

  // Dispara a contagem apenas quando os números entram na tela
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateCount);
        observer.disconnect(); // só precisa disparar uma vez
      }
    });
  }, { threshold: 0.5 });

  if (statNumbers.length) {
    statsObserver.observe(statNumbers[0].closest('.hero__stats'));
  }


  /* =======================================================================
     6. CARROSSEL DE DEPOIMENTOS
     Carrossel simples baseado em "translateX" da track, com botões de
     navegação, dots clicáveis e troca automática a cada X segundos.
     ======================================================================= */
  const track     = document.getElementById('testimonialsTrack');
  const slides     = track ? Array.from(track.children) : [];
  const dotsWrapper = document.getElementById('testimonialDots');
  const btnPrev    = document.getElementById('testimonialPrev');
  const btnNext    = document.getElementById('testimonialNext');

  let currentSlide = 0;
  let autoplayTimer = null;

  // Gera dinamicamente um "dot" de navegação para cada depoimento
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonials__dot');
    dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
    if (index === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsWrapper.appendChild(dot);
  });

  const dots = Array.from(dotsWrapper.children);

  function goToSlide(index) {
    // Garante que o índice sempre fique dentro do intervalo válido (loop)
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (slides.length) {
    btnNext.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoplay(); });
    btnPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoplay(); });
    startAutoplay();
  }


  /* =======================================================================
     7. ACCORDION DO FAQ
     Abre uma pergunta por vez, fechando as demais — comportamento padrão
     de FAQ para manter a lista organizada e fácil de escanear.
     ======================================================================= */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-item__header');
    const body   = item.querySelector('.accordion-item__body');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fecha todos os itens antes de abrir o clicado
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.accordion-item__body').style.maxHeight = null;
      });

      // Se o item clicado já estava aberto, ele permanece fechado (toggle).
      // Caso contrário, abre e ajusta a altura máxima conforme o conteúdo.
      if (!isOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    });
  });


  /* =======================================================================
     8. FORMULÁRIO DE CONTATO — validação simples + feedback visual
     Como não há back-end neste projeto, simulamos o envio e mostramos
     uma mensagem de confirmação amigável ao usuário.
     ======================================================================= */
  const contactForm   = document.getElementById('contactForm');
  const formFeedback  = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome     = contactForm.querySelector('[name="nome"]').value.trim();
    const telefone = contactForm.querySelector('[name="telefone"]').value.trim();
    const email    = contactForm.querySelector('[name="email"]').value.trim();

    // Validação básica de preenchimento (o "required" do HTML já ajuda,
    // mas reforçamos aqui para exibir uma mensagem customizada)
    if (!nome || !telefone || !email) {
      formFeedback.textContent = 'Por favor, preencha todos os campos.';
      formFeedback.style.color = '#F87171'; // vermelho de alerta
      return;
    }

    // Simulação de envio bem-sucedido
    formFeedback.textContent = `Obrigado, ${nome.split(' ')[0]}! Em breve entraremos em contato pelo WhatsApp.`;
    formFeedback.style.color = 'var(--color-purple-light)';
    contactForm.reset();
  });


  /* =======================================================================
     9. BOTÃO "VOLTAR AO TOPO"
     Aparece após o usuário rolar uma certa distância e leva suavemente
     de volta ao topo da página ao ser clicado.
     ======================================================================= */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =======================================================================
     10. ANO ATUAL NO RODAPÉ
     Mantém o copyright sempre atualizado automaticamente.
     ======================================================================= */
  document.getElementById('currentYear').textContent = new Date().getFullYear();

});