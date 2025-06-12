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
