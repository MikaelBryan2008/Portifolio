
document.addEventListener("DOMContentLoaded", () => {

  const preloader = document.getElementById("preloader");

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add("is-hidden");
    }
  }

  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 500);
  });

  setTimeout(hidePreloader, 3500);

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

  mobileDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

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

  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuPanels = document.querySelectorAll(".menu-panel");

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      menuTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      menuPanels.forEach((panel) => {
        const isTarget = panel.id === `panel-${targetTab}`;
        panel.classList.toggle("is-active", isTarget);
        panel.hidden = !isTarget;
      });
    });
  });

  const revealElements = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
        
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
  
    el.dataset.revealDelay = (index % 4) * 70;
    revealObserver.observe(el);
  });

  setTimeout(() => {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }, 4000);

  const counters = document.querySelectorAll("[data-counter]");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1400; // ms
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
    
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


  const reservaForm = document.getElementById("reservaForm");
  const reservaFeedback = document.getElementById("reservaFeedback");


  const dataInput = document.getElementById("data");
  if (dataInput) {
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.setAttribute("min", hoje);
  }

  reservaForm.addEventListener("submit", (e) => {
    e.preventDefault();

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

    reservaFeedback.textContent = `Obrigado, ${nome}! Sua reserva para ${pessoas} às ${hora} do dia ${formatarData(data)} foi recebida. Em breve entraremos em contato para confirmar.`;
    reservaFeedback.className = "reserva__feedback is-success";

    reservaForm.reset();
  });

  function formatarData(isoDate) {
    const [ano, mes, dia] = isoDate.split("-");
    return `${dia}/${mes}/${ano}`;
  }

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

  const anoAtual = document.getElementById("anoAtual");
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }
});