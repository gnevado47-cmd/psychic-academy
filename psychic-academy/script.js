// Slide Data for the story
const slides = [
  {
    title: "Prólogo: El Llamado de Reigen",
    character: "Reigen Arataka (Mentor)",
    image: "images/prologue_reigen.png",
    dialogue: "¡Atención, alumnos! Este no es un salón de clases ordinario. A partir de hoy, son agentes de la Agencia de Consultoría de Fenómenos Extraños. El inglés no es una materia aburrida... ¡es un código de energía psíquica para comunicarnos con el más allá!",
    level: "Prólogo: El Llamado",
    objective: "Establecer la narrativa y conectar el interés de los estudiantes. Desmitificar la clase de inglés y transformarla en una misión.",
    features: [
      "Cambio de rol: El docente es Mentor y los alumnos son Agentes.",
      "El error se redefine como una fluctuación de energía psíquica.",
      "El Medidor de Confianza grupal reemplaza a las notas tradicionales."
    ],
    progress: 5,
    effect: null,
    borderClass: "highlight-primary"
  },
  {
    title: "Capítulo 1: El Despertar",
    character: "Agentes Novatos (Estudiantes)",
    image: "images/level1_awakening.png",
    dialogue: "Nos colocamos los auriculares psíquicos. Escuchamos interferencias extrañas en inglés... ¡son las frecuencias del más allá! Si desciframos cómo se sienten los espíritus en los clips de anime, ganamos Medallas de Empatía.",
    level: "Nivel 1: El Despertar",
    objective: "Desarrollar comprensión auditiva y empatía identificando emociones y detalles clave en clips de audio en inglés.",
    features: [
      "Escucha activa de testimonios en inglés.",
      "Ganar Medallas de Empatía al identificar emociones (sube +20% al Medidor).",
      "Libertad de elección: elegir analizar canciones o fragmentos de anime."
    ],
    progress: 25,
    effect: null,
    borderClass: "highlight-primary"
  },
  {
    title: "Capítulo 2: Entrenamiento Mental",
    character: "La Barrera del Error (Ente)",
    image: "images/level2_training.png",
    dialogue: "¡Cuidado! Un ente gigante de color verde, 'La Barrera del Error', intenta bloquearnos. Debemos usar el 'Escáner de Rutinas' (Present Simple) para debilitarlo: 'The ghost wakes up at midnight. He haunts the kitchen.' ¡Cuidado con el traductor, nos quedan pocos puntos de magia (MP)!",
    level: "Nivel 2: Entrenamiento",
    objective: "Escribir y hablar sobre rutinas y hábitos cotidianos usando el Present Simple de forma cooperativa.",
    features: [
      "Cargas de Traductor Limitadas (puntos de MP) para reducir la parálisis por error.",
      "Si el MP se agota, los estudiantes deben cooperar y apoyarse en sus conocimientos.",
      "Estructuración de rutinas para debilitar al enemigo."
    ],
    progress: 60,
    effect: "shake",
    borderClass: "highlight-secondary"
  },
  {
    title: "Capítulo 3: El Encuentro Final",
    character: "Espíritu Afligido (Jefe Final)",
    image: "images/level3_encounter.png",
    dialogue: "¿Por qué lloras, criatura? ¡El salón está lleno de niebla psíquica! Formuladores listos: usemos las WH-Questions como conjuros de interrogación. 'What do you want? Where is your home? Why are you sad?' ¡Cada pregunta correcta disipa la niebla!",
    level: "Nivel 3: El Encuentro",
    objective: "Lograr que al menos el 80% de los estudiantes formulen autónomamente 5 preguntas correctas con WH-questions.",
    features: [
      "Interrogatorio interactivo simulado al espíritu.",
      "Los errores no restan puntos, sino que aumentan el 'Caos del Caso' con reacciones graciosas.",
      "Producción autónoma del idioma como llave de la resolución."
    ],
    progress: 85,
    effect: null,
    borderClass: "highlight-secondary"
  },
  {
    title: "Epílogo: ¡Explosión del 100%!",
    character: "Shigeo Kageyama (Mob)",
    image: "images/epilogue_explosion.png",
    dialogue: "¡Increíble! El medidor ha alcanzado el 100%. Una explosión de colores llena el salón. No hemos memorizado reglas gramaticales inútiles; hemos decodificado un misterio siendo nosotros mismos. ¡Bienvenidos a la Academia Psíquica!",
    level: "Epílogo: Confianza 100%",
    objective: "Consolidar el aprendizaje, liberar el potencial y celebrar el desbloqueo de identidad del alumno.",
    features: [
      "Desbloqueo de Identidad: hablar inglés sin perder la esencia propia.",
      "Evaluación mediante Reportes de Caso en lugar de exámenes formales.",
      "Sensación de triunfo colectivo y empoderamiento."
    ],
    progress: 100,
    effect: "flash",
    borderClass: "highlight-secondary"
  }
];

let currentSlideIndex = 0;

// DOM Elements
const imgEl = document.getElementById("chapter-image");
const charNameEl = document.getElementById("char-name");
const dialogueEl = document.getElementById("dialogue-content");
const levelEl = document.getElementById("chapter-level");
const objectiveEl = document.getElementById("level-objective");
const featuresEl = document.getElementById("gamification-features");

const meterFillEl = document.getElementById("meter-fill");
const meterPercentEl = document.getElementById("meter-percent");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const indicatorsContainer = document.getElementById("slide-indicators");

const shakeOverlay = document.getElementById("shake-overlay");
const flashOverlay = document.getElementById("flash-overlay");
const contentContainer = document.querySelector(".content-container");

// Initialize Indicators (Dots)
function initIndicators() {
  indicatorsContainer.innerHTML = "";
  slides.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.className = `dot ${idx === currentSlideIndex ? 'active' : ''}`;
    dot.addEventListener("click", () => goToSlide(idx));
    indicatorsContainer.appendChild(dot);
  });
}

// Update UI for the current slide
function updateUI() {
  const slide = slides[currentSlideIndex];
  
  // Fade image transition
  imgEl.classList.remove("fade-in");
  setTimeout(() => {
    imgEl.src = slide.image;
    imgEl.alt = slide.title;
    imgEl.classList.add("fade-in");
  }, 100);

  // Text contents
  charNameEl.textContent = slide.character;
  dialogueEl.textContent = slide.dialogue;
  levelEl.textContent = slide.level;
  objectiveEl.textContent = slide.objective;

  // Features list
  featuresEl.innerHTML = "";
  slide.features.forEach(feat => {
    const li = document.createElement("li");
    li.textContent = feat;
    featuresEl.appendChild(li);
  });

  // Update Meter
  meterFillEl.style.width = `${slide.progress}%`;
  meterPercentEl.textContent = `${slide.progress}%`;

  // Highlight classes
  contentContainer.classList.remove("highlight-primary", "highlight-secondary");
  if (slide.borderClass) {
    contentContainer.classList.add(slide.borderClass);
  }

  // Handle buttons state
  btnPrev.disabled = currentSlideIndex === 0;
  btnNext.textContent = currentSlideIndex === slides.length - 1 ? "¡Completar!" : "Siguiente →";

  // Update dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    dot.className = `dot ${idx === currentSlideIndex ? 'active' : ''}`;
  });

  // Trigger visual effects
  triggerEffects(slide.effect);
}

function triggerEffects(effect) {
  // Clear any existing effects
  shakeOverlay.classList.remove("shake-active");
  flashOverlay.classList.remove("flash-active");

  if (effect === "shake") {
    shakeOverlay.classList.add("shake-active");
    // Auto remove shake after 4s
    setTimeout(() => {
      shakeOverlay.classList.remove("shake-active");
    }, 4000);
  } else if (effect === "flash") {
    flashOverlay.classList.add("flash-active");
  }
}

function goToSlide(index) {
  if (index >= 0 && index < slides.length) {
    currentSlideIndex = index;
    updateUI();
  }
}

// Event Listeners
btnPrev.addEventListener("click", () => {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    updateUI();
  }
});

btnNext.addEventListener("click", () => {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    updateUI();
  } else {
    // Reset to beginning or show alert
    currentSlideIndex = 0;
    updateUI();
  }
});

// Start the presentation
initIndicators();
updateUI();
