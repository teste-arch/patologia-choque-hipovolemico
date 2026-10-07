/**
 * STATE.JS — Gerenciador de estado reativo do jogo e da trilha
 * Sala Vermelha: Choque Hipovolêmico
 */

class GameState {
  constructor() {
    this.listeners = [];
    this.storageKey = "sala_vermelha_pref_v1";

    // Configurações padrão e preferências salvas
    this.prefs = this.loadPreferences();

    // Estado geral
    this.nomeJogador = this.prefs.nomeJogador || "";
    this.trilhaConcluida = new Set(this.prefs.trilhaConcluida || []);
    
    // Estado do Caso Clínico
    this.etapaAtualIndex = 0; // 0 a 4 (5 etapas)
    this.pontos = 0;
    this.dicasRestantes = 2;
    this.dicasUsadas = 0;
    this.historicoEscolhas = []; // [{ etapa, opcaoId, tipo, pontos, deltas }]
    this.cintaPelvicaAplicada = false;
    this.mantaTermicaAplicada = false;
    this.transfusaoIniciada = false;

    // Estado do Paciente Lucas
    this.paciente = this.getInitialPatientState();
    this.pacienteAnterior = { ...this.paciente };

    // Finais e status
    this.jogoFinalizado = false;
    this.resultadoFinal = null; // { finalId, titulo, estrelas, ... }
  }

  getClinicalData() {
    if (typeof window !== "undefined" && window.CLINICAL_DATA) return window.CLINICAL_DATA;
    if (typeof globalThis !== "undefined" && globalThis.CLINICAL_DATA) return globalThis.CLINICAL_DATA;
    return null;
  }

  getInitialPatientState() {
    const data = this.getClinicalData();
    const init = data?.paciente?.estadoInicial || {
      fc: 128,
      pas: 88,
      fr: 26,
      spo2: 94,
      perfusao: 40,
      consciencia: 85,
      volume: 55,
      temperatura: 75,
      sangramento: 70
    };
    return { ...init };
  }

  // Clamping seguro nos intervalos clínicos definidos
  clamp(valor, min, max) {
    return Math.max(min, Math.min(max, Math.round(valor)));
  }

  // Aplica deltas das escolhas com regras de hemostasia e aquecimento
  aplicarEfeitos(deltas, opcaoId) {
    this.pacienteAnterior = { ...this.paciente };

    // Se a etapa 1 selecionou a conduta da cinta pélvica
    if (opcaoId === "1A") this.cintaPelvicaAplicada = true;
    if (opcaoId === "1C") this.cintaPelvicaAplicada = false;
    if (opcaoId === "1A" || opcaoId === "2A" || opcaoId === "3A") this.mantaTermicaAplicada = true;
    if (opcaoId === "3A" || opcaoId === "4A") this.transfusaoIniciada = true;

    this.paciente.fc = this.clamp(this.paciente.fc + (deltas.fc || 0), 40, 180);
    this.paciente.pas = this.clamp(this.paciente.pas + (deltas.pas || 0), 40, 140);
    this.paciente.fr = this.clamp(this.paciente.fr + (deltas.fr || 0), 8, 40);
    this.paciente.spo2 = this.clamp(this.paciente.spo2 + (deltas.spo2 || 0), 70, 100);
    this.paciente.perfusao = this.clamp(this.paciente.perfusao + (deltas.perfusao || 0), 0, 100);
    this.paciente.consciencia = this.clamp(this.paciente.consciencia + (deltas.consciencia || 0), 0, 100);
    this.paciente.volume = this.clamp(this.paciente.volume + (deltas.volume || 0), 0, 100);
    this.paciente.temperatura = this.clamp(this.paciente.temperatura + (deltas.temperatura || 0), 0, 100);
    this.paciente.sangramento = this.clamp(this.paciente.sangramento + (deltas.sangramento || 0), 0, 100);

    this.notify();
  }

  // PA Diastólica calculada didaticamente
  get pad() {
    return Math.round(this.paciente.pas * 0.6);
  }

  // Registra a escolha da etapa e computa pontos
  registrarEscolha(etapaIndex, opcao) {
    const pontosGanhos = opcao.pontos ?? (opcao.tipo === "correta" ? 2 : opcao.tipo === "parcial" ? 1 : 0);
    this.pontos += pontosGanhos;

    const registro = {
      etapaIndex,
      opcaoId: opcao.id,
      tipo: opcao.tipo,
      pontos: pontosGanhos,
      deltas: opcao.efeitos,
      estadoAntes: { ...this.pacienteAnterior },
      estadoDepois: { ...this.paciente }
    };

    this.historicoEscolhas.push(registro);
    this.notify();
    return registro;
  }

  // Uso de dica da Gota (máximo 2 por partida)
  usarDica() {
    if (this.dicasRestantes > 0) {
      this.dicasRestantes--;
      this.dicasUsadas++;
      this.notify();
      return true;
    }
    return false;
  }

  // Cálculo rigoroso do Final do Caso (avaliado na ordem exata da Seção 6.2)
  calcularFinal() {
    const data = this.getClinicalData();
    const limiares = data?.paciente?.limiaresFinais || {
      final3: { pontosMax: 3, volumeMin: 30, perfusaoMin: 20 },
      final1: { pontosMin: 8, volumeMin: 70, perfusaoMin: 55, sangramentoMax: 40 }
    };
    const finaisData = data?.finais || {};

    let finalChave = "final2";
    let estrelasBase = 2;

    // Regra 1: Final 3 (Evolução desfavorável)
    if (
      this.pontos <= limiares.final3.pontosMax ||
      this.paciente.volume < limiares.final3.volumeMin ||
      this.paciente.perfusao < limiares.final3.perfusaoMin
    ) {
      finalChave = "final3";
      estrelasBase = 1;
    }
    // Regra 2: Final 1 (Estabilizado)
    else if (
      this.pontos >= limiares.final1.pontosMin &&
      this.paciente.volume >= limiares.final1.volumeMin &&
      this.paciente.perfusao >= limiares.final1.perfusaoMin &&
      this.paciente.sangramento <= limiares.final1.sangramentoMax
    ) {
      finalChave = "final1";
      estrelasBase = 3;
    }
    // Regra 3: Final 2 (Grave, porém vivo)
    else {
      finalChave = "final2";
      estrelasBase = 2;
    }

    // Cálculo das estrelas com penalidade de dicas usadas (desconta no máximo 1 estrela)
    let estrelasFinais = estrelasBase;
    if (this.dicasUsadas > 0 && estrelasFinais > 1) {
      estrelasFinais -= 1;
    }

    this.jogoFinalizado = true;
    this.resultadoFinal = {
      ...finaisData[finalChave],
      chave: finalChave,
      estrelas: estrelasFinais,
      estrelasBase,
      pontos: this.pontos,
      maxPontos: 10,
      dicasUsadas: this.dicasUsadas,
      paciente: { ...this.paciente }
    };

    // Salvar melhor resultado
    this.saveBestResult(this.resultadoFinal);
    this.notify();
    return this.resultadoFinal;
  }

  // Reiniciar partida do Caso Clínico
  reiniciarCaso() {
    this.etapaAtualIndex = 0;
    this.pontos = 0;
    this.dicasRestantes = 2;
    this.dicasUsadas = 0;
    this.historicoEscolhas = [];
    this.cintaPelvicaAplicada = false;
    this.mantaTermicaAplicada = false;
    this.transfusaoIniciada = false;
    this.jogoFinalizado = false;
    this.resultadoFinal = null;
    this.paciente = this.getInitialPatientState();
    this.pacienteAnterior = { ...this.paciente };
    this.notify();
  }

  // Marcar parada teórica como concluída
  concluirParadaTrilha(paradaId) {
    this.trilhaConcluida.add(paradaId);
    this.savePreferences();
    this.notify();
  }

  isParadaConcluida(paradaId) {
    return this.trilhaConcluida.has(paradaId);
  }

  // Embaralhar opções sem alterar id (Fisher-Yates)
  embaralharOpcoes(opcoes) {
    const copias = [...opcoes];
    for (let i = copias.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copias[i], copias[j]] = [copias[j], copias[i]];
    }
    return copias;
  }

  // Sistema de Observadores / Reatividade
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this);
      } catch (err) {
        console.error("Erro no listener de estado:", err);
      }
    });
  }

  // Persistência com tratamento seguro de localStorage
  loadPreferences() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Aviso: localStorage inacessível ou desabilitado.");
    }
    return {
      nomeJogador: "",
      somAtivo: false,
      animacoesReduzidas: false,
      modoApresentacao: false,
      trilhaConcluida: []
    };
  }

  savePreferences() {
    try {
      const data = {
        nomeJogador: this.nomeJogador,
        somAtivo: this.prefs.somAtivo,
        animacoesReduzidas: this.prefs.animacoesReduzidas,
        modoApresentacao: this.prefs.modoApresentacao,
        trilhaConcluida: Array.from(this.trilhaConcluida)
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      // Ignora falhas de gravação em modo anônimo
    }
  }

  saveBestResult(resultado) {
    try {
      const chaveMelhor = "sala_vermelha_melhor_resultado";
      const atual = JSON.parse(localStorage.getItem(chaveMelhor) || "null");
      if (!atual || resultado.pontos > atual.pontos || (resultado.pontos === atual.pontos && resultado.estrelas > atual.estrelas)) {
        localStorage.setItem(chaveMelhor, JSON.stringify({
          pontos: resultado.pontos,
          estrelas: resultado.estrelas,
          chave: resultado.chave,
          data: new Date().toLocaleDateString("pt-BR")
        }));
      }
    } catch (e) {}
  }
}

// Exportação global
if (typeof window !== "undefined") {
  window.gameState = new GameState();
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameState;
}
