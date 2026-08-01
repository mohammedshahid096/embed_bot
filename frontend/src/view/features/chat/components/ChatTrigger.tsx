import { MessageCircle } from "lucide-react";
import type { ChatConfig } from "../types";

interface ChatTriggerProps {
  config: ChatConfig;
  onClick: () => void;
}

export default function ChatTrigger({ config, onClick }: ChatTriggerProps) {
  const bg = config.buttonBgColor || config.accentColor;
  const textColor = config.buttonTextColor || "#ffffff";
  const rawWidth = config.buttonWidth || 56;
  const maxWidth = config.buttonMaxWidth || 160;
  const actualWidth = Math.min(rawWidth, maxWidth);
  const isWide = actualWidth > 70;

  return (
    <button
      onClick={onClick}
      className="flex h-14 items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden flex-shrink-0 cursor-pointer"
      style={{
        backgroundColor: bg,
        color: textColor,
        boxShadow: `0 8px 24px ${bg}40`,
        borderRadius: `${config.buttonBorderRadius ?? 28}px`,
        width: `${actualWidth}px`,
        minWidth: `${actualWidth}px`,
        maxWidth: `${maxWidth}px`,
        paddingLeft: isWide ? "16px" : "0px",
        paddingRight: isWide ? "16px" : "0px",
      }}
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6 flex-shrink-0" />
      {isWide && (
        <span className="text-sm font-semibold truncate whitespace-nowrap">
          {config.botName || "Chat"}
        </span>
      )}
    </button>
  );
}
