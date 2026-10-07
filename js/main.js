/**
 * MAIN.JS — Orquestrador principal da aplicação Sala Vermelha
 * Inicialização, escuta de eventos globais, atalhos do seminário e ciclo de vida
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar renderizadores
  window.patientRenderer = new PatientRenderer("patientSceneBox");
  window.vitalMonitor = new VitalMonitor("vitalMonitorPanel", "ecgCanvasMonitor");

  // Inscrever monitor e paciente nas mudanças de estado
  window.gameState.subscribe((state) => {
    window.uiManager?.atualizarBarraProgresso();
    if (window.uiManager?.telaAtualId === "telaCasoClinico") {
      window.patientRenderer?.render(state);
      window.vitalMonitor?.update(state);
    }
  });

  // 2. Renderizar equipe e referências no rodapé
  window.uiManager.renderEquipeEReferencias();

  // 3. Restaurar preferências salvas
  restaurarPreferencias();

  // 4. Vincular eventos dos botões da Home e do Cabeçalho
  bindGlobalEvents();

  // 5. Inicializar na Tela Home
  window.uiManager.mostrarTela("telaHome");
});

function restaurarPreferencias() {
  const nomeInput = document.getElementById("inputNomeEnfermeiro");
  if (nomeInput && window.gameState.nomeJogador) {
    nomeInput.value = window.gameState.nomeJogador;
  }

  // Restaurar modo apresentação se estava ativo
  if (window.gameState.prefs?.modoApresentacao) {
    document.body.classList.add("modo-apresentacao");
    document.getElementById("btnToggleApresentacao")?.classList.add("active");
  }

  // Restaurar som
  if (window.gameState.prefs?.somAtivo) {
    window.vitalMonitor.toggleAudio(true);
    const btnSom = document.getElementById("btnToggleAudio");
    if (btnSom) btnSom.textContent = "🔊";
  }
}

function bindGlobalEvents() {
  // Navegação da Marca / Logo
  document.getElementById("brandLogoLink")?.addEventListener("click", () => {
    window.uiManager.mostrarTela("telaHome");
  });

  // Botões do Cabeçalho
  document.getElementById("btnNavMapa")?.addEventListener("click", () => {
    window.uiManager.mostrarTela("telaMapaTrilha");
  });

  document.getElementById("btnNavConsultaRapida")?.addEventListener("click", () => {
    window.uiManager.abrirModalConsultaRapida();
  });

  // Alternador de Som (Bip do Monitor)
  const btnAudio = document.getElementById("btnToggleAudio");
  btnAudio?.addEventListener("click", () => {
    const ativo = window.vitalMonitor.toggleAudio();
    btnAudio.textContent = ativo ? "🔊" : "🔇";
    window.gameState.prefs.somAtivo = ativo;
    window.gameState.savePreferences();
  });

  // Alternador de Tema Claro / Escuro
  document.getElementById("btnToggleTema")?.addEventListener("click", () => {
    const atual = document.documentElement.getAttribute("data-theme");
    const novo = atual === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", novo);
    localStorage.setItem("sala_vermelha_tema", novo);
  });

  // Alternador do Modo Apresentação (Projetor 16:9)
  const btnApres = document.getElementById("btnToggleApresentacao");
  const alternarModoApresentacao = () => {
    const ativo = document.body.classList.toggle("modo-apresentacao");
    btnApres?.classList.toggle("active", ativo);
    window.gameState.prefs.modoApresentacao = ativo;
    window.gameState.savePreferences();
  };
  btnApres?.addEventListener("click", alternarModoApresentacao);
  document.getElementById("btnHeroApresentacao")?.addEventListener("click", alternarModoApresentacao);

  // Botões da Tela Inicial (Hero)
  const nomeInput = document.getElementById("inputNomeEnfermeiro");
  const salvarNome = () => {
    if (nomeInput) {
      window.gameState.nomeJogador = nomeInput.value.trim();
      window.gameState.savePreferences();
    }
  };

  document.getElementById("btnHeroIniciarTrilha")?.addEventListener("click", () => {
    salvarNome();
    window.uiManager.mostrarTela("telaMapaTrilha");
  });

  document.getElementById("btnHeroPularCaso")?.addEventListener("click", () => {
    salvarNome();
    window.uiManager.iniciarCasoClinico();
  });

  document.getElementById("btnHeroComoJogar")?.addEventListener("click", () => {
    window.uiManager.abrirModalComoJogar();
  });

  document.getElementById("btnHeroConsultaRapida")?.addEventListener("click", () => {
    window.uiManager.abrirModalConsultaRapida();
  });

  // Eventos do Caso Clínico
  document.getElementById("btnEntendaSituacao")?.addEventListener("click", () => {
    window.uiManager.abrirModalEntendaSituacao(window.gameState.etapaAtualIndex);
  });

  document.getElementById("btnUsarDicaGota")?.addEventListener("click", () => {
    window.uiManager.acionarDicaGota();
  });

  // Fechamento de Modais
  document.getElementById("modalBtnClose")?.addEventListener("click", () => {
    window.uiManager.fecharModal();
  });

  document.getElementById("modalBtnOk")?.addEventListener("click", () => {
    window.uiManager.fecharModal();
  });

  document.getElementById("modalBackdrop")?.addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") {
      window.uiManager.fecharModal();
    }
  });

  // Atalhos de Teclado (Acessibilidade e Seminário)
  document.addEventListener("keydown", (e) => {
    // Tecla Esc fecha modais
    if (e.key === "Escape") {
      window.uiManager.fecharModal();
      return;
    }

    // Tecla F alterna fullscreen
    if ((e.key === "f" || e.key === "F") && !isInputElement(e.target)) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }

    // Teclas de seta no Modo Apresentação ou Trilha
    if (e.key === "ArrowRight" && !isInputElement(e.target)) {
      navegarParaFrente();
    } else if (e.key === "ArrowLeft" && !isInputElement(e.target)) {
      navegarParaTras();
    }
  });
}

function isInputElement(el) {
  return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

function navegarParaFrente() {
  if (window.uiManager.telaAtualId === "telaParadaTeorica") {
    if (window.trilhaManager.paradaAtual < 6) {
      window.trilhaManager.renderParada(window.trilhaManager.paradaAtual + 1);
    } else {
      window.uiManager.iniciarCasoClinico();
    }
  } else if (window.uiManager.telaAtualId === "telaHome") {
    window.uiManager.mostrarTela("telaMapaTrilha");
  }
}

function navegarParaTras() {
  if (window.uiManager.telaAtualId === "telaParadaTeorica") {
    if (window.trilhaManager.paradaAtual > 1) {
      window.trilhaManager.renderParada(window.trilhaManager.paradaAtual - 1);
    } else {
      window.uiManager.mostrarTela("telaMapaTrilha");
    }
  }
}
