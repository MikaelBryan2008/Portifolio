
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollEffect();
  initMobileMenu();
  initScrollAnimations();
  setCurrentYear();
  initBackToTop();
});

function initNavbarScrollEffect() {
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 40;

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  handleScroll();

  window.addEventListener('scroll', handleScroll);
}

function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navToggle || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');

    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);

  mobileMenu.addEventListener('click', (event) => {
    if (event.target.classList.contains('mobile-menu__link')) {
      closeMenu();
    }
  });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up');

  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    threshold: 0.15,       
    rootMargin: '0px 0px -40px 0px', 
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
       
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));
}

function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

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