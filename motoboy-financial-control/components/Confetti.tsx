"use client";

import { useEffect, useMemo } from "react";
import { PartyPopper } from "lucide-react";

interface ConfettiProps {
  active: boolean;
  onDone: () => void;
}

const COLORS = ["#FFC530", "#35D07F", "#FF8A3D", "#F4F7FA"];

export function Confetti({ active, onDone }: ConfettiProps) {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onDone, 2600);
    return () => clearTimeout(timer);
  }, [active, onDone]);

  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 0.9,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-10px] block h-2.5 w-1.5 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      <div className="animate-pop-in absolute left-1/2 top-24 -translate-x-1/2 rounded-2xl border border-visor/40 bg-elevated px-5 py-3 text-center shadow-card">
        <PartyPopper className="mx-auto mb-1 text-visor" size={22} />
        <p className="text-sm font-semibold">Meta diária batida!</p>
        <p className="text-[11px] text-muted">Bora fechar o dia com chave de ouro</p>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(110vh) rotate(540deg);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
