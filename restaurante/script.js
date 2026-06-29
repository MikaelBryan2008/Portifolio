/* ==========================================================================
   BELLA MASSA — Script principal
   Organização:
     1. Preloader
     2. Navbar fixa (efeito de scroll)
     3. Drawer mobile (menu hambúrguer)
     4. Scroll suave + fechamento automático do menu ao clicar em link
     5. Abas do cardápio
     6. Scroll Reveal (IntersectionObserver)
     7. Contadores animados (estatísticas da história)
     8. Galeria + Lightbox
     9. Formulário de reserva
    10. Botão "voltar ao topo"
    11. Ano dinâmico no rodapé
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. PRELOADER ---------- */
  // Esconde o preloader assim que a página e as imagens principais carregarem.
  // Um pequeno atraso garante que a animação de entrada seja percebida pelo usuário.
  const preloader = document.getElementById("preloader");

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add("is-hidden");
    }
  }

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 500);
  });

  // Fallback: caso o evento "load" demore (ex: imagens externas lentas),
  // força o fechamento do preloader após um tempo máximo de espera.
  setTimeout(hidePreloader, 3500);

  /* ---------- 2. NAVBAR FIXA — efeito ao rolar a página ---------- */
  const navbar = document.getElementById("navbar");
  const SCROLL_THRESHOLD = 40;

  function updateNavbarState() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });

  /* ---------- 3. DRAWER MOBILE ---------- */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");

  function openDrawer() {
    mobileDrawer.classList.add("is-open");
    drawerBackdrop.classList.add("is-open");
    burgerBtn.classList.add("is-active");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    mobileDrawer.classList.remove("is-open");
    drawerBackdrop.classList.remove("is-open");
    burgerBtn.classList.remove("is-active");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    const isOpen = mobileDrawer.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });

  drawerBackdrop.addEventListener("click", closeDrawer);

  // Fecha o drawer ao clicar em qualquer link de navegação dentro dele
  mobileDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // Fecha o drawer com a tecla ESC (acessibilidade via teclado)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  /* ---------- 4. SCROLL SUAVE ---------- */
  // O scroll suave já é tratado via CSS (scroll-behavior: smooth),
  // mas garantimos compatibilidade extra para navegadores mais antigos.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ---------- 5. ABAS DO CARDÁPIO ---------- */
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuPanels = document.querySelectorAll(".menu-panel");

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      // Atualiza o estado visual e de acessibilidade das abas
      menuTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      // Mostra apenas o painel correspondente à aba selecionada
      menuPanels.forEach((panel) => {
        const isTarget = panel.id === `panel-${targetTab}`;
        panel.classList.toggle("is-active", isTarget);
        panel.hidden = !isTarget;
      });
    });
  });

  /* ---------- 6. SCROLL REVEAL (IntersectionObserver) ---------- */
  // Usamos IntersectionObserver em vez de listeners de "scroll" por ser
  // muito mais leve para a performance — o navegador só nos notifica
  // quando um elemento realmente entra ou sai da área visível.
  const revealElements = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pequeno atraso escalonado para elementos próximos revelarem em cascata
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px",
    }
  );

  revealElements.forEach((el, index) => {
    // Escalona levemente itens dentro do mesmo grupo/lista para um efeito em cascata sutil
    el.dataset.revealDelay = (index % 4) * 70;
    revealObserver.observe(el);
  });

  // Rede de segurança: garante que nenhum conteúdo fique invisível permanentemente
  // caso o IntersectionObserver não dispare para algum elemento (ex: grids muito largos).
  setTimeout(() => {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }, 4000);

  /* ---------- 7. CONTADORES ANIMADOS (estatísticas da história) ---------- */
  const counters = document.querySelectorAll("[data-counter]");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1400; // ms
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuad para uma desaceleração suave e elegante
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  /* ---------- 8. GALERIA + LIGHTBOX ---------- */
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const fullSrc = item.getAttribute("data-full");
      const imgAlt = item.querySelector("img").alt;
      openLightbox(fullSrc, imgAlt);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  /* ---------- 9. FORMULÁRIO DE RESERVA ---------- */
  const reservaForm = document.getElementById("reservaForm");
  const reservaFeedback = document.getElementById("reservaFeedback");

  // Impede que o usuário selecione uma data no passado
  const dataInput = document.getElementById("data");
  if (dataInput) {
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.setAttribute("min", hoje);
  }

  reservaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validação simples no front-end. Em produção, este formulário deve
    // ser conectado a um backend, serviço de e-mail ou API de reservas.
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const pessoas = document.getElementById("pessoas").value;

    if (!nome || !telefone || !data || !hora || !pessoas) {
      reservaFeedback.textContent =
        "Por favor, preencha todos os campos obrigatórios.";
      reservaFeedback.className = "reserva__feedback is-error";
      return;
    }

    // Simula o envio da reserva. Substitua este bloco pela integração real
    // (ex: fetch para uma API, envio de e-mail, ou webhook do WhatsApp).
    reservaFeedback.textContent = `Obrigado, ${nome}! Sua reserva para ${pessoas} às ${hora} do dia ${formatarData(data)} foi recebida. Em breve entraremos em contato para confirmar.`;
    reservaFeedback.className = "reserva__feedback is-success";

    reservaForm.reset();
  });

  function formatarData(isoDate) {
    const [ano, mes, dia] = isoDate.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  /* ---------- 10. BOTÃO "VOLTAR AO TOPO" ---------- */
  const backToTop = document.getElementById("backToTop");
  const BACK_TO_TOP_THRESHOLD = 600;

  function updateBackToTopVisibility() {
    backToTop.classList.toggle(
      "is-visible",
      window.scrollY > BACK_TO_TOP_THRESHOLD
    );
  }

  updateBackToTopVisibility();
  window.addEventListener("scroll", updateBackToTopVisibility, {
    passive: true,
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 11. ANO DINÂMICO NO RODAPÉ ---------- */
  const anoAtual = document.getElementById("anoAtual");
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }
});