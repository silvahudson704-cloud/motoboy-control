"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { QUICK_ACTIONS } from "@/lib/constants";

interface QuickEntryTerminalProps {
  onSubmit: (text: string) => void;
}

export function QuickEntryTerminal({ onSubmit }: QuickEntryTerminalProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function send() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
    inputRef.current?.focus();
  }

  function handleQuickAction(actionText: string) {
    if (actionText.endsWith(" ")) {
      setText(actionText);
      inputRef.current?.focus();
    } else {
      onSubmit(actionText);
    }
  }

  return (
    <div className="safe-bottom sticky bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto px-3 pt-2 pb-1 [scrollbar-width:none]">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.text)}
            className="shrink-0 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-ink active:scale-95 transition-transform"
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
          placeholder='Ex: "mais uma de 15 no Diniz paga"'
          className="h-12 flex-1 rounded-full border border-border bg-elevated px-4 text-[15px] text-ink placeholder:text-muted outline-none focus:border-visor"
          inputMode="text"
          autoComplete="off"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-visor text-visor-ink active:scale-95 transition-transform disabled:opacity-40"
          disabled={!text.trim()}
        >
          <Send size={20} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
