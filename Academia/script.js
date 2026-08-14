

document.addEventListener('DOMContentLoaded', () => {

  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
    }, 600); 
  });

  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
.
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); 

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

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

  const scrollIndicator = document.getElementById('scrollIndicator');
  scrollIndicator.addEventListener('click', () => smoothScrollTo('#beneficios'));


  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.15,      
    rootMargin: '0px 0px -60px 0px'
  });

  fadeElements.forEach((el) => fadeObserver.observe(el));

  const statNumbers = document.querySelectorAll('.hero__stat-number');

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600; 
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
    
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; 
      }
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateCount);
        observer.disconnect(); 
      }
    });
  }, { threshold: 0.5 });

  if (statNumbers.length) {
    statsObserver.observe(statNumbers[0].closest('.hero__stats'));
  }


  const track     = document.getElementById('testimonialsTrack');
  const slides     = track ? Array.from(track.children) : [];
  const dotsWrapper = document.getElementById('testimonialDots');
  const btnPrev    = document.getElementById('testimonialPrev');
  const btnNext    = document.getElementById('testimonialNext');

  let currentSlide = 0;
  let autoplayTimer = null;

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

  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-item__header');
    const body   = item.querySelector('.accordion-item__body');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.accordion-item__body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    });
  });

  const contactForm   = document.getElementById('contactForm');
  const formFeedback  = document.getElementById('formFeedback');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome     = contactForm.querySelector('[name="nome"]').value.trim();
    const telefone = contactForm.querySelector('[name="telefone"]').value.trim();
    const email    = contactForm.querySelector('[name="email"]').value.trim();

    if (!nome || !telefone || !email) {
      formFeedback.textContent = 'Por favor, preencha todos os campos.';
      formFeedback.style.color = '#F87171'; 
      return;
    }

    formFeedback.textContent = `Obrigado, ${nome.split(' ')[0]}! Em breve entraremos em contato pelo WhatsApp.`;
    formFeedback.style.color = 'var(--color-purple-light)';
    contactForm.reset();
  });

 const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('currentYear').textContent = new Date().getFullYear();

});