/* =====================================================================
   RAPAT WALI MURID — SDIT TARBIYATUL UMMAH
   script.js — logika navigasi presentasi
===================================================================== */

(function () {
  'use strict';

  /* ------------------- 1. AMBIL ELEMEN ------------------- */
  const slides          = Array.from(document.querySelectorAll('.slide'));
  const totalSlides     = slides.length;

  const progressFill    = document.getElementById('progressFill');
  const sectionLabel    = document.getElementById('sectionLabel');
  const slideCurrentEl  = document.getElementById('slideCurrent');
  const slideTotalEl    = document.getElementById('slideTotal');

  const prevBtn         = document.getElementById('prevBtn');
  const nextBtn         = document.getElementById('nextBtn');
  const dotsContainer   = document.getElementById('dotsContainer');
  const fullscreenBtn   = document.getElementById('fullscreenBtn');

  let currentIndex = 0;
  let isAnimating  = false;

  /* ------------------- 2. INISIALISASI ------------------- */
  slideTotalEl.textContent = String(totalSlides).padStart(2, '0');

  // Buat navigation dots secara dinamis, satu per slide
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', 'Ke slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dotEls = Array.from(dotsContainer.children);

  /* ------------------- 3. FUNGSI UTAMA NAVIGASI ------------------- */
  function renderSlide(index, direction) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'exit-left');
      if (i === index) {
        slide.classList.add('active');
      } else if (direction === 'next' && i === currentIndex) {
        slide.classList.add('exit-left');
      }
    });

    // Update progress bar
    const progressPercent = ((index + 1) / totalSlides) * 100;
    progressFill.style.width = progressPercent + '%';

    // Update nomor slide
    slideCurrentEl.textContent = String(index + 1).padStart(2, '0');

    // Update section indicator sesuai data-section slide aktif
    const sectionName = slides[index].getAttribute('data-section') || '';
    sectionLabel.textContent = sectionName;

    // Update dots
    dotEls.forEach((dot, i) => dot.classList.toggle('active', i === index));

    // Update status tombol prev/next
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalSlides - 1;

    currentIndex = index;
  }

  function goToSlide(index) {
    if (isAnimating) return;
    if (index < 0 || index >= totalSlides) return;
    if (index === currentIndex) return;

    const direction = index > currentIndex ? 'next' : 'prev';
    isAnimating = true;
    renderSlide(index, direction);

    // Kunci animasi selama transisi berlangsung (samakan dengan durasi CSS)
    window.setTimeout(() => { isAnimating = false; }, 650);
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  /* ------------------- 4. EVENT: TOMBOL ------------------- */
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  /* ------------------- 5. EVENT: KEYBOARD ------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });

  /* ------------------- 6. EVENT: SWIPE (MOBILE) ------------------- */
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const deltaX = touchEndX - touchStartX;
    const SWIPE_THRESHOLD = 50;

    if (deltaX > SWIPE_THRESHOLD) {
      prevSlide();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      nextSlide();
    }
  }, { passive: true });

  /* ------------------- 7. FULLSCREEN ------------------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        /* Browser menolak permintaan fullscreen — abaikan secara senyap */
      });
    } else {
      document.exitFullscreen();
    }
  }

  fullscreenBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', () => {
    const icon = fullscreenBtn.querySelector('i');
    if (document.fullscreenElement) {
      icon.classList.remove('fa-expand');
      icon.classList.add('fa-compress');
    } else {
      icon.classList.remove('fa-compress');
      icon.classList.add('fa-expand');
    }
  });

  /* ------------------- 8. RENDER PERTAMA KALI ------------------- */
  renderSlide(0, 'init');
})();
