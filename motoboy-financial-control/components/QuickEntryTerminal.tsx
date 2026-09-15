"use client";

import { useRef, useState } from "react";
import { Rocket } from "lucide-react";
import { QUICK_ACTIONS, QuickAction } from "@/lib/constants";

interface QuickEntryTerminalProps {
  onSubmit: (text: string) => void;
}

const kindClasses: Record<QuickAction["kind"], string> = {
  value: "border-visor/40 bg-visor/10 text-visor",
  status: "border-paid/40 bg-paid/10 text-paid",
  cost: "border-pending/40 bg-pending/10 text-pending",
};

export function QuickEntryTerminal({ onSubmit }: QuickEntryTerminalProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    // Mantém o foco/cursor no campo de texto após tocar num atalho.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function appendToInput(fragment: string) {
    setText((prev) => {
      const trimmed = prev.trimEnd();
      const next = trimmed.length ? `${trimmed} ${fragment}` : fragment;
      return next;
    });
    focusInput();
  }

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
    focusInput();
  }

  return (
    <div className="safe-bottom sticky bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto px-3 pt-2 pb-1 [scrollbar-width:none]">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => appendToInput(action.insert)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold active:scale-95 transition-transform ${kindClasses[action.kind]}`}
          >
            {action.label}
          </button>
        ))}
      </div>

      <form
        className="flex items-center gap-2 px-3 pb-3 pt-1"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Monte a mensagem: "Diniz 15 pago"'
          className="h-14 flex-1 rounded-full border border-border bg-elevated px-4 text-[15px] text-ink placeholder:text-muted outline-none focus:border-visor"
          inputMode="text"
          autoComplete="off"
        />
        <button
          type="submit"
          aria-label="Enviar corrida"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-visor text-visor-ink shadow-card active:scale-95 transition-transform disabled:opacity-40"
          disabled={!text.trim()}
        >
          <Rocket size={24} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
