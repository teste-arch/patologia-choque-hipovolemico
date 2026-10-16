export interface Participant {
  id: string;
  nick: string;
  isHost: boolean;
  joinedAt: number;
  lastSeenAt: number;
  score: number;
  clinicalScore: number;
  timeBonus: number;
  timeSeconds: number;
  stars: number;
  status: string;
  hasFinished: boolean;
}

export interface Room {
  code: string;
  createdAt: number;
  lastActivityAt: number;
  gameMode: "caso_clinico" | "quiz_relampago";
  status: "waiting" | "playing" | "finished";
  participants: Participant[];
}

export interface ScoreSubmission {
  participantId: string;
  score: number;
  clinicalScore: number;
  timeBonus: number;
  timeSeconds: number;
  stars?: number;
  status?: string;
}

// 1 hora de inatividade como padrão inicial exigido
export const ROOM_INACTIVITY_TTL_MS = 60 * 60 * 1000;

// Armazenamento em memória volátil compartilhado na instância do servidor
// Salas são temporárias, sem persistência permanente
const rooms = new Map<string, Room>();
const expiredRooms = new Map<string, number>();

// Alfabeto legível para códigos de sala (sem caracteres ambíguos como 0/O, 1/I)
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  // Se por acaso já existir código idêntico ativo, gera outro
  if (rooms.has(code)) {
    return generateRoomCode();
  }
  return code;
}

function generateParticipantId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Remove salas que ficaram inativas por mais de 1 hora
 */
export function cleanupExpiredRooms(): void {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.lastActivityAt > ROOM_INACTIVITY_TTL_MS) {
      rooms.delete(code);
      expiredRooms.set(code, now);
    }
  }
  // Limpa histórico temporário de salas expiradas após 1 hora adicional
  for (const [code, expTime] of expiredRooms.entries()) {
    if (now - expTime > ROOM_INACTIVITY_TTL_MS) {
      expiredRooms.delete(code);
    }
  }
}

/**
 * Verifica se uma sala específica está expirada por inatividade
 */
export function isRoomExpired(room: Room): boolean {
  return Date.now() - room.lastActivityAt > ROOM_INACTIVITY_TTL_MS;
}


/**
 * Cria uma nova sala temporária com código único
 */
export function createRoom(
  hostNick: string,
  gameMode: "caso_clinico" | "quiz_relampago" = "caso_clinico"
): { room: Room; participantId: string } {
  cleanupExpiredRooms();

  const cleanNick = (hostNick || "Anfitrião").trim().slice(0, 25);
  const code = generateRoomCode();
  const now = Date.now();
  const participantId = generateParticipantId();

  const hostParticipant: Participant = {
    id: participantId,
    nick: cleanNick,
    isHost: true,
    joinedAt: now,
    lastSeenAt: now,
    score: 0,
    clinicalScore: 0,
    timeBonus: 0,
    timeSeconds: 0,
    stars: 0,
    status: "No lobby",
    hasFinished: false,
  };

  const room: Room = {
    code,
    createdAt: now,
    lastActivityAt: now,
    gameMode,
    status: "waiting",
    participants: [hostParticipant],
  };

  rooms.set(code, room);
  return { room, participantId };
}

/**
 * Busca uma sala ativa e atualiza sua atividade se não expirada
 */
export function getRoom(code: string): Room | null {
  cleanupExpiredRooms();
  const cleanCode = code.trim().toUpperCase();
  const room = rooms.get(cleanCode);

  if (!room) return null;
  if (isRoomExpired(room)) {
    rooms.delete(cleanCode);
    return null;
  }

  return room;
}

/**
 * Adiciona um participante a uma sala existente com validação de nickname
 */
export function joinRoom(
  code: string,
  nick: string
): { success: true; room: Room; participantId: string } | { success: false; error: string; status: number } {
  cleanupExpiredRooms();
  const cleanCode = code.trim().toUpperCase();
  const room = rooms.get(cleanCode);

  if (!room) {
    if (expiredRooms.has(cleanCode)) {
      return {
        success: false,
        error: "Esta sala expirou por inatividade (limite de 1 hora) e não está mais disponível.",
        status: 410,
      };
    }
    return { success: false, error: "Sala não encontrada. Verifique o código e tente novamente.", status: 404 };
  }

  if (isRoomExpired(room)) {
    rooms.delete(cleanCode);
    return {
      success: false,
      error: "Esta sala expirou por inatividade (limite de 1 hora) e não está mais disponível.",
      status: 410,
    };
  }

  const cleanNick = nick.trim().slice(0, 25);
  if (!cleanNick || cleanNick.length < 2) {
    return { success: false, error: "O nickname deve ter entre 2 e 25 caracteres.", status: 400 };
  }

  // Impede nicknames duplicados na mesma sala
  const alreadyExists = room.participants.some(
    (p) => p.nick.toLowerCase() === cleanNick.toLowerCase()
  );

  if (alreadyExists) {
    return {
      success: false,
      error: `O nickname "${cleanNick}" já está em uso nesta sala. Por favor, escolha outro apelido!`,
      status: 409,
    };
  }

  const now = Date.now();
  const participantId = generateParticipantId();

  const newParticipant: Participant = {
    id: participantId,
    nick: cleanNick,
    isHost: false,
    joinedAt: now,
    lastSeenAt: now,
    score: 0,
    clinicalScore: 0,
    timeBonus: 0,
    timeSeconds: 0,
    stars: 0,
    status: "No lobby",
    hasFinished: false,
  };

  room.participants.push(newParticipant);
  room.lastActivityAt = now;

  return { success: true, room, participantId };
}

/**
 * Atualiza heartbeat e mantém sala ativa enquanto houver participantes jogando
 */
export function heartbeat(
  code: string,
  participantId: string
): { success: true; room: Room } | { success: false; error: string; status: number } {
  cleanupExpiredRooms();
  const cleanCode = code.trim().toUpperCase();
  const room = rooms.get(cleanCode);

  if (!room) {
    return { success: false, error: "Sala não encontrada.", status: 404 };
  }

  if (isRoomExpired(room)) {
    rooms.delete(cleanCode);
    return { success: false, error: "Esta sala expirou por inatividade.", status: 410 };
  }

  const now = Date.now();
  const participant = room.participants.find((p) => p.id === participantId);

  if (participant) {
    participant.lastSeenAt = now;
  }

  // Atualiza atividade da sala para evitar expiração prematura durante o jogo
  room.lastActivityAt = now;

  return { success: true, room };
}

/**
 * Inicia a partida para todos na sala
 */
export function startRoomGame(
  code: string,
  participantId: string
): { success: true; room: Room } | { success: false; error: string; status: number } {
  const room = getRoom(code);
  if (!room) {
    return { success: false, error: "Sala não encontrada ou expirada.", status: 404 };
  }

  const participant = room.participants.find((p) => p.id === participantId);
  if (!participant) {
    return { success: false, error: "Participante não encontrado nesta sala.", status: 403 };
  }

  room.status = "playing";
  room.lastActivityAt = Date.now();
  return { success: true, room };
}

/**
 * Submete pontuação individual para o ranking daquela sala
 */
export function submitScore(
  code: string,
  data: ScoreSubmission
): { success: true; room: Room } | { success: false; error: string; status: number } {
  cleanupExpiredRooms();
  const cleanCode = code.trim().toUpperCase();
  const room = rooms.get(cleanCode);

  if (!room) {
    return { success: false, error: "Sala não encontrada ou expirada.", status: 404 };
  }

  const participant = room.participants.find((p) => p.id === data.participantId);
  if (!participant) {
    return { success: false, error: "Participante não encontrado nesta sala.", status: 404 };
  }

  participant.score = data.score;
  participant.clinicalScore = data.clinicalScore;
  participant.timeBonus = data.timeBonus;
  participant.timeSeconds = data.timeSeconds;
  participant.stars = data.stars ?? 3;
  participant.status = data.status ?? "Concluído";
  participant.hasFinished = true;
  participant.lastSeenAt = Date.now();

  room.lastActivityAt = Date.now();

  // Se todos finalizaram, muda status da sala
  const allFinished = room.participants.every((p) => p.hasFinished);
  if (allFinished) {
    room.status = "finished";
  }

  return { success: true, room };
}

/**
 * Retorna o ranking ordenado de uma sala específica
 */
export function getRoomRanking(room: Room): Participant[] {
  return [...room.participants].sort((a, b) => {
    // Quem tem maior pontuação fica primeiro
    if (b.score !== a.score) return b.score - a.score;
    // Em caso de empate de pontos, quem demorou menos tempo vence
    return a.timeSeconds - b.timeSeconds;
  });
}

/**
 * Reseta o armazenamento de salas (usado para testes automatizados)
 */
export function resetRoomsStore(): void {
  rooms.clear();
  expiredRooms.clear();
}

/**
 * Roteador HTTP padrão para responder a requisições /api/rooms
 */
export async function handleRoomsApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/rooms\/?/, "");
  const method = request.method;

  const corsHeaders = {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. POST /api/rooms (Cria sala)
    if (!path && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as {
        hostNick?: string;
        gameMode?: "caso_clinico" | "quiz_relampago";
      };
      const result = createRoom(body.hostNick || "Anfitrião", body.gameMode || "caso_clinico");
      return new Response(
        JSON.stringify({
          ok: true,
          code: result.room.code,
          participantId: result.participantId,
          room: result.room,
          ranking: getRoomRanking(result.room),
        }),
        { status: 201, headers: corsHeaders }
      );
    }

    const segments = path.split("/").filter(Boolean);
    const roomCode = segments[0];
    const action = segments[1];

    if (!roomCode) {
      return new Response(JSON.stringify({ ok: false, error: "Rota inválida." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 2. GET /api/rooms/:code (Consulta sala e ranking)
    if (segments.length === 1 && method === "GET") {
      const room = getRoom(roomCode);
      if (!room) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: "Esta sala expirou por inatividade ou não existe.",
          }),
          { status: 404, headers: corsHeaders }
        );
      }
      return new Response(
        JSON.stringify({
          ok: true,
          room,
          ranking: getRoomRanking(room),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3. POST /api/rooms/:code/join (Entra na sala)
    if (action === "join" && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as { nick?: string };
      const result = joinRoom(roomCode, body.nick || "");
      if (!result.success) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: result.status,
          headers: corsHeaders,
        });
      }
      return new Response(
        JSON.stringify({
          ok: true,
          participantId: result.participantId,
          room: result.room,
          ranking: getRoomRanking(result.room),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 4. POST /api/rooms/:code/heartbeat (Sincronização periódica)
    if (action === "heartbeat" && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as { participantId?: string };
      const result = heartbeat(roomCode, body.participantId || "");
      if (!result.success) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: result.status,
          headers: corsHeaders,
        });
      }
      return new Response(
        JSON.stringify({
          ok: true,
          room: result.room,
          ranking: getRoomRanking(result.room),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 5. POST /api/rooms/:code/start (Inicia a partida)
    if (action === "start" && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as { participantId?: string };
      const result = startRoomGame(roomCode, body.participantId || "");
      if (!result.success) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: result.status,
          headers: corsHeaders,
        });
      }
      return new Response(
        JSON.stringify({
          ok: true,
          room: result.room,
          ranking: getRoomRanking(result.room),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 6. POST /api/rooms/:code/score (Envia pontuação)
    if (action === "score" && method === "POST") {
      const body = (await request.json().catch(() => ({}))) as ScoreSubmission;
      const result = submitScore(roomCode, body);
      if (!result.success) {
        return new Response(JSON.stringify({ ok: false, error: result.error }), {
          status: result.status,
          headers: corsHeaders,
        });
      }
      return new Response(
        JSON.stringify({
          ok: true,
          room: result.room,
          ranking: getRoomRanking(result.room),
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ ok: false, error: "Ação não encontrada." }), {
      status: 404,
      headers: corsHeaders,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || "Erro interno do servidor." }),
      { status: 500, headers: corsHeaders }
    );
  }
}
