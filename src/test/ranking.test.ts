import { describe, expect, it, beforeEach } from "vitest";
import {
  getRanking,
  saveRankingEntry,
  resetRanking,
  getPlayerNick,
  setPlayerNick,
  formatTime,
} from "@/lib/ranking";

describe("Ranking and Nickname System", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles player nickname persistence", () => {
    expect(getPlayerNick()).toBe("");
    setPlayerNick("Enf. Paula");
    expect(getPlayerNick()).toBe("Enf. Paula");
  });

  it("formats seconds into MM:SS correctly", () => {
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(132)).toBe("02:12");
  });

  it("returns default ranking when storage is empty", () => {
    const list = getRanking();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].score).toBeGreaterThanOrEqual(list[1].score);
  });

  it("saves a new ranking entry and sorts properly", () => {
    saveRankingEntry({
      nick: "Super Plantonista",
      score: 2500,
      clinicalScore: 2000,
      timeBonus: 500,
      timeSeconds: 45,
      mode: "caso_clinico",
      stars: 3,
      status: "Lucas Salvo 🌟",
    });

    const list = getRanking();
    expect(list[0].nick).toBe("Super Plantonista");
    expect(list[0].score).toBe(2500);
  });
});
