/**
 * PATIENT.JS — Renderizador do Paciente Lucas (SVG Cartoon Dinâmico)
 * Sala Vermelha: Choque Hipovolêmico
 */

class PatientRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  // Define cor da pele conforme nível de perfusão
  getSkinColor(perfusao) {
    if (perfusao >= 70) return "#FFDFC4"; // Corado / saudável
    if (perfusao >= 50) return "#F5E2CE"; // Leve palidez
    if (perfusao >= 30) return "#EFE8DA"; // Pálido evidente
    return "#D8DEE8"; // Acinzentado / cianose suave
  }

  // Gera o SVG do cenário de fundo conforme a etapa
  renderScenarioBackground(cenarioTipo) {
    if (cenarioTipo === "rua") {
      return `
        <!-- Cenário 1: Rua / Acidente -->
        <rect x="0" y="0" width="520" height="240" fill="#E8EDF5" />
        <!-- Pista e asfalto -->
        <rect x="0" y="160" width="520" height="80" fill="#4A5568" />
        <line x1="0" y1="200" x2="520" y2="200" stroke="#FFD166" stroke-width="3" stroke-dasharray="20 15" />
        <!-- Moto caída estilizada cartoon -->
        <g transform="translate(40, 155) scale(0.65)">
          <circle cx="20" cy="30" r="14" fill="#2D3748" stroke="#1A202C" stroke-width="3"/>
          <circle cx="70" cy="30" r="14" fill="#2D3748" stroke="#1A202C" stroke-width="3"/>
          <path d="M 20 30 L 45 10 L 60 25 L 70 30" stroke="#E63946" stroke-width="6" stroke-linecap="round"/>
          <line x1="45" y1="10" x2="40" y2="0" stroke="#718096" stroke-width="4"/>
          <!-- Risco no asfalto -->
          <path d="M -10 38 Q 20 35 45 37" stroke="#2D3748" stroke-width="3" opacity="0.6"/>
        </g>
        <!-- Ambulância de fundo com giroflex -->
        <g transform="translate(380, 100) scale(0.8)">
          <rect x="10" y="30" width="110" height="55" rx="8" fill="#FFFFFF" stroke="#CBD5E0" stroke-width="2"/>
          <rect x="80" y="40" width="35" height="25" rx="4" fill="#90CDF4"/>
          <rect x="10" y="55" width="110" height="12" fill="#E63946"/>
          <!-- Cruz vermelha -->
          <rect x="42" y="35" width="6" height="16" fill="#E63946"/>
          <rect x="37" y="40" width="16" height="6" fill="#E63946"/>
          <circle cx="35" cy="85" r="10" fill="#2D3748"/>
          <circle cx="95" cy="85" r="10" fill="#2D3748"/>
          <!-- Giroflex pulsante -->
          <ellipse cx="65" cy="26" rx="7" ry="5" fill="#E63946" class="siren-active"/>
        </g>
      `;
    }

    if (cenarioTipo === "ambulancia") {
      return `
        <!-- Cenário 2: Interior da Ambulância -->
        <rect x="0" y="0" width="520" height="240" fill="#2D3748" />
        <rect x="15" y="15" width="490" height="210" rx="12" fill="#F7FAFC" stroke="#E2E8F0" stroke-width="3"/>
        <!-- Janela com asfalto correndo -->
        <rect x="40" y="30" width="160" height="70" rx="8" fill="#BEE3F8" stroke="#CBD5E0" stroke-width="2"/>
        <line x1="50" y1="80" x2="190" y2="80" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="16 12"/>
        <!-- Equipamentos e suportes internos -->
        <rect x="380" y="30" width="90" height="100" rx="6" fill="#EDF2F7" stroke="#CBD5E0" stroke-width="2"/>
        <rect x="390" y="40" width="70" height="40" rx="4" fill="#1A202C"/>
        <line x1="395" y1="60" x2="455" y2="60" stroke="#00FF88" stroke-width="2"/>
        <circle cx="400" cy="95" r="4" fill="#38A169"/>
        <circle cx="415" cy="95" r="4" fill="#E53E3E"/>
      `;
    }

    // Cenário Padrão: Sala Vermelha do Pronto-Socorro
    return `
      <!-- Cenário 3: Sala Vermelha PS -->
      <rect x="0" y="0" width="520" height="240" fill="#F0F4F8" />
      <!-- Faixa vermelha institucional na parede -->
      <rect x="0" y="70" width="520" height="20" fill="#E63946" opacity="0.85" />
      <text x="20" y="84" font-family="'Fredoka', sans-serif" font-weight="700" font-size="11" fill="#FFFFFF" letter-spacing="2">EMERGÊNCIA • SALA VERMELHA • TRAUMA</text>
      <!-- Sirene de teto pulsando -->
      <g transform="translate(250, 12)" class="siren-active">
        <rect x="0" y="0" width="20" height="6" fill="#718096" rx="2"/>
        <path d="M 3 6 C 3 18, 17 18, 17 6 Z" fill="#E63946"/>
      </g>
      <!-- Suporte de soro à esquerda -->
      <line x1="70" y1="30" x2="70" y2="220" stroke="#A0AEC0" stroke-width="4" stroke-linecap="round"/>
      <path d="M 55 40 Q 70 30 85 40" stroke="#A0AEC0" stroke-width="3" fill="none"/>
    `;
  }

  // Renderiza todo o componente SVG do paciente e maca
  render(state) {
    if (!this.container) return;

    const p = state.paciente;
    const skin = this.getSkinColor(p.perfusao);
    const cenarioTipo = state.etapaAtualIndex === 0 ? "rua" : state.etapaAtualIndex === 1 ? "ambulancia" : "sala-vermelha";

    // Expressão dos olhos conforme consciência
    let eyesSvg = "";
    if (p.consciencia >= 75) {
      // Alerta / ansioso
      eyesSvg = `
        <circle cx="178" cy="115" r="3.5" fill="#1D2B53" />
        <circle cx="194" cy="115" r="3.5" fill="#1D2B53" />
        <circle cx="179" cy="113.5" r="1.2" fill="#FFFFFF" />
        <circle cx="195" cy="113.5" r="1.2" fill="#FFFFFF" />
        <!-- Sobrancelhas franzidas de dor/ansiedade -->
        <line x1="174" y1="108" x2="182" y2="111" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="198" y1="108" x2="190" y2="111" stroke="#4A5568" stroke-width="1.8" stroke-linecap="round"/>
      `;
    } else if (p.consciencia >= 45) {
      // Sonolento / cansado
      eyesSvg = `
        <path d="M 174 116 Q 178 119 182 116" stroke="#1D2B53" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 190 116 Q 194 119 198 116" stroke="#1D2B53" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <line x1="174" y1="110" x2="182" y2="112" stroke="#718096" stroke-width="1.5"/>
        <line x1="198" y1="110" x2="190" y2="112" stroke="#718096" stroke-width="1.5"/>
      `;
    } else {
      // Quase fechados / torpor
      eyesSvg = `
        <line x1="174" y1="117" x2="182" y2="117" stroke="#1D2B53" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="190" y1="117" x2="198" y2="117" stroke="#1D2B53" stroke-width="2.5" stroke-linecap="round"/>
      `;
    }

    // Suor dinâmico se hipoperfusão
    const showSweat = p.perfusao < 55;
    const sweatSvg = showSweat ? `
      <g fill="#63B3ED" class="sweat-drop">
        <path d="M 170 108 C 170 106 172 104 172 104 C 172 104 174 106 174 108 A 2 2 0 0 1 170 108 Z"/>
        <path d="M 200 110 C 200 108 202 106 202 106 C 202 106 204 108 204 110 A 2 2 0 0 1 200 110 Z"/>
      </g>
    ` : "";

    // Tremor de frio se temperatura baixa
    const isShivering = p.temperatura < 65 ? "patient-shivering" : "";

    // Tamanho do hematoma pélvico (escala de acordo com sangramento)
    const hematomaRadiusX = Math.max(8, (p.sangramento / 100) * 36);
    const hematomaRadiusY = Math.max(5, (p.sangramento / 100) * 22);
    const hematomaOpacity = Math.min(0.85, Math.max(0.25, p.sangramento / 100));

    // Cinta Pélvica instalada
    const cintaSvg = state.cintaPelvicaAplicada ? `
      <!-- Cinta Pélvica nos Trocânteres Maiores -->
      <g transform="translate(262, 142)">
        <rect x="0" y="0" width="60" height="24" rx="6" fill="#1D2B53" stroke="#2EC4B6" stroke-width="2.5"/>
        <rect x="18" y="4" width="24" height="16" rx="4" fill="#FFD166"/>
        <!-- Fivela / indicador de tração correta -->
        <circle cx="30" cy="12" r="3" fill="#E63946"/>
        <text x="30" y="32" font-family="'Nunito', sans-serif" font-weight="800" font-size="8" fill="#1D2B53" text-anchor="middle">CINTA FIXADA</text>
      </g>
    ` : "";

    // Manta térmica de aquecimento
    const mantaSvg = state.mantaTermicaAplicada ? `
      <!-- Manta Térmica Aluminizada/Amarela -->
      <path d="M 195 130 Q 300 118 410 135 L 405 185 Q 295 190 195 175 Z" 
            fill="#FFD166" opacity="0.88" stroke="#E09F3E" stroke-width="2"/>
      <text x="300" y="155" font-family="'Fredoka', sans-serif" font-weight="700" font-size="11" fill="#1D2B53" text-anchor="middle" letter-spacing="1">MANTA TÉRMICA ATIVA</text>
    ` : "";

    // Bolsa de Soro / Sangue no suporte
    let infusionBagSvg = "";
    if (state.transfusaoIniciada) {
      infusionBagSvg = `
        <!-- Bolsa de Sangue Concentrado de Hemácias -->
        <g transform="translate(60, 48)">
          <rect x="0" y="0" width="22" height="34" rx="5" fill="#8B0000" stroke="#FFFFFF" stroke-width="1.5"/>
          <rect x="4" y="6" width="14" height="12" rx="2" fill="#FFFFFF" opacity="0.9"/>
          <text x="11" y="15" font-family="'Nunito', sans-serif" font-weight="800" font-size="7" fill="#8B0000" text-anchor="middle">CH</text>
          <!-- Tubo e gotejamento rápido -->
          <line x1="11" y1="34" x2="11" y2="80" stroke="#8B0000" stroke-width="2"/>
          <circle cx="11" cy="46" r="2.5" fill="#8B0000" class="iv-drip fast"/>
        </g>
      `;
    } else {
      infusionBagSvg = `
        <!-- Frasco / Bolsa de Cristaloides -->
        <g transform="translate(60, 48)">
          <rect x="0" y="0" width="22" height="34" rx="5" fill="#EBF8FF" stroke="#63B3ED" stroke-width="1.5"/>
          <text x="11" y="18" font-family="'Nunito', sans-serif" font-weight="700" font-size="7" fill="#2B6CB0" text-anchor="middle">SF</text>
          <line x1="11" y1="34" x2="11" y2="80" stroke="#63B3ED" stroke-width="1.5"/>
          <circle cx="11" cy="46" r="2" fill="#63B3ED" class="iv-drip"/>
        </g>
      `;
    }

    const html = `
      <svg viewBox="0 0 520 240" class="patient-svg-root" style="width: 100%; height: auto; display: block;">
        <defs>
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1D2B53" flood-opacity="0.15"/>
          </filter>
        </defs>

        <!-- 1. Cenário de Fundo -->
        ${this.renderScenarioBackground(cenarioTipo)}

        <!-- 2. Maca Hospitalar com Rodinhas -->
        <g transform="translate(130, 150)" filter="url(#shadowFilter)">
          <!-- Estrutura metálica -->
          <rect x="10" y="20" width="280" height="12" rx="4" fill="#718096" />
          <rect x="30" y="32" width="10" height="28" fill="#4A5568" />
          <rect x="260" y="32" width="10" height="28" fill="#4A5568" />
          <circle cx="35" cy="62" r="7" fill="#1A202C" />
          <circle cx="265" cy="62" r="7" fill="#1A202C" />
          <!-- Colchão azul-claro -->
          <rect x="5" y="6" width="290" height="16" rx="6" fill="#63B3ED" />
        </g>

        <!-- 3. Paciente Lucas em Maca -->
        <g id="patientBodyGroup" class="${isShivering}">
          <!-- Travesseiro -->
          <ellipse cx="185" cy="148" rx="26" ry="12" fill="#E2E8F0"/>

          <!-- Cabeça -->
          <circle cx="186" cy="120" r="22" fill="${skin}" stroke="#D69E2E" stroke-width="1" />
          <!-- Cabelo castanho cartoon -->
          <path d="M 166 118 C 166 98, 206 98, 206 118 C 200 104, 172 104, 166 118 Z" fill="#4A3525"/>
          <!-- Olhos e Sobrancelhas -->
          ${eyesSvg}
          <!-- Nariz e Boca de dor/ansiedade -->
          <path d="M 186 120 L 184 125 L 187 125" stroke="#A0AEC0" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <path d="M 181 130 Q 186 127 191 130" stroke="#742A2A" stroke-width="2" stroke-linecap="round" fill="none"/>
          <!-- Gotas de suor se houver -->
          ${sweatSvg}

          <!-- Tronco / Camisa hospitalar -->
          <path d="M 198 134 L 268 136 L 268 170 L 198 168 Z" fill="#EBF8FF" stroke="#BEE3F8" stroke-width="1.5"/>
          <line x1="200" y1="150" x2="265" y2="152" stroke="#BEE3F8" stroke-width="2"/>

          <!-- Braço com acesso venoso -->
          <path d="M 205 142 L 250 155" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>
          <!-- Curativo do acesso no antebraço -->
          <rect x="236" y="148" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#3182CE" stroke-width="1"/>

          <!-- Pelve e Quadril -->
          <path d="M 264 136 L 315 138 L 315 174 L 264 170 Z" fill="${skin}"/>
          
          <!-- Hematoma pélvico estilizado -->
          <ellipse cx="290" cy="154" rx="${hematomaRadiusX}" ry="${hematomaRadiusY}" 
                   fill="#553C9A" opacity="${hematomaOpacity}" />

          <!-- Membros Inferiores: Perna direita encurtada e rotação externa -->
          <!-- Perna esquerda normal -->
          <path d="M 312 144 L 400 148" stroke="${skin}" stroke-width="11" stroke-linecap="round"/>
          <path d="M 398 144 L 408 144" stroke="#4A5568" stroke-width="6" stroke-linecap="round"/> <!-- Pé esquerdo -->

          <!-- Perna direita (encurtada e rodada para fora) -->
          <path d="M 310 160 L 388 168" stroke="${skin}" stroke-width="11" stroke-linecap="round"/>
          <path d="M 384 168 L 396 178" stroke="#4A5568" stroke-width="6" stroke-linecap="round"/> <!-- Pé rodado -->

          <!-- Cinta Pélvica (se aplicada) -->
          ${cintaSvg}

          <!-- Manta Térmica (se aplicada) -->
          ${mantaSvg}
        </g>

        <!-- 4. Suporte e Bolsas de Infusão -->
        ${infusionBagSvg}
      </svg>
    `;

    this.container.innerHTML = html;
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.PatientRenderer = PatientRenderer;
}
