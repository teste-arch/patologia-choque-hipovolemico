import { describe, expect, it, beforeEach } from "vitest";
import {
  createRoom,
  getRoom,
  joinRoom,
  heartbeat,
  submitScore,
  getRoomRanking,
  resetRoomsStore,
  cleanupExpiredRooms,
  handleRoomsApiRequest,
  ROOM_INACTIVITY_TTL_MS,
  isRoomExpired,
} from "@/lib/rooms-service";

describe("Temporary Rooms and Isolated Ranking Service", () => {
  beforeEach(() => {
    resetRoomsStore();
  });

  it("creates a room with unique code, host participant, and 1-hour expiration timestamp", () => {
    const { room, participantId } = createRoom("Dra. Paula", "caso_clinico");

    expect(room.code).toHaveLength(6);
    expect(room.status).toBe("waiting");
    expect(room.participants).toHaveLength(1);
    expect(room.participants[0].id).toBe(participantId);
    expect(room.participants[0].nick).toBe("Dra. Paula");
    expect(room.participants[0].isHost).toBe(true);

    const fetched = getRoom(room.code);
    expect(fetched).not.toBeNull();
    expect(fetched?.code).toBe(room.code);
  });

  it("allows other participants to join with unique nicknames", () => {
    const { room } = createRoom("Anfitrião");

    const join1 = joinRoom(room.code, "Enf. Marcos");
    expect(join1.success).toBe(true);
    if (!join1.success) return;

    expect(join1.room.participants).toHaveLength(2);
    expect(join1.room.participants[1].nick).toBe("Enf. Marcos");
    expect(join1.room.participants[1].isHost).toBe(false);
  });

  it("rejects duplicate nicknames within the same room (case-insensitive)", () => {
    const { room } = createRoom("Enf. Clara");

    const duplicate1 = joinRoom(room.code, "enf. clara");
    expect(duplicate1.success).toBe(false);
    if (duplicate1.success) return;
    expect(duplicate1.status).toBe(409);
    expect(duplicate1.error).toContain("já está em uso nesta sala");

    const duplicate2 = joinRoom(room.code, "  ENF. CLARA  ");
    expect(duplicate2.success).toBe(false);
  });

  it("isolates participants, rankings, and scores between different rooms", () => {
    const roomA = createRoom("Host A");
    const roomB = createRoom("Host B");

    joinRoom(roomA.room.code, "Aluno 1");
    joinRoom(roomB.room.code, "Aluno 2");

    const fetchedA = getRoom(roomA.room.code);
    const fetchedB = getRoom(roomB.room.code);

    expect(fetchedA?.participants.map((p) => p.nick)).toEqual(["Host A", "Aluno 1"]);
    expect(fetchedB?.participants.map((p) => p.nick)).toEqual(["Host B", "Aluno 2"]);

    // Nickname Aluno 1 can be used in Room B because rooms are strictly isolated!
    const joinInOtherRoom = joinRoom(roomB.room.code, "Aluno 1");
    expect(joinInOtherRoom.success).toBe(true);
  });

  it("submits scores and sorts room ranking correctly", () => {
    const { room, participantId: p1Id } = createRoom("Dr. House");
    const joinResult = joinRoom(room.code, "Enf. Amanda");
    if (!joinResult.success) throw new Error("Join failed");
    const p2Id = joinResult.participantId;

    // Dr. House scores 1200
    submitScore(room.code, {
      participantId: p1Id,
      score: 1200,
      clinicalScore: 900,
      timeBonus: 300,
      timeSeconds: 95,
      stars: 3,
      status: "Lucas Salvo 🌟",
    });

    // Enf. Amanda scores 1450 (faster, higher score)
    submitScore(room.code, {
      participantId: p2Id,
      score: 1450,
      clinicalScore: 1000,
      timeBonus: 450,
      timeSeconds: 68,
      stars: 3,
      status: "Conduta Perfeita 🌟",
    });

    const updatedRoom = getRoom(room.code);
    if (!updatedRoom) throw new Error("Room not found");

    const ranking = getRoomRanking(updatedRoom);
    expect(ranking).toHaveLength(2);
    expect(ranking[0].nick).toBe("Enf. Amanda");
    expect(ranking[0].score).toBe(1450);
    expect(ranking[1].nick).toBe("Dr. House");
    expect(ranking[1].score).toBe(1200);
  });

  it("automatically expires a room inactive for more than 1 hour and rejects joins", () => {
    const { room } = createRoom("Host Inativo");

    // Simula 1 hora e 2 minutos de inatividade
    room.lastActivityAt = Date.now() - (ROOM_INACTIVITY_TTL_MS + 2 * 60 * 1000);

    const tryGet = getRoom(room.code);
    expect(tryGet).toBeNull();

    const tryJoin = joinRoom(room.code, "Novo Aluno");
    expect(tryJoin.success).toBe(false);
    if (tryJoin.success) return;
    expect(tryJoin.status).toBe(410);
    expect(tryJoin.error).toContain("expirou por inatividade");
  });

  it("heartbeat keeps active game alive and updates lastSeenAt and lastActivityAt", () => {
    const { room, participantId } = createRoom("Plantonista Ativo");
    const oldActivity = Date.now() - 30 * 60 * 1000; // 30 minutos atrás
    room.lastActivityAt = oldActivity;

    const hb = heartbeat(room.code, participantId);
    expect(hb.success).toBe(true);
    if (!hb.success) return;

    expect(hb.room.lastActivityAt).toBeGreaterThan(oldActivity);
    expect(isRoomExpired(hb.room)).toBe(false);
  });

  it("handles HTTP API requests via handleRoomsApiRequest", async () => {
    // 1. Create room via POST
    const createReq = new Request("http://localhost:3000/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostNick: "Prof. Paula", gameMode: "quiz_relampago" }),
    });

    const createRes = await handleRoomsApiRequest(createReq);
    expect(createRes.status).toBe(201);
    const createData = (await createRes.json()) as any;
    expect(createData.ok).toBe(true);
    expect(createData.code).toHaveLength(6);

    // 2. Query room via GET
    const getReq = new Request(`http://localhost:3000/api/rooms/${createData.code}`, {
      method: "GET",
    });
    const getRes = await handleRoomsApiRequest(getReq);
    expect(getRes.status).toBe(200);
    const getData = (await getRes.json()) as any;
    expect(getData.room.participants[0].nick).toBe("Prof. Paula");

    // 3. Join room via POST
    const joinReq = new Request(`http://localhost:3000/api/rooms/${createData.code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nick: "Estudante 1" }),
    });
    const joinRes = await handleRoomsApiRequest(joinReq);
    expect(joinRes.status).toBe(200);
    const joinData = (await joinRes.json()) as any;
    expect(joinData.room.participants).toHaveLength(2);
  });
});
