/**
 * TRILHA.JS — Gerenciador e minijogos das 6 paradas teóricas da Trilha
 * Sala Vermelha: Choque Hipovolêmico
 */

class TrilhaManager {
  constructor() {
    this.paradaAtual = 1;
  }

  // Renderiza a parada teórica pelo ID (1 a 6)
  renderParada(paradaId) {
    const data = window.CLINICAL_DATA?.trilha?.find(p => p.id === paradaId);
    if (!data) return;

    this.paradaAtual = paradaId;
    const container = document.getElementById("paradaContentArea");
    if (!container) return;

    // Atualiza cabeçalho da parada
    const htmlHeader = `
      <div class="parada-header">
        <div class="parada-header-titles">
          <span class="hero-header-badge">PARADA ${data.numero} DE 6</span>
          <h2>${data.titulo}</h2>
          <p class="sub">${data.subtitulo}</p>
        </div>
        <button class="btn btn-outline btn-mini" id="btnVoltarAoMapaTop">
          🗺️ Voltar ao Mapa
        </button>
      </div>

      <!-- Texto Teórico Didático -->
      <div class="parada-bloco-texto">
        ${data.conteudo.map(p => `<p>${p}</p>`).join("")}
      </div>

      <!-- Card Para Fixar -->
      <div class="card-para-fixar">
        <span>📌</span>
        <span><strong>Para fixar:</strong> "${data.paraFixar}"</span>
      </div>
    `;

    // Renderiza a interação específica
    let htmlInteracao = `<div class="interactive-playground" id="playgroundArea">`;
    if (paradaId === 1) htmlInteracao += this.renderInteracaoP1(data);
    else if (paradaId === 2) htmlInteracao += this.renderInteracaoP2(data);
    else if (paradaId === 3) htmlInteracao += this.renderInteracaoP3(data);
    else if (paradaId === 4) htmlInteracao += this.renderInteracaoP4(data);
    else if (paradaId === 5) htmlInteracao += this.renderInteracaoP5(data);
    else if (paradaId === 6) htmlInteracao += this.renderInteracaoP6(data);
    htmlInteracao += `</div>`;

    // Navegação Inferior
    const htmlFooter = `
      <div class="trilha-nav-buttons">
        <button class="btn btn-outline" id="btnParadaAnterior" ${paradaId === 1 ? 'disabled' : ''}>
          ← Anterior
        </button>
        <button class="btn btn-primary" id="btnConcluirParada">
          ${paradaId === 6 ? 'Ir para o Caso Clínico 🚨' : 'Concluir e Avançar →'}
        </button>
      </div>
    `;

    container.innerHTML = htmlHeader + htmlInteracao + htmlFooter;

    // Conectar eventos da parada
    this.bindEventsParada(paradaId);
  }

  // ==========================================================================
  // PARADA 1 — Vaso com Líquido e Coração
  // ==========================================================================
  renderInteracaoP1(data) {
    return `
      <div class="playground-title">🔬 Interação: Volume Circulante vs Bomba Cardíaca</div>
      <p style="font-size: 0.95rem;">${data.interacao.instrucao}</p>
      
      <div class="vaso-interativo-container">
        <div style="display: flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap;">
          <!-- Vaso Sanguíneo Ilustrado SVG -->
          <div class="vaso-svg-wrapper">
            <svg viewBox="0 0 160 220" width="160" height="220">
              <!-- Frasco de Vidro / Vaso -->
              <rect x="25" y="20" width="110" height="180" rx="14" fill="none" stroke="#1D2B53" stroke-width="4"/>
              <!-- Marcações de Volume (Graduação) -->
              <line x1="30" y1="60" x2="45" y2="60" stroke="#1D2B53" stroke-width="2"/>
              <text x="50" y="64" font-size="9" font-family="'Nunito', sans-serif">100%</text>
              <line x1="30" y1="110" x2="45" y2="110" stroke="#1D2B53" stroke-width="2"/>
              <text x="50" y="114" font-size="9" font-family="'Nunito', sans-serif">65%</text>
              <line x1="30" y1="160" x2="45" y2="160" stroke="#1D2B53" stroke-width="2"/>
              <text x="50" y="164" font-size="9" font-family="'Nunito', sans-serif">30%</text>

              <!-- Nível de Sangue Líquido Dinâmico -->
              <rect id="vasoNivelSangue" x="29" y="30" width="102" height="166" rx="10" fill="#E63946" opacity="0.88"/>
              <!-- Gotinhas animadas -->
              <circle cx="80" cy="100" r="4" fill="#FFFFFF" opacity="0.4"/>
            </svg>
          </div>

          <!-- Coração SVG que pulsa com velocidade proporcional -->
          <div class="coracao-svg-wrapper" style="text-align: center;">
            <svg id="coracaoSvgP1" viewBox="0 0 100 100" width="110" height="110" style="transition: transform 0.2s ease;">
              <path d="M 50 85 C 50 85, 10 55, 10 32 A 22 22 0 0 1 50 20 A 22 22 0 0 1 90 32 C 90 55, 50 85, 50 85 Z" fill="#E63946"/>
              <circle cx="36" cy="32" r="3" fill="#FFFFFF" opacity="0.6"/>
            </svg>
            <div id="coracaoRitmoTexto" style="font-size: 0.85rem; font-weight: 700; color: var(--navy-blue); margin-top: 0.25rem;">
              Ritmo: 75 bpm (Normal)
            </div>
          </div>
        </div>

        <!-- Slider de Volume -->
        <div class="slider-volume-control">
          <label for="sliderVolP1" style="font-weight: 700; font-size: 0.9rem; display: flex; justify-content: space-between;">
            <span>Volume Intravascular:</span>
            <span id="sliderVolP1Val" style="color: var(--coral-red);">100%</span>
          </label>
          <input type="range" id="sliderVolP1" class="slider-custom" min="20" max="100" value="100" step="5">
          <div id="feedbackVolP1" style="font-size: 0.9rem; color: var(--text-muted); background: var(--bg-card); padding: 0.5rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--aqua-green); margin-top: 0.5rem;">
            ${data.interacao.mensagensNivel.alto}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 2 — Etiologia: Flip Cards e Minijogo de Classificação
  // ==========================================================================
  renderInteracaoP2(data) {
    const flipHtml = `
      <div class="playground-title">🗂️ Os Dois Grandes Grupos Etiológicos (Toque nos cards para virar)</div>
      <div class="flip-cards-container">
        ${data.gruposFlip.map(g => `
          <div class="flip-card" onclick="this.classList.toggle('flipped')">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <span style="font-size: 2.2rem; margin-bottom: 0.5rem;">${g.grupo === 'Hemorrágico' ? '🩸' : '💧'}</span>
                <h3 style="color: var(--coral-red);">${g.grupo}</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted);">${g.subtitulo}</p>
                <span class="btn-text-badge" style="margin: 0.5rem auto 0;">🔄 Toque para ver causas</span>
              </div>
              <div class="flip-card-back">
                <h4 style="color: var(--yellow-gold); margin-bottom: 0.4rem;">Causas: ${g.grupo}</h4>
                <ul>
                  ${g.exemplos.map(ex => `<li>${ex}</li>`).join("")}
                </ul>
                <p style="font-size: 0.78rem; opacity: 0.9; margin-top: 0.3rem;"><em>💡 ${g.destaque}</em></p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Minijogo: Classifique a Causa -->
      <div style="margin-top: 1.5rem; border-top: 2px dashed var(--border-color); padding-top: 1.25rem;">
        <div class="playground-title">🎮 Minijogo: ${data.minijogo.titulo}</div>
        <p style="font-size: 0.9rem;">${data.minijogo.instrucao}</p>

        <div class="cartas-classificacao-grid">
          ${data.minijogo.cartas.map(c => `
            <div class="carta-classificar-item" id="cartaItem_${c.id}" data-id="${c.id}" data-tipo="${c.tipo}">
              <p style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.4rem;">${c.texto}</p>
              <div class="botoes-classificar-row">
                <button class="btn btn-outline btn-mini btn-classif" data-id="${c.id}" data-escolha="hemorragica">
                  🩸 Hemorrágico
                </button>
                <button class="btn btn-outline btn-mini btn-classif" data-id="${c.id}" data-escolha="nao_hemorragica">
                  💧 Não Hemorrágico
                </button>
              </div>
              <div class="feedback-msg" style="font-size: 0.8rem; margin-top: 0.35rem; display: none;"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    return flipHtml;
  }

  // ==========================================================================
  // PARADA 3 — Fisiopatologia: A Reação em Cadeia e Tríade Letal
  // ==========================================================================
  renderInteracaoP3(data) {
    return `
      <div class="playground-title">⚡ A Reação em Cadeia Fisiopatológica</div>
      <p style="font-size: 0.95rem;">Clique no botão para avançar cada elo da cascata e observar o colapso compensatório:</p>

      <div style="text-align: right; margin-bottom: 0.75rem;">
        <button class="btn btn-secondary btn-mini" id="btnAvancarCadeia">Próximo Passo da Cascata ➔</button>
      </div>

      <div class="cadeia-fisiopatologia-stepper" id="stepperFisiopatologia">
        ${data.fases.map((f, i) => `
          <div class="passo-cadeia-item ${i === 0 ? 'ativo' : ''}" data-step="${i + 1}">
            <div class="parada-numero" style="width: 36px; height: 36px; font-size: 1rem;">${f.etapa}</div>
            <div style="flex: 1;">
              <h4 style="color: var(--navy-blue); margin-bottom: 0.2rem;">${f.nome}</h4>
              <p style="font-size: 0.9rem; margin-bottom: 0.4rem;">${f.detalhe}</p>
              <!-- Barra de Compensação Orgânica -->
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;">
                <span style="font-weight: 700; color: var(--text-muted);">Capacidade de Compensação:</span>
                <div style="flex: 1; max-width: 150px; height: 6px; background: #E2E8F0; border-radius: 99px; overflow: hidden;">
                  <div style="width: ${f.compensacaoBarra}%; height: 100%; background: ${f.compensacaoBarra > 50 ? 'var(--aqua-green)' : 'var(--coral-red)'};"></div>
                </div>
                <span>${f.compensacaoBarra}%</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Card Destaque: Tríade Letal com Engrenagens -->
      <div style="margin-top: 1.5rem; background: var(--bg-card); border: 2px solid var(--coral-red); border-radius: var(--radius-md); padding: 1.1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
          <svg viewBox="0 0 60 60" width="36" height="36" class="gear-cw">
            <path d="M 30 10 L 33 16 L 40 14 L 41 21 L 48 22 L 46 29 L 50 34 L 45 38 L 46 45 L 39 46 L 36 52 L 30 49 L 24 52 L 21 46 L 14 45 L 15 38 L 10 34 L 14 29 L 12 22 L 19 21 L 20 14 L 27 16 Z" fill="#E63946"/>
            <circle cx="30" cy="30" r="8" fill="#FFFFFF"/>
          </svg>
          <h4 style="color: var(--coral-red); margin: 0; font-size: 1.1rem;">${data.triadeLetal.titulo}</h4>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
          ${data.triadeLetal.componentes.map(c => `
            <div style="background: var(--coral-red-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--coral-red);">
              <strong style="color: var(--coral-red);">${c.nome}:</strong>
              <p style="font-size: 0.82rem; margin: 0.2rem 0 0;">${c.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 4 — Sinais e Sintomas: Corpo Humano Interativo e Slider de Choque
  // ==========================================================================
  renderInteracaoP4(data) {
    return `
      <div class="playground-title">🩺 O Corpo Fala: Toque nos Órgãos Alvo</div>
      <p style="font-size: 0.95rem;">Toque nos pontos brilhantes do corpo para examinar o que acontece e o que a enfermagem observa:</p>

      <div class="corpo-humano-interativo">
        <!-- SVG Ilustrado do Corpo Humano com Hotspots -->
        <div class="corpo-svg-container">
          <svg viewBox="0 0 240 400" width="240" height="400">
            <!-- Silhueta Humana Cartoon Amigável -->
            <g fill="#E2E8F0" stroke="#A0AEC0" stroke-width="2">
              <!-- Cabeça -->
              <circle cx="120" cy="50" r="26"/>
              <!-- Pescoço -->
              <rect x="114" y="74" width="12" height="12"/>
              <!-- Tronco -->
              <path d="M 90 86 L 150 86 L 144 210 L 96 210 Z" rx="10"/>
              <!-- Braços -->
              <path d="M 88 88 L 60 180 L 52 178 L 80 86 Z"/>
              <path d="M 152 88 L 180 180 L 188 178 L 160 86 Z"/>
              <!-- Pernas -->
              <path d="M 98 210 L 90 350 L 105 350 L 115 210 Z"/>
              <path d="M 142 210 L 150 350 L 135 350 L 125 210 Z"/>
            </g>

            <!-- Hotspots Interativos Pulsantes -->
            <!-- Cérebro -->
            <circle class="hotspot-dot" data-id="cerebro" cx="120" cy="50" r="9" fill="#E63946" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Coração -->
            <circle class="hotspot-dot" data-id="coracao" cx="126" cy="115" r="9" fill="#E63946" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Pulmões -->
            <circle class="hotspot-dot" data-id="pulmoes" cx="106" cy="125" r="9" fill="#2EC4B6" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Rins -->
            <circle class="hotspot-dot" data-id="rins" cx="120" cy="170" r="9" fill="#FFD166" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Pele / Extremidades -->
            <circle class="hotspot-dot" data-id="pele" cx="56" cy="180" r="9" fill="#2EC4B6" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
            <!-- Vasos / Pressão -->
            <circle class="hotspot-dot" data-id="vasos" cx="120" cy="225" r="9" fill="#1D2B53" stroke="#FFFFFF" stroke-width="2.5" style="cursor: pointer;"/>
          </svg>
        </div>

        <!-- Painel de Informação do Hotspot Clicado -->
        <div class="hotspot-info-box" id="hotspotInfoDisplay">
          <h4 id="hotspotNome" style="color: var(--coral-red); margin-bottom: 0.35rem;">Cérebro (Neurológico)</h4>
          <p id="hotspotAcontece" style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>O que acontece:</strong> Hipoperfusão do sistema nervoso central e ação da adrenalina.</p>
          <div style="background: var(--navy-blue-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--navy-blue);">
            <strong style="color: var(--navy-blue); font-size: 0.85rem;">O que o Enfermeiro observa:</strong>
            <p id="hotspotObserva" style="font-size: 0.85rem; margin: 0.2rem 0 0;">Ansiedade precoce, agitação motora, confusão mental, sonolência e letargia tardia.</p>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.6rem;">💡 Toque em outros pontos do corpo para inspecionar!</p>
        </div>
      </div>

      <!-- Slider das 4 Classes de Hemorragia -->
      <div style="margin-top: 1.75rem; border-top: 2px dashed var(--border-color); padding-top: 1.25rem;">
        <div class="playground-title">📊 ${data.sliderHemorragia.titulo}</div>
        <p style="font-size: 0.9rem;">${data.sliderHemorragia.instrucao}</p>

        <div style="max-width: 500px; margin: 0.5rem 0 1rem;">
          <input type="range" id="sliderClasseHemo" class="slider-custom" min="5" max="45" value="10" step="10">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-top: 0.25rem;">
            <span>Classe I (<15%)</span>
            <span>Classe II (15-30%)</span>
            <span>Classe III (30-40%)</span>
            <span>Classe IV (>40%)</span>
          </div>
        </div>

        <!-- Card da Classe Selecionada -->
        <div id="cardClasseHemoDisplay" style="background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <h4 id="displayClasseNome" style="color: var(--coral-red); margin: 0;">Classe I — Perda até 15% (~750 mL)</h4>
            <span class="btn-text-badge" id="displayClasseBadge">Compensado</span>
          </div>
          <p id="displayClasseResumo" style="font-size: 0.9rem; margin-bottom: 0.5rem;">Totalmente compensado. Sintomas mínimos, similar a uma doação de sangue.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; font-size: 0.8rem; background: var(--bg-card-alt); padding: 0.5rem; border-radius: var(--radius-sm);">
            <div><strong>FC:</strong> <span id="dispFC">Normal (< 100 bpm)</span></div>
            <div><strong>PA:</strong> <span id="dispPA">Normal</span></div>
            <div><strong>FR:</strong> <span id="dispFR">14 a 20 irpm</span></div>
            <div><strong>Sensório:</strong> <span id="dispMental">Pouco ansioso</span></div>
          </div>
        </div>

        <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--coral-red); font-weight: 700;">
          ⚠️ ${data.avisoClinico}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 5 — Diagnóstico: Bandeja de Exames
  // ==========================================================================
  renderInteracaoP5(data) {
    return `
      <div class="playground-title">🔬 Interação: Monte a Bandeja de Exames da Sala Vermelha</div>
      <p style="font-size: 0.95rem;">Toque em cada exame para entender sua utilidade e a conduta direta de enfermagem:</p>

      <div style="background: var(--coral-red-light); border-left: 4px solid var(--coral-red); padding: 0.75rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.25rem; font-size: 0.9rem; color: #5A121A;">
        <strong>⚠️ Ponto Clínico Crucial:</strong> ${data.alertaImportante}
      </div>

      <div class="bandeja-exames-grid">
        ${data.bandejaExames.map(ex => `
          <div class="exame-item-card" data-id="${ex.id}">
            <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">📋</div>
            <h4 style="font-size: 0.95rem; color: var(--navy-blue); margin-bottom: 0.2rem;">${ex.nome}</h4>
            <span style="font-size: 0.75rem; background: var(--navy-blue-light); padding: 0.15rem 0.5rem; border-radius: 99px;">${ex.tipo}</span>
          </div>
        `).join("")}
      </div>

      <!-- Detalhes do Exame Clicado -->
      <div id="detalheExameContainer" style="background: var(--bg-card); border: 2px solid var(--aqua-green); border-radius: var(--radius-md); padding: 1.1rem; margin-top: 1.25rem; display: none;">
        <h4 id="detExameTitulo" style="color: var(--aqua-green); margin-bottom: 0.35rem;">Nome do Exame</h4>
        <p id="detExameParaQueServe" style="font-size: 0.9rem; margin-bottom: 0.5rem;"></p>
        <div style="background: var(--aqua-green-light); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--aqua-green);">
          <strong style="color: var(--aqua-green-dark); font-size: 0.85rem;">O que o Enfermeiro faz:</strong>
          <p id="detExamePapel" style="font-size: 0.85rem; margin: 0.2rem 0 0;"></p>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // PARADA 6 — Tratamento: Ordene os Passos do XABCDE
  // ==========================================================================
  renderInteracaoP6(data) {
    const passos = [...data.minijogoXabcde.passosCorretos];
    // Embaralha para o minijogo
    const embaralhados = [...passos].sort(() => Math.random() - 0.5);

    return `
      <div class="playground-title">🎯 Minijogo: ${data.minijogoXabcde.titulo}</div>
      <p style="font-size: 0.95rem;">${data.minijogoXabcde.instrucao}</p>

      <div class="xabcde-sort-container" id="xabcdeCardsList">
        ${embaralhados.map(p => `
          <button class="xabcde-card-btn" data-ordem="${p.ordem}" data-letra="${p.letra}">
            <div class="parada-numero" style="width: 38px; height: 38px; font-size: 1.1rem; background: var(--coral-red);">${p.letra}</div>
            <div style="flex: 1;">
              <strong style="font-size: 0.95rem; color: var(--navy-blue);">${p.titulo}</strong>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.15rem 0 0;">${p.descricao}</p>
            </div>
          </button>
        `).join("")}
      </div>

      <div id="xabcdeFeedbackMsg" style="margin-top: 1rem; text-align: center; font-weight: 700; font-size: 0.95rem; color: var(--aqua-green); display: none;">
        🎉 Parabéns! Você ordenou perfeitamente toda a cadeia do XABCDE no trauma!
      </div>
    `;
  }

  // ==========================================================================
  // BIND DE EVENTOS DAS PARADAS
  // ==========================================================================
  bindEventsParada(paradaId) {
    // Voltar ao mapa
    document.getElementById("btnVoltarAoMapaTop")?.addEventListener("click", () => {
      window.uiManager?.mostrarTela("telaMapaTrilha");
    });

    // Anterior / Avançar
    document.getElementById("btnParadaAnterior")?.addEventListener("click", () => {
      if (paradaId > 1) this.renderParada(paradaId - 1);
    });

    document.getElementById("btnConcluirParada")?.addEventListener("click", () => {
      window.gameState?.concluirParadaTrilha(paradaId);
      if (paradaId < 6) {
        this.renderParada(paradaId + 1);
      } else {
        // Vai para a Parada 7 (Caso Clínico)
        window.uiManager?.iniciarCasoClinico();
      }
    });

    // Eventos Específicos de cada parada
    if (paradaId === 1) this.bindEventsP1();
    else if (paradaId === 2) this.bindEventsP2();
    else if (paradaId === 3) this.bindEventsP3();
    else if (paradaId === 4) this.bindEventsP4();
    else if (paradaId === 5) this.bindEventsP5();
    else if (paradaId === 6) this.bindEventsP6();
  }

  bindEventsP1() {
    const slider = document.getElementById("sliderVolP1");
    const valText = document.getElementById("sliderVolP1Val");
    const vasoNivel = document.getElementById("vasoNivelSangue");
    const coracao = document.getElementById("coracaoSvgP1");
    const ritmoTexto = document.getElementById("coracaoRitmoTexto");
    const feedback = document.getElementById("feedbackVolP1");
    const msgs = window.CLINICAL_DATA?.trilha[0]?.interacao?.mensagensNivel;

    if (!slider) return;

    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      valText.textContent = `${val}%`;

      // Atualiza altura do líquido no vaso SVG (max y=30, height=166)
      const maxH = 166;
      const h = (val / 100) * maxH;
      const y = 30 + (maxH - h);
      vasoNivel.setAttribute("y", y);
      vasoNivel.setAttribute("height", h);

      // Ritmo e tamanho do batimento
      if (val >= 85) {
        coracao.style.transform = "scale(1)";
        ritmoTexto.textContent = "Ritmo: 75 bpm (Normal)";
        ritmoTexto.style.color = "var(--navy-blue)";
        feedback.textContent = msgs.alto;
      } else if (val >= 65) {
        coracao.style.transform = "scale(1.15)";
        ritmoTexto.textContent = "Ritmo: 110 bpm (Taquicardia Compensatória)";
        ritmoTexto.style.color = "var(--yellow-dark)";
        feedback.textContent = msgs.medio;
      } else {
        coracao.style.transform = "scale(1.28)";
        ritmoTexto.textContent = "Ritmo: 135 bpm (Choque Grave / Esvaziamento)";
        ritmoTexto.style.color = "var(--coral-red)";
        feedback.textContent = msgs.critico;
      }
    });
  }

  bindEventsP2() {
    const btns = document.querySelectorAll(".btn-classif");
    const cartasData = window.CLINICAL_DATA?.trilha[1]?.minijogo?.cartas || [];

    btns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        const escolha = btn.getAttribute("data-escolha");
        const carta = cartasData.find(c => c.id === id);
        const cardElem = document.getElementById(`cartaItem_${id}`);
        const feedbackElem = cardElem?.querySelector(".feedback-msg");

        if (!carta || !cardElem || !feedbackElem) return;

        if (escolha === carta.tipo) {
          cardElem.style.borderColor = "var(--aqua-green)";
          cardElem.style.backgroundColor = "var(--aqua-green-light)";
          cardElem.classList.add("pulse-success");
          feedbackElem.textContent = `✔ ${carta.feedback}`;
          feedbackElem.style.color = "var(--aqua-green-dark)";
          feedbackElem.style.display = "block";
          // Desabilita botões desta carta
          cardElem.querySelectorAll(".btn-classif").forEach(b => b.disabled = true);
        } else {
          cardElem.classList.add("shake-error");
          setTimeout(() => cardElem.classList.remove("shake-error"), 500);
          feedbackElem.textContent = "✖ Pense no tipo de líquido perdido nesta situação!";
          feedbackElem.style.color = "var(--coral-red)";
          feedbackElem.style.display = "block";
        }
      });
    });
  }

  bindEventsP3() {
    let currentStep = 1;
    const btn = document.getElementById("btnAvancarCadeia");
    const items = document.querySelectorAll(".passo-cadeia-item");

    btn?.addEventListener("click", () => {
      currentStep++;
      if (currentStep > items.length) currentStep = 1;

      items.forEach((item, idx) => {
        if (idx < currentStep) {
          item.classList.add("ativo");
        } else {
          item.classList.remove("ativo");
        }
      });
    });
  }

  bindEventsP4() {
    // Hotspots do Corpo
    const dots = document.querySelectorAll(".hotspot-dot");
    const hotspotsData = window.CLINICAL_DATA?.trilha[3]?.hotspotsCorpo || [];

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const id = dot.getAttribute("data-id");
        const item = hotspotsData.find(h => h.id === id);
        if (!item) return;

        document.getElementById("hotspotNome").textContent = item.nome;
        document.getElementById("hotspotAcontece").innerHTML = `<strong>O que acontece:</strong> ${item.acontece}`;
        document.getElementById("hotspotObserva").textContent = item.observaEnfermeiro;

        // Feedback visual
        dots.forEach(d => d.setAttribute("stroke-width", "2.5"));
        dot.setAttribute("stroke-width", "5");
      });
    });

    // Slider das 4 Classes
    const slider = document.getElementById("sliderClasseHemo");
    const classes = window.CLINICAL_DATA?.trilha[3]?.sliderHemorragia?.classes || [];

    slider?.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      let classeObj = classes[0];

      if (val > 40) classeObj = classes[3];
      else if (val > 30) classeObj = classes[2];
      else if (val > 15) classeObj = classes[1];

      document.getElementById("displayClasseNome").textContent = `${classeObj.classe} — Perda ${classeObj.perdaPercent} (${classeObj.volumeAprox})`;
      document.getElementById("displayClasseBadge").textContent = classeObj.classe;
      document.getElementById("displayClasseResumo").textContent = classeObj.resumo;
      document.getElementById("dispFC").textContent = classeObj.fc;
      document.getElementById("dispPA").textContent = classeObj.pa;
      document.getElementById("dispFR").textContent = classeObj.fr;
      document.getElementById("dispMental").textContent = classeObj.mental;
    });
  }

  bindEventsP5() {
    const cards = document.querySelectorAll(".exame-item-card");
    const examesData = window.CLINICAL_DATA?.trilha[4]?.bandejaExames || [];
    const container = document.getElementById("detalheExameContainer");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const exame = examesData.find(e => e.id === id);
        if (!exame || !container) return;

        cards.forEach(c => c.classList.remove("selecionado"));
        card.classList.add("selecionado");

        document.getElementById("detExameTitulo").textContent = exame.nome;
        document.getElementById("detExameParaQueServe").innerHTML = `<strong>Para que serve:</strong> ${exame.paraQueServe}`;
        document.getElementById("detExamePapel").textContent = exame.papelEnfermagem;
        container.style.display = "block";
      });
    });
  }

  bindEventsP6() {
    let proximaOrdemEsperada = 1;
    const cards = document.querySelectorAll(".xabcde-card-btn");
    const feedback = document.getElementById("xabcdeFeedbackMsg");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const ordem = parseInt(card.getAttribute("data-ordem"), 10);

        if (ordem === proximaOrdemEsperada) {
          card.classList.add("acertou", "pulse-success");
          card.disabled = true;
          proximaOrdemEsperada++;

          if (proximaOrdemEsperada > cards.length && feedback) {
            feedback.style.display = "block";
          }
        } else {
          card.classList.add("shake-error");
          setTimeout(() => card.classList.remove("shake-error"), 500);
        }
      });
    });
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.trilhaManager = new TrilhaManager();
}
