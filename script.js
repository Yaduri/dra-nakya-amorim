/* ==========================================================================
   ESTÉTICA NAKYA AMORIM — INTERACTIVE JAVASCRIPT (FEATURES 1-7)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. NAVBAR SCROLL EFFECT
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. MOBILE MENU TOGGLE
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

  // 3. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // ITEM 1: SLIDER INTERATIVO ANTES E DEPOIS
  // ==========================================================================
  const baInputs = document.querySelectorAll('.ba-range-input');
  baInputs.forEach(input => {
    const sliderContainer = input.closest('.ba-slider-wrapper');
    const afterImgBox = sliderContainer.querySelector('.ba-after');
    const handle = sliderContainer.querySelector('.ba-slider-handle');

    const updateSlider = (val) => {
      afterImgBox.style.width = `${val}%`;
      handle.style.left = `${val}%`;
    };

    input.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    updateSlider(50);
  });

  // ==========================================================================
  // ITEM 2: VÍDEOS ESTILO REELS (AUTOPLAY SILENCIOSO + SOM MUTE/UNMUTE)
  // ==========================================================================
  const muteBtns = document.querySelectorAll('.video-mute-btn');
  muteBtns.forEach(btn => {
    const videoCard = btn.closest('.video-card');
    const video = videoCard.querySelector('video');

    if (video) {
      // Tentar autoplay mudo
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
  // ITEM 3: SELETOR DE MODALIDADE (PRESENCIAL X ONLINE)
  // ==========================================================================
  const modTabs = document.querySelectorAll('.modalidade-tab');
  const modContents = document.querySelectorAll('.modalidade-content');

  modTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      modTabs.forEach(t => t.classList.remove('active'));
      modContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // ==========================================================================
  // ITEM 4: MICRO-QUIZ INTERATIVO (3 PASSOS)
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

      // Avançar passo
      const nextStepNum = currentStepNum + 1;
      const currentStepEl = document.getElementById(`quiz-step-${currentStepNum}`);
      const nextStepEl = document.getElementById(`quiz-step-${nextStepNum}`);

      if (currentStepEl) currentStepEl.classList.remove('active');

      if (nextStepEl) {
        nextStepEl.classList.add('active');
        const progressPercent = (nextStepNum / 3) * 100;
        if (quizProgressBar) quizProgressBar.style.width = `${progressPercent}%`;
      }

      // Se for o passo final (resultado)
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
          const textMsg = encodeURIComponent(
            `Ol%C3%A1%2C%20Dra.%20Nakya!%20Fiz%20o%20Quiz%20no%20site.%20Meu%20foco%3A%20${userAnswers['pergunta_1']}.%20Quero%20agendar%20minha%20consulta!`
          );
          resultWspBtn.href = `https://wa.me/5511942373219?text=${textMsg}`;
        }
      }
    });
  });

  // Reset Quiz
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

  // ==========================================================================
  // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
  // ==========================================================================
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.pain-card, .pillar-card, .treatment-card, .video-card, .testimonial-card, .step-card, .results-card, .insta-post-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

});
