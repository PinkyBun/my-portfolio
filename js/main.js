/* ============================================================
   main.js — Jasmine A. Nalda Portfolio
   ============================================================ */

/* ============================================================
   1. Theme Toggle (Light / Dark)
   ============================================================ */
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('icon-sun');
const moonIcon = document.getElementById('icon-moon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

// Load saved preference or system preference
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || system);
})();

themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


/* ============================================================
   2. Sticky Navbar Shadow on Scroll
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ============================================================
   3. Hamburger / Mobile Nav
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  if (isOpen) {
    mobileNav.classList.add('open');
  } else {
    mobileNav.classList.remove('open');
  }
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});


/* ============================================================
   4. Active Nav Link on Scroll
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], #mobile-nav a[href^="#"]');

function updateActiveLink() {
  let currentId = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 90;
    if (window.scrollY >= top) {
      currentId = sec.id;
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ============================================================
   5. Scroll Fade-Up Animation (Intersection Observer)
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));


/* ============================================================
   6. Modal & Slider Logic
   ============================================================ */
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalSlides = document.getElementById('modal-slides');
const modalDots = document.getElementById('slider-dots');
const sliderPrev = document.getElementById('slider-prev');
const sliderNext = document.getElementById('slider-next');

let currentSlideIndex = 0;
let currentModalKey = '';

// Modal content data
const modalData = {
  ojt: {
    badge: 'On-the-Job Training',
    title: 'Department of Transportation — MRT3 Depot Office',
    tools: 'Station Division · January 2026 – April 2026',
    bullets: [
      'Handled daily encoding and record-keeping tasks to ensure accurate and up-to-date documentation',
      'Supported the monitoring and organization of operational data across different station activities',
      'Collaborated with government employees and learned how to navigate a professional government work environment'
    ],
    images: [
      'images/experience/sliders/1.jpg',
      'images/experience/sliders/2.jpg',
    ]
  }
};

function openModal(key) {
  const data = modalData[key];
  if (!data) return;

  currentModalKey = key;
  currentSlideIndex = 0;

  // Set text content
  document.getElementById('modal-badge').textContent = data.badge;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-tools').textContent = data.tools;

  // Build bullets
  const bulletsList = document.getElementById('modal-desc');
  bulletsList.innerHTML = '';
  data.bullets.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    bulletsList.appendChild(li);
  });

  // Build slides
  modalSlides.innerHTML = '';
  data.images.forEach(imgSrc => {
    const slide = document.createElement('div');
    slide.className = 'modal-slide';
    slide.innerHTML = `<img src="${imgSrc}" alt="${data.title}">`;
    modalSlides.appendChild(slide);
  });

  // Build dots
  modalDots.innerHTML = '';
  data.images.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    modalDots.appendChild(dot);
  });

  updateSlider();

  // Show modal
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function updateSlider() {
  modalSlides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

  // Update dots
  const dots = modalDots.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlideIndex);
  });
}

function nextSlide() {
  const data = modalData[currentModalKey];
  if (!data) return;
  currentSlideIndex = (currentSlideIndex + 1) % data.images.length;
  updateSlider();
}

function prevSlide() {
  const data = modalData[currentModalKey];
  if (!data) return;
  currentSlideIndex = (currentSlideIndex - 1 + data.images.length) % data.images.length;
  updateSlider();
}

function goToSlide(n) {
  currentSlideIndex = n;
  updateSlider();
}

// Event Listeners
document.querySelectorAll('[data-modal]').forEach(trigger => {
  trigger.addEventListener('click', () => openModal(trigger.dataset.modal));
});

sliderPrev.addEventListener('click', e => {
  e.stopPropagation();
  prevSlide();
});

sliderNext.addEventListener('click', e => {
  e.stopPropagation();
  nextSlide();
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (!modalOverlay.classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});


/* ============================================================
   7. Contact Form (Formspree AJAX)
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = btn.innerHTML;

    // Loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        const data = await response.json();
        if (data.errors) {
          formStatus.textContent = data.errors.map(error => error.message).join(", ");
        } else {
          formStatus.textContent = 'Oops! Something went wrong. Please try again.';
        }
        formStatus.classList.add('error');
      }
    } catch (error) {
      formStatus.textContent = 'Oops! Something went wrong. Please try again.';
      formStatus.classList.add('error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  });
}


/* ============================================================
   8. Typing Effect (Hero)
   ============================================================ */
const typedTextSpan = document.getElementById('typed-text');
const words = ["Fresh Graduate", "Willing to Learn", "Detail-Oriented", "Open to Opportunities"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at the end of a word
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500; // Pause before starting next word
  }

  setTimeout(type, typeSpeed);
}

// Start typing effect on load
window.addEventListener('load', () => {
  if (typedTextSpan) {
    setTimeout(type, 1200);
  }
});

/* ============================================================
   9. Gallery Overlay & Lightbox
   ============================================================ */
const btnSeeMyWork = document.getElementById('btn-see-my-work');
const galleryOverlay = document.getElementById('gallery-overlay');
const galleryCloseBtn = document.getElementById('gallery-close');
const filterBtns = document.querySelectorAll('.filter-btn');
const masonryItems = document.querySelectorAll('.masonry-item');

// Lightbox elements
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCloseBtn = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentGalleryImages = [];
let currentLightboxIndex = 0;

// Gallery Open/Close
if (btnSeeMyWork && galleryOverlay && galleryCloseBtn) {
  btnSeeMyWork.addEventListener('click', (e) => {
    e.preventDefault();
    galleryOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  galleryCloseBtn.addEventListener('click', () => {
    galleryOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Filtering
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    masonryItems.forEach(item => {
      if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// Lightbox Open
masonryItems.forEach(item => {
  item.addEventListener('click', () => {
    // Collect all currently visible images for navigation
    currentGalleryImages = Array.from(masonryItems)
      .filter(m => !m.classList.contains('hidden'))
      .map(m => m.querySelector('img').src);
    
    const clickedImgSrc = item.querySelector('img').src;
    currentLightboxIndex = currentGalleryImages.indexOf(clickedImgSrc);
    
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;
    
    showLightboxImage(currentLightboxIndex);
    lightboxOverlay.classList.add('open');
  });
});

function showLightboxImage(index) {
  if (currentGalleryImages.length === 0) return;
  lightboxImg.src = currentGalleryImages[index];
}

function nextLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryImages.length;
  showLightboxImage(currentLightboxIndex);
}

function prevLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  showLightboxImage(currentLightboxIndex);
}

function closeLightbox() {
  lightboxOverlay.classList.remove('open');
}

if (lightboxOverlay) {
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightboxImage(); });
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightboxImage(); });

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // Keyboard support for Lightbox and Gallery
  document.addEventListener('keydown', (e) => {
    if (lightboxOverlay.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    } else if (galleryOverlay && galleryOverlay.classList.contains('open')) {
      if (e.key === 'Escape') {
        galleryOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // Swipe Support for Lightbox (Mobile)
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxOverlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightboxOverlay.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left
      nextLightboxImage();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right
      prevLightboxImage();
    }
  }
}
