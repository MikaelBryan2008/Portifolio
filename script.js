/* =========================================================
   PORTFÓLIO — MIKAEL BRYAN
   Arquivo de comportamento (script.js)

   Este arquivo é dividido em pequenas funções, cada uma
   responsável por UMA única responsabilidade. Isso facilita
   a leitura, manutenção e reaproveitamento do código.

   Índice:
   1. Navbar: efeito de fundo ao rolar a página
   2. Menu mobile: abrir/fechar e fechar ao clicar em link
   3. Animações ao rolar (Intersection Observer)
   4. Ano atual automático no footer
   5. Botão "voltar ao topo"
   ========================================================= */

// Espera o DOM estar completamente carregado antes de manipular elementos.
// Isso evita erros de "elemento não encontrado" por script.js rodar antes do HTML existir.
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollEffect();
  initMobileMenu();
  initScrollAnimations();
  setCurrentYear();
  initBackToTop();
});


/* =========================================================
   1. NAVBAR: EFEITO DE FUNDO AO ROLAR A PÁGINA
   ========================================================= */

/**
 * Adiciona a classe "is-scrolled" na navbar quando o usuário
 * rola a página além de um limite (threshold). Isso ativa o
 * efeito de fundo translúcido com blur, definido no CSS.
 */
function initNavbarScrollEffect() {
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 40; // pixels rolados para ativar o efeito

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  // Roda uma vez ao carregar (caso a página já comece rolada)
  handleScroll();

  window.addEventListener('scroll', handleScroll);
}


/* =========================================================
   2. MENU MOBILE: ABRIR/FECHAR
   ========================================================= */

/**
 * Controla o botão hambúrguer e o painel de menu mobile.
 * Usa "event delegation" nos links do menu para fechar o painel
 * automaticamente após o clique, melhorando a experiência de navegação.
 */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navToggle || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');

    // Atualiza atributo de acessibilidade (leitores de tela)
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Bloqueia o scroll do body enquanto o menu mobile está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);

  // Event delegation: um único listener no painel, em vez de um por link.
  // Mais eficiente e funciona mesmo se os links forem adicionados depois.
  mobileMenu.addEventListener('click', (event) => {
    if (event.target.classList.contains('mobile-menu__link')) {
      closeMenu();
    }
  });
}


/* =========================================================
   3. ANIMAÇÕES AO ROLAR A PÁGINA (INTERSECTION OBSERVER)
   ========================================================= */

/**
 * Anima elementos com a classe ".fade-up" quando eles entram
 * na área visível da tela (viewport). Usamos Intersection Observer
 * em vez do evento "scroll" porque é muito mais performático:
 * o navegador só nos avisa quando algo realmente muda de estado,
 * sem precisarmos calcular posições a cada pixel rolado.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');

  // Fallback: se o navegador não suportar Intersection Observer,
  // apenas exibe todos os elementos sem animação.
  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    threshold: 0.15,        // dispara quando 15% do elemento estiver visível
    rootMargin: '0px 0px -40px 0px', // antecipa um pouco o disparo
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Para de observar após animar, já que a animação não precisa repetir
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));
}


/* =========================================================
   4. ANO ATUAL AUTOMÁTICO NO FOOTER
   ========================================================= */

/**
 * Preenche automaticamente o ano atual no footer (© 2026, por exemplo),
 * assim você nunca precisa lembrar de atualizar isso manualmente.
 */
function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}


/* =========================================================
   5. BOTÃO "VOLTAR AO TOPO"
   ========================================================= */

/**
 * Mostra/esconde o botão de voltar ao topo com base na posição
 * de scroll, e rola suavemente até o topo quando clicado.
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}