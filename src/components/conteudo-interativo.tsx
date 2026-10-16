import { useState, useId } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Flame,
  Heart,
  Layers,
  Percent,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Thermometer,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConteudoInterativoProps {
  onGoToGame: () => void;
  onOpenParada?: (id: number) => void;
}

export function ConteudoInterativo({ onGoToGame, onOpenParada }: ConteudoInterativoProps) {
  // --- MÓDULO 1: Simulador de Vaso & Volemia ---
  const [volumePercent, setVolumePercent] = useState<number>(85); // 100 to 40%

  // Cálculos dinâmicos hemodinâmicos baseados no slider
  const fc = Math.round(72 + (100 - volumePercent) * 1.25); // 72 to 147 bpm
  const pas = Math.max(65, Math.round(125 - (100 - volumePercent) * 0.95)); // 125 to 68 mmHg
  const pad = Math.max(40, Math.round(80 - (100 - volumePercent) * 0.55));
  const debito = ((volumePercent / 100) * 5.2).toFixed(1); // 5.2 down to 2.1 L/min
  const enchimentoCapilar = volumePercent >= 80 ? "< 2 segundos (Normal)" : volumePercent >= 65 ? "3 a 4 segundos (Lento)" : "> 4 segundos (Grave / Choque)";
  
  // Mascote Gota feedback
  const getGotaFeedback = () => {
    if (volumePercent >= 85) {
      return {
        humor: "feliz",
        titulo: "Hemodinâmica Equilibrada! 💧",
        texto: "Volume pleno dentro dos vasos. O coração bate com calma, o débito cardíaco irriga o cérebro e os rins com abundância de oxigênio.",
        cor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300",
        icone: "😄",
      };
    } else if (volumePercent >= 70) {
      return {
        humor: "alerta",
        titulo: "Mecanismo Compensatório em Ação! ⚡",
        texto: "Barorreflexo ativado! O corpo libera catecolaminas (adrenalina). O coração acelera (taquicardia) e os vasos periféricos se contraem para segurar a pressão arterial sistêmica.",
        cor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300",
        icone: "😮",
      };
    } else {
      return {
        humor: "perigo",
        titulo: "ALERTA: Choque Hipovolêmico Descompensado! 🚨",
        texto: "O débito cardíaco despencou! Vasoconstrição máxima não é mais suficiente. Células entram em metabolismo anaeróbio e acumulam lactato. Risco iminente de parada cardíaca!",
        cor: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-300",
        icone: "😱",
      };
    }
  };

  const gotaStatus = getGotaFeedback();

  // --- MÓDULO 2: Causas Flip Cards ---
  const [causaTipo, setCausaTipo] = useState<"hemorragico" | "nao_hemorragico">("hemorragico");
  const [cardAtivo, setCardAtivo] = useState<number | null>(0);

  const causasHemorragicas = [
    {
      titulo: "Fratura Pélvica & Politrauma",
      sub: "Exemplo: Caso do Lucas!",
      descricao: "A bacia é um anel ósseo ricamente vascularizado por plexos venosos e ramos da artéria ilíaca interna. Fraturas instáveis podem sangrar até 3 litros para o espaço retroperitoneal silenciosamente!",
      conduta: "Contenção com cinta ou lençol pélvico no nível do trocanter maior para fechar o anel.",
      icone: "🦴",
      gravidade: "Crítica / Emergência Imediata",
    },
    {
      titulo: "Fratura Fechada de Fêmur",
      sub: "Trauma ortopédico de alta energia",
      descricao: "Um único fêmur quebrado pode reter entre 1.000 mL e 1.500 mL de sangue nos compartimentos musculares da coxa, sem sangramento externo aparente.",
      conduta: "Alinhamento, tração cutânea/esquelética e monitoramento de síndrome compartimental.",
      icone: "🦵",
      gravidade: "Grave / Choque Oculto",
    },
    {
      titulo: "Hemorragia Digestiva Alta (HDA)",
      sub: "Úlcera péptica ou varizes esofágicas",
      descricao: "Perda maciça de sangue pelo trato gastrointestinal superior. Apresenta hematêmese (vômito com sangue vivo) e melena (fezes em borra de café).",
      conduta: "Acessos calibrosos, reposição volêmica hemostática e endoscopia digestiva urgente.",
      icone: "🩸",
      gravidade: "Muito Grave",
    },
    {
      titulo: "Ruptura de Aneurisma de Aorta",
      sub: "Aneurisma de Aorta Abdominal (AAA)",
      descricao: "Dilatação vascular que rompe abruptamente. Causa dor abdominal súbita lancinante irradiando para dorso, massa pulsátil e choque hemorrágico fulminante.",
      conduta: "Hipotensão permissiva, alerta cirúrgico imediato (sala aberta) e protocolo de transfusão maciça.",
      icone: "🫀",
      gravidade: "Extremamente Crítica",
    },
  ];

  const causasNaoHemorragicas = [
    {
      titulo: "Grandes Queimaduras",
      sub: "Perda extrema de plasma e eletrólitos",
      descricao: "A destruição da barreira cutânea e a resposta inflamatória sistêmica causam aumento colossal da permeabilidade capilar, com extravasamento de plasma para o interstício (terceiro espaço).",
      conduta: "Fórmula de Parkland com Ringer Lactato aquecido, sondagem vesical e controle diurese > 0.5 mL/kg/h.",
      icone: "🔥",
      gravidade: "Grave / Perda Plasmática",
    },
    {
      titulo: "Desidratação Severa / Gastroenterite",
      sub: "Vômitos e diarreia incoercíveis",
      descricao: "Perda maciça de água livre e eletrólitos (sódio, potássio). Muito frequente em idosos e crianças, levando a turgor cutâneo diminuído, mucosas secas e hipovolemia franca.",
      conduta: "Cristaloides balanceados endovenosos com controle hidroeletrolítico e gasometria.",
      icone: "💧",
      gravidade: "Moderada a Grave",
    },
    {
      titulo: "Cetoacidose Diabética (CAD)",
      sub: "Diurese osmótica por glicotoxicidade",
      descricao: "A hiperglicemia severa ultrapassa o limiar renal, gerando glicosúria maciça e arrastando litros de água e eletrólitos na urina (perda de 5 a 8 litros de volume circulante).",
      conduta: "Hidratação vigorosa com SF 0,9% antes da insulinoterapia e monitoramento rigoroso de K+.",
      icone: "🧪",
      gravidade: "Grave / Metabólica",
    },
    {
      titulo: "Pancreatite Aguda Necrotizante",
      sub: "Sequestro maciço em 3º espaço",
      descricao: "Enzimas pancreáticas ativadas no tecido causam autodigestão e necrose com vasodilatação extrema e sequestro de litros de exsudato no retroperitônio e abdome.",
      conduta: "Expansão volêmica precoce guiada por metas hemodinâmicas e débito urinário.",
      icone: "⚠️",
      gravidade: "Grave",
    },
  ];

  // --- MÓDULO 3: Tríade Letal Interativa ---
  const [triadeFoco, setTriadeFoco] = useState<"hipotermia" | "coagulopatia" | "acidose">("hipotermia");
  const [intervencaoAtiva, setIntervencaoAtiva] = useState<boolean>(false);

  // --- MÓDULO 4: Classes do Choque (ATLS) ---
  const [classeChoque, setClasseChoque] = useState<1 | 2 | 3 | 4>(2);

  const dadosClasses = {
    1: {
      nome: "Classe I (Leve)",
      perdaMl: "< 750 mL",
      perdaPercent: "< 15%",
      fc: "< 100 bpm",
      pa: "Normal",
      fr: "14 - 20 irpm",
      mental: "Levemente ansioso",
      reposicao: "Cristaloide (se necessário)",
      cor: "border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20",
    },
    2: {
      nome: "Classe II (Moderado)",
      perdaMl: "750 a 1.500 mL",
      perdaPercent: "15% a 30%",
      fc: "100 a 120 bpm",
      pa: "Normal ou Pressão de Pulso reduzida",
      fr: "20 a 30 irpm",
      mental: "Ansioso / Agitado",
      reposicao: "Cristaloide aquecido (Ringer Lactato)",
      cor: "border-amber-500 bg-amber-50/50 text-amber-700 dark:bg-amber-950/20",
    },
    3: {
      nome: "Classe III (Grave)",
      perdaMl: "1.500 a 2.000 mL",
      perdaPercent: "30% a 40%",
      fc: "120 a 140 bpm",
      pa: "Hipotensão evidente (PAS < 90)",
      fr: "30 a 40 irpm",
      mental: "Confuso / Obnubilado",
      reposicao: "Cristaloides + Concentrado de Hemácias",
      cor: "border-orange-500 bg-orange-50/50 text-orange-700 dark:bg-orange-950/20",
    },
    4: {
      nome: "Classe IV (Muito Grave / Ameaçador à Vida)",
      perdaMl: "> 2.000 mL",
      perdaPercent: "> 40%",
      fc: "> 140 bpm (ou bradicardia terminal)",
      pa: "Hipotensão profunda ou inaudível",
      fr: "> 35 irpm (respiração superficial)",
      mental: "Letárgico / Comatoso",
      reposicao: "Protocolo de Transfusão Maciça (1:1:1)",
      cor: "border-rose-600 bg-rose-50/50 text-rose-700 dark:bg-rose-950/20",
    },
  };

  // --- MÓDULO 5: Frascos de Fluidos & Farmacologia ---
  const [frascoSelecionado, setFrascoSelecionado] = useState<number>(0);

  const frascos = [
    {
      nome: "Ringer Lactato (Cristaloide Balanceado)",
      tipo: "Fluido de Reanimação Inicial",
      infusao: "Infusão rápida guiada por metas (aquecido a 37°C)",
      perola: "Evita a acidose hiperclorêmica do SF 0,9%. Não infunda volumes gigantescos (> 1.000 mL no choque hemorrágico) para não diluir fatores de coagulação!",
      cor: "from-cyan-500 to-blue-600",
      icone: "💧",
    },
    {
      nome: "Concentrado de Hemácias (CH)",
      tipo: "Hemoderivado de Transporte de Oxigênio",
      infusao: "Infusão sob pressão e aquecimento",
      perola: "Cada bolsa eleva a hemoglobina em aproximadamente 1 g/dL. No choque grave, priorizar sangue tipo O negativo (ou O positivo em homens) antes da prova cruzada.",
      cor: "from-red-600 to-rose-800",
      icone: "🩸",
    },
    {
      nome: "Plasma Fresco Congelado (PFC)",
      tipo: "Hemoderivado Rico em Fatores de Coagulação",
      infusao: "Descongelamento controlado a 37°C",
      perola: "Combate a coagulopatia precoce no trauma. Parte essencial da proporção 1:1:1 na transfusão maciça.",
      cor: "from-amber-400 to-yellow-600",
      icone: "🧪",
    },
    {
      nome: "Ácido Tranexâmico (TXA)",
      tipo: "Antifibrinolítico Sistêmico (CRASH-2)",
      infusao: "1 g EV em bolus em 10 min + 1 g em bomba em 8 horas",
      perola: "DEVE ser administrado nas primeiras 3 horas do trauma! Após 3 horas, pode aumentar a mortalidade por trombose.",
      cor: "from-violet-500 to-purple-700",
      icone: "💊",
    },
  ];

  return (
    <div className="space-y-12 py-4 animate-fade-in pb-16">
      {/* Hero do Conteúdo Interativo */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-muted p-8 border-2 border-primary/20 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} /> Laboratório Interativo de Patologia
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-display tracking-tight leading-tight">
            Explore a Fisiopatologia do Choque na Prática
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Nada de textos maçantes ou estáticos! Mexa nos sliders de volume sanguíneo, alterne as causas, ative a tríade letal e veja a resposta celular do paciente acontecer diante dos seus olhos.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={onGoToGame}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg gap-2"
            >
              <Play size={16} /> Ir Direto para a Gamificação
            </Button>
            {onOpenParada && (
              <Button
                variant="outline"
                onClick={() => onOpenParada(1)}
                className="gap-2 font-medium"
              >
                <Layers size={16} /> Ver Trilha Completa de 6 Etapas
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* MÓDULO 1: Simulador Interativo de Volemia e Vaso */}
      <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Simulador Hemodinâmico #1
            </span>
            <h2 className="text-2xl font-bold text-foreground font-display mt-0.5">
              O Vaso Sanguíneo Vivo & Débito Cardíaco
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Deslize o controle de volemia abaixo e observe a reação do calibre vascular, taquicardia compensatória e estado do paciente:
            </p>
          </div>

          <div className="flex items-center gap-3 bg-muted px-4 py-2.5 rounded-2xl border border-border">
            <Droplets className="text-primary animate-bounce" size={24} />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Volume Circulante
              </span>
              <span className="text-xl font-extrabold text-primary font-display">
                {volumePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Slider Interativo */}
        <div className="bg-muted/60 p-5 rounded-2xl border border-border mb-6">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-rose-600 flex items-center gap-1">
              <AlertTriangle size={13} /> 40% (Choque Grave)
            </span>
            <span className="text-amber-600">75% (Compensatório)</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> 100% (Normovolemia)
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            step={1}
            value={volumePercent}
            onChange={(e) => setVolumePercent(Number(e.target.value))}
            className="w-full h-3 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Tubo de Sangue Vivo em SVG */}
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 overflow-hidden border border-slate-800 shadow-inner mb-6">
          <div className="flex items-center justify-between mb-3 text-white text-xs font-bold">
            <span className="flex items-center gap-2">
              <Activity size={14} className="text-rose-500 animate-pulse" />
              Microcirculação & Vasoconstrição Compensatória
            </span>
            <span className="text-slate-400">
              Calibre do Vaso: {Math.round((volumePercent / 100) * 100)}%
            </span>
          </div>

          {/* SVG com hemácias animadas */}
          <div className="h-32 flex items-center justify-center relative">
            {/* Parede do vaso (contrai quando volume cai) */}
            <div
              className="w-full transition-all duration-300 rounded-xl relative overflow-hidden flex items-center"
              style={{
                height: `${Math.max(48, Math.min(110, (volumePercent / 100) * 110))}px`,
                background: "linear-gradient(180deg, #881337 0%, #4c0519 50%, #881337 100%)",
                boxShadow: "0 0 20px rgba(225, 29, 72, 0.35) inset",
                borderTop: "3px solid #f43f5e",
                borderBottom: "3px solid #f43f5e",
              }}
            >
              {/* Hemácias fluindo */}
              <div className="w-full h-full flex items-center justify-around overflow-hidden relative">
                {Array.from({ length: Math.round((volumePercent / 100) * 14) + 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 shadow-md flex-shrink-0 animate-pulse"
                    style={{
                      transform: `scale(${0.7 + (i % 4) * 0.15}) translateY(${((i % 3) - 1) * 6}px)`,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 mt-2">
            ← Fluxo sanguíneo arterial sob regulação neuro-humoral →
          </div>
        </div>

        {/* Painel de Parâmetros Vitais Calculados em Tempo Real */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-muted p-4 rounded-2xl border border-border text-center">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block flex items-center justify-center gap-1">
              <Heart
                size={14}
                className={fc > 100 ? "text-rose-500 animate-ping" : "text-emerald-500"}
              />
              Frequência Cardíaca
            </span>
            <span
              className={`text-2xl font-black font-display block mt-1 ${
                fc > 120 ? "text-rose-600" : fc > 100 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {fc} <small className="text-xs font-normal">bpm</small>
            </span>
            <span className="text-[10px] text-muted-foreground">
              {fc > 100 ? "Taquicardia compensatória" : "Ritmo sinusal normal"}
            </span>
          </div>

          <div className="bg-muted p-4 rounded-2xl border border-border text-center">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block flex items-center justify-center gap-1">
              <Activity size={14} className="text-primary" />
              Pressão Arterial
            </span>
            <span
              className={`text-2xl font-black font-display block mt-1 ${
                pas < 90 ? "text-rose-600" : pas < 100 ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {pas}/{pad} <small className="text-xs font-normal">mmHg</small>
            </span>
            <span className="text-[10px] text-muted-foreground">
              {pas < 90 ? "Hipotensão crítica" : "Pressão sustentada"}
            </span>
          </div>

          <div className="bg-muted p-4 rounded-2xl border border-border text-center">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block flex items-center justify-center gap-1">
              <Droplets size={14} className="text-cyan-500" />
              Débito Cardíaco
            </span>
            <span
              className={`text-2xl font-black font-display block mt-1 ${
                Number(debito) < 3.5 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {debito} <small className="text-xs font-normal">L/min</small>
            </span>
            <span className="text-[10px] text-muted-foreground">
              DC = Volume Sistólico × FC
            </span>
          </div>

          <div className="bg-muted p-4 rounded-2xl border border-border text-center">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block flex items-center justify-center gap-1">
              <Percent size={14} className="text-amber-500" />
              Enchimento Capilar
            </span>
            <span className="text-sm font-black font-display block mt-2 text-foreground">
              {enchimentoCapilar}
            </span>
            <span className="text-[10px] text-muted-foreground">Perfusão periférica</span>
          </div>
        </div>

        {/* Mascote Gota Reagindo */}
        <div className={`p-5 rounded-2xl border-2 flex items-start sm:items-center gap-4 transition-all ${gotaStatus.cor}`}>
          <div className="text-4xl select-none flex-shrink-0 animate-bounce">
            {gotaStatus.icone}
          </div>
          <div>
            <h4 className="font-bold text-base font-display">{gotaStatus.titulo}</h4>
            <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">{gotaStatus.texto}</p>
          </div>
        </div>
      </section>

      {/* MÓDULO 2: Card Lab - Hemorrágico vs Não Hemorrágico */}
      <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Diagnóstico Etiológico #2
            </span>
            <h2 className="text-2xl font-bold text-foreground font-display mt-0.5">
              De Onde Vem a Perda? (Hemorrágico vs Não Hemorrágico)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Nem todo choque hipovolêmico é sangue derramado. Clique nos botões para alternar e explore as causas práticas:
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="inline-flex bg-muted p-1.5 rounded-2xl border border-border">
            <button
              onClick={() => {
                setCausaTipo("hemorragico");
                setCardAtivo(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                causaTipo === "hemorragico"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🩸 Hemorrágico (Sangue Total)
            </button>
            <button
              onClick={() => {
                setCausaTipo("nao_hemorragico");
                setCardAtivo(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                causaTipo === "nao_hemorragico"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              💧 Não Hemorrágico (Fluidos/Plasma)
            </button>
          </div>
        </div>

        {/* Grade de Cards Clicáveis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(causaTipo === "hemorragico" ? causasHemorragicas : causasNaoHemorragicas).map(
            (causa, idx) => {
              const isSelected = cardAtivo === idx;
              return (
                <div
                  key={causa.titulo}
                  onClick={() => setCardAtivo(idx)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg -translate-y-1"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{causa.icone}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {causa.gravidade}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm font-display">
                      {causa.titulo}
                    </h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{causa.sub}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      {causa.descricao}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs font-bold text-primary">
                    <span>{isSelected ? "Selecionado" : "Clique para ver conduta"}</span>
                    <ChevronRight size={14} className={isSelected ? "rotate-90" : ""} />
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Detalhe da Conduta de Enfermagem Selecionada */}
        {cardAtivo !== null && (
          <div className="mt-6 p-5 rounded-2xl bg-muted/80 border-2 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-primary text-primary-foreground rounded-xl shadow">
                <Stethoscope size={22} />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Conduta Prática de Enfermagem
                </span>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {(causaTipo === "hemorragico" ? causasHemorragicas : causasNaoHemorragicas)[cardAtivo].conduta}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onGoToGame}
              className="bg-primary text-primary-foreground text-xs whitespace-nowrap"
            >
              Testar no Caso do Lucas ➔
            </Button>
          </div>
        )}
      </section>

      {/* MÓDULO 3: Tríade Letal Interativa (Hipotermia + Coagulopatia + Acidose) */}
      <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert size={14} /> Fisiopatologia Crítica #3
            </span>
            <h2 className="text-2xl font-bold text-foreground font-display mt-0.5">
              O Círculo Vicioso da Tríade Letal do Trauma
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Clique nos vértices do triângulo para entender como esses três monstros se alimentam reciprocamente:
            </p>
          </div>

          <Button
            variant={intervencaoAtiva ? "default" : "outline"}
            onClick={() => setIntervencaoAtiva(!intervencaoAtiva)}
            className={`gap-2 font-bold ${intervencaoAtiva ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" : ""}`}
          >
            <Zap size={16} />
            {intervencaoAtiva ? "Intervenções de Enfermagem Ativas! ✔" : "Aplicar Manta Térmica & TXA 🩺"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Vértice 1: Hipotermia */}
          <div
            onClick={() => setTriadeFoco("hipotermia")}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              triadeFoco === "hipotermia"
                ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-md"
                : "border-border hover:border-cyan-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Thermometer className="text-cyan-500" size={28} />
              <span className="text-xs font-bold text-cyan-600 uppercase">T &lt; 35°C</span>
            </div>
            <h3 className="font-bold text-lg text-foreground font-display">1. Hipotermia</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              O paciente perde calor pela exposição na cena, infusão de cristaloides frios e diminuição da produção de calor celular. A cada grau a menos, a coagulação se desintegra.
            </p>
            {intervencaoAtiva && (
              <div className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950/50 p-2 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Manta térmica ativa + Fluidos a 37°C
              </div>
            )}
          </div>

          {/* Vértice 2: Coagulopatia */}
          <div
            onClick={() => setTriadeFoco("coagulopatia")}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              triadeFoco === "coagulopatia"
                ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-md"
                : "border-border hover:border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Droplets className="text-rose-500" size={28} />
              <span className="text-xs font-bold text-rose-600 uppercase">Inibição Enzimática</span>
            </div>
            <h3 className="font-bold text-lg text-foreground font-display">2. Coagulopatia</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              As enzimas da cascata de coagulação são termodependentes. No frio e no sangue ácido, as plaquetas não agregam e o coágulo se desfaz, aumentando o sangramento!
            </p>
            {intervencaoAtiva && (
              <div className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950/50 p-2 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Ácido Tranexâmico & PFC / Plaquetas
              </div>
            )}
          </div>

          {/* Vértice 3: Acidose */}
          <div
            onClick={() => setTriadeFoco("acidose")}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
              triadeFoco === "acidose"
                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md"
                : "border-border hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Activity className="text-amber-500" size={28} />
              <span className="text-xs font-bold text-amber-600 uppercase">pH &lt; 7.20 / Lactato ↑</span>
            </div>
            <h3 className="font-bold text-lg text-foreground font-display">3. Acidose Metabólica</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Sem oxigênio nos tecidos, as células produzem ATP por glicólise anaeróbia gerando ácido lático. O pH baixo deprime ainda mais a contratilidade do coração.
            </p>
            {intervencaoAtiva && (
              <div className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950/50 p-2 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Restaurar perfusão com hemácias
              </div>
            )}
          </div>
        </div>

        {/* Conclusão Pedagógica da Tríade */}
        <div className="bg-muted p-4 rounded-2xl border border-border flex items-center gap-3">
          <Sparkles className="text-primary flex-shrink-0" size={20} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Regra de Ouro da Enfermagem:</strong> A melhor forma de combater a acidose e a coagulopatia não é dar bicarbonato, mas sim <em>estancar a hemorragia, aquecer o paciente e restabelecer o volume de hemácias circulantes</em>!
          </p>
        </div>
      </section>

      {/* MÓDULO 4: Calculadora Visual das 4 Classes do Choque (ATLS) */}
      <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-md">
        <div className="mb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Estratificação de Gravidade #4
          </span>
          <h2 className="text-2xl font-bold text-foreground font-display mt-0.5">
            As 4 Classes do Choque Hemorrágico (ATLS 10ª Edição)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Selecione uma classe para ver como os sinais vitais evoluem conforme a perda volêmica aumenta num adulto de 70 kg:
          </p>
        </div>

        {/* Seletor de Classe em Abas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {([1, 2, 3, 4] as const).map((num) => {
            const isSel = classeChoque === num;
            return (
              <button
                key={num}
                onClick={() => setClasseChoque(num)}
                className={`py-3 px-4 rounded-2xl border-2 font-display font-bold text-sm transition-all text-center ${
                  isSel
                    ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                Classe {num}
                <span className="block text-[11px] font-normal opacity-85 mt-0.5">
                  {dadosClasses[num].perdaPercent} de perda
                </span>
              </button>
            );
          })}
        </div>

        {/* Card de Apresentação da Classe Selecionada */}
        <div className={`p-6 rounded-2xl border-2 transition-all ${dadosClasses[classeChoque].cor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/20 pb-4 mb-4">
            <div>
              <h3 className="text-xl font-extrabold font-display">
                {dadosClasses[classeChoque].nome}
              </h3>
              <span className="text-xs font-semibold opacity-90">
                Volume perdido: <strong>{dadosClasses[classeChoque].perdaMl}</strong> ({dadosClasses[classeChoque].perdaPercent})
              </span>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-card text-foreground border border-current/20">
              Conduta: {dadosClasses[classeChoque].reposicao}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-card/70 p-3 rounded-xl border border-current/15">
              <span className="font-bold opacity-80 block uppercase text-[10px]">Frequência Cardíaca</span>
              <span className="text-base font-extrabold block mt-0.5">{dadosClasses[classeChoque].fc}</span>
            </div>
            <div className="bg-card/70 p-3 rounded-xl border border-current/15">
              <span className="font-bold opacity-80 block uppercase text-[10px]">Pressão Arterial</span>
              <span className="text-base font-extrabold block mt-0.5">{dadosClasses[classeChoque].pa}</span>
            </div>
            <div className="bg-card/70 p-3 rounded-xl border border-current/15">
              <span className="font-bold opacity-80 block uppercase text-[10px]">Freq. Respiratória</span>
              <span className="text-base font-extrabold block mt-0.5">{dadosClasses[classeChoque].fr}</span>
            </div>
            <div className="bg-card/70 p-3 rounded-xl border border-current/15">
              <span className="font-bold opacity-80 block uppercase text-[10px]">Estado Mental</span>
              <span className="text-base font-extrabold block mt-0.5">{dadosClasses[classeChoque].mental}</span>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULO 5: Bancada de Fluidos e Fármacos da Sala Vermelha */}
      <section className="bg-card rounded-3xl border-2 border-border p-6 sm:p-8 shadow-md">
        <div className="mb-6">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Terapêutica Imediata #5
          </span>
          <h2 className="text-2xl font-bold text-foreground font-display mt-0.5">
            Bancada de Fluidos, Sangue & Fármacos
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em cada frasco para conhecer as propriedades farmacológicas e alertas de infusão da enfermagem:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {frascos.map((frasco, i) => (
            <button
              key={frasco.nome}
              onClick={() => setFrascoSelecionado(i)}
              className={`p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                frascoSelecionado === i
                  ? "border-primary bg-primary/10 shadow-lg -translate-y-1"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${frasco.cor} text-white flex items-center justify-center text-2xl shadow-md`}
              >
                {frasco.icone}
              </div>
              <span className="font-bold text-xs text-foreground font-display leading-tight line-clamp-2">
                {frasco.nome.split("(")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Detalhe do Frasco */}
        <div className="p-6 rounded-2xl bg-muted border-2 border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {frascos[frascoSelecionado].tipo}
            </span>
            <h4 className="text-lg font-bold text-foreground font-display mt-0.5">
              {frascos[frascoSelecionado].nome}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              <strong>Modo de Infusão:</strong> {frascos[frascoSelecionado].infusao}
            </p>
            <p className="text-xs text-foreground mt-2 bg-card p-3 rounded-xl border border-border">
              💡 <strong>Pérola da Enfermagem:</strong> {frascos[frascoSelecionado].perola}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final para a Gamificação */}
      <section className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-wider font-extrabold opacity-80 block">
            Teoria compreendida com sucesso!
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display mt-1">
            Hora de Salvar Vidas no Plantão Cronometrado!
          </h3>
          <p className="text-sm opacity-90 mt-1 max-w-xl">
            Clique no botão abaixo, aperte o START, tome as melhores condutas para o Lucas e garanta seu lugar no topo do Ranking!
          </p>
        </div>
        <Button
          size="lg"
          onClick={onGoToGame}
          className="bg-card text-foreground hover:bg-card/90 font-extrabold text-base px-8 py-6 rounded-2xl shadow-2xl flex-shrink-0 gap-2"
        >
          <Play size={18} /> Entrar na Gamificação ⏱️
        </Button>
      </section>
    </div>
  );
}
