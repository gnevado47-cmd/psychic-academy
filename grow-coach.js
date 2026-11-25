// grow-coach.js — Integrado con #meter-fill y #meter-percent de Psychic Academy
const PsychicCoachingEngine = (() => {
  const state = {
    mission: 1,
    confidence: 0,
    mpCharges: 3,
    growLog: [],
    decisions: []
  };

  const prompts = {
    G: "¿Qué mejora observable buscamos?",
    R: "¿Qué evidencia hay y qué limitación existe?",
    O: "¿Qué alternativas y pros/contras vemos?",
    W: "¿Cuál es el primer paso y cómo se revisa?"
  };

  function syncMeterUI(value) {
    const clamped = Math.max(0, Math.min(100, Number(value) || 0));
    state.confidence = clamped;
    const fillEl = document.getElementById("meter-fill");
    const percentEl = document.getElementById("meter-percent");
    if (fillEl) fillEl.style.width = `${clamped}%`;
    if (percentEl) percentEl.textContent = `${clamped}%`;
  }

  function recordGrowStep(step, answer) {
    if (!prompts[step]) return;
    state.growLog.push({
      mission: state.mission,
      step,
      question: prompts[step],
      response: (answer || "").trim(),
      timestamp: new Date().toISOString()
    });
  }

  function applyDecision({ choiceLabel, isCollaborative, chaosTriggered, deltaConfidence = 20 }) {
    const currentText = document.getElementById("meter-percent")?.textContent || "0%";
    const currentNum = parseInt(currentText.replace("%", ""), 10);
    const base = Number.isNaN(currentNum) ? state.confidence : currentNum;

    let nextVal = base;
    if (chaosTriggered) {
      nextVal = Math.max(0, base - 5);
    } else {
      const bonus = isCollaborative ? 5 : 0;
      nextVal = Math.min(100, base + deltaConfidence + bonus);
    }

    syncMeterUI(nextVal);

    state.decisions.push({
      mission: state.mission,
      choiceLabel,
      isCollaborative,
      chaosTriggered,
      confidenceAfter: state.confidence
    });

    return {
      mission: state.mission,
      confidence: state.confidence,
      mpCharges: state.mpCharges,
      growCount: state.growLog.length,
      decisions: state.decisions,
      growLog: state.growLog
    };
  }

  function useMpCharge() {
    if (state.mpCharges > 0) {
      state.mpCharges -= 1;
      return { allowed: true, remainingMp: state.mpCharges };
    }
    return { allowed: false, remainingMp: 0 };
  }

  function nextMission() {
    state.mission += 1;
    return state.mission;
  }

  function exportReportText() {
    const lines = [
      "EVIDENCIA LEADERSHIP CHALLENGE GAME — THE PSYCHIC ACADEMY",
      `Confianza registrada: ${state.confidence}% | Cargas MP restantes: ${state.mpCharges}`,
      "--- CICLO GROW ---",
      ...state.growLog.map(
        (item) => `[Misión ${item.mission} | ${item.step}] ${item.question}\nRespuesta: ${item.response || "(Sin registro)"}`
      ),
      "--- DECISIONES ---",
      ...state.decisions.map(
        (d) => `[Misión ${d.mission}] ${d.choiceLabel} | Colaborativa: ${d.isCollaborative ? "Sí" : "No"} | Confianza: ${d.confidenceAfter}%`
      )
    ];
    return lines.join("\n");
  }

  return {
    prompts,
    syncMeterUI,
    recordGrowStep,
    applyDecision,
    useMpCharge,
    nextMission,
    exportReportText
  };
})();

(() => {
  const btnSave = document.getElementById("btn-save-grow");
  const btnMp = document.getElementById("btn-use-mp");
  const btnExport = document.getElementById("btn-export-report");
  const mpBadge = document.getElementById("grow-mp-badge");
  const feedbackEl = document.getElementById("grow-feedback");
  const reportEl = document.getElementById("grow-report-preview");

  if (!btnSave || !window.PsychicCoachingEngine) return;

  btnMp?.addEventListener("click", () => {
    const res = window.PsychicCoachingEngine.useMpCharge();
    if (mpBadge) mpBadge.textContent = `Cargas MP: ${res.remainingMp}`;
    feedbackEl.textContent = res.allowed
      ? `Carga MP activada (apoyo/pista). Quedan ${res.remainingMp}.`
      : "Sin cargas MP restantes: responde con el análisis y liderazgo de tu equipo.";
  });

  btnSave.addEventListener("click", () => {
    const steps = {
      G: document.getElementById("grow-g")?.value || "",
      R: document.getElementById("grow-r")?.value || "",
      O: document.getElementById("grow-o")?.value || "",
      W: document.getElementById("grow-w")?.value || ""
    };

    const allFilled = Object.values(steps).every((v) => v.trim().length > 0);
    if (!allFilled) {
      feedbackEl.textContent = "Completa los cuatro campos (G, R, O y W) antes de guardar.";
      return;
    }

    Object.entries(steps).forEach(([step, val]) => {
      window.PsychicCoachingEngine.recordGrowStep(step, val);
    });

    const isCollaborative = Boolean(document.getElementById("grow-collab-check")?.checked);
    const summary = window.PsychicCoachingEngine.applyDecision({
      choiceLabel: `Plan GROW: ${steps.W.slice(0, 75)}`,
      isCollaborative,
      chaosTriggered: false,
      deltaConfidence: 20
    });

    feedbackEl.textContent = `GROW guardado (${summary.growCount} registros). Medidor actual: ${summary.confidence}%.`;
  });

  btnExport?.addEventListener("click", async () => {
    const reportText = window.PsychicCoachingEngine.exportReportText();
    reportEl.hidden = false;
    reportEl.textContent = reportText;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evidencia-grow-psychic-academy.txt";
    a.click();
    URL.revokeObjectURL(url);

    try {
      await navigator.clipboard.writeText(reportText);
      feedbackEl.textContent = "Evidencia descargada (.txt) y copiada al portapapeles.";
    } catch {
      feedbackEl.textContent = "Evidencia descargada (.txt) lista para enviar.";
    }
  });
})();
// Respaldo directo para asegurar que Guardar GROW y Exportar siempre respondan
document.addEventListener("DOMContentLoaded", () => {
  const btnSave = document.getElementById("btn-save-grow");
  const btnExport = document.getElementById("btn-export-report");
  const feedbackEl = document.getElementById("grow-feedback");
  const reportEl = document.getElementById("grow-report-preview");

  if (!btnSave || btnSave.dataset.growBound === "true") return;
  btnSave.dataset.growBound = "true";

  let growBonus = 0;
  const savedEntries = [];

  function setConfidenceDisplay(pct) {
    const safePct = Math.max(0, Math.min(100, pct));
    const fill = document.getElementById("meter-fill");
    const label = document.getElementById("meter-percent");
    if (fill) fill.style.width = `${safePct}%`;
    if (label) label.textContent = `${safePct}%`;
  }

  btnSave.addEventListener("click", (e) => {
    e.preventDefault();
    const g = (document.getElementById("grow-g")?.value || "").trim();
    const r = (document.getElementById("grow-r")?.value || "").trim();
    const o = (document.getElementById("grow-o")?.value || "").trim();
    const w = (document.getElementById("grow-w")?.value || "").trim();
    const collab = Boolean(document.getElementById("grow-collab-check")?.checked);

    if (!g || !r || !o || !w) {
      if (feedbackEl) {
        feedbackEl.textContent = "Completa los cuatro campos (G, R, O y W) antes de guardar.";
      }
      return;
    }

    const increment = collab ? 25 : 20;
    growBonus = Math.min(100, growBonus + increment);

    const currentPctText = document.getElementById("meter-percent")?.textContent || "0%";
    const basePct = parseInt(currentPctText.replace("%", ""), 10) || 0;
    const newPct = Math.min(100, Math.max(basePct + increment, growBonus));

    setConfidenceDisplay(newPct);
    savedEntries.push({ g, r, o, w, collab, confidence: newPct });

    if (feedbackEl) {
      feedbackEl.textContent = `GROW guardado (${savedEntries.length} registro). Confianza actualizada a ${newPct}%.`;
    }
  });

  if (btnExport && btnExport.dataset.exportBound !== "true") {
    btnExport.dataset.exportBound = "true";
    btnExport.addEventListener("click", (e) => {
      e.preventDefault();
      const g = (document.getElementById("grow-g")?.value || "").trim();
      const r = (document.getElementById("grow-r")?.value || "").trim();
      const o = (document.getElementById("grow-o")?.value || "").trim();
      const w = (document.getElementById("grow-w")?.value || "").trim();
      const collab = Boolean(document.getElementById("grow-collab-check")?.checked);
      const currentPctText = document.getElementById("meter-percent")?.textContent || "0%";

      const text = [
        "EVIDENCIA COACHING GROW - THE PSYCHIC ACADEMY",
        `Medidor de Confianza actual: ${currentPctText}`,
        `Decision colaborativa: ${collab ? "Si" : "No"}`,
        `G (Goal): ${g || "(Sin registro)"}`,
        `R (Reality): ${r || "(Sin registro)"}`,
        `O (Options): ${o || "(Sin registro)"}`,
        `W (Will): ${w || "(Sin registro)"}`
      ].join("\n");

      if (reportEl) {
        reportEl.hidden = false;
        reportEl.textContent = text;
      }

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "evidencia-grow-psychic-academy.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      if (feedbackEl) {
        feedbackEl.textContent = "Evidencia (.txt) generada y descargada.";
      }
    });
  }
});
