import type { Room, Participant, ScoreSubmission } from "./rooms-service";

export type { Room, Participant, ScoreSubmission };

const API_BASE = "/api/rooms";

export async function createRoomApi(
  hostNick: string,
  gameMode: "caso_clinico" | "quiz_relampago" = "caso_clinico"
): Promise<{ ok: true; code: string; participantId: string; room: Room; ranking: Participant[] }> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hostNick, gameMode }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Erro ao criar sala temporária.");
  }
  return data;
}

export async function joinRoomApi(
  code: string,
  nick: string
): Promise<{ ok: true; participantId: string; room: Room; ranking: Participant[] }> {
  const cleanCode = code.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/${cleanCode}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Erro ao entrar na sala.");
  }
  return data;
}

export async function getRoomApi(
  code: string
): Promise<{ ok: true; room: Room; ranking: Participant[] }> {
  const cleanCode = code.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/${cleanCode}`);

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Sala não encontrada ou expirada.");
  }
  return data;
}

export async function heartbeatRoomApi(
  code: string,
  participantId: string
): Promise<{ ok: true; room: Room; ranking: Participant[] }> {
  const cleanCode = code.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/${cleanCode}/heartbeat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participantId }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Erro de sincronização da sala.");
  }
  return data;
}

export async function startRoomGameApi(
  code: string,
  participantId: string
): Promise<{ ok: true; room: Room; ranking: Participant[] }> {
  const cleanCode = code.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/${cleanCode}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participantId }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Erro ao iniciar jogo.");
  }
  return data;
}

export async function submitScoreApi(
  code: string,
  submission: ScoreSubmission
): Promise<{ ok: true; room: Room; ranking: Participant[] }> {
  const cleanCode = code.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/${cleanCode}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Erro ao submeter pontuação.");
  }
  return data;
}
