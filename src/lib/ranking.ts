export interface RankingEntry {
  id: string;
  nick: string;
  score: number;
  clinicalScore: number;
  timeBonus: number;
  timeSeconds: number;
  mode: "caso_clinico" | "quiz_relampago";
  stars: number;
  status: string;
  date: string;
}

const STORAGE_KEY_RANKING = "sala_vermelha_ranking_v1";
const STORAGE_KEY_NICK = "sala_vermelha_player_nick";

const DEFAULT_RANKING: RankingEntry[] = [
  {
    id: "def-1",
    nick: "Dra. Paula Silveira",
    score: 1480,
    clinicalScore: 1000,
    timeBonus: 480,
    timeSeconds: 72,
    mode: "caso_clinico",
    stars: 3,
    status: "Conduta Perfeita 🌟",
    date: "15/10/2026",
  },
  {
    id: "def-2",
    nick: "Enf. Amanda (R3)",
    score: 1390,
    clinicalScore: 1000,
    timeBonus: 390,
    timeSeconds: 98,
    mode: "caso_clinico",
    stars: 3,
    status: "Lucas Estabilizado 🩺",
    date: "15/10/2026",
  },
  {
    id: "def-3",
    nick: "Dr. House",
    score: 1320,
    clinicalScore: 900,
    timeBonus: 420,
    timeSeconds: 85,
    mode: "caso_clinico",
    stars: 3,
    status: "Diagnóstico Certeiro ⚡",
    date: "14/10/2026",
  },
  {
    id: "def-4",
    nick: "Enf. Gabriel FAC",
    score: 1210,
    clinicalScore: 850,
    timeBonus: 360,
    timeSeconds: 114,
    mode: "caso_clinico",
    stars: 2,
    status: "Ressuscitação Eficaz 🩹",
    date: "14/10/2026",
  },
  {
    id: "def-5",
    nick: "Dra. Carolina (UTI)",
    score: 1150,
    clinicalScore: 800,
    timeBonus: 350,
    timeSeconds: 125,
    mode: "quiz_relampago",
    stars: 3,
    status: "Mestre da Tríade Letal 🩸",
    date: "13/10/2026",
  },
  {
    id: "def-6",
    nick: "Acadêmico 4º Período",
    score: 1020,
    clinicalScore: 750,
    timeBonus: 270,
    timeSeconds: 155,
    mode: "caso_clinico",
    stars: 2,
    status: "Plantão Concluído 💧",
    date: "12/10/2026",
  },
];

export function getPlayerNick(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY_NICK)?.trim() || "";
}

export function setPlayerNick(nick: string): void {
  if (typeof window === "undefined") return;
  const clean = nick.trim();
  if (clean) {
    localStorage.setItem(STORAGE_KEY_NICK, clean);
    // Sync with window.gameState if initialized
    if ((window as any).gameState) {
      (window as any).gameState.nomeJogador = clean;
      (window as any).gameState.savePreferences?.();
    }
  }
}

export function getRanking(): RankingEntry[] {
  if (typeof window === "undefined") return DEFAULT_RANKING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RANKING);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RANKING, JSON.stringify(DEFAULT_RANKING));
      return DEFAULT_RANKING;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => b.score - a.score);
    }
    return DEFAULT_RANKING;
  } catch (err) {
    console.error("Erro ao ler ranking:", err);
    return DEFAULT_RANKING;
  }
}

export function saveRankingEntry(
  entry: Omit<RankingEntry, "id" | "date">
): RankingEntry {
  const current = getRanking();
  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const newEntry: RankingEntry = {
    ...entry,
    id: `rank-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: dateStr,
  };

  const updated = [...current, newEntry].sort((a, b) => b.score - a.score);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_RANKING, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("sala-ranking-updated", { detail: updated }));
    } catch (err) {
      console.error("Erro ao salvar ranking:", err);
    }
  }

  return newEntry;
}

export function resetRanking(): RankingEntry[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_RANKING, JSON.stringify(DEFAULT_RANKING));
      window.dispatchEvent(new CustomEvent("sala-ranking-updated", { detail: DEFAULT_RANKING }));
    } catch (err) {
      console.error("Erro ao resetar ranking:", err);
    }
  }
  return DEFAULT_RANKING;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
