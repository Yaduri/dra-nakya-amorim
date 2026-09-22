/* ==========================================================================
   ESTÉTICA NAKYA AMORIM — INTERACTIVE JAVASCRIPT
   Features: Lenis Smooth Scroll, GSAP Orchestration, Luxury Preloader,
   Mobile Menu, Accordion, Video Reels, Interactive B&A Slider, Micro-Quiz
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // ==========================================================================
  // 0. ACCESSIBILITY & MOTION SENSITIVITY CHECK (WCAG 2.3.3)
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderNum = document.getElementById('preloader-num');
  const hasVisited = sessionStorage.getItem('nakya_preloader_seen');

  let lenisInstance = null;

  // Initialize Lenis Smooth Scroll only if user has not requested reduced motion
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false
    });

    // Sync Lenis with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Handle Preloader dismissal & Hero entrance
  const launchHeroAnimations = () => {
    if (prefersReducedMotion) {
      document.querySelectorAll('.navbar, .hero-badge, .hero-title, .hero-subtitle, .hero-bullet-item, .hero-ctas, .hero-stats, .hero-image-card, .floating-badge').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    if (typeof gsap !== 'undefined') {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .fromTo('.navbar', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, clearProps: 'all' })
        .fromTo('.hero-badge', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, clearProps: 'all' }, '-=0.3')
        .fromTo('.hero-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, clearProps: 'all' }, '-=0.3')
        .fromTo('.hero-subtitle', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, clearProps: 'all' }, '-=0.4')
        .fromTo('.hero-bullet-item', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, clearProps: 'all' }, '-=0.3')
        .fromTo('.hero-ctas', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, clearProps: 'all' }, '-=0.2')
        .fromTo('.hero-stats', { opacity: 0 }, { opacity: 1, duration: 0.5, clearProps: 'all' }, '-=0.2')
        .fromTo('.hero-image-card', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, clearProps: 'all' }, '-=0.7')
        .fromTo('.floating-badge', { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.15, clearProps: 'opacity' }, '-=0.4');

      if (typeof ScrollTrigger !== 'undefined') {
        // Pilares do Método: Destaque progressivo no scroll
        const pillarCards = document.querySelectorAll('.pillar-card');
        pillarCards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 75%',
            end: 'bottom 40%',
            onEnter: () => card.classList.add('is-active'),
            onLeaveBack: () => card.classList.remove('is-active')
          });
        });

        // Revelação Stagger nos cards de tratamentos
        gsap.from('.treatment-card', {
          scrollTrigger: {
            trigger: '.treatments-grid',
            start: 'top 80%',
            once: true
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out'
        });

        // Revelação Stagger nos depoimentos
        gsap.from('.testimonial-card', {
          scrollTrigger: {
            trigger: '.testimonials-grid',
            start: 'top 80%',
            once: true
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out'
        });

        // Revelação nos passos de atendimento
        gsap.from('.step-card', {
          scrollTrigger: {
            trigger: '.steps-grid',
            start: 'top 80%',
            once: true
          },
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out'
        });
      }
    }
  };

  if (preloader) {
    if (hasVisited || prefersReducedMotion) {
      preloader.style.display = 'none';
      launchHeroAnimations();
    } else {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 8;
        if (progress > 100) progress = 100;

        if (preloaderBar) preloaderBar.style.transform = `scaleX(${progress / 100})`;
        if (preloaderNum) preloaderNum.textContent = `${progress}%`;

        if (progress === 100) {
          clearInterval(interval);
          sessionStorage.setItem('nakya_preloader_seen', 'true');

          if (typeof gsap !== 'undefined') {
            const exitTl = gsap.timeline({
              onComplete: () => {
                preloader.style.display = 'none';
              }
            });

            // Iniciar animação da hero logo antes do curtain subir completamente
            launchHeroAnimations();

            exitTl
              .to('.preloader-content', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' })
              .to('.preloader-curtain', { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.1');
          } else {
            preloader.style.transition = 'opacity 0.6s ease';
            preloader.style.opacity = '0';
            launchHeroAnimations();
            setTimeout(() => {
              preloader.style.display = 'none';
            }, 600);
          }
        }
      }, 70);
    }
  } else {
    launchHeroAnimations();
  }

  // ==========================================================================
  // 1. NAVBAR SCROLL EFFECT
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 2. MOBILE MENU TOGGLE
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
      navToggle.innerHTML = isExpanded ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ==========================================================================
  // 3. FAQ ACCORDION (ACCESSIBLE WAI-ARIA)
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger') || item.querySelector('.faq-header');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger') || otherItem.querySelector('.faq-header');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        const willBeActive = !isActive;
        item.classList.toggle('active', willBeActive);
        trigger.setAttribute('aria-expanded', willBeActive ? 'true' : 'false');
      });
    }
  });

  // ==========================================================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS (INTEGRATED WITH LENIS)
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(targetElement, { offset: -70 });
        } else {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ==========================================================================
  // 5. SLIDER INTERATIVO ANTES E DEPOIS (CLIP-PATH BASED)
  // ==========================================================================
  const baInputs = document.querySelectorAll('.ba-range-input');
  baInputs.forEach(input => {
    const wrapper = input.closest('.ba-slider-wrapper');
    if (wrapper) {
      const updateSlider = (val) => {
        wrapper.style.setProperty('--pos', `${val}%`);
      };

      input.addEventListener('input', (e) => updateSlider(e.target.value));
      input.addEventListener('change', (e) => updateSlider(e.target.value));
      updateSlider(50);
    }
  });

  // ==========================================================================
  // 6. VÍDEOS ESTILO REELS (AUTOPLAY SILENCIOSO + SOM MUTE/UNMUTE)
  // ==========================================================================
  const muteBtns = document.querySelectorAll('.video-mute-btn');
  muteBtns.forEach(btn => {
    const videoCard = btn.closest('.video-card');
    const video = videoCard.querySelector('video');

    if (video) {
      video.muted = true;
      video.play().catch(() => {});

      btn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
          btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Ativar Som';
        } else {
          btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Mudar Som';
        }
      });
    }
  });

  // ==========================================================================
  // 7. SELETOR DE MODALIDADE (PRESENCIAL X ONLINE - ACESSÍVEL)
  // ==========================================================================
  const modTabs = document.querySelectorAll('.modalidade-tab');
  const modContents = document.querySelectorAll('.modalidade-content');

  modTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      modTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      modContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      const activeContent = document.getElementById(target);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextIndex = e.key === 'ArrowRight' 
          ? (index + 1) % modTabs.length 
          : (index - 1 + modTabs.length) % modTabs.length;
        modTabs[nextIndex].focus();
        modTabs[nextIndex].click();
      }
    });
  });

  // ==========================================================================
  // 8. MICRO-QUIZ INTERATIVO (3 PASSOS)
  // ==========================================================================
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizProgressBar = document.querySelector('.quiz-progress-bar');
  let userAnswers = {};

  const quizOptions = document.querySelectorAll('.quiz-option-btn');
  quizOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStepNum = parseInt(btn.dataset.step);
      const answerVal = btn.dataset.value;

      userAnswers[`pergunta_${currentStepNum}`] = answerVal;

      const nextStepNum = currentStepNum + 1;
      const currentStepEl = document.getElementById(`quiz-step-${currentStepNum}`);
      const nextStepEl = document.getElementById(`quiz-step-${nextStepNum}`);

      if (currentStepEl) currentStepEl.classList.remove('active');

      if (nextStepEl) {
        nextStepEl.classList.add('active');
        const progressPercent = (nextStepNum / 3) * 100;
        if (quizProgressBar) quizProgressBar.style.width = `${progressPercent}%`;
      }

      if (nextStepNum === 4) {
        if (quizProgressBar) quizProgressBar.style.width = `100%`;
        const resultTextEl = document.getElementById('quiz-result-text');
        const resultWspBtn = document.getElementById('quiz-wsp-btn');

        let recomText = "Protocolo Melasma Control e Avaliação Biológica Personalizada";
        if (userAnswers['pergunta_1'] === 'firmeza') {
          recomText = "Protocolo de Rejuvenescimento e Estímulo de Colágeno";
        } else if (userAnswers['pergunta_1'] === 'limpeza') {
          recomText = "Limpeza de Pele Científica e Detox Cutâneo";
        }

        if (resultTextEl) {
          resultTextEl.innerHTML = `Com base nas suas respostas, a conduta recomendada para a sua pele é o <strong>${recomText}</strong>.`;
        }

        if (resultWspBtn) {
          const focoText = userAnswers['pergunta_1'] ? userAnswers['pergunta_1'].toUpperCase() : 'SAÚDE DA PELE';
          const rawText = `Olá, Dra. Nakya! Fiz o Quiz no site. Meu foco principal: ${focoText}. Gostaria de agendar minha consulta!`;
          resultWspBtn.href = `https://wa.me/5511948371282?text=${encodeURIComponent(rawText)}`;
        }
      }
    });
  });

  const quizResetBtn = document.getElementById('quiz-reset-btn');
  if (quizResetBtn) {
    quizResetBtn.addEventListener('click', () => {
      quizSteps.forEach(s => s.classList.remove('active'));
      const firstStep = document.getElementById('quiz-step-1');
      if (firstStep) firstStep.classList.add('active');
      if (quizProgressBar) quizProgressBar.style.width = '33%';
      userAnswers = {};
    });
  }

});
