import { useState, useEffect } from "react";
import { Clock, Zap, DoorOpen } from "lucide-react";
import { formatTime } from "@/lib/ranking";

interface GameHudProps {
  startTime: number | null;
  playerNick: string;
  roomCode?: string;
  isActive: boolean;
  onQuit?: () => void;
}

export function GameHud({ startTime, playerNick, roomCode, isActive, onQuit }: GameHudProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  if (!isActive || !startTime) return null;

  // Bônus de velocidade decrescente lúdico
  // Começa em 500, cai 1 ponto a cada segundo até mínimo de 50
  const speedBonus = Math.max(50, 500 - elapsed * 2);

  return (
    <div className="sticky top-2 z-40 w-full mb-4 animate-slide-down">
      <div className="max-w-4xl mx-auto bg-slate-900/95 text-white backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-rose-500/50 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Plantonista, Sala & Status */}
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
          <div className="flex items-center gap-2 text-xs font-bold">
            {roomCode && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                SALA {roomCode}
              </span>
            )}
            <span className="text-slate-300">
              Plantonista: <strong className="text-white">{playerNick || "Enfermeiro(a)"}</strong>
            </span>
          </div>
        </div>

        {/* Cronômetro & Bônus de Velocidade */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-sm font-bold text-amber-300">
            <Clock size={15} className="animate-spin text-amber-400" />
            <span>{formatTime(elapsed)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400">
            <Zap size={14} className="text-yellow-400 fill-current" />
            <span>+{speedBonus} pts agilidade</span>
          </div>

          {onQuit && (
            <button
              onClick={onQuit}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Sair do jogo"
            >
              <DoorOpen size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
