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
  openOilForm.onclick = () => { oilModal.style.display = 'flex'; };
  closeOilForm.onclick = () => { oilModal.style.display = 'none'; };
  window.onclick = (e) => { if (e.target === oilModal) oilModal.style.display = 'none'; };
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

// --- Modal de Promociones ---
const openPromos = document.getElementById('open-promos');
const promoModal = document.getElementById('promo-modal');
const closePromoModal = document.getElementById('close-promo-modal');
if (openPromos && promoModal && closePromoModal) {
  openPromos.onclick = () => { promoModal.style.display = 'flex'; };
  closePromoModal.onclick = () => { promoModal.style.display = 'none'; };
  window.addEventListener('click', (e) => { if (e.target === promoModal) promoModal.style.display = 'none'; });
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
});
