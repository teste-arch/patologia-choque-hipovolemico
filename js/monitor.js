/**
 * MONITOR.JS — Monitor de Sinais Vitais, ECG em Tempo Real e Web Audio Bip
 * Sala Vermelha: Choque Hipovolêmico
 */

class VitalMonitor {
  constructor(panelId, canvasId) {
    this.panel = document.getElementById(panelId);
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;

    // Estado local para tendências
    this.valoresAnteriores = {
      fc: null,
      pas: null,
      fr: null,
      spo2: null
    };

    // Áudio Web Audio API (desligado por padrão)
    this.audioCtx = null;
    this.somHabilitado = false;
    this.bipTimer = null;

    // ECG Canvas setup
    this.ecgOffset = 0;
    this.ecgSpeed = 2;
    this.animFrameId = null;

    // Padrão do complexo P-Q-R-S-T
    this.ecgBuffer = [];
    this.initEcgBuffer();

    if (this.canvas) {
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.startEcgLoop();
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth || 300;
    this.canvas.height = this.canvas.clientHeight || 64;
  }

  // Gera onda de ECG estilizada contínua
  initEcgBuffer() {
    this.ecgPattern = [
      0, 0, 0, 0, 0, 2, 4, 2, 0, 0, // Onda P
      -3, 26, -10, 0,              // Complexo QRS
      0, 0, 0, 3, 6, 4, 1, 0, 0, 0 // Onda T
    ];
  }

  // Loop de desenho contínuo do ECG no Canvas
  startEcgLoop() {
    const draw = () => {
      if (!this.ctx || !this.canvas) return;

      const w = this.canvas.width;
      const h = this.canvas.height;
      const midY = h / 2;

      // Limpeza suave tipo fósforo
      this.ctx.fillStyle = "rgba(6, 9, 17, 0.18)";
      this.ctx.fillRect(0, 0, w, h);

      // Grade suave de monitor
      this.ctx.strokeStyle = "rgba(0, 255, 136, 0.05)";
      this.ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < w; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, h);
        this.ctx.stroke();
      }

      // Traçado do ECG
      this.ctx.strokeStyle = "#00FF88";
      this.ctx.lineWidth = 2.2;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = "#00FF88";
      this.ctx.beginPath();

      const pontosCount = 60;
      const stepX = w / pontosCount;

      for (let i = 0; i < pontosCount; i++) {
        const x = i * stepX;
        const patternIdx = Math.floor((i + this.ecgOffset) % this.ecgPattern.length);
        const amp = this.ecgPattern[patternIdx] || 0;
        const y = midY - amp;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Velocidade proporcional à frequência cardíaca atual
      const fcAtual = window.gameState?.paciente?.fc || 120;
      this.ecgOffset += (fcAtual / 60) * 0.35;

      this.animFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  // Web Audio Bip agradável e realista
  tocarBip(fc) {
    if (!this.somHabilitado) return;

    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      // Tom agudo sutil de monitor
      osc.frequency.setValueAtTime(fc > 120 ? 980 : 880, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.09);
    } catch (e) {
      // Ignora falhas em navegadores com restrição estrita
    }
  }

  // Sincroniza o timer de bips com a FC atual
  atualizarBipTimer(fc) {
    if (this.bipTimer) clearInterval(this.bipTimer);

    if (this.somHabilitado && fc > 0) {
      const intervaloMs = Math.max(330, Math.min(1500, (60 / fc) * 1000));
      this.bipTimer = setInterval(() => {
        this.tocarBip(fc);
      }, intervaloMs);
    }
  }

  toggleAudio(forceState) {
    this.somHabilitado = typeof forceState === "boolean" ? forceState : !this.somHabilitado;
    const fc = window.gameState?.paciente?.fc || 128;
    this.atualizarBipTimer(fc);
    return this.somHabilitado;
  }

  // Retorna indicador de tendência visual
  getTrend(novo, anterior) {
    if (anterior === null || anterior === undefined) return "";
    if (novo > anterior) return " ↑";
    if (novo < anterior) return " ↓";
    return "";
  }

  // Atualização em tempo real de toda a interface do monitor
  update(state) {
    if (!this.panel) return;

    const p = state.paciente;
    const pad = state.pad;

    // Tendências
    const trendFc = this.getTrend(p.fc, this.valoresAnteriores.fc);
    const trendPas = this.getTrend(p.pas, this.valoresAnteriores.pas);
    const trendFr = this.getTrend(p.fr, this.valoresAnteriores.fr);
    const trendSpo2 = this.getTrend(p.spo2, this.valoresAnteriores.spo2);

    // Alertas Críticos (PAS < 90, FC > 120, SpO2 < 92)
    const fcCritico = p.fc > 120 || p.fc < 50;
    const paCritica = p.pas < 90;
    const spo2Critico = p.spo2 < 92;
    const frCritica = p.fr > 28 || p.fr < 10;

    // Atualiza bips
    this.atualizarBipTimer(p.fc);

    const html = `
      <div class="monitor-header">
        <span>LEITO 01 • SALA VERMELHA</span>
        <span>PACIENTE: LUCAS (28a)</span>
      </div>

      <div class="ecg-screen-wrapper">
        <canvas id="ecgCanvasMonitor" class="ecg-canvas"></canvas>
      </div>

      <div class="monitor-grid-display" aria-live="polite">
        <!-- FC -->
        <div class="vital-param-card ${fcCritico ? 'alert-critico' : ''}">
          <span class="param-label">FC <span>${trendFc}</span></span>
          <span class="param-value" style="color: ${fcCritico ? 'var(--monitor-alert)' : 'var(--monitor-text)'};">
            ${p.fc} <span class="param-unit">bpm</span>
          </span>
        </div>

        <!-- PA -->
        <div class="vital-param-card ${paCritica ? 'alert-critico' : ''}">
          <span class="param-label">PA <span>${trendPas}</span></span>
          <span class="param-value" style="color: ${paCritica ? 'var(--monitor-alert)' : 'var(--monitor-yellow)'};">
            ${p.pas}/${pad} <span class="param-unit">mmHg</span>
          </span>
        </div>

        <!-- SpO2 -->
        <div class="vital-param-card ${spo2Critico ? 'alert-critico' : ''}">
          <span class="param-label">SpO₂ <span>${trendSpo2}</span></span>
          <span class="param-value" style="color: ${spo2Critico ? 'var(--monitor-alert)' : 'var(--monitor-blue)'};">
            ${p.spo2} <span class="param-unit">%</span>
          </span>
        </div>

        <!-- FR -->
        <div class="vital-param-card ${frCritica ? 'alert-critico' : ''}">
          <span class="param-label">FR <span>${trendFr}</span></span>
          <span class="param-value" style="color: ${frCritica ? 'var(--monitor-alert)' : '#FFFFFF'};">
            ${p.fr} <span class="param-unit">irpm</span>
          </span>
        </div>
      </div>

      <!-- Medidores de Volume e Temperatura -->
      <div class="patient-meters-row">
        <div class="meter-wrapper">
          <div class="meter-label">
            <span>Volume Circulante</span>
            <span>${p.volume}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: ${p.volume}%; background: ${p.volume < 40 ? '#FF3366' : '#2EC4B6'};"></div>
          </div>
        </div>

        <div class="meter-wrapper">
          <div class="meter-label">
            <span>Índice Térmico</span>
            <span>${p.temperatura}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: ${p.temperatura}%; background: ${p.temperatura < 60 ? '#48CAE4' : '#FFD166'};"></div>
          </div>
        </div>
      </div>
    `;

    this.panel.innerHTML = html;

    // Reconectar o canvas após re-renderizar o container
    this.canvas = document.getElementById("ecgCanvasMonitor");
    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
    }

    // Armazenar valores atuais para a próxima comparação de tendência
    this.valoresAnteriores = {
      fc: p.fc,
      pas: p.pas,
      fr: p.fr,
      spo2: p.spo2
    };
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.VitalMonitor = VitalMonitor;
}
