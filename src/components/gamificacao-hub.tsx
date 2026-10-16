import { useState, useEffect, useRef } from "react";
import {
  Play,
  Clock,
  Zap,
  Award,
  Stethoscope,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  HeartPulse,
  Flame,
  ChevronRight,
  Trophy,
  Users,
  Copy,
  DoorOpen,
  Crown,
  Share2,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/ranking";
import {
  createRoomApi,
  joinRoomApi,
  getRoomApi,
  heartbeatRoomApi,
  startRoomGameApi,
  submitScoreApi,
  type Room,
  type Participant,
} from "@/lib/rooms-client";

interface GamificacaoHubProps {
  onStartCasoClinico: (startTime: number, roomCode: string, participantId: string) => void;
  completedCasoScore?: {
    score: number;
    clinical: number;
    timeBonus: number;
    timeSeconds: number;
    stars: number;
  } | null;
}

// Perguntas para o modo Mini-Game Quiz Relâmpago
const QUIZ_QUESTIONS = [
  {
    id: 1,
    pergunta: "Qual é a alteração fisiopatológica inicial e marcante no choque hipovolêmico?",
    opcoes: [
      { texto: "Bradicardia e vasodilatação periférica generalizada", correta: false },
      { texto: "Queda da pré-carga com taquicardia compensatória pelo barorreflexo", correta: true },
      { texto: "Aumento abrupto do débito cardíaco e hipertensão", correta: false },
      { texto: "Acúmulo exclusivo de oxigênio nas hemácias", correta: false },
    ],
    explicacao: "Com menos volume circulante, a pré-carga despenca. O barorreflexo ativa catecolaminas, gerando taquicardia e vasoconstrição para tentar manter a pressão.",
  },
  {
    id: 2,
    pergunta: "No trauma pélvico instável com choque hemorrágico, qual a primeira conduta na cena?",
    opcoes: [
      { texto: "Contenção do anel pélvico com lençol/cinta no nível dos trocanteres maiores", correta: true },
      { texto: "Infundir 3 litros de soro fisiológico gelado imediatamente", correta: false },
      { texto: "Administrar vasodilatador para aliviar a dor do paciente", correta: false },
      { texto: "Colocar o paciente em pé para testar a estabilidade da bacia", correta: false },
    ],
    explicacao: "A contenção pélvica precoce reduz o volume pélvico e tampona os plexos venosos retroperitoneais rompidos, salvando a vida do paciente.",
  },
  {
    id: 3,
    pergunta: "Quais são os 3 componentes da temida Tríade Letal do Trauma?",
    opcoes: [
      { texto: "Hipertensão, Bradicardia e Respiração irregular", correta: false },
      { texto: "Hipotermia, Coagulopatia e Acidose Metabólica", correta: true },
      { texto: "Taquicardia, Hipertermia e Alcalose Respiratória", correta: false },
      { texto: "Cianose, Icterícia e Sudorese", correta: false },
    ],
    explicacao: "Hipotermia inibe as enzimas de coagulação; a coagulopatia aumenta o sangramento; e a hipoperfusão celular gera acidose lática, fechando o ciclo letal.",
  },
  {
    id: 4,
    pergunta: "Qual é a janela terapêutica máxima recomendada para o Ácido Tranexâmico (TXA)?",
    opcoes: [
      { texto: "Até 3 horas após o evento traumático", correta: true },
      { texto: "Apenas após 12 horas de internação na UTI", correta: false },
      { texto: "A qualquer momento, mesmo depois de 24 horas", correta: false },
      { texto: "Não deve ser usado em politraumatizados", correta: false },
    ],
    explicacao: "O estudo CRASH-2 provou que o TXA reduz a mortalidade por sangramento quando iniciado nas primeiras 3 horas. Após esse tempo, o risco de trombose supera o benefício.",
  },
  {
    id: 5,
    pergunta: "O que preconiza o conceito moderno de Ressuscitação Hemostática no choque Classe IV?",
    opcoes: [
      { texto: "Proporção balanceada 1:1:1 de Hemácias, Plasma e Plaquetas + Hipotensão permissiva", correta: true },
      { texto: "Grandes volumes de cristaloides até atingir PAS acima de 150 mmHg", correta: false },
      { texto: "Infusão exclusiva de água destilada para hidratar os tecidos", correta: false },
      { texto: "Suspender transfusões até confirmação da prova cruzada em 2 horas", correta: false },
    ],
    explicacao: "A proporção 1:1:1 restaura a capacidade carreadora e os fatores hemostáticos sem diluição severa, enquanto a hipotensão permissiva evita estourar os coágulos recém-formados.",
  },
];

export function GamificacaoHub({
  onStartCasoClinico,
  completedCasoScore,
}: GamificacaoHubProps) {
  // Estado da sala temporária
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomRanking, setRoomRanking] = useState<Participant[]>([]);
  const [myParticipantId, setMyParticipantId] = useState<string>("");
  const [myNick, setMyNick] = useState<string>("");

  // Formulários de entrada
  const [createNick, setCreateNick] = useState("");
  const [createMode, setCreateMode] = useState<"caso_clinico" | "quiz_relampago">("caso_clinico");
  const [joinCode, setJoinCode] = useState("");
  const [joinNick, setJoinNick] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  // Modo de jogo ativo ("room_lobby" | "playing_quiz" | "finished_ranking")
  const [viewState, setViewState] = useState<"portal" | "room_lobby" | "playing_quiz" | "ranking">("portal");

  // Estado do Quiz Relâmpago
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(15);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Polling e Heartbeat periódico enquanto estiver na sala
  useEffect(() => {
    if (!currentRoom || !myParticipantId) return;

    const interval = setInterval(async () => {
      try {
        const res = await heartbeatRoomApi(currentRoom.code, myParticipantId);
        if (res.ok) {
          setCurrentRoom(res.room);
          setRoomRanking(res.ranking);

          // Se a sala mudou para status 'playing' e for quiz
          if (res.room.status === "playing" && viewState === "room_lobby" && res.room.gameMode === "quiz_relampago") {
            startQuizLocal();
          }
        }
      } catch (err: any) {
        // Se a sala expirou, avisa e volta para o portal
        if (err?.message?.includes("expirou") || err?.message?.includes("não encontrada")) {
          setErrorMessage(err.message);
          setCurrentRoom(null);
          setViewState("portal");
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentRoom?.code, myParticipantId, viewState]);

  // Se o caso clínico acabou de ser completado pelo player, submete para a sala
  useEffect(() => {
    if (completedCasoScore && currentRoom && myParticipantId) {
      submitScoreApi(currentRoom.code, {
        participantId: myParticipantId,
        score: completedCasoScore.score,
        clinicalScore: completedCasoScore.clinical,
        timeBonus: completedCasoScore.timeBonus,
        timeSeconds: completedCasoScore.timeSeconds,
        stars: completedCasoScore.stars,
        status: completedCasoScore.score >= 1200 ? "Lucas Salvo 🌟" : "Plantonista Dedicado 🩺",
      }).then((res) => {
        if (res.ok) {
          setCurrentRoom(res.room);
          setRoomRanking(res.ranking);
          setViewState("ranking");
        }
      }).catch((err) => {
        console.error("Erro ao enviar pontuação para a sala:", err);
      });
    }
  }, [completedCasoScore]);

  // Timer regressivo do Quiz
  useEffect(() => {
    if (viewState !== "playing_quiz" || quizSelectedOption !== null) return;

    if (quizTimeLeft <= 0) {
      handleAnswerOption(-1);
      return;
    }

    const timer = setInterval(() => {
      setQuizTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState, quizTimeLeft, quizSelectedOption]);

  // Criar Sala
  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    const cleanNick = createNick.trim();
    if (!cleanNick) {
      setErrorMessage("Por favor, digite seu nickname de anfitrião.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await createRoomApi(cleanNick, createMode);
      setCurrentRoom(res.room);
      setRoomRanking(res.ranking);
      setMyParticipantId(res.participantId);
      setMyNick(cleanNick);
      setViewState("room_lobby");
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao criar sala temporária.");
    } finally {
      setIsLoading(false);
    }
  }

  // Entrar em Sala Existente
  async function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault();
    const cleanCode = joinCode.trim().toUpperCase();
    const cleanNick = joinNick.trim();

    if (!cleanCode) {
      setErrorMessage("Informe o código de 6 caracteres da sala.");
      return;
    }
    if (!cleanNick) {
      setErrorMessage("Escolha seu nickname para participar da sala.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await joinRoomApi(cleanCode, cleanNick);
      setCurrentRoom(res.room);
      setRoomRanking(res.ranking);
      setMyParticipantId(res.participantId);
      setMyNick(cleanNick);
      setViewState("room_lobby");
    } catch (err: any) {
      setErrorMessage(err.message || "Não foi possível entrar na sala.");
    } finally {
      setIsLoading(false);
    }
  }

  // Copiar código da sala para a área de transferência
  function copyRoomCode() {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  // Iniciar partida da sala
  async function handleStartGame() {
    if (!currentRoom) return;

    try {
      await startRoomGameApi(currentRoom.code, myParticipantId);
    } catch (err) {
      console.warn("Aviso ao notificar início da sala:", err);
    }

    if (currentRoom.gameMode === "caso_clinico") {
      onStartCasoClinico(Date.now(), currentRoom.code, myParticipantId);
    } else {
      startQuizLocal();
    }
  }

  function startQuizLocal() {
    setViewState("playing_quiz");
    setQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizTimeLeft(15);
    setQuizSelectedOption(null);
    setQuizStartTime(Date.now());
  }

  function handleAnswerOption(optionIndex: number) {
    if (quizSelectedOption !== null) return;
    setQuizSelectedOption(optionIndex);

    const q = QUIZ_QUESTIONS[quizIndex];
    const isCorrect = optionIndex >= 0 && q.opcoes[optionIndex]?.correta;

    if (isCorrect) {
      const speedBonusPerQuestion = Math.max(20, quizTimeLeft * 10);
      setQuizScore((prev) => prev + 180 + speedBonusPerQuestion);
      setQuizStreak((prev) => prev + 1);
    } else {
      setQuizStreak(0);
    }
  }

  async function handleNextQuestion() {
    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelectedOption(null);
      setQuizTimeLeft(15);
    } else {
      // Concluiu o Quiz Relâmpago
      const elapsed = Math.max(15, Math.floor((Date.now() - quizStartTime) / 1000));
      const speedBonus = Math.max(50, Math.floor(500 - elapsed * 4));
      const totalScore = quizScore + speedBonus;

      if (currentRoom && myParticipantId) {
        try {
          const res = await submitScoreApi(currentRoom.code, {
            participantId: myParticipantId,
            score: totalScore,
            clinicalScore: quizScore,
            timeBonus: speedBonus,
            timeSeconds: elapsed,
            stars: totalScore > 900 ? 3 : totalScore > 600 ? 2 : 1,
            status: totalScore > 900 ? "Mestre do Choque ⚡" : "Raciocínio Rápido 🩺",
          });
          setCurrentRoom(res.room);
          setRoomRanking(res.ranking);
        } catch (err) {
          console.error("Erro ao enviar pontuação:", err);
        }
      }

      setViewState("ranking");
    }
  }

  function handleLeaveRoom() {
    setCurrentRoom(null);
    setRoomRanking([]);
    setMyParticipantId("");
    setViewState("portal");
    setErrorMessage("");
  }

  const isHost = currentRoom?.participants.find((p) => p.id === myParticipantId)?.isHost ?? false;

  return (
    <div className="space-y-8 py-4 animate-fade-in pb-16">
      {/* 1. PORTAL DE SALAS: CRIAR OU ENTRAR */}
      {viewState === "portal" && (
        <>
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 text-white p-8 sm:p-10 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-sm mb-3">
                <Users size={14} /> Salas Temporárias (Kahoot Style)
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                Arena de Jogos por Salas
              </h1>
              <p className="mt-3 text-base sm:text-lg text-white/90 leading-relaxed font-medium">
                Crie uma sala temporária para a sua turma ou entre com o código do seu grupo. Cada sala tem seu próprio ranking e expira automaticamente após <strong>1 hora de inatividade</strong>!
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-white">
                <span className="px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
                  <Hourglass size={14} className="text-amber-300" /> Sem cadastro nem senhas
                </span>
                <span className="px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
                  <Trophy size={14} className="text-yellow-300" /> Ranking exclusivo por sala
                </span>
                <span className="px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
                  <Zap size={14} className="text-emerald-300" /> Sincronização em tempo real
                </span>
              </div>
            </div>
          </section>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 text-rose-700 dark:text-rose-300 text-sm font-semibold flex items-center gap-2 animate-slide-down">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* DUAS AÇÕES PRINCIPAIS: CRIAR SALA OU ENTRAR EM SALA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD 1: CRIAR NOVA SALA */}
            <div className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-lg flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} /> Para Professores e Líderes
                </div>
                <h3 className="text-2xl font-bold text-foreground font-display">
                  Criar Nova Sala 🚀
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gere um código de 6 letras para compartilhar com sua turma no projetor ou WhatsApp.
                </p>

                <form onSubmit={handleCreateRoom} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Modalidade do Jogo
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCreateMode("caso_clinico")}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          createMode === "caso_clinico"
                            ? "border-rose-500 bg-rose-500/10 font-bold"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <span className="block text-sm">🚨 Caso do Lucas</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          Politrauma com 5 decisões
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreateMode("quiz_relampago")}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          createMode === "quiz_relampago"
                            ? "border-amber-500 bg-amber-500/10 font-bold"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <span className="block text-sm">⚡ Quiz Relâmpago</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          5 perguntas de 15s cada
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="create-nick-input"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
                    >
                      Seu Nickname de Anfitrião
                    </label>
                    <input
                      id="create-nick-input"
                      type="text"
                      maxLength={25}
                      placeholder="Ex.: Profa. Paula, Dr. House..."
                      value={createNick}
                      onChange={(e) => setCreateNick(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none text-foreground font-medium text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg"
                  >
                    {isLoading ? "Criando Sala..." : "Criar Sala & Gerar Código ➔"}
                  </Button>
                </form>
              </div>
            </div>

            {/* CARD 2: ENTRAR EM SALA EXISTENTE */}
            <div className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-lg flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <DoorOpen size={13} /> Para Alunos e Participantes
                </div>
                <h3 className="text-2xl font-bold text-foreground font-display">
                  Entrar em uma Sala 🚪
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Digite o código que o professor ou colega compartilhou para participar da disputa.
                </p>

                <form onSubmit={handleJoinRoom} className="space-y-4 mt-6">
                  <div>
                    <label
                      htmlFor="join-code-input"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
                    >
                      Código da Sala (6 dígitos)
                    </label>
                    <input
                      id="join-code-input"
                      type="text"
                      maxLength={6}
                      placeholder="Ex.: SAL28X"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-amber-500 focus:outline-none text-foreground font-mono font-bold text-lg tracking-widest text-center"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="join-nick-input"
                      className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
                    >
                      Seu Nickname
                    </label>
                    <input
                      id="join-nick-input"
                      type="text"
                      maxLength={25}
                      placeholder="Ex.: Enf. Amanda, Lucas R1..."
                      value={joinNick}
                      onChange={(e) => setJoinNick(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-amber-500 focus:outline-none text-foreground font-medium text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg"
                  >
                    {isLoading ? "Entrando..." : "Entrar na Sala ➔"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. LOBBY DA SALA ATIVA (ESPERANDO JOGADORES OU PRONTO PARA JOGAR) */}
      {viewState === "room_lobby" && currentRoom && (
        <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Top banner da sala */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-border pb-6">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 inline-flex mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Sala Ativa · Expira em 1 hora de inatividade
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                Lobby da Sala
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Modalidade: <strong>{currentRoom.gameMode === "caso_clinico" ? "🚨 Caso do Lucas (Politrauma)" : "⚡ Quiz Relâmpago (15s)"}</strong>
              </p>
            </div>

            {/* Código da Sala em Destaque */}
            <div className="text-center sm:text-right bg-muted px-6 py-4 rounded-2xl border-2 border-primary/20 shadow-inner">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Código de Acesso
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-primary tracking-widest block">
                {currentRoom.code}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyRoomCode}
                className="text-xs mt-1 h-7 text-primary gap-1"
              >
                <Copy size={13} />
                {copiedCode ? "Copiado! ✔" : "Copiar Código"}
              </Button>
            </div>
          </div>

          {/* Lista ao vivo de participantes na sala */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Participantes Conectados ({currentRoom.participants.length})
              </h3>
              <span className="text-xs text-muted-foreground">Sincronizando em tempo real 🔄</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentRoom.participants.map((p) => {
                const isMe = p.id === myParticipantId;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      isMe
                        ? "border-primary bg-primary/10 shadow-md font-bold"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center text-lg flex-shrink-0">
                        {p.isHost ? "👑" : "🩺"}
                      </div>
                      <div className="truncate">
                        <span className="text-sm text-foreground block truncate">{p.nick}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {p.isHost ? "Anfitrião" : "Participante"}
                        </span>
                      </div>
                    </div>

                    {isMe && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider flex-shrink-0">
                        Você
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botão de Iniciar Partida */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleLeaveRoom}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <DoorOpen size={14} /> Sair da Sala
            </Button>

            <Button
              size="lg"
              onClick={handleStartGame}
              className="w-full sm:w-auto px-10 py-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-base shadow-xl gap-2 tracking-wider uppercase"
            >
              <Play size={20} className="fill-current" />
              <span>INICIAR PLANTÃO CRONOMETRADO ⏱️</span>
            </Button>
          </div>
        </section>
      )}

      {/* 3. JOGO DO QUIZ RELÂMPAGO NA SALA */}
      {viewState === "playing_quiz" && (
        <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                Pergunta {quizIndex + 1} de {QUIZ_QUESTIONS.length}
              </span>
              {currentRoom && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  SALA {currentRoom.code}
                </span>
              )}
              {quizStreak > 1 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white flex items-center gap-1 animate-bounce">
                  <Flame size={12} /> {quizStreak}x Streak!
                </span>
              )}
            </div>

            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm border ${
                quizTimeLeft <= 5
                  ? "bg-rose-500 text-white border-rose-600 animate-ping"
                  : "bg-muted text-foreground border-border"
              }`}
            >
              <Clock size={15} /> {quizTimeLeft}s
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-display leading-snug">
              {QUIZ_QUESTIONS[quizIndex].pergunta}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {QUIZ_QUESTIONS[quizIndex].opcoes.map((opcao, idx) => {
              const isSelected = quizSelectedOption === idx;
              const hasAnswered = quizSelectedOption !== null;

              let btnStyle = "border-border bg-card hover:border-primary/40 text-foreground";
              if (hasAnswered) {
                if (opcao.correta) {
                  btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold";
                } else if (isSelected && !opcao.correta) {
                  btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
                } else {
                  btnStyle = "opacity-50 border-border bg-muted";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleAnswerOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opcao.texto}</span>
                  {hasAnswered && opcao.correta && (
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  )}
                  {hasAnswered && isSelected && !opcao.correta && (
                    <XCircle size={18} className="text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {quizSelectedOption !== null && (
            <div className="pt-4 border-t border-border animate-fade-in space-y-4">
              <p className="text-xs text-muted-foreground bg-muted p-3.5 rounded-xl border border-border leading-relaxed">
                💡 <strong>Explicação:</strong> {QUIZ_QUESTIONS[quizIndex].explicacao}
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 px-6"
                >
                  {quizIndex + 1 < QUIZ_QUESTIONS.length ? "Próxima Pergunta" : "Finalizar & Ver Ranking da Sala"}
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. RANKING EXCLUSIVO DA SALA */}
      {viewState === "ranking" && currentRoom && (
        <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center text-4xl mb-3 shadow-xl">
              🏆
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Sala {currentRoom.code} · Partida Concluída
            </span>
            <h2 className="text-3xl font-extrabold text-foreground font-display mt-0.5">
              Ranking Oficial da Sala
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Placar exclusivo entre os participantes desta sessão. Não afeta nem se mistura com outras salas!
            </p>
          </div>

          {/* Pódio dos Top 3 da Sala */}
          {roomRanking.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2 max-w-2xl mx-auto">
              {roomRanking[1] && (
                <div className="order-2 sm:order-1 flex flex-col items-center p-5 rounded-2xl bg-muted/60 border border-border text-center">
                  <span className="text-sm font-bold text-slate-400">🥈 2º Lugar</span>
                  <span className="font-extrabold text-base text-foreground mt-1 truncate max-w-full">
                    {roomRanking[1].nick}
                  </span>
                  <span className="text-xl font-black text-foreground font-display mt-2">
                    {roomRanking[1].score} <small className="text-xs font-normal">pts</small>
                  </span>
                  <span className="text-xs text-muted-foreground font-mono mt-0.5">
                    {formatTime(roomRanking[1].timeSeconds)}
                  </span>
                </div>
              )}

              {roomRanking[0] && (
                <div className="order-1 sm:order-2 flex flex-col items-center p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-400 text-center shadow-lg -translate-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                    👑 1º Lugar
                  </span>
                  <span className="font-extrabold text-lg text-foreground mt-2 truncate max-w-full">
                    {roomRanking[0].nick}
                  </span>
                  <span className="text-3xl font-black text-amber-600 font-display mt-2">
                    {roomRanking[0].score} <small className="text-xs font-normal">pts</small>
                  </span>
                  <span className="text-xs text-muted-foreground font-mono mt-0.5">
                    {formatTime(roomRanking[0].timeSeconds)}
                  </span>
                </div>
              )}

              {roomRanking[2] && (
                <div className="order-3 flex flex-col items-center p-5 rounded-2xl bg-muted/60 border border-border text-center">
                  <span className="text-sm font-bold text-amber-700">🥉 3º Lugar</span>
                  <span className="font-extrabold text-base text-foreground mt-1 truncate max-w-full">
                    {roomRanking[2].nick}
                  </span>
                  <span className="text-xl font-black text-foreground font-display mt-2">
                    {roomRanking[2].score} <small className="text-xs font-normal">pts</small>
                  </span>
                  <span className="text-xs text-muted-foreground font-mono mt-0.5">
                    {formatTime(roomRanking[2].timeSeconds)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tabela de Classificação da Sala */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Posição</th>
                  <th className="py-3 px-4">Plantonista</th>
                  <th className="py-3 px-4 text-center">Tempo</th>
                  <th className="py-3 px-4 text-right">Pontos</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {roomRanking.map((p, idx) => {
                  const isMe = p.id === myParticipantId;
                  const pos = idx + 1;
                  return (
                    <tr
                      key={p.id}
                      className={isMe ? "bg-primary/10 font-bold border-l-4 border-l-primary" : ""}
                    >
                      <td className="py-3.5 px-4">
                        {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : `#${pos}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{p.nick}</span>
                          {isMe && (
                            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase">
                              Você
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-xs">
                        {p.hasFinished ? formatTime(p.timeSeconds) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-display font-extrabold text-foreground">
                        {p.score} pts
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-muted text-foreground">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleLeaveRoom}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <DoorOpen size={14} /> Sair da Sala
            </Button>

            <Button
              size="lg"
              onClick={() => setViewState("room_lobby")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 px-8"
            >
              <RotateCcw size={16} /> Jogar Novamente nesta Sala
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
