/* ═══════════════════════════════════════════════════════════════
   AL NOOR TOUR & TRAVELS — Shared JavaScript
   Entry overlay, audio, header, scroll reveals, lightning
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Audio ──
  const audio = new Audio('assets/talbiyah.mp3');
  audio.loop = true;
  audio.volume = 0.4;
  let audioPlaying = false;

  // ── Entry Overlay ──
  const overlay = document.getElementById('entryOverlay');
  const enterBtn = document.getElementById('enterBtn');

  // Check if overlay was already dismissed this session
  if (sessionStorage.getItem('alnoor_entered') === '1') {
    if (overlay) overlay.classList.add('dismissed');
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', function () {
      overlay.classList.add('dismissed');
      document.body.style.overflow = '';
      sessionStorage.setItem('alnoor_entered', '1');

      // Start audio
      audio.play().then(() => {
        audioPlaying = true;
        updateSpeakerIcon(true);
      }).catch(() => {
        // Browser blocked it anyway
        audioPlaying = false;
        updateSpeakerIcon(false);
      });
    });
  }

  // ── Speaker Toggle ──
  const speakerBtn = document.getElementById('speakerToggle');
  const speakerOnIcon = document.getElementById('speakerOn');
  const speakerOffIcon = document.getElementById('speakerOff');

  function updateSpeakerIcon(playing) {
    if (!speakerOnIcon || !speakerOffIcon) return;
    speakerOnIcon.style.display = playing ? 'block' : 'none';
    speakerOffIcon.style.display = playing ? 'none' : 'block';
  }

  if (speakerBtn) {
    speakerBtn.addEventListener('click', function () {
      if (audioPlaying) {
        audio.pause();
        audioPlaying = false;
      } else {
        audio.play().then(() => {
          audioPlaying = true;
        }).catch(() => {});
      }
      updateSpeakerIcon(audioPlaying);
    });
  }

  // Initialize icon state
  updateSpeakerIcon(false);

  // ── Header Scroll ──
  const header = document.querySelector('.header');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    lastScroll = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile Menu ──
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ── Scroll Reveal (IntersectionObserver) ──
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── Lightning Flash ──
  const lightning = document.querySelector('.hero__lightning');
  if (lightning) {
    function triggerLightning() {
      lightning.classList.remove('flash');
      // Force reflow
      void lightning.offsetWidth;
      lightning.classList.add('flash');
    }

    // First flash after 3s, then every ~7s with slight randomness
    setTimeout(() => {
      triggerLightning();
      setInterval(() => {
        triggerLightning();
      }, 6000 + Math.random() * 3000);
    }, 3000);
  }

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(fi => fi.classList.remove('open'));
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ── Contact Form → WhatsApp ──
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const mobile = document.getElementById('formMobile').value.trim();
      const pkg = document.getElementById('formPackage').value;
      const passengers = document.getElementById('formPassengers').value;
      const message = document.getElementById('formMessage').value.trim();

      // Validation
      if (!name || !mobile || !pkg) {
        alert('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং প্যাকেজ নির্বাচন করুন।');
        return;
      }

      // Build WhatsApp message
      let waMsg = `আসসালামু আলাইকুম,\n\n`;
      waMsg += `বুকিং রিকোয়েস্ট:\n`;
      waMsg += `নাম: ${name}\n`;
      waMsg += `মোবাইল: ${mobile}\n`;
      waMsg += `প্যাকেজ: ${pkg}\n`;
      if (passengers) waMsg += `যাত্রী সংখ্যা: ${passengers}\n`;
      if (message) waMsg += `বার্তা: ${message}\n`;
      waMsg += `\nআল নূর ট্যুর অ্যান্ড ট্রাভেলস ওয়েবসাইট থেকে পাঠানো।`;

      const encoded = encodeURIComponent(waMsg);
      window.open(`https://wa.me/918282912691?text=${encoded}`, '_blank');
    });
  }

})();
