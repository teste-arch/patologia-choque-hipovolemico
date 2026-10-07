/**
 * UI.JS — Renderizador de Telas, Modais, Mini-Animações e Interações do Usuário
 * Sala Vermelha: Choque Hipovolêmico
 */

class UIManager {
  constructor() {
    this.telas = [
      "telaHome",
      "telaMapaTrilha",
      "telaParadaTeorica",
      "telaCasoClinico",
      "telaFinalCaso"
    ];
    this.telaAtualId = "telaHome";
  }

  // Troca suave de telas
  mostrarTela(idTelaAlvo) {
    this.telas.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === idTelaAlvo) {
          el.classList.add("active");
          el.removeAttribute("hidden");
        } else {
          el.classList.remove("active");
          el.setAttribute("hidden", "true");
        }
      }
    });

    this.telaAtualId = idTelaAlvo;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Atualiza barras e mapas quando aplicável
    this.atualizarBarraProgresso();
    if (idTelaAlvo === "telaMapaTrilha") {
      this.renderMapaTrilha();
    }
  }

  // Atualiza a barra de progresso no topo
  atualizarBarraProgresso() {
    const totalParadas = 7; // 6 teóricas + 1 caso clínico
    let concluidas = window.gameState?.trilhaConcluida?.size || 0;
    if (window.gameState?.jogoFinalizado) concluidas++;

    const percent = Math.min(100, Math.round((concluidas / totalParadas) * 100));
    const fill = document.getElementById("trilhaProgressFill");
    const text = document.getElementById("trilhaProgressText");

    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${concluidas} de ${totalParadas} etapas (${percent}%)`;
  }

  // Renderiza o mapa da trilha com as 7 paradas
  renderMapaTrilha() {
    const grid = document.getElementById("mapaTrilhaCardsGrid");
    if (!grid) return;

    const trilhaData = window.CLINICAL_DATA?.trilha || [];
    const htmlCards = trilhaData.map(p => {
      const concluida = window.gameState?.isParadaConcluida(p.id);
      return `
        <div class="parada-card ${concluida ? 'concluida' : ''}" data-parada-id="${p.id}" tabindex="0" role="button" aria-label="Parada ${p.numero}: ${p.titulo}">
          <div class="parada-numero">${concluida ? '✔' : p.numero}</div>
          <div class="parada-info">
            <h3>${p.titulo}</h3>
            <p>${p.subtitulo}</p>
          </div>
          <div class="parada-status-icon">
            ${concluida ? '<span>Concluída</span>' : '<span>➔</span>'}
          </div>
        </div>
      `;
    }).join("");

    // Card especial do Caso Clínico (Parada 7)
    const casoFinalizado = window.gameState?.jogoFinalizado;
    const cardCaso = `
      <div class="parada-card caso-card ${casoFinalizado ? 'concluida' : ''}" id="cardAcessarCasoClinico" tabindex="0" role="button">
        <div class="parada-numero" style="background: var(--coral-red);">${casoFinalizado ? '✔' : '7'}</div>
        <div class="parada-info">
          <h3 style="color: var(--coral-red);">🚨 Caso Clínico Interativo (Plantão na Sala Vermelha)</h3>
          <p>Assuma o papel do enfermeiro no atendimento de Lucas (28a): politrauma com choque hemorrágico!</p>
        </div>
        <div class="parada-status-icon" style="color: var(--coral-red);">
          <strong>Jogar ➔</strong>
        </div>
      </div>
    `;

    grid.innerHTML = htmlCards + cardCaso;

    // Adiciona cliques nos cards
    grid.querySelectorAll(".parada-card[data-parada-id]").forEach(card => {
      card.addEventListener("click", () => {
        const id = parseInt(card.getAttribute("data-parada-id"), 10);
        this.abrirParadaTeorica(id);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          const id = parseInt(card.getAttribute("data-parada-id"), 10);
          this.abrirParadaTeorica(id);
        }
      });
    });

    document.getElementById("cardAcessarCasoClinico")?.addEventListener("click", () => {
      this.iniciarCasoClinico();
    });
  }

  abrirParadaTeorica(paradaId) {
    this.mostrarTela("telaParadaTeorica");
    window.trilhaManager?.renderParada(paradaId);
  }

  // ==========================================================================
  // CASO CLÍNICO INTERATIVO (SERIOUS GAME)
  // ==========================================================================
  iniciarCasoClinico() {
    this.mostrarTela("telaCasoClinico");
    this.renderEtapaCaso(window.gameState.etapaAtualIndex);
  }

  renderEtapaCaso(etapaIndex) {
    const etapas = window.CLINICAL_DATA?.casoClinico?.etapas || [];
    const etapa = etapas[etapaIndex];
    if (!etapa) return;

    // Atualiza badges e cabeçalhos
    const badgeFase = document.getElementById("casoFaseBadge");
    const tituloEtapa = document.getElementById("casoTituloEtapa");
    const situacaoTexto = document.getElementById("casoSituacaoTexto");
    const sinaisLista = document.getElementById("casoSinaisLista");
    const btnDica = document.getElementById("btnUsarDicaGota");
    const dicasRestantesTexto = document.getElementById("dicasRestantesNum");

    if (badgeFase) badgeFase.textContent = `${etapa.fase} • ETAPA ${etapa.numero} DE 5`;
    if (tituloEtapa) tituloEtapa.textContent = etapa.titulo;
    if (situacaoTexto) situacaoTexto.textContent = etapa.situacao;

    if (sinaisLista) {
      sinaisLista.innerHTML = etapa.sinais.map(s => `<li>${s}</li>`).join("");
    }

    if (dicasRestantesTexto) {
      dicasRestantesTexto.textContent = window.gameState.dicasRestantes;
    }
    if (btnDica) {
      btnDica.disabled = window.gameState.dicasRestantes <= 0;
    }

    // Embaralha as 3 opções para esta rodada (referenciadas estritamente por ID)
    const opcoesEmbaralhadas = window.gameState.embaralharOpcoes(etapa.opcoes);
    const containerOpcoes = document.getElementById("casoOpcoesList");
    if (!containerOpcoes) return;

    const letras = ["A", "B", "C"];
    containerOpcoes.innerHTML = opcoesEmbaralhadas.map((op, idx) => `
      <button class="opcao-conduta-item" data-opcao-id="${op.id}" id="btnOpcao_${op.id}">
        <span class="opcao-letra">${letras[idx]}</span>
        <span class="opcao-texto">${op.texto}</span>
      </button>
    `).join("");

    // Oculta feedback anterior
    const feedbackCard = document.getElementById("casoFeedbackCard");
    if (feedbackCard) {
      feedbackCard.className = "feedback-escolha-container";
      feedbackCard.style.display = "none";
    }

    // Conecta cliques nas opções
    containerOpcoes.querySelectorAll(".opcao-conduta-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-opcao-id");
        this.processarEscolhaJogador(etapaIndex, id, etapa);
      });
    });

    // Atualiza paciente e monitor
    window.patientRenderer?.render(window.gameState);
    window.vitalMonitor?.update(window.gameState);
  }

  // Processa a escolha do usuário
  processarEscolhaJogador(etapaIndex, opcaoId, etapa) {
    const opcao = etapa.opcoes.find(o => o.id === opcaoId);
    if (!opcao) return;

    // Desabilita todas as opções para evitar múltiplos cliques
    const botoes = document.querySelectorAll(".opcao-conduta-item");
    botoes.forEach(b => b.disabled = true);

    // Aplica efeitos no estado do paciente
    window.gameState.aplicarEfeitos(opcao.efeitos, opcaoId);
    // Registra pontuação e histórico
    window.gameState.registrarEscolha(etapaIndex, opcao);

    // Efeito visual no botão clicado
    const btnClicado = document.getElementById(`btnOpcao_${opcaoId}`);
    if (opcao.tipo === "correta") {
      btnClicado?.classList.add("pulse-success");
    } else {
      btnClicado?.classList.add("shake-error");
    }

    // Atualiza SVG do paciente e monitor multiparamétrico
    window.patientRenderer?.render(window.gameState);
    window.vitalMonitor?.update(window.gameState);

    // Exibe o painel pedagógico de feedback
    this.exibirFeedbackEscolha(opcao, etapa);
  }

  exibirFeedbackEscolha(opcao, etapa) {
    const container = document.getElementById("casoFeedbackCard");
    if (!container) return;

    const tipoClasse = opcao.tipo; // 'correta', 'parcial', 'errada'
    container.className = `feedback-escolha-container visible ${tipoClasse}`;
    container.style.display = "block";

    const iconeTipo = opcao.tipo === "correta" ? "✔" : opcao.tipo === "parcial" ? "◐" : "✖";
    const tituloTipo = opcao.tipo === "correta" ? "Conduta Adequada!" : opcao.tipo === "parcial" ? "Conduta Parcial" : "Conduta Inadequada";

    const html = `
      <div class="feedback-titulo">
        <span>${iconeTipo}</span>
        <span>${tituloTipo}</span>
      </div>
      <p style="font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.75rem;">
        ${opcao.feedback}
      </p>

      <!-- Cuidados de Enfermagem Fundamentais -->
      <div class="card-cuidados-enfermagem">
        <h4>📋 Cuidados de Enfermagem na Situação:</h4>
        <ul>
          ${etapa.cuidadosEnfermagem.map(c => `<li>${c}</li>`).join("")}
        </ul>
      </div>

      <!-- Para Fixar -->
      <div class="card-para-fixar" style="margin: 0.75rem 0;">
        <span>📌</span>
        <span><strong>Para fixar:</strong> "${etapa.paraFixar}"</span>
      </div>

      <!-- Curiosidade Você Sabia -->
      ${etapa.vocesabia ? `
        <div style="font-size: 0.85rem; color: var(--text-muted); background: var(--bg-card); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 0.75rem;">
          💡 <strong>Você sabia?</strong> ${etapa.vocesabia}
        </div>
      ` : ''}

      <!-- Botão Avançar -->
      <div style="text-align: right; margin-top: 1rem;">
        <button class="btn btn-primary" id="btnAvancarCasoEtapa">
          ${etapa.numero === 5 ? 'Ver Desfecho Final do Caso 🏁' : 'Avançar para a Próxima Etapa ➔'}
        </button>
      </div>
    `;

    container.innerHTML = html;

    // Scroll suave até o feedback
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Evento do botão avançar
    document.getElementById("btnAvancarCasoEtapa")?.addEventListener("click", () => {
      if (etapa.numero < 5) {
        window.gameState.etapaAtualIndex++;
        this.renderEtapaCaso(window.gameState.etapaAtualIndex);
      } else {
        // Conclui o caso e exibe tela final
        this.exibirTelaFinal();
      }
    });
  }

  // Uso de dica da Gota durante a etapa
  acionarDicaGota() {
    if (window.gameState.dicasRestantes <= 0) return;

    const etapas = window.CLINICAL_DATA?.casoClinico?.etapas || [];
    const etapa = etapas[window.gameState.etapaAtualIndex];
    if (!etapa) return;

    // Procura uma opção errada ou parcial ainda não desabilitada
    const erradas = etapa.opcoes.filter(o => o.tipo !== "correta");
    const opcaoDesabilitar = erradas[Math.floor(Math.random() * erradas.length)];

    if (opcaoDesabilitar) {
      const btn = document.getElementById(`btnOpcao_${opcaoDesabilitar.id}`);
      if (btn) {
        btn.classList.add("desabilitada-dica");
      }
    }

    // Deduz dica no estado
    window.gameState.usarDica();

    // Atualiza contador
    const dicasText = document.getElementById("dicasRestantesNum");
    if (dicasText) dicasText.textContent = window.gameState.dicasRestantes;
    if (window.gameState.dicasRestantes <= 0) {
      const btnDica = document.getElementById("btnUsarDicaGota");
      if (btnDica) btnDica.disabled = true;
    }

    // Modal ou fala da Gota com a pista
    this.abrirModalGenerico(
      "💧 Dica da Gota",
      `<div class="mascote-gota-card">
        <div class="mascote-gota-avatar">
          <svg viewBox="0 0 64 64"><use href="#svgGotaMascoteBase"></use></svg>
        </div>
        <div class="mascote-fala">
          <h4 class="mascote-fala-titulo">Atenção, Enfermeiro(a)!</h4>
          <p class="mascote-fala-texto">${etapa.opcoes.find(o => o.tipo === 'correta')?.dicaGota || 'Analise a prioridade do XABCDE e evite atrasar o tratamento!'}</p>
          <p style="font-size: 0.8rem; color: var(--coral-red); margin-top: 0.4rem;"><em>(Eliminei uma alternativa arriscada para você!)</em></p>
        </div>
      </div>`
    );
  }

  // ==========================================================================
  // TELA FINAL DO CASO CLÍNICO
  // ==========================================================================
  exibirTelaFinal() {
    const resultado = window.gameState.calcularFinal();
    this.mostrarTela("telaFinalCaso");

    const container = document.getElementById("finalCasoContentArea");
    if (!container) return;

    // Disparar confetes se Final 1
    if (resultado.chave === "final1") {
      this.dispararConfetes();
    }

    const estrelasHtml = Array(3).fill(0).map((_, i) => {
      return i < resultado.estrelas ? '⭐' : '☆';
    }).join("");

    const nomeTratado = window.gameState.nomeJogador ? `Enf. ${window.gameState.nomeJogador}` : "Enfermeiro(a)";

    const html = `
      <div class="final-screen-card" style="border-color: ${resultado.cor};">
        <span class="final-badge" style="background: ${resultado.cor}22; color: ${resultado.cor};">
          ${resultado.classificacao}
        </span>
        <h2 style="color: ${resultado.cor}; font-size: 1.8rem; margin: 0.4rem 0;">${resultado.titulo}</h2>
        <p style="font-size: 1.1rem; color: var(--text-muted);">${resultado.subtitulo}</p>

        <!-- Estrelas -->
        <div class="estrelas-avaliacao">${estrelasHtml}</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--navy-blue); margin-bottom: 1.25rem;">
          Pontuação Clínica: ${resultado.pontos} de ${resultado.maxPontos} pontos 
          ${resultado.dicasUsadas > 0 ? `(${resultado.dicasUsadas} dica(s) utilizada(s))` : '(Sem uso de dicas!)'}
        </div>

        <!-- Mensagem de Conclusão -->
        <div style="max-width: 720px; margin: 0 auto 1.5rem; text-align: left; background: var(--bg-card-alt); padding: 1.25rem; border-radius: var(--radius-md); border-left: 5px solid ${resultado.cor}; line-height: 1.6;">
          <p><strong>Parabéns pelo empenho, ${nomeTratado}!</strong></p>
          <p>${resultado.mensagem}</p>
          <p style="margin-bottom: 0;"><em>${resultado.estadoFinalDesc}</em></p>
        </div>

        <!-- 1. Linha do Tempo das Escolhas -->
        <h3 style="color: var(--navy-blue); margin-top: 1.75rem;">📋 Linha do Tempo das Decisões de Enfermagem</h3>
        <div class="timeline-escolhas-grid">
          ${window.gameState.historicoEscolhas.map((item, idx) => {
            const icon = item.tipo === "correta" ? "✔ Correta (+2)" : item.tipo === "parcial" ? "◐ Parcial (+1)" : "✖ Inadequada (0)";
            const borda = item.tipo === "correta" ? "var(--aqua-green)" : item.tipo === "parcial" ? "var(--yellow-gold)" : "var(--coral-red)";
            return `
              <div class="timeline-item-card" style="border-top: 3px solid ${borda};">
                <strong>Etapa ${idx + 1}</strong>
                <div style="color: ${borda}; font-weight: 700; margin: 0.2rem 0;">${icon}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Opção escolhida: ${item.opcaoId}</div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- 2. Plano Sistematizado de Cuidados de Enfermagem -->
        <div style="text-align: left; margin: 2rem 0; background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
          <h3 style="color: var(--coral-red); margin-bottom: 0.25rem;">${window.CLINICAL_DATA?.planoCuidados?.titulo}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
            <em>${window.CLINICAL_DATA?.planoCuidados?.notaAcademica}</em>
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${window.CLINICAL_DATA?.planoCuidados?.diagnosticos?.map(diag => `
              <div style="background: var(--bg-card-alt); border-radius: var(--radius-sm); padding: 0.85rem; border-left: 3px solid var(--navy-blue);">
                <h4 style="color: var(--navy-blue); font-size: 0.95rem; margin-bottom: 0.25rem;">🎯 Diagnóstico: ${diag.titulo}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;"><strong>Fator relacionado:</strong> ${diag.evidenciadoPor}</p>
                <div style="font-size: 0.85rem;"><strong>Intervenções principais:</strong></div>
                <ul style="padding-left: 1.2rem; font-size: 0.82rem; margin-bottom: 0.4rem;">
                  ${diag.intervencoes.map(int => `<li>${int}</li>`).join("")}
                </ul>
                <div style="font-size: 0.82rem; color: var(--aqua-green-dark);"><strong>Resultado Esperado:</strong> ${diag.resultadosEsperados}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 3. Complicações Tardias a Monitorar (Saleh et al. 2024) -->
        <div style="text-align: left; margin: 1.5rem 0; background: var(--coral-red-light); border: 2px solid var(--coral-red); border-radius: var(--radius-md); padding: 1.25rem;">
          <h3 style="color: var(--coral-red); margin-bottom: 0.2rem;">${window.CLINICAL_DATA?.planoCuidados?.complicacoesTardias?.titulo}</h3>
          <p style="font-size: 0.8rem; color: #5A121A; margin-bottom: 0.75rem;"><em>${window.CLINICAL_DATA?.planoCuidados?.complicacoesTardias?.apoio}</em></p>
          <ul style="padding-left: 1.25rem; font-size: 0.85rem; line-height: 1.5;">
            ${window.CLINICAL_DATA?.planoCuidados?.complicacoesTardias?.itens?.map(comp => `
              <li><strong>${comp.nome}:</strong> ${comp.desc}</li>
            `).join("")}
          </ul>
        </div>

        <!-- 4. O Que Aprendemos (Os 5 Para Fixar) -->
        <div style="text-align: left; margin: 1.5rem 0;">
          <h3 style="color: var(--navy-blue); margin-bottom: 0.75rem;">📌 Síntese das Lições do Caso</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${window.CLINICAL_DATA?.casoClinico?.etapas?.map((et, idx) => `
              <div class="card-para-fixar" style="margin: 0;">
                <span>Etapa ${idx + 1}:</span>
                <span>"${et.paraFixar}"</span>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Ações Finais -->
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
          <button class="btn btn-primary" id="btnJogarNovamente">🔄 Jogar Novamente</button>
          <button class="btn btn-secondary" id="btnVerCreditosEquipe">👥 Ver Equipe e Referências</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Eventos
    document.getElementById("btnJogarNovamente")?.addEventListener("click", () => {
      window.gameState.reiniciarCaso();
      this.iniciarCasoClinico();
    });

    document.getElementById("btnVerCreditosEquipe")?.addEventListener("click", () => {
      const secao = document.getElementById("secaoEquipeReferencias");
      secao?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Dispara confetes leves na tela
  dispararConfetes() {
    const container = document.createElement("div");
    container.className = "confetti-container";
    const cores = ["#E63946", "#2EC4B6", "#FFD166", "#1D2B53", "#FF85A1"];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
      container.appendChild(piece);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4500);
  }

  // ==========================================================================
  // MODAIS E MINI-ANIMAÇÕES PEDAGÓGICAS ("ENTENDA A SITUAÇÃO")
  // ==========================================================================
  abrirModalEntendaSituacao(etapaIndex) {
    const etapas = window.CLINICAL_DATA?.casoClinico?.etapas || [];
    const etapa = etapas[etapaIndex];
    if (!etapa) return;

    const animSvg = this.gerarMiniAnimacaoSvg(etapa.miniAnimacao);

    const corpoModal = `
      <div style="margin-bottom: 1rem;">
        <h4 style="color: var(--coral-red); margin-bottom: 0.35rem;">${etapa.miniAnimacaoTitulo}</h4>
        <p style="font-size: 0.95rem; line-height: 1.5;">${etapa.contexto}</p>
      </div>

      <div style="background: var(--bg-card-alt); border: 2px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; text-align: center; margin-bottom: 1rem;">
        ${animSvg}
        <p style="font-size: 0.85rem; color: var(--navy-blue); font-weight: 700; margin-top: 0.6rem;">${etapa.miniAnimacaoDesc}</p>
      </div>

      <div class="card-para-fixar" style="margin: 0.5rem 0 0;">
        <span>📌</span>
        <span>${etapa.paraFixar}</span>
      </div>
    `;

    this.abrirModalGenerico("💡 Entenda a Situação Clínica", corpoModal);
  }

  gerarMiniAnimacaoSvg(idAnim) {
    if (idAnim === "cinta-pelvica") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Bacia óssea estilizada -->
          <path d="M 50 40 Q 100 20 150 40 Q 170 70 140 90 Q 100 80 60 90 Q 30 70 50 40 Z" fill="#E2E8F0" stroke="#718096" stroke-width="3"/>
          <circle cx="85" cy="55" r="12" fill="#FFFFFF" stroke="#718096" stroke-width="2"/>
          <circle cx="115" cy="55" r="12" fill="#FFFFFF" stroke="#718096" stroke-width="2"/>
          <!-- Cinta fechando animada -->
          <rect x="40" y="58" width="120" height="16" rx="4" fill="#1D2B53" stroke="#2EC4B6" stroke-width="2"/>
          <line x1="30" y1="66" x2="170" y2="66" stroke="#FFD166" stroke-width="3" class="pelvic-belt-path"/>
          <text x="100" y="112" font-family="'Nunito', sans-serif" font-weight="800" font-size="10" fill="#1D2B53" text-anchor="middle">REDUÇÃO DE VOLUME DA PELVE</text>
        </svg>
      `;
    }

    if (idAnim === "triade-letal") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- 3 Engrenagens conectadas -->
          <g transform="translate(60, 45)" class="gear-cw">
            <circle cx="0" cy="0" r="22" fill="#48CAE4"/>
            <text x="0" y="4" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">HIPOTERMIA</text>
          </g>
          <g transform="translate(140, 45)" class="gear-ccw">
            <circle cx="0" cy="0" r="22" fill="#E63946"/>
            <text x="0" y="4" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">ACIDOSE</text>
          </g>
          <g transform="translate(100, 85)" class="gear-cw">
            <circle cx="0" cy="0" r="22" fill="#FFD166"/>
            <text x="0" y="4" font-size="6.5" font-weight="800" fill="#1D2B53" text-anchor="middle">COAGULOPATIA</text>
          </g>
        </svg>
      `;
    }

    if (idAnim === "fast-negativo") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Abdome Livre vs Retroperitônio -->
          <rect x="25" y="20" width="70" height="70" rx="8" fill="#EBF8FF" stroke="#3182CE" stroke-width="2"/>
          <text x="60" y="55" font-size="8.5" font-weight="800" fill="#2B6CB0" text-anchor="middle">PERITÔNIO</text>
          <text x="60" y="70" font-size="8" fill="#38A169" text-anchor="middle">FAST Negativo ✔</text>

          <rect x="105" y="20" width="70" height="70" rx="8" fill="#FFF5F5" stroke="#E53E3E" stroke-width="2"/>
          <text x="140" y="50" font-size="8" font-weight="800" fill="#9B2C2C" text-anchor="middle">RETROPERITÔNIO</text>
          <circle cx="140" cy="70" r="14" fill="#E63946" opacity="0.85"/>
          <text x="140" y="73" font-size="7" font-weight="800" fill="#FFFFFF" text-anchor="middle">SANGUE OCULTO</text>
        </svg>
      `;
    }

    if (idAnim === "transfusao-segura") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Bolsa + Pulseira + Duplo Check -->
          <rect x="35" y="25" width="40" height="60" rx="6" fill="#8B0000" stroke="#FFFFFF" stroke-width="2"/>
          <rect x="42" y="35" width="26" height="20" rx="2" fill="#FFFFFF"/>
          <text x="55" y="48" font-size="8" font-weight="800" fill="#8B0000" text-anchor="middle">CH O+</text>

          <rect x="110" y="45" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#1D2B53" stroke-width="2"/>
          <text x="137" y="59" font-size="8" font-weight="800" fill="#1D2B53" text-anchor="middle">LUCAS O+</text>

          <!-- Selo Dupla Checagem -->
          <circle cx="95" cy="55" r="14" fill="#2EC4B6"/>
          <text x="95" y="59" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✔✔</text>
          <text x="100" y="105" font-size="9" font-weight="800" fill="#1D2B53" text-anchor="middle">DUPLA CHECAGEM À BEIRA DO LEITO</text>
        </svg>
      `;
    }

    if (idAnim === "uretra") {
      return `
        <svg viewBox="0 0 200 120" width="200" height="120" style="margin: 0 auto; display: block;">
          <!-- Bexiga e Uretra com sinal de Pare -->
          <ellipse cx="100" cy="35" rx="30" ry="20" fill="#FEFCBF" stroke="#D69E2E" stroke-width="2"/>
          <line x1="100" y1="55" x2="100" y2="85" stroke="#E53E3E" stroke-width="5" stroke-dasharray="6 3"/>
          
          <!-- Placa de Pare -->
          <polygon points="100,68 115,75 115,90 100,97 85,90 85,75" fill="#E63946"/>
          <text x="100" y="86" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">PARE!</text>
          <text x="100" y="112" font-size="9" font-weight="800" fill="#E63946" text-anchor="middle">NÃO SONDAR ÀS CEGAS</text>
        </svg>
      `;
    }

    return `<div style="padding: 1rem; color: var(--navy-blue);">Conceito clínico chave ilustrado.</div>`;
  }

  // Modal genérico reutilizável
  abrirModalGenerico(titulo, conteudoHtml) {
    const backdrop = document.getElementById("modalBackdrop");
    const tituloEl = document.getElementById("modalHeaderTitle");
    const corpoEl = document.getElementById("modalBodyContent");

    if (!backdrop || !tituloEl || !corpoEl) return;

    tituloEl.textContent = titulo;
    corpoEl.innerHTML = conteudoHtml;

    backdrop.classList.add("open");
    backdrop.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  fecharModal() {
    const backdrop = document.getElementById("modalBackdrop");
    if (backdrop) {
      backdrop.classList.remove("open");
      backdrop.setAttribute("hidden", "true");
      document.body.style.overflow = "";
    }
  }

  // Modal Consulta Rápida (Glossário + Tabela das 4 Classes)
  abrirModalConsultaRapida() {
    const cr = window.CLINICAL_DATA?.consultaRapida;
    if (!cr) return;

    const html = `
      <div class="modal-tabs">
        <button class="tab-btn active" id="tabBtnGlossario">📖 Glossário de Termos</button>
        <button class="tab-btn" id="tabBtnClassesHemo">📊 Classes de Hemorragia</button>
      </div>

      <!-- Conteúdo da Aba 1: Glossário -->
      <div id="tabConteudoGlossario" style="margin-top: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          ${cr.glossario.map(g => `
            <div style="background: var(--bg-card-alt); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm); border-left: 3px solid var(--coral-red);">
              <strong style="color: var(--navy-blue); font-size: 0.95rem;">${g.termo}:</strong>
              <p style="font-size: 0.85rem; margin: 0.15rem 0 0; line-height: 1.4;">${g.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Conteúdo da Aba 2: Classes de Hemorragia -->
      <div id="tabConteudoClassesHemo" style="margin-top: 1rem; display: none;">
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;"><em>${cr.classesHemorragia.nota}</em></p>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
            <thead>
              <tr style="background: var(--navy-blue); color: #FFFFFF;">
                <th style="padding: 0.5rem;">Classe</th>
                <th style="padding: 0.5rem;">Perda Sanguínea</th>
                <th style="padding: 0.5rem;">FC (bpm)</th>
                <th style="padding: 0.5rem;">PA</th>
                <th style="padding: 0.5rem;">FR (irpm)</th>
                <th style="padding: 0.5rem;">Sensório</th>
              </tr>
            </thead>
            <tbody>
              ${cr.classesHemorragia.tabela.map((row, i) => `
                <tr style="background: ${i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-card-alt)'}; border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.5rem; font-weight: 700; color: var(--coral-red);">${row.classe}</td>
                  <td style="padding: 0.5rem;">${row.perda}</td>
                  <td style="padding: 0.5rem;">${row.fc}</td>
                  <td style="padding: 0.5rem;">${row.pa}</td>
                  <td style="padding: 0.5rem;">${row.fr}</td>
                  <td style="padding: 0.5rem;">${row.mental}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.abrirModalGenerico("🔍 Consulta Rápida da Sala Vermelha", html);

    // Abas
    document.getElementById("tabBtnGlossario")?.addEventListener("click", () => {
      document.getElementById("tabBtnGlossario").classList.add("active");
      document.getElementById("tabBtnClassesHemo").classList.remove("active");
      document.getElementById("tabConteudoGlossario").style.display = "block";
      document.getElementById("tabConteudoClassesHemo").style.display = "none";
    });

    document.getElementById("tabBtnClassesHemo")?.addEventListener("click", () => {
      document.getElementById("tabBtnClassesHemo").classList.add("active");
      document.getElementById("tabBtnGlossario").classList.remove("active");
      document.getElementById("tabConteudoClassesHemo").style.display = "block";
      document.getElementById("tabConteudoGlossario").style.display = "none";
    });
  }

  // Modal Como Jogar
  abrirModalComoJogar() {
    const html = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <h4 style="color: var(--coral-red); margin-bottom: 0.4rem;">Bem-vindo(a) ao Plantão da Sala Vermelha!</h4>
        <p>Este aplicativo interativo foi desenvolvido para o seminário de <strong>Patologia Geral do 4º período de Enfermagem da FAC</strong>, orientado pela <strong>Profa. Paula Silveira</strong>.</p>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin: 1rem 0;">
          <div style="background: var(--bg-card-alt); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--aqua-green);">
            <strong>1. Trilha de Aprendizado (6 Paradas):</strong>
            <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">Descubra a definição, etiologia, fisiopatologia, sinais clínicos, exames diagnósticos e a prioridade do XABCDE com minijogos práticos.</p>
          </div>

          <div style="background: var(--bg-card-alt); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--coral-red);">
            <strong>2. Caso Clínico Interativo (O Jogo):</strong>
            <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">Você atende Lucas (28a), vítima de politrauma com fratura pélvica instável. Suas condutas alteram os sinais vitais, cor da pele, hematoma e volume em tempo real!</p>
          </div>

          <div style="background: var(--bg-card-alt); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--yellow-dark);">
            <strong>3. Dicas da Gota:</strong>
            <p style="margin: 0.2rem 0 0; font-size: 0.85rem;">Você dispõe de 2 dicas por partida. Cada dica descarta uma conduta arriscada e fornece uma pista clínica valiosa.</p>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0;">
          ⌨️ <strong>Teclas de Atalho no Seminário:</strong> Use [←] e [→] para navegar e [F] para tela cheia.
        </p>
      </div>
    `;
    this.abrirModalGenerico("ℹ️ Como Funciona a Sala Vermelha", html);
  }

  // Renderiza a seção de equipe, referências e aviso legal
  renderEquipeEReferencias() {
    const container = document.getElementById("secaoEquipeReferencias");
    if (!container) return;

    const eq = window.CLINICAL_DATA?.equipe;
    const refs = window.CLINICAL_DATA?.referencias;
    const aviso = window.CLINICAL_DATA?.avisoAcademico;

    const html = `
      <div class="section-equipe-wrapper">
        <h2 class="section-title">Quem Faz a Sala Vermelha</h2>
        <p class="section-subtitle">Seminário Tipos de Choque • Enfermagem (4º período) • FAC Curvelo</p>

        <!-- Banner Institucional da Faculdade -->
        <div class="faculdade-banner">
          <img src="assets/logo-faculdade.png" alt="FAC — Faculdade Arquidiocesana de Curvelo" class="logo-fac-img" onerror="this.onerror=null; this.src='assets/logo-faculdade.svg';">
          <div style="text-align: left;">
            <h4 style="color: var(--navy-blue); margin-bottom: 0.1rem;">FAC — Faculdade Arquidiocesana de Curvelo</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0;">Curso de Bacharelado em Enfermagem • Curvelo, MG</p>
          </div>
        </div>

        <!-- Card da Professora Orientadora -->
        <div class="orientadora-card">
          <div class="orientadora-avatar">
            <img src="${eq.orientadora.foto}" alt="${eq.orientadora.nome}" onerror="this.onerror=null; this.parentElement.innerHTML='${eq.orientadora.iniciais}';">
          </div>
          <div>
            <span class="btn-text-badge" style="font-size: 0.75rem; margin-bottom: 0.25rem;">${eq.orientadora.titulacao}</span>
            <h3 style="color: var(--navy-blue); font-size: 1.25rem; margin-bottom: 0.2rem;">${eq.orientadora.nome}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0;">Disciplina: ${eq.orientadora.disciplina}</p>
          </div>
        </div>

        <!-- Grade com os 7 Alunos da Equipe -->
        <h3 style="text-align: center; color: var(--navy-blue); margin-bottom: 1.25rem;">Integrantes da Equipe</h3>
        <div class="equipe-grid">
          ${eq.integrantes.map(m => `
            <div class="membro-card">
              <div class="membro-avatar">
                <img src="${m.foto}" alt="${m.nome}" onerror="this.onerror=null; this.parentElement.innerHTML='${m.iniciais}';">
              </div>
              <div class="membro-info">
                <h4>${m.nome}</h4>
                <p>${m.curso}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Referências em ABNT -->
        <div class="referencias-box">
          <h3>📚 Referências Bibliográficas (ABNT)</h3>
          <ul class="referencias-lista">
            ${refs.map(r => `
              <li><strong>[${r.tipo}]</strong> ${r.citacao}</li>
            `).join("")}
          </ul>
        </div>

        <!-- Aviso Acadêmico -->
        <div class="aviso-academico-card">
          <strong>⚖️ Aviso Acadêmico e Institucional:</strong><br>
          ${aviso}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.uiManager = new UIManager();
}
