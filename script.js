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

// --- Modal de Promociones ---
const openPromos = document.getElementById('open-promos');
const promoModal = document.getElementById('promo-modal');
const closePromoModal = document.getElementById('close-promo-modal');
if (openPromos && promoModal && closePromoModal) {
  openPromos.onclick = (e) => {
    e.preventDefault();
    promoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  closePromoModal.onclick = () => {
    promoModal.style.display = 'none';
    document.body.style.overflow = '';
  };
  window.addEventListener('click', (e) => {
    if (e.target === promoModal) {
      promoModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  // Mostrar imagen en grande al hacer click
  const promoImgs = promoModal.querySelectorAll('img');
  const imgModal = document.getElementById('img-modal');
  const imgModalSrc = document.getElementById('img-modal-src');
  const imgModalClose = document.getElementById('img-modal-close');
  promoImgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      imgModalSrc.src = this.src;
      imgModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
  imgModalClose.addEventListener('click', function() {
    imgModal.style.display = 'none';
    document.body.style.overflow = '';
  });
  imgModal.addEventListener('click', function(e) {
    if (e.target === imgModal) {
      imgModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

// --- Modal de cambio de aceite ---
const openOilForm = document.getElementById('open-oil-form');
const oilModal = document.getElementById('oil-modal');
const closeOilForm = document.getElementById('close-oil-form');
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
if (oilForm) {
  const radios = oilForm.querySelectorAll('input[name="intervalo"]');
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
  radios.forEach(r => r.addEventListener('change', updateProximo));
}

// Envío de correo con EmailJS
if (oilForm) {
  oilForm.onsubmit = function(e) {
    e.preventDefault();
    // Aquí debes configurar tu servicio de EmailJS
    // Reemplaza los siguientes valores con los tuyos de EmailJS
    const serviceID = 'TU_SERVICE_ID';
    const templateID = 'TU_TEMPLATE_ID';
    const userID = 'TU_USER_ID';
    const formData = new FormData(oilForm);
    const data = Object.fromEntries(formData.entries());
    const templateParams = {
      marca: data.marca,
      tipo: data.tipo,
      fecha: data.fecha,
      intervalo: data.intervalo,
      km_actual: data.km_actual,
      km_proximo: data.km_proximo,
      email: data.email
    };
    emailjs.send(serviceID, templateID, templateParams, userID)
      .then(() => {
        alert('¡Información enviada! Recibirás un correo con tu próximo cambio de aceite.');
        oilModal.style.display = 'none';
        oilForm.reset();
        kmProximoInput.value = '';
      }, (err) => {
        alert('Error al enviar el correo. Intenta de nuevo.');
      });
  };
}

// --- Modal de Afiliados ---
const openAfiliados = document.getElementById('open-afiliados');
const afiliadosModal = document.getElementById('afiliados-modal');
const closeAfiliadosModal = document.getElementById('close-afiliados-modal');
if (openAfiliados && afiliadosModal && closeAfiliadosModal) {
  openAfiliados.onclick = () => { afiliadosModal.style.display = 'flex'; };
  closeAfiliadosModal.onclick = () => { afiliadosModal.style.display = 'none'; };
  window.addEventListener('click', (e) => { if (e.target === afiliadosModal) afiliadosModal.style.display = 'none'; });
}

// MODALES
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.classList.remove('modal-open');
}

// Botón Próximo cambio de aceite
const oilBtn = document.querySelector('.elite-oil-change');
if (oilBtn && oilModal) {
  oilBtn.onclick = (e) => {
    e.preventDefault();
    closeAllModals();
    oilModal.classList.add('open');
    document.body.classList.add('modal-open');
  };
}

// Botón Afiliados
const afiliadosBtn = document.getElementById('btn-afiliados');
if (afiliadosBtn && afiliadosModal) {
  afiliadosBtn.onclick = (e) => {
    e.preventDefault();
    closeAllModals();
    afiliadosModal.classList.add('open');
    document.body.classList.add('modal-open');
  };
}

// Botón Promociones
const promoBtn = document.getElementById('btn-promociones');
if (promoBtn && promoModal) {
  promoBtn.onclick = (e) => {
    e.preventDefault();
    closeAllModals();
    promoModal.classList.add('open');
    document.body.classList.add('modal-open');
  };
  // Ampliar imagen de promoción
  const promoImgs = promoModal.querySelectorAll('.promo-img');
  promoImgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      img.classList.toggle('zoom');
    });
  });
}

// --- Galería de Promociones ---
const promoGalleryImgs = [
  'assets/promociones/promocion1.jpeg',
  'assets/promociones/promocion2.jpeg',
  'assets/promociones/promocion3.jpeg',
  'assets/promociones/promocion4.jpeg'
];
let promoGalleryIndex = 0;
const promoGalleryImg = document.getElementById('promo-gallery-img');
const promoPrev = document.getElementById('promo-prev');
const promoNext = document.getElementById('promo-next');

function showPromoGalleryImg(idx) {
  promoGalleryImg.src = promoGalleryImgs[idx];
}
if (promoPrev && promoNext && promoGalleryImg) {
  promoPrev.onclick = function(e) {
    e.stopPropagation();
    promoGalleryIndex = (promoGalleryIndex - 1 + promoGalleryImgs.length) % promoGalleryImgs.length;
    showPromoGalleryImg(promoGalleryIndex);
  };
  promoNext.onclick = function(e) {
    e.stopPropagation();
    promoGalleryIndex = (promoGalleryIndex + 1) % promoGalleryImgs.length;
    showPromoGalleryImg(promoGalleryIndex);
  };
  // Clic en la imagen para ampliar
  promoGalleryImg.onclick = function() {
    imgModalSrc.src = promoGalleryImgs[promoGalleryIndex];
    imgModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
}

// Cerrar modales
const closeBtns = document.querySelectorAll('.modal .close');
closeBtns.forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  document.querySelectorAll('.modal.open').forEach(modal => {
    if (e.target === modal) {
      closeAllModals();
    }
  });
});
});
