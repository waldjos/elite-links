// Inicializar EmailJS
emailjs.init('kGnKXT_qHqEq7HQxP');

document.addEventListener('DOMContentLoaded', function() {
  // Inicializamos tilt 3D en los iconos
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3,
  });

  // Timeline de entrada con GSAP
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.to(".logo", {
    opacity: 1,
    y: -20,
    duration: 1.2
  })
  .to(".icon-grid", {
    opacity: 1,
    duration: 0.6
  }, "-=0.6")
  .from(".icon-item", {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6
  }, "-=0.4");

  // Mensajes a rotar
  const slogans = [
    "Aliados en Movilidad",
    "Tu Seguridad, Nuestra Prioridad",
    "Cobertura Integral"
  ];
  const tagEl = document.querySelector(".tagline");
  let idx = 0;

  function changeTagline() {
    // Fade out
    gsap.to(tagEl, { opacity: 0, duration: 0.4, onComplete: () => {
      // Cambia texto
      tagEl.textContent = slogans[idx];
      idx = (idx + 1) % slogans.length;
      // Fade in
      gsap.to(tagEl, { opacity: 1, duration: 0.4 });
    }});
  }

  // Inicializa
  tagEl.style.opacity = 0;
  changeTagline();
  // Cada 4 segundos
  setInterval(changeTagline, 4000);

  // Añádelo a la timeline para que aparezca tras el logo
  tl.to(".tagline", { opacity: 1, y: -10, duration: 0.8 }, "-=0.4");

  // --- Modal de cambio de aceite ---
  const openOilForm = document.getElementById('open-oil-form');
  const oilModal = document.getElementById('oil-modal');
  const closeOilForm = document.getElementById('close-oil-form');
  const oilForm = document.getElementById('oil-form');
  const kmActualInput = document.getElementById('km_actual');
  const kmProximoInput = document.getElementById('km_proximo');

  if (openOilForm && oilModal && closeOilForm) {
    openOilForm.onclick = (e) => {
      e.preventDefault();
      oilModal.style.display = 'flex';
      oilModal.style.alignItems = 'center';
      oilModal.style.justifyContent = 'center';
      document.body.style.overflow = 'hidden';
    };

    closeOilForm.onclick = (e) => {
      e.preventDefault();
      oilModal.style.display = 'none';
      document.body.style.overflow = '';
    };

    oilModal.addEventListener('click', (e) => {
      if (e.target === oilModal) {
        oilModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // Calcular próximo cambio automáticamente
  if (oilForm && kmActualInput && kmProximoInput) {
    function updateProximo() {
      const kmActual = parseInt(kmActualInput.value) || 0;
      const intervalo = parseInt(oilForm.querySelector('input[name="intervalo"]:checked')?.value || 0);
      if (kmActual && intervalo) {
        kmProximoInput.value = kmActual + intervalo;
      } else {
        kmProximoInput.value = '';
      }
    }

    kmActualInput.addEventListener('input', updateProximo);
    oilForm.querySelectorAll('input[name="intervalo"]').forEach(radio => {
      radio.addEventListener('change', updateProximo);
    });

    // Validación y envío del formulario
    oilForm.onsubmit = async function(e) {
      e.preventDefault();

      // Validar campos requeridos
      const requiredFields = oilForm.querySelectorAll('[required]');
      let isValid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (!isValid) {
        alert('Por favor, completa todos los campos requeridos');
        return;
      }

      // Validar email
      const emailField = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        alert('Por favor, ingresa un correo electrónico válido');
        emailField.classList.add('error');
        return;
      }

      // Mostrar indicador de carga
      const submitBtn = oilForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      submitBtn.style.opacity = '0.7';

      try {
        // Obtener datos del formulario
        const formData = new FormData(oilForm);
        const data = Object.fromEntries(formData.entries());

        // Formatear fechas
        const fechaObj = new Date(data.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Calcular fecha estimada del próximo cambio
        const fechaProxima = new Date(fechaObj);
        const mesesAprox = parseInt(data.intervalo) / 1000;
        fechaProxima.setMonth(fechaProxima.getMonth() + mesesAprox);
        const fechaProximaFormateada = fechaProxima.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Parámetros para el template de EmailJS
        const templateParams = {
          email: data.email, // Este es el email del usuario que recibirá el correo
          name: 'Cliente Elite Loyal',
          marca: data.marca,
          tipo: data.tipo,
          fecha: fechaFormateada,
          intervalo: `${parseInt(data.intervalo).toLocaleString()} km`,
          km_actual: `${parseInt(data.km_actual).toLocaleString()} km`,
          km_proximo: `${parseInt(data.km_proximo).toLocaleString()} km`,
          fecha_proxima: fechaProximaFormateada
        };

        // Enviar email usando EmailJS
        const response = await emailjs.send('service_v1ze02i', 'template_5ms21o9', templateParams);
        console.log('Email enviado exitosamente:', response);

        // Mostrar mensaje de éxito
        alert('¡Información enviada exitosamente! 📧\n\nRecibirás un correo electrónico con todos los detalles de tu cambio de aceite y la información para el próximo mantenimiento.\n\n¡Gracias por confiar en Elite Loyal!');

        // Cerrar modal y resetear formulario
        oilModal.style.display = 'none';
        document.body.style.overflow = '';
        oilForm.reset();
        kmProximoInput.value = '';

      } catch (error) {
        console.error('Error al enviar email:', error);
        alert('❌ Error al enviar el correo electrónico.\n\nPor favor, verifica tu conexión a internet e intenta nuevamente.\n\nSi el problema persiste, contáctanos por WhatsApp: +58 414-9208034');
      } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
      }
    };
  }

  // --- Modal de Afiliados ---
  const openAfiliados = document.getElementById('open-afiliados');
  const afiliadosModal = document.getElementById('afiliados-modal');
  const closeAfiliadosModal = document.getElementById('close-afiliados-modal');

  if (openAfiliados && afiliadosModal && closeAfiliadosModal) {
    openAfiliados.onclick = () => { 
      afiliadosModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
    closeAfiliadosModal.onclick = () => { 
      afiliadosModal.style.display = 'none';
      document.body.style.overflow = '';
    };
    window.addEventListener('click', (e) => { 
      if (e.target === afiliadosModal) {
        afiliadosModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // --- Modal de Repuestos 24 horas ---
  const repuestosBtn = document.getElementById('open-repuestos');
  const repuestosModal = document.getElementById('repuestos-modal');
  const repuestosClose = document.getElementById('close-repuestos-modal');

  if (repuestosBtn && repuestosModal && repuestosClose) {
    repuestosBtn.addEventListener('click', function(e) {
      e.preventDefault();
      repuestosModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
    repuestosClose.addEventListener('click', function() {
      repuestosModal.style.display = 'none';
      document.body.style.overflow = '';
    });
    window.addEventListener('click', function(e) {
      if (e.target === repuestosModal) {
        repuestosModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // --- Modal de Promociones ---
  const promocionesBtn = document.getElementById('open-promos');
  const promocionesModal = document.getElementById('promo-modal');
  const promocionesClose = document.getElementById('close-promo-modal');

  if (promocionesBtn && promocionesModal && promocionesClose) {
    promocionesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      promocionesModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
    promocionesClose.addEventListener('click', function() {
      promocionesModal.style.display = 'none';
      document.body.style.overflow = '';
    });
    window.addEventListener('click', function(e) {
      if (e.target === promocionesModal) {
        promocionesModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // --- Galería de Promociones ---
  const galleryModal = document.getElementById('gallery-modal');
  const galleryImage = document.getElementById('gallery-image');
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');
  const galleryClose = document.getElementById('gallery-close');
  const galleryCurrent = document.getElementById('gallery-current');
  const galleryTotal = document.getElementById('gallery-total');
  
  let currentImageIndex = 0;
  const promoImages = Array.from(document.querySelectorAll('.promo-grid img'));
  if (galleryTotal) galleryTotal.textContent = promoImages.length;

  function showImage(index) {
    currentImageIndex = index;
    galleryImage.src = promoImages[index].src;
    galleryCurrent.textContent = index + 1;
  }

  function nextImage() {
    showImage((currentImageIndex + 1) % promoImages.length);
  }

  function prevImage() {
    showImage((currentImageIndex - 1 + promoImages.length) % promoImages.length);
  }

  // Event Listeners para galería
  if (galleryModal && galleryImage && galleryPrev && galleryNext && galleryClose) {
    document.querySelectorAll('.promo-grid img').forEach((img, index) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(e) {
        e.preventDefault();
        currentImageIndex = index;
        showImage(index);
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    galleryClose.addEventListener('click', () => {
      galleryModal.style.display = 'none';
      document.body.style.overflow = '';
    });

    galleryPrev.addEventListener('click', prevImage);
    galleryNext.addEventListener('click', nextImage);

    // Gestos táctiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryModal.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    galleryModal.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          prevImage();
        } else {
          nextImage();
        }
      }
    }

    // Teclas de navegación
    document.addEventListener('keydown', e => {
      if (galleryModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'Escape') {
          galleryModal.style.display = 'none';
          document.body.style.overflow = '';
        }
      }
    });
  }

  // --- Modal Términos y Condiciones ---
  const openTermsBtn = document.getElementById('open-terms');
  const termsModal = document.getElementById('terms-modal');
  const closeTermsModal = document.getElementById('close-terms-modal');
  const acceptTerms = document.getElementById('accept-terms');
  const acceptTermsBtn = document.getElementById('accept-terms-btn');

  function showTermsModal() {
    if (termsModal) {
      termsModal.style.display = 'flex';
      termsModal.style.alignItems = 'center';
      termsModal.style.justifyContent = 'center';
      document.body.style.overflow = 'hidden';
    }
  }

  function hideTermsModal() {
    if (termsModal) {
      termsModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function termsAccepted() {
    return localStorage.getItem('elite_terms_accepted') === '1';
  }

  function setTermsAccepted() {
    localStorage.setItem('elite_terms_accepted', '1');
  }

  if (termsModal && acceptTerms && acceptTermsBtn) {
    if (!termsAccepted()) {
      const gridBtns = document.querySelectorAll('.elite-btn, .poliza-btn');
      const showOnFirstBtn = (e) => {
        showTermsModal();
        gridBtns.forEach(btn => btn.removeEventListener('click', showOnFirstBtn, true));
      };
      gridBtns.forEach(btn => btn.addEventListener('click', showOnFirstBtn, true));
    }

    acceptTerms.addEventListener('change', function(){
      if(this.checked){
        acceptTermsBtn.disabled = false;
        acceptTermsBtn.style.opacity = '1';
        acceptTermsBtn.style.cursor = 'pointer';
      }else{
        acceptTermsBtn.disabled = true;
        acceptTermsBtn.style.opacity = '0.6';
        acceptTermsBtn.style.cursor = 'not-allowed';
      }
    });

    acceptTermsBtn.disabled = true;
    acceptTermsBtn.addEventListener('click', function(){
      if(acceptTerms.checked){
        setTermsAccepted();
        hideTermsModal();
      }
    });

    if (closeTermsModal) {
      closeTermsModal.addEventListener('click', function(){
        if (!termsAccepted()) {
          showTermsModal();
        } else {
          hideTermsModal();
        }
      });
    }

    window.addEventListener('click', function(e){
      if(e.target === termsModal && !termsAccepted()){
        showTermsModal();
      } else if (e.target === termsModal) {
        hideTermsModal();
      }
    });
  }

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', function(e){
      e.preventDefault();
      showTermsModal();
    });
  }

  // Preloader
  window.addEventListener('load', () => { 
    gsap.to('#preloader', {
      opacity: 0, 
      duration: 0.8, 
      onComplete: () => {
        document.getElementById('preloader').style.display = 'none';
      }
    }); 
  });

  // Partículas
  if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', 'particles.json', null);
  }

  // Toggle tema
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      btn.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌙';
    });
  }
});
