document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. PANTALLA SPLASH Y ENTRADA HERO
  // ==========================================
  const splashScreen = document.getElementById("splash-screen");
  const btnEmpezar = document.getElementById("btn-empezar");
  const textColumn = document.querySelector(".text-column");
  const logoFace = document.querySelector(".logo-face");
  const portafolioPrincipal = document.getElementById("portafolio-principal");
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  const heroBox = document.getElementById("hero-box");
  const navbar = document.getElementById("navbar");

  btnEmpezar.addEventListener("click", () => {
    textColumn.classList.add("fade-out");
    logoFace.classList.add("roll-out");
    splashScreen.classList.add("clear-bg");

    setTimeout(() => {
      portafolioPrincipal.style.display = "block";
      
      setTimeout(() => {
        portafolioPrincipal.style.opacity = "1";
        heroTitle.classList.add("fly-in");

        setTimeout(() => {
          heroTitle.classList.remove("fly-in");
          heroTitle.classList.add("settle");

          heroBox.classList.add("show-layout");
          navbar.classList.add("show-layout");
          heroSubtitle.classList.add("show-layout");

          setTimeout(() => {
            splashScreen.style.display = "none";
          }, 500);

        }, 2000); 
      }, 50);
    }, 1500);
  });


  // ==========================================
  // 2. ANIMACIONES DE SCROLL REVEAL Y OJOS
  // ==========================================
  const reveals = document.querySelectorAll(".reveal");
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.classList.add("active");
      observer.unobserve(entry.target); 
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });

  // ==========================================
  // 3. CARRUSEL 3D DE PROYECTOS
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allCards = document.querySelectorAll('.carousel-card');
  let currentCategory = 'profesional';
  let activeIndex = 0;

  function renderCarousel() {
    const visibleCards = Array.from(allCards).filter(card => card.classList.contains(currentCategory));

    allCards.forEach(card => {
      card.classList.remove('active', 'next', 'next-2', 'prev', 'prev-2');
      card.style.display = card.classList.contains(currentCategory) ? 'block' : 'none';
    });

    if(visibleCards.length === 0) return;

    visibleCards.forEach((card, index) => {
      if (index === activeIndex) {
        card.classList.add('active');
      } else if (index === activeIndex + 1) {
        card.classList.add('next');
      } else if (index > activeIndex + 1) {
        card.classList.add('next-2');
      } else if (index === activeIndex - 1) {
        card.classList.add('prev');
      } else if (index < activeIndex - 1) {
        card.classList.add('prev-2');
      }
    });
  }

  allCards.forEach(card => {
    card.addEventListener('click', function() {
      if(this.classList.contains('active')) return; 
      const visibleCards = Array.from(allCards).filter(c => c.classList.contains(currentCategory));
      activeIndex = visibleCards.indexOf(this);
      renderCarousel();
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.filter;
      activeIndex = 0; 
      renderCarousel();
    });
  });

  renderCarousel();


 // ==========================================
  // 4. VENTANAS EMERGENTES (MODALES)
  // ==========================================
  const btnsDetalles = document.querySelectorAll('.btn-detalles'); 
  const closeBtns = document.querySelectorAll('.close-modal'); 
  const modals = document.querySelectorAll('.modal-overlay'); 

  // --- Abrir Modal ---
  btnsDetalles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const targetId = btn.getAttribute('data-target'); 
      if (targetId) {
        const modalToOpen = document.getElementById(targetId);
        if (modalToOpen) {
          modalToOpen.classList.add('show');
          
          // ¡NUEVO! Le da "Play" al video que esté activo apenas se abre la ventana
          const primerVideo = modalToOpen.querySelector('video.slide-img.active');
          if (primerVideo) {
            primerVideo.play().catch(err => console.log("Esperando interacción:", err));
          }
        }
      }
    });
  });

  // --- Cerrar Modal con la X ---
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      modal.classList.remove('show');
      
      // ¡NUEVO! Pausa todos los videos para que no sigan sonando/consumiendo memoria de fondo
      modal.querySelectorAll('video').forEach(vid => vid.pause());
    });
  });
  
  // --- Cerrar Modal haciendo clic fuera del recuadro ---
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        
        // ¡NUEVO! También pausa los videos si se cierra haciendo clic afuera
        modal.querySelectorAll('video').forEach(vid => vid.pause());
      }
    });
  });

  // --- Lógica del Slider (Carrusel) dentro del Modal ---
  modals.forEach(modal => {
    const slides = modal.querySelectorAll('.slide-img');
    const nextBtn = modal.querySelector('.next-btn');
    const prevBtn = modal.querySelector('.prev-btn');
    
    if (slides.length > 0 && nextBtn && prevBtn) {
      let currentSlide = 0;

      function showSlide(index) {
        slides.forEach(slide => {
          slide.classList.remove('active');
          // Apagamos cualquier video que ya no se esté viendo al pasar al siguiente slide
          if (slide.tagName === 'VIDEO') slide.pause();
        });

        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        
        const activeSlide = slides[currentSlide];
        activeSlide.classList.add('active');

        // Encendemos solo el video que acaba de aparecer en pantalla
        if (activeSlide.tagName === 'VIDEO') {
            const playPromise = activeSlide.play();
            // Prevención de errores si el navegador bloquea la reproducción
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log("Video en pausa", error));
            }
        }
      }

      nextBtn.addEventListener('click', () => {
        currentSlide++;
        showSlide(currentSlide);
      });

      prevBtn.addEventListener('click', () => {
        currentSlide--;
        showSlide(currentSlide);
      });
    }
  });
  // ==========================================
  // 5. ANIMACIÓN DE OJOS (PARPADEO Y SEGUIMIENTO REAL)
  // ==========================================
  const ojosBlink = document.querySelectorAll('.ojos-blink');
  const ojosTracker = document.querySelectorAll('.ojos-tracker');

  // 1. Parpadeo independiente
  setInterval(() => {
    ojosBlink.forEach(ojo => {
      ojo.classList.add('is-blinking');
      
      setTimeout(() => {
        ojo.classList.remove('is-blinking');
      }, 150); 
    });
  }, 4000);

  // 2. Sistema de seguimiento ocular (Rastreo de cursor)
  document.addEventListener('mousemove', (e) => {
    ojosTracker.forEach(tracker => {
      // Obtenemos las coordenadas del centro de la "cara"
      const rect = tracker.getBoundingClientRect();
      const x = rect.left + (rect.width / 2);
      const y = rect.top + (rect.height / 2);
      
      // Calculamos el ángulo entre la cara y tu ratón
      const radian = Math.atan2(e.clientY - y, e.clientX - x);
      
      // Radio de movimiento (20px para el logo grande, 6px para el pequeño)
      const distance = tracker.classList.contains('mini-tracker') ? 6 : 20;
      
      // Calculamos hacia dónde deben moverse
      const moveX = Math.cos(radian) * distance;
      const moveY = Math.sin(radian) * distance;
      
      // Aplicamos el movimiento directamente a los ojos
      tracker.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
  // ==========================================
  // 6. SELECTOR DE IDIOMAS BILINGÜE
  // ==========================================
  const btnEs = document.getElementById('btn-es');
  const btnEn = document.getElementById('btn-en');
  const body = document.body;

  // Idioma por defecto al cargar
  body.classList.add('lang-es');

  if (btnEs && btnEn) {
      btnEs.addEventListener('click', () => {
          body.classList.remove('lang-en');
          body.classList.add('lang-es');
          btnEs.classList.add('active');
          btnEn.classList.remove('active');
      });

      btnEn.addEventListener('click', () => {
          body.classList.remove('lang-es');
          body.classList.add('lang-en');
          btnEn.classList.add('active');
          btnEs.classList.remove('active');
      });
  }

}); // <-- ¡Esta es la llave de cierre que necesita la primera línea!