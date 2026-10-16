import { memo, useEffect, useState, useRef } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Droplets,
  GraduationCap,
  Home,
  Info,
  ListChecks,
  PanelLeftClose,
  Presentation,
  Search,
  Stethoscope,
  Users,
  Volume2,
  VolumeX,
  Trophy,
  Sparkles,
  Play,
  User,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import screens from "@/lib/sala/screens.html?raw";
import { ConteudoInterativo } from "@/components/conteudo-interativo";
import { GamificacaoHub } from "@/components/gamificacao-hub";
import { GameHud } from "@/components/game-hud";
import { getPlayerNick, formatTime } from "@/lib/ranking";

type SalaRuntime = Window & {
  initializeSala?: () => void;
  uiManager?: {
    mostrarTela: (id: string) => void;
    iniciarCasoClinico: () => void;
    abrirModalConsultaRapida: () => void;
    abrirModalComoJogar: () => void;
    fecharModal: () => void;
  };
  gameState?: {
    nomeJogador: string;
    pontos: number;
    prefs: { modoApresentacao?: boolean; somAtivo?: boolean };
    savePreferences: () => void;
    resultadoFinal?: { estrelas?: number; chave?: string };
    listeners: unknown[];
  };
  vitalMonitor?: {
    toggleAudio: (enabled?: boolean) => boolean;
    animFrameId?: number;
    bipTimer?: number;
    audioCtx?: AudioContext;
    startEcgLoop: () => void;
  };
  trilhaManager?: {
    renderParada: (id: number) => void;
  };
  salaKeyHandler?: EventListener;
};

let runtimePromise: Promise<void> | undefined;
function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/sala/runtime.js";
      script.onload = () => resolve();
      script.onerror = () => {
        runtimePromise = undefined;
        reject(new Error("Não foi possível carregar as atividades."));
      };
      document.body.appendChild(script);
    });
  }
  return runtimePromise;
}

function runtime() {
  return window as SalaRuntime;
}

const LegacyActivities = memo(function LegacyActivities() {
  return <div dangerouslySetInnerHTML={{ __html: screens }} />;
});

export function SalaPlantao() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [screen, setScreen] = useState("telaHome");
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [audio, setAudio] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [progress, setProgress] = useState("0 de 7 etapas (0%)");

  // Abas principais
  // "home" | "conteudo" | "gamificacao" | "caso" | "legado"
  const [activeTab, setActiveTab] = useState<
    "home" | "conteudo" | "gamificacao" | "caso" | "legado"
  >("home");

  // Dados da sala temporária ativa
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);

  // Pontuação concluída do caso clínico para submissão à sala
  const [completedCasoScore, setCompletedCasoScore] = useState<{
    score: number;
    clinical: number;
    timeBonus: number;
    timeSeconds: number;
    stars: number;
  } | null>(null);

  // Controle do Cronômetro & Gamificação
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [lastGameScore, setLastGameScore] = useState<{
    score: number;
    clinical: number;
    timeBonus: number;
    timeSeconds: number;
  } | null>(null);

  const gameStartTimeRef = useRef<number | null>(null);
  gameStartTimeRef.current = gameStartTime;
  const activeRoomCodeRef = useRef<string | null>(null);
  activeRoomCodeRef.current = activeRoomCode;
  const activeParticipantIdRef = useRef<string | null>(null);
  activeParticipantIdRef.current = activeParticipantId;

  useEffect(() => {
    let mounted = true;

    // Carrega o nick salvo se já existir de uma sessão prévia (sem abrir nenhum modal bloqueante!)
    const storedNick = getPlayerNick();
    if (storedNick) {
      setName(storedNick);
    }

    const onScreen = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setScreen(id);

      if (id === "telaCasoClinico") {
        setActiveTab("caso");
      } else if (id === "telaFinalCaso") {
        setActiveTab("caso");

        // Salvar resultado do caso clínico com cronômetro se veio do START da sala
        if (gameStartTimeRef.current) {
          const now = Date.now();
          const elapsed = Math.max(15, Math.floor((now - gameStartTimeRef.current) / 1000));
          const timeBonus = Math.max(50, Math.floor(500 - elapsed * 2));
          const pontosClinicosRaw = runtime().gameState?.pontos ?? 8;
          const clinicalScore = Math.min(1000, pontosClinicosRaw * 100);
          const totalScore = clinicalScore + timeBonus;
          const stars = runtime().gameState?.resultadoFinal?.estrelas ?? 3;

          const scorePayload = {
            score: totalScore,
            clinical: clinicalScore,
            timeBonus,
            timeSeconds: elapsed,
            stars,
          };

          setLastGameScore(scorePayload);
          setCompletedCasoScore(scorePayload);
          setGameStartTime(null);
        }
      } else if (id === "telaMapaTrilha" || id === "telaParadaTeorica") {
        setActiveTab("legado");
      }
    };

    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ concluidas: number; percent: number }>).detail;
      setProgress(`${detail.concluidas} de 7 etapas (${detail.percent}%)`);
    };

    window.addEventListener("sala-screen", onScreen);
    window.addEventListener("sala-progress", onProgress);

    loadRuntime()
      .then(() => {
        if (!mounted) return;
        runtime().initializeSala?.();
        const initialNick = getPlayerNick() || runtime().gameState?.nomeJogador || "";
        if (initialNick) {
          setName(initialNick);
          if (runtime().gameState) {
            runtime().gameState.nomeJogador = initialNick;
          }
        }
        setReady(true);
        setPresentation(document.body.classList.contains("modo-apresentacao"));
        setAudio(runtime().gameState?.prefs.somAtivo ?? false);
      })
      .catch(() => {
        if (mounted) setError(true);
      });

    return () => {
      mounted = false;
      window.removeEventListener("sala-screen", onScreen);
      window.removeEventListener("sala-progress", onProgress);
      const app = runtime();
      if (app.salaKeyHandler) document.removeEventListener("keydown", app.salaKeyHandler);
      if (app.vitalMonitor?.animFrameId) cancelAnimationFrame(app.vitalMonitor.animFrameId);
      if (app.vitalMonitor?.bipTimer) clearInterval(app.vitalMonitor.bipTimer);
      app.vitalMonitor?.audioCtx?.close();
      if (app.gameState) app.gameState.listeners = [];
      document.body.classList.remove("modo-apresentacao");
      document.body.style.overflow = "";
    };
  }, []);

  function startCaseWithTimer(startTime: number, roomCode: string, participantId: string) {
    setGameStartTime(startTime);
    setActiveRoomCode(roomCode);
    setActiveParticipantId(participantId);
    setCompletedCasoScore(null);
    setLastGameScore(null);

    const cleanNick = name.trim() || getPlayerNick() || "Plantonista";
    if (runtime().gameState) {
      runtime().gameState.nomeJogador = cleanNick;
      runtime().gameState.savePreferences();
    }
    setActiveTab("caso");
    runtime().uiManager?.iniciarCasoClinico();
    const monitor = runtime().vitalMonitor;
    if (monitor && !monitor.animFrameId) monitor.startEcgLoop();
  }

  function navigateToTab(
    tab: "home" | "conteudo" | "gamificacao" | "caso" | "legado"
  ) {
    setActiveTab(tab);

    if (tab === "home") {
      runtime().uiManager?.mostrarTela("telaHome");
    } else if (tab === "conteudo" || tab === "gamificacao") {
      // Oculta telas do runtime para exibir componentes React
      const screensEls = document.querySelectorAll(".screen");
      screensEls.forEach((el) => {
        el.classList.remove("active");
        el.setAttribute("hidden", "true");
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function showTeam() {
    document.getElementById("secaoEquipeReferencias")?.scrollIntoView({ behavior: "smooth" });
  }

  function togglePresentation() {
    const enabled = document.body.classList.toggle("modo-apresentacao");
    setPresentation(enabled);
    const state = runtime().gameState;
    if (state) {
      state.prefs.modoApresentacao = enabled;
      state.savePreferences();
    }
  }

  // Lista de navegação lateral (Conteúdo 100% Livre + Jogos em Salas)
  const nav = [
    {
      label: "Visão Geral",
      icon: Home,
      active: activeTab === "home",
      action: () => navigateToTab("home"),
    },
    {
      label: "📚 Conteúdo Interativo",
      icon: BookOpen,
      active: activeTab === "conteudo",
      action: () => navigateToTab("conteudo"),
    },
    {
      label: "🎮 Jogos em Salas",
      icon: Stethoscope,
      active: activeTab === "gamificacao" || activeTab === "caso",
      action: () => navigateToTab("gamificacao"),
    },
    {
      label: "Trilha das 7 Etapas",
      icon: ListChecks,
      active: activeTab === "legado",
      action: () => {
        setActiveTab("legado");
        runtime().uiManager?.mostrarTela("telaMapaTrilha");
      },
    },
    {
      label: "Consulta Rápida",
      icon: Search,
      active: false,
      action: () => runtime().uiManager?.abrirModalConsultaRapida(),
    },
    {
      label: "Equipe e Referências",
      icon: Users,
      active: false,
      action: showTeam,
    },
  ];

  return (
    <div className={`plantao-shell${collapsed ? " is-collapsed" : ""}`}>
      {/* Menu Lateral */}
      <aside className="plantao-sidebar" aria-label="Menu principal">
        <div className="brand">
          <div className="brand-mark">
            <Droplets size={26} strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-name">
              SALA
              <br />
              VERMELHA
            </div>
            <div className="brand-caption">PATOLOGIA GERAL · FAC</div>
          </div>
        </div>

        {/* Crachá Informativo se houver sessão de sala ativa */}
        {(name || activeRoomCode) && (
          <div className="mb-6 p-3 rounded-xl bg-card/10 border border-white/10 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-sidebar-muted block">
                {activeRoomCode ? `Sala: ${activeRoomCode}` : "Plantonista"}
              </span>
              <span className="font-bold text-white truncate block">
                {name ? `Enf. ${name}` : "Sessão Aberta"}
              </span>
            </div>
            <span className="text-emerald-400 text-xs font-bold">●</span>
          </div>
        )}

        <p className="sidebar-label">Navegação do Plantão</p>
        <nav className="sidebar-nav">
          {nav.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="sidebar-button"
              data-active={item.active}
              aria-current={item.active ? "page" : undefined}
              title={item.label}
              disabled={!ready}
              onClick={item.action}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        <div className="sidebar-institution">
          <div className="bg-white/95 p-2 rounded-xl mb-3 shadow-xs inline-block">
            <img
              src="https://raw.githubusercontent.com/teste-arch/conte-do/main/FAC%20logo.png"
              alt="FAC — Faculdade Arquidiocesana de Curvelo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/fac-logo.png";
              }}
            />
          </div>
          <p>
            FAC — Faculdade
            <br />
            Arquidiocesana de Curvelo
          </p>
          <span>
            Enfermagem · 4º período
            <br />
            Curvelo, MG
          </span>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="plantao-main">
        {/* Topbar */}
        <header className="plantao-topbar">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              <PanelLeftClose />
            </Button>

            {/* Crachá no Topbar se houver sala ativa */}
            {activeRoomCode && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
                <Users size={13} />
                <span>SALA {activeRoomCode}</span>
                {name && <span className="opacity-80">· Enf. {name}</span>}
              </div>
            )}
          </div>

          <div className="progress-block">
            <div className="progress-heading">
              <span>PROGRESSO DO MÓDULO</span>
              <span id="trilhaProgressText">{progress}</span>
            </div>
            <div className="progress-track">
              <div id="trilhaProgressFill" className="progress-fill" />
            </div>
          </div>

          <div className="topbar-tools">
            <Button
              variant="outline"
              size="icon"
              disabled={!ready}
              title={audio ? "Silenciar monitor" : "Ativar som do monitor"}
              aria-label={audio ? "Silenciar monitor" : "Ativar som do monitor"}
              onClick={() => {
                const enabled = runtime().vitalMonitor?.toggleAudio() ?? false;
                setAudio(enabled);
                const state = runtime().gameState;
                if (state) {
                  state.prefs.somAtivo = enabled;
                  state.savePreferences();
                }
              }}
            >
              {audio ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button
              variant={presentation ? "secondary" : "default"}
              disabled={!ready}
              onClick={togglePresentation}
              aria-pressed={presentation}
              title="Modo apresentação"
            >
              <Presentation />
              <span>Modo aula</span>
            </Button>
          </div>
        </header>

        {/* HUD Flutuante com Cronômetro e Bônus de Velocidade quando o caso estiver rodando */}
        <GameHud
          isActive={activeTab === "caso" && screen === "telaCasoClinico" && !!gameStartTime}
          startTime={gameStartTime}
          playerNick={name}
          roomCode={activeRoomCode || undefined}
          onQuit={() => {
            setGameStartTime(null);
            navigateToTab("gamificacao");
          }}
        />

        {/* BANNER COMEMORATIVO DE PONTUAÇÃO NO FIM DO CASO */}
        {activeTab === "caso" && screen === "telaFinalCaso" && lastGameScore && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-card to-emerald-500/20 border-2 border-amber-400 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-down">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl shadow-md">
                🏆
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-600 block">
                  Plantão Concluído com Sucesso!
                </span>
                <h3 className="text-2xl font-black text-foreground font-display">
                  Sua Pontuação: {lastGameScore.score} pts
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock size={12} className="text-primary" />
                    Tempo: {formatTime(lastGameScore.timeSeconds)}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Zap size={12} />
                    +{lastGameScore.timeBonus} bônus agilidade
                  </span>
                  {activeRoomCode && (
                    <span className="font-bold text-rose-600 font-mono">
                      • Sala {activeRoomCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => navigateToTab("gamificacao")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold gap-2 shadow-lg flex-shrink-0"
            >
              <Trophy size={18} /> Ver Ranking da Sala ➔
            </Button>
          </div>
        )}

        {/* ABA 1: VISÃO GERAL (TELA HOME) */}
        {activeTab === "home" && (
          <section id="telaHome" className="screen active" aria-labelledby="heroTitle">
            <div className="home-intro">
              <span className="hero-header-badge">
                <Activity size={12} />
                Seminário Tipos de Choque · 20/10/2026
              </span>
              <h1 id="heroTitle" className="home-title">
                Choque Hipovolêmico:
                <br />
                <span>Plantão na Sala Vermelha</span>
              </h1>
              <div className="home-meta flex items-center flex-wrap gap-4">
                <img
                  src="https://raw.githubusercontent.com/teste-arch/conte-do/main/FAC%20logo.png"
                  alt="FAC — Faculdade Arquidiocesana de Curvelo"
                  className="h-9 w-auto object-contain bg-white/95 px-2.5 py-1 rounded-xl border border-border shadow-xs"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/assets/fac-logo.png";
                  }}
                />
                <span>
                  <strong>Orientação:</strong> Profa. Paula Silveira
                </span>
                <span>
                  <strong>Enfermagem:</strong> 4º período · FAC Curvelo
                </span>
              </div>

              <div className="welcome-note">
                <div className="gota-avatar">
                  <svg viewBox="0 0 64 64" role="img" aria-label="Gota, mascote da Sala Vermelha">
                    <use href="#svgGotaMascoteBase" />
                  </svg>
                </div>
                <div>
                  <h2>Bem-vindo à Sala Vermelha Interativa 💧</h2>
                  <p>
                    O site é estruturado em duas grandes experiências: o{" "}
                    <strong>Conteúdo Educacional</strong> (100% livre e interativo, com simuladores visuais sem necessidade de cadastro nem nick) e a{" "}
                    <strong>Arena de Jogos em Salas</strong> (com salas temporárias no estilo Kahoot, código de 6 letras, disputa cronometrada com bônus de agilidade e ranking exclusivo por sala que expira automaticamente após 1 hora de inatividade).
                  </p>
                </div>
              </div>

              {/* Botões Principais de Navegação */}
              <div className="home-actions mt-6">
                <Button
                  className="action-button bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!ready}
                  onClick={() => navigateToTab("conteudo")}
                >
                  <BookOpen />
                  <small>PARTE 1 · VISUAL E LIVRE</small>
                  <span>Conteúdo Interativo</span>
                </Button>

                <Button
                  className="action-button action-clinical"
                  disabled={!ready}
                  onClick={() => navigateToTab("gamificacao")}
                >
                  <Stethoscope />
                  <small>PARTE 2 · SALAS KAHOOT</small>
                  <span>Jogos em Salas</span>
                </Button>

                <Button
                  variant="outline"
                  className="action-button"
                  disabled={!ready}
                  onClick={() => {
                    setActiveTab("legado");
                    runtime().uiManager?.mostrarTela("telaMapaTrilha");
                  }}
                >
                  <ListChecks />
                  <small>DIDÁTICA</small>
                  <span>Trilha das 7 Etapas</span>
                </Button>

                <Button
                  variant="outline"
                  className="action-button"
                  disabled={!ready}
                  onClick={() => runtime().uiManager?.abrirModalConsultaRapida()}
                >
                  <Search />
                  <small>DÚVIDAS</small>
                  <span>Consulta Rápida</span>
                </Button>
              </div>

              {error && (
                <p role="alert" className="mt-4 text-rose-600">
                  Não foi possível abrir as atividades.{" "}
                  <Button variant="link" onClick={() => window.location.reload()}>
                    Tentar novamente
                  </Button>
                </p>
              )}

              <div className="home-bottom">
                <span>
                  <ListChecks size={13} />
                  Simuladores interativos livres
                </span>
                <span>
                  <Users size={13} />
                  Salas temporárias (Kahoot style)
                </span>
                <span>
                  <Trophy size={13} />
                  Ranking exclusivo por sala
                </span>
                <span>
                  <GraduationCap size={13} />
                  Enfermagem FAC
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ABA 2: CONTEÚDO INTERATIVO (PARTE 1 — 100% LIVRE SEM CADASTRO NEM NICK) */}
        {activeTab === "conteudo" && (
          <ConteudoInterativo
            onGoToGame={() => navigateToTab("gamificacao")}
            onOpenParada={(id) => {
              setActiveTab("legado");
              runtime().uiManager?.mostrarTela("telaParadaTeorica");
              runtime().trilhaManager?.renderParada(id);
            }}
          />
        )}

        {/* ABA 3: GAMIFICAÇÃO & DESAFIOS (SISTEMA DE SALAS TEMPORÁRIAS KAHOOT STYLE) */}
        <div style={{ display: activeTab === "gamificacao" ? "block" : "none" }}>
          <GamificacaoHub
            onStartCasoClinico={startCaseWithTimer}
            completedCasoScore={completedCasoScore}
          />
        </div>

        {/* ATIVIDADES LEGADAS DO RUNTIME (Caso Clínico, Trilha e Equipe) */}
        <LegacyActivities />

        <footer className="site-footer flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border mt-12">
          <div className="flex items-center gap-3">
            <img
              src="https://raw.githubusercontent.com/teste-arch/conte-do/main/FAC%20logo.png"
              alt="FAC"
              className="h-7 w-auto object-contain bg-white/95 px-2 py-0.5 rounded border border-border shadow-xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/fac-logo.png";
              }}
            />
            <span className="text-xs text-muted-foreground">
              © 2026 Sala Vermelha · Enfermagem FAC Curvelo · Orientação: Profa. Paula Silveira
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}