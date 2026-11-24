tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                display: ["Nunito", "sans-serif"],
                sans: ["Nunito Sans", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            colors: {
                lab: {
                    bg: "#f1f5f9",
                    card: "#ffffff",
                    dark: "#0f172a",
                    anode: "#ef4444",
                    cathode: "#0284c7",
                    conduct: "#10b981",
                    accent: "#2563eb",
                },
            },
        },
    },
};

// =========================================================================
// 1. NAVEGACIÓN DE DIAPOSITIVAS Y ATAJOS DE TECLADO
// =========================================================================
let currentSlide = 0;
const totalSlides = 6;

function updateSlideUI() {
    const panels = document.querySelectorAll(".slide-panel");
    panels.forEach((panel, idx) => {
        panel.classList.toggle("active", idx === currentSlide);
    });

    // Actualizar contador y barra de progreso
    document.getElementById("slideCounter").textContent = `${currentSlide + 1} / ${totalSlides}`;
    const pct = ((currentSlide + 1) / totalSlides) * 100;
    document.getElementById("progressBar").style.width = `${pct}%`;

    // Habilitar/Deshabilitar botones Anterior/Siguiente
    document.getElementById("prevBtn").disabled = currentSlide === 0;
    document.getElementById("nextBtn").disabled = currentSlide === totalSlides - 1;

    // Actualizar estilos de botones indicadores
    document.querySelectorAll(".slide-dot").forEach((btn, idx) => {
        if (idx === currentSlide) {
            btn.className =
                "slide-dot px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all bg-blue-600 text-white shadow-sm";
        } else {
            btn.className =
                "slide-dot px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:bg-slate-200/70";
        }
    });

    document.querySelectorAll(".mobile-dot").forEach((btn, idx) => {
        if (idx === currentSlide) {
            btn.className = "mobile-dot w-7 h-7 rounded-lg font-extrabold bg-blue-600 text-white";
        } else {
            btn.className = "mobile-dot w-7 h-7 rounded-lg font-bold bg-slate-100 text-slate-600";
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function changeSlide(delta) {
    const next = currentSlide + delta;
    if (next >= 0 && next < totalSlides) {
        currentSlide = next;
        updateSlideUI();
    }
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        currentSlide = index;
        updateSlideUI();
    }
}

// Atajos de teclado (Flechas izquierda / derecha)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") changeSlide(1);
    if (e.key === "ArrowLeft") changeSlide(-1);
});

// =========================================================================
// 2. ACORDEONES / TARJETAS INTERACTIVAS DE ESTUDIO
// =========================================================================
function toggleCard(buttonEl) {
    const item = buttonEl.closest(".accordion-item");
    const content = item.querySelector(".accordion-content");
    const isOpen = content.classList.contains("open");

    if (isOpen) {
        content.classList.remove("open");
        item.classList.remove("active");
    } else {
        content.classList.add("open");
        item.classList.add("active");
    }
}

function toggleAllInSlide(slideIndex, shouldOpen) {
    const slide = document.querySelector(`.slide-panel[data-slide="${slideIndex}"]`);
    if (!slide) return;
    const items = slide.querySelectorAll(".accordion-item");
    items.forEach((item) => {
        const content = item.querySelector(".accordion-content");
        if (shouldOpen) {
            content.classList.add("open");
            item.classList.add("active");
        } else {
            content.classList.remove("open");
            item.classList.remove("active");
        }
    });
}

// =========================================================================
// 3. SIMULADOR EXPERIENCIA 1: CONDUCCIÓN EN VASOS
// =========================================================================
const sim1State = {
    solution: "water", // 'water' | 'salt' | 'sugar'
    anodeConnected: false,
    cathodeConnected: false,
};

function selectSolution1(sol) {
    sim1State.solution = sol;

    // Actualizar botones visuales
    document.querySelectorAll(".sol1-btn").forEach((btn) => {
        btn.className =
            "sol1-btn p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all border-slate-200 hover:border-slate-300 bg-white";
    });
    const activeBtn = document.getElementById(`solBtn-${sol}`);
    activeBtn.className =
        "sol1-btn p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all border-blue-600 bg-blue-50/70 shadow-sm";

    updateSim1();
}

function toggleClamp1(pole) {
    if (pole === "anode") {
        sim1State.anodeConnected = !sim1State.anodeConnected;
    } else {
        sim1State.cathodeConnected = !sim1State.cathodeConnected;
    }
    updateSim1();
}

function rinseElectrodes1() {
    sim1State.anodeConnected = false;
    sim1State.cathodeConnected = false;
    updateSim1();
    const statusText = document.getElementById("sim1StatusText");
    const statusIcon = document.getElementById("sim1StatusIcon");
    statusIcon.className = "fa-solid fa-sparkles text-sky-400 text-lg shrink-0";
    statusText.innerHTML =
        "<strong>Electrodos enjuagados:</strong> Circuito desconectado y barras de grafito limpias para evitar contaminación entre pruebas.";
}

function updateSim1() {
    // Actualizar estado visual de botones de pinzas
    const anodeBadge = document.getElementById("clamp1-anode-badge");
    const cathodeBadge = document.getElementById("clamp1-cathode-badge");
    const wireAnode = document.getElementById("wire1Anode");
    const wireCathode = document.getElementById("wire1Cathode");

    if (sim1State.anodeConnected) {
        anodeBadge.textContent = "CONECTADO";
        anodeBadge.className = "font-mono text-[11px] px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold";
        wireAnode.setAttribute("opacity", "1");
        wireAnode.removeAttribute("stroke-dasharray");
    } else {
        anodeBadge.textContent = "DESCONECTADO";
        anodeBadge.className = "font-mono text-[11px] px-2 py-0.5 rounded-lg bg-slate-200 text-slate-600";
        wireAnode.setAttribute("opacity", "0.35");
        wireAnode.setAttribute("stroke-dasharray", "6 4");
    }

    if (sim1State.cathodeConnected) {
        cathodeBadge.textContent = "CONECTADO";
        cathodeBadge.className = "font-mono text-[11px] px-2 py-0.5 rounded-lg bg-sky-600 text-white font-bold";
        wireCathode.setAttribute("opacity", "1");
        wireCathode.removeAttribute("stroke-dasharray");
    } else {
        cathodeBadge.textContent = "DESCONECTADO";
        cathodeBadge.className = "font-mono text-[11px] px-2 py-0.5 rounded-lg bg-slate-200 text-slate-600";
        wireCathode.setAttribute("opacity", "0.35");
        wireCathode.setAttribute("stroke-dasharray", "6 4");
    }

    // Etiqueta y partículas en el vaso
    const beakerLabel = document.getElementById("sim1BeakerLabel");
    const saltGroup = document.getElementById("sim1ParticlesSalt");
    const sugarGroup = document.getElementById("sim1ParticlesSugar");

    saltGroup.classList.add("hidden");
    sugarGroup.classList.add("hidden");

    if (sim1State.solution === "water") {
        beakerLabel.textContent = "Agua sola";
    } else if (sim1State.solution === "salt") {
        beakerLabel.textContent = "Agua con sal";
        saltGroup.classList.remove("hidden");
    } else if (sim1State.solution === "sugar") {
        beakerLabel.textContent = "Agua con azúcar";
        sugarGroup.classList.remove("hidden");
    }

    // Verificar si el circuito está cerrado y conduce
    const circuitClosed = sim1State.anodeConnected && sim1State.cathodeConnected;
    const conducts = circuitClosed && sim1State.solution === "salt";

    const ledBulb = document.getElementById("sim1LedBulb");
    const ledLabel = document.getElementById("sim1LedLabel");
    const bubbles = document.getElementById("sim1Bubbles");
    const currentFlow = document.getElementById("sim1CurrentFlow");
    const statusText = document.getElementById("sim1StatusText");
    const statusIcon = document.getElementById("sim1StatusIcon");

    if (conducts) {
        ledBulb.innerHTML = `
          <path d="M62,14 L62,-4 A13,13 0 0,1 88,-4 L88,14 Z" fill="#ef4444" stroke="#fecaca" stroke-width="2" class="led-on"/>
          <ellipse cx="75" cy="14" rx="15" ry="3" fill="#dc2626"/>
        `;
        ledLabel.textContent = "¡LED ENCENDIDO!";
        ledLabel.setAttribute("fill", "#fca5a5");
        bubbles.classList.remove("hidden");
        currentFlow.classList.remove("hidden");

        statusIcon.className = "fa-solid fa-bolt text-emerald-400 text-lg shrink-0";
        statusText.innerHTML =
            '<strong class="text-emerald-300">¡Circuito cerrado con conducción!</strong> La sal se disocia en iones <span class="font-mono text-sky-300">Na⁺</span> y <span class="font-mono text-red-300">Cl⁻</span> que transportan carga y encienden el LED.';
    } else {
        ledBulb.innerHTML = `
          <path d="M62,14 L62,-4 A13,13 0 0,1 88,-4 L88,14 Z" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>
          <ellipse cx="75" cy="14" rx="15" ry="3" fill="#991b1b"/>
        `;
        ledLabel.textContent = "LED APAGADO";
        ledLabel.setAttribute("fill", "#94a3b8");
        bubbles.classList.add("hidden");
        currentFlow.classList.add("hidden");

        if (!circuitClosed) {
            statusIcon.className = "fa-solid fa-plug-circle-xmark text-amber-400 text-lg shrink-0";
            statusText.textContent =
                "Circuito abierto: conectá tanto el Ánodo (+) como el Cátodo (−) a la batería para probar esta solución.";
        } else if (sim1State.solution === "sugar") {
            statusIcon.className = "fa-solid fa-ban text-red-400 text-lg shrink-0";
            statusText.innerHTML =
                '<strong class="text-amber-300">No conduce electricidad:</strong> Aunque el azúcar se disuelve, forma moléculas neutras sin iones libres. El LED permanece apagado.';
        } else {
            statusIcon.className = "fa-solid fa-droplet-slash text-sky-400 text-lg shrink-0";
            statusText.innerHTML =
                '<strong class="text-sky-300">Sin electrolito suficiente:</strong> El agua sola prácticamente no conduce corriente porque carece de iones disueltos en cantidad.';
        }
    }
}

// =========================================================================
// 4. SIMULADOR EXPERIENCIA 2: ELECTRÓLISIS DEL AGUA CON BICARBONATO
// =========================================================================
const sim2State = {
    hasBicarbonate: false,
    anodeConnected: false,
    cathodeConnected: false,
};

function toggleBicarbonate2() {
    sim2State.hasBicarbonate = !sim2State.hasBicarbonate;
    updateSim2();
}

function toggleClamp2(pole) {
    if (pole === "anode") {
        sim2State.anodeConnected = !sim2State.anodeConnected;
    } else {
        sim2State.cathodeConnected = !sim2State.cathodeConnected;
    }
    updateSim2();
}

function resetSim2() {
    sim2State.hasBicarbonate = false;
    sim2State.anodeConnected = false;
    sim2State.cathodeConnected = false;
    updateSim2();
}

function updateSim2() {
    // Actualizar badges
    const bicarbBadge = document.getElementById("badgeBicarb2");
    const anodeBadge = document.getElementById("badge2-anode");
    const cathodeBadge = document.getElementById("badge2-cathode");

    if (sim2State.hasBicarbonate) {
        bicarbBadge.textContent = "DISUELTO";
        bicarbBadge.className = "font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold";
    } else {
        bicarbBadge.textContent = "SIN AGREGAR";
        bicarbBadge.className = "font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600";
    }

    const wireAnode = document.getElementById("wire2Anode");
    const wireCathode = document.getElementById("wire2Cathode");

    if (sim2State.anodeConnected) {
        anodeBadge.textContent = "ON";
        anodeBadge.className = "font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold";
        wireAnode.setAttribute("opacity", "1");
        wireAnode.removeAttribute("stroke-dasharray");
    } else {
        anodeBadge.textContent = "OFF";
        anodeBadge.className = "font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600";
        wireAnode.setAttribute("opacity", "0.35");
        wireAnode.setAttribute("stroke-dasharray", "6 4");
    }

    if (sim2State.cathodeConnected) {
        cathodeBadge.textContent = "ON";
        cathodeBadge.className = "font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold";
        wireCathode.setAttribute("opacity", "1");
        wireCathode.removeAttribute("stroke-dasharray");
    } else {
        cathodeBadge.textContent = "OFF";
        cathodeBadge.className = "font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600";
        wireCathode.setAttribute("opacity", "0.35");
        wireCathode.setAttribute("stroke-dasharray", "6 4");
    }

    // Iones en solución
    document.getElementById("sim2Ions").classList.toggle("hidden", !sim2State.hasBicarbonate);

    // Reacción activa si hay bicarbonato + ambos electrodos conectados
    const circuitClosed = sim2State.anodeConnected && sim2State.cathodeConnected;
    const activeElectrolysis = circuitClosed && sim2State.hasBicarbonate;

    document.getElementById("sim2GasBubbles").classList.toggle("hidden", !activeElectrolysis);
    document.getElementById("sim2Electrons").classList.toggle("hidden", !activeElectrolysis);

    const statusIcon = document.getElementById("sim2StatusIcon");
    const statusText = document.getElementById("sim2StatusText");

    if (activeElectrolysis) {
        statusIcon.className = "fa-solid fa-fire-flame-simple text-emerald-400 text-lg shrink-0";
        statusText.innerHTML =
            '<strong class="text-emerald-300">¡Electrólisis en curso!</strong> Los iones del bicarbonato conducen la corriente: se libera <span class="font-mono text-sky-300">H₂</span> (reducción en cátodo) y <span class="font-mono text-red-300">O₂</span> (oxidación en ánodo).';
    } else if (circuitClosed && !sim2State.hasBicarbonate) {
        statusIcon.className = "fa-solid fa-triangle-exclamation text-amber-400 text-lg shrink-0";
        statusText.innerHTML =
            '<strong class="text-amber-300">Baja conductividad:</strong> La batería está conectada, pero sin bicarbonato de sodio el agua pura conduce muy mal y casi no se ven burbujas.';
    } else {
        statusIcon.className = "fa-solid fa-flask text-blue-400 text-lg shrink-0";
        statusText.textContent =
            "Agregá bicarbonato de sodio y conectá ambos electrodos (Ánodo + y Cátodo −) para observar la reacción química.";
    }
}

// =========================================================================
// 5. DIAPOSITIVA 5: ESQUEMA INTEGRADOR INTERACTIVO
// =========================================================================
const diagramParts = {
    source: {
        tag: "Componente 1 de 6",
        title: "Fuente de Corriente Eléctrica",
        icon: "fa-car-battery",
        colorClass: "amber",
        desc: "Batería o portapilas de corriente continua de <strong>3 a 6 voltios</strong>. Suministra la energía eléctrica necesaria para impulsar los electrones en el circuito externo y forzar la descomposición química del agua.",
    },
    anode: {
        tag: "Componente 2 de 6",
        title: "Ánodo (Electrodo Positivo +)",
        icon: "fa-circle-plus",
        colorClass: "red",
        desc: "Electrodo de grafito conectado al <strong>polo positivo (+)</strong> de la batería. Atrae a los aniones y es el sitio donde ocurre la <strong>oxidación</strong> (liberación de burbujas de oxígeno O₂).",
    },
    cathode: {
        tag: "Componente 3 de 6",
        title: "Cátodo (Electrodo Negativo −)",
        icon: "fa-circle-minus",
        colorClass: "sky",
        desc: "Electrodo de grafito conectado al <strong>polo negativo (−)</strong> de la batería. Atrae a los cationes y es el sitio donde ocurre la <strong>reducción</strong> (liberación de burbujas de hidrógeno H₂).",
    },
    electrolyte: {
        tag: "Componente 4 de 6",
        title: "Electrolito (Solución Conductora)",
        icon: "fa-droplet",
        colorClass: "emerald",
        desc: "Solución acuosa con iones disueltos (por ejemplo, <strong>agua con bicarbonato de sodio</strong>). Permite la migración de iones entre ambos electrodos, cerrando el circuito dentro del recipiente.",
    },
    electrodes: {
        tag: "Componente 5 de 6",
        title: "Electrodos de Grafito",
        icon: "fa-grip-lines-vertical",
        colorClass: "slate",
        desc: "Dos barras de grafito o minas gruesas de lápiz sumergidas en la solución, <strong>separadas entre sí y sin tocarse</strong>. Permiten el ingreso y la salida de electrones sin corroerse fácilmente.",
    },
    electrons: {
        tag: "Componente 6 de 6",
        title: "Sentido del Movimiento de los Electrones",
        icon: "fa-arrows-left-right",
        colorClass: "yellow",
        desc: "En el circuito externo (cables), los electrones salen del <strong>polo negativo (−)</strong> de la batería hacia el <strong>cátodo</strong>, y regresan desde el <strong>ánodo</strong> hacia el <strong>polo positivo (+)</strong>. Dentro de la solución, la carga viaja mediante iones.",
    },
};

function selectDiagramPart(key) {
    const data = diagramParts[key];
    if (!data) return;

    // Actualizar botones
    document.querySelectorAll(".diag-btn").forEach((btn) => {
        btn.className =
            "diag-btn p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 text-left font-display font-extrabold text-xs sm:text-sm text-slate-800 transition";
    });
    const activeBtn = document.getElementById(`dBtn-${key}`);
    if (activeBtn) {
        activeBtn.className =
            "diag-btn p-3 rounded-2xl border-2 border-blue-600 bg-blue-50 text-left font-display font-extrabold text-xs sm:text-sm text-blue-950 shadow-sm transition";
    }

    // Actualizar tarjeta de detalle
    document.getElementById("diagTag").textContent = data.tag;
    document.getElementById("diagTitle").textContent = data.title;
    document.getElementById("diagDesc").innerHTML = data.desc;
    document.getElementById("diagIconBox").innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
}

// Inicializar estado
updateSlideUI();
updateSim1();
updateSim2();
