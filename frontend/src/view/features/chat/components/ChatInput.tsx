import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import type { ChatConfig } from "../types";

interface ChatInputProps {
  config: ChatConfig;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  config,
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-gray-200 dark:border-white/10 px-3 py-3"
    >
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={config.inputPlaceholder}
        disabled={disabled}
        className="flex-1 resize-none border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder:text-gray-500"
        style={
          {
            "--tw-ring-color": `${config.accentColor}40`,
            ...(config.inputBgColor ? { backgroundColor: config.inputBgColor } : {}),
            ...(config.inputTextColor || config.textColor
              ? { color: config.inputTextColor || config.textColor }
              : {}),
            ...(config.inputBorderColor ? { borderColor: config.inputBorderColor } : {}),
            borderRadius: `${config.inputBorderRadius ?? 12}px`,
          } as React.CSSProperties
        }
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: config.buttonBgColor || config.accentColor,
          color: config.buttonTextColor || "#ffffff",
          borderRadius: `${config.buttonBorderRadius !== undefined ? Math.min(config.buttonBorderRadius, 16) : 12}px`,
        }}
        aria-label="Send message"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
}
