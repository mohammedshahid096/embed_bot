import { Bot } from "lucide-react";
import type { ChatConfig } from "../types";

interface ChatHeaderProps {
  config: ChatConfig;
  onClose: () => void;
}

export default function ChatHeader({ config, onClose }: ChatHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        backgroundColor: config.theme.accentColor,
        borderTopLeftRadius: `${config.theme.borderRadius}px`,
        borderTopRightRadius: `${config.theme.borderRadius}px`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white leading-tight">
            {config.general.botName}
          </span>
          <span className="text-[10px] text-white/70 leading-tight">
            Online
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
        aria-label="Close chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 6-12 12" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
