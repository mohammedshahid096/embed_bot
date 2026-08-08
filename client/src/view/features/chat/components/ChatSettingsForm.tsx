import {
  Bot,
  Type,
  Palette,
  Paintbrush,
  Sliders,
  User,
  MessageCircle,
  Square,
  MousePointerClick,
  MessageSquareText,
  MoveHorizontal,
  Maximize2,
  Edit3,
  Sparkles,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChatConfig, ChatTheme, DeepPartial } from "@/view/features/chat";
import themesData from "../data/themes.json";

const PRESET_COLORS = [
  "#7c3aed", // purple
  "#2563eb", // blue
  "#0891b2", // cyan
  "#059669", // emerald
  "#d97706", // amber
  "#dc2626", // red
  "#db2777", // pink
  "#4f46e5", // indigo
  "#0f172a", // slate dark
  "#ffffff", // pure white
];

const BORDER_RADIUS_PRESETS = [
  { label: "Square", value: 0 },
  { label: "Small", value: 8 },
  { label: "Smooth", value: 16 },
  { label: "Curved", value: 24 },
  { label: "Pill", value: 32 },
];

interface ChatSettingsFormProps {
  config: ChatConfig;
  onConfigChange: <G extends keyof ChatConfig>(
    group: G,
    key: keyof ChatConfig[G],
    value: string | number,
  ) => void;
  onApplyTheme?: (themeConfig: DeepPartial<ChatConfig>) => void;
}

export default function ChatSettingsForm({
  config,
  onConfigChange,
  onApplyTheme,
}: ChatSettingsFormProps) {
  const renderColorPicker = <G extends keyof ChatConfig>(
    label: string,
    group: G,
    key: keyof ChatConfig[G] & string,
    value: string,
    placeholder: string,
    helperText: string,
    icon: React.ReactNode,
  ) => {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          {icon}
          {label}
        </label>

        {/* Preset swatches */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_COLORS.map((color) => {
            const isActive = value === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => onConfigChange(group, key, color)}
                className="relative h-8 w-8 rounded-lg border border-white/20 transition-all duration-150 hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: color,
                  boxShadow: isActive
                    ? `0 0 0 2px var(--background), 0 0 0 4px ${color === "#ffffff" ? "#cbd5e1" : color}`
                    : "none",
                }}
                aria-label={`Select ${label} ${color}`}
              >
                {isActive && (
                  <svg
                    className={`absolute inset-0 m-auto h-4 w-4 ${
                      color === "#ffffff" || color.startsWith("#f")
                        ? "text-black"
                        : "text-white"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom color input */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={value || "#7c3aed"}
              onChange={(e) => onConfigChange(group, key, e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
            />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || val === "") {
                onConfigChange(group, key, val);
              }
            }}
            placeholder={placeholder}
            maxLength={7}
            className="w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
          />
          <div
            className="h-10 flex-1 rounded-lg border border-white/10 flex items-center justify-center text-xs font-medium"
            style={{
              backgroundColor: value || "var(--muted)",
              color:
                value === "#ffffff" || value.startsWith("#f")
                  ? "#000"
                  : value
                    ? "#fff"
                    : "var(--foreground)",
            }}
          >
            {value ? "Preview" : "Default"}
          </div>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground/70">{helperText}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* CARD 0: Preset Theme Templates */}
      <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Preset Theme Templates
          </CardTitle>
          <CardDescription>
            Select a pre-configured theme template to instantly style your chatbot. All values will populate the controls below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(themesData as ChatTheme[]).map((theme) => {
              const isSelected =
                config.theme.accentColor === theme.config.theme?.accentColor &&
                (config.theme.backgroundColor === theme.config.theme?.backgroundColor ||
                  (!config.theme.backgroundColor && theme.config.theme?.backgroundColor === "#ffffff"));

              return (
                <div
                  key={theme.id}
                  onClick={() => onApplyTheme?.(theme.config)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/30 shadow-purple-500/10"
                      : "border-white/10 bg-background/50 hover:border-white/20 hover:bg-background/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                        {theme.name}
                      </span>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3">
                      {theme.description}
                    </p>
                  </div>

                  {/* Swatches preview badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      {theme.previewColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-purple-400 group-hover:underline">
                      Apply →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CARD 1: Bot Identity & Content */}
      <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            Bot Identity & Content
          </CardTitle>
          <CardDescription>
            Configure bot name, welcome greeting, and input placeholder text.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Bot Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Bot className="h-4 w-4 text-purple-400" />
              Bot Name
            </label>
            <input
              type="text"
              value={config.general.botName}
              onChange={(e) => onConfigChange("general", "botName", e.target.value)}
              placeholder="My Chatbot"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
            />
            <p className="mt-1 text-xs text-muted-foreground/70">
              Displayed in the chat header to your visitors.
            </p>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MessageSquareText className="h-4 w-4 text-purple-400" />
              Welcome Greeting Message
            </label>
            <input
              type="text"
              value={config.general.welcomeMessage}
              onChange={(e) => onConfigChange("general", "welcomeMessage", e.target.value)}
              placeholder="Hello! How can I help you today?"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
            />
            <p className="mt-1 text-xs text-muted-foreground/70">
              Greeting message displayed when the user opens the chat for the first time.
            </p>
          </div>

          {/* Input Placeholder */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Type className="h-4 w-4 text-purple-400" />
              Input Placeholder
            </label>
            <input
              type="text"
              value={config.general.inputPlaceholder}
              onChange={(e) =>
                onConfigChange("general", "inputPlaceholder", e.target.value)
              }
              placeholder="Type your message..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
            />
            <p className="mt-1 text-xs text-muted-foreground/70">
              Shown inside the message input before the user starts typing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Theme & Window Layout */}
      <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-400" />
            Theme & Window Layout
          </CardTitle>
          <CardDescription>
            Customize the chat window background, border, text color, and corner roundness.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Accent Color */}
          {renderColorPicker(
            "Accent Color",
            "theme",
            "accentColor",
            config.theme.accentColor,
            "#7c3aed",
            "Applied to the chat header and default highlights.",
            <Palette className="h-4 w-4 text-purple-400" />,
          )}

          {/* Background Color */}
          {renderColorPicker(
            "Widget Background Color",
            "theme",
            "backgroundColor",
            config.theme.backgroundColor,
            "#ffffff",
            "Background color of the chat popup window.",
            <Paintbrush className="h-4 w-4 text-purple-400" />,
          )}

          {/* General Text Color */}
          {renderColorPicker(
            "General Text Color",
            "theme",
            "textColor",
            config.theme.textColor,
            "Default theme",
            "General text color across the chatbot window.",
            <Type className="h-4 w-4 text-purple-400" />,
          )}

          {/* Widget Border Color */}
          {renderColorPicker(
            "Widget Border Color",
            "theme",
            "borderColor",
            config.theme.borderColor,
            "Default border",
            "Border color around the chat popup window.",
            <Square className="h-4 w-4 text-purple-400" />,
          )}

          {/* Border Radius */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sliders className="h-4 w-4 text-purple-400" />
                Border Radius
              </label>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {config.theme.borderRadius}px
              </span>
            </div>

            {/* Border radius presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {BORDER_RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onConfigChange("theme", "borderRadius", preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    config.theme.borderRadius === preset.value
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "bg-background border-input text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {preset.label} ({preset.value}px)
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={32}
                step={1}
                value={config.theme.borderRadius}
                onChange={(e) =>
                  onConfigChange("theme", "borderRadius", Number(e.target.value))
                }
                className="flex-1 accent-purple-600 h-2 bg-muted rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={32}
                value={config.theme.borderRadius}
                onChange={(e) =>
                  onConfigChange(
                    "theme",
                    "borderRadius",
                    Math.min(32, Math.max(0, Number(e.target.value))),
                  )
                }
                className="w-16 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm font-mono text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              Corner roundness of the chat popup window.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 3: Button Styles */}
      <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MousePointerClick className="h-5 w-5 text-purple-400" />
            Button Styles
          </CardTitle>
          <CardDescription>
            Style the floating launcher button and send message action button.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Button Background Color */}
          {renderColorPicker(
            "Button Background Color",
            "button",
            "bgColor",
            config.button.bgColor,
            "Default accent color",
            "Background color for the floating launcher button & send button.",
            <MousePointerClick className="h-4 w-4 text-purple-400" />,
          )}

          {/* Button Icon / Text Color */}
          {renderColorPicker(
            "Button Icon Color",
            "button",
            "textColor",
            config.button.textColor,
            "#ffffff",
            "Icon and text color inside action buttons.",
            <MousePointerClick className="h-4 w-4 text-purple-400" />,
          )}

          {/* Button Border Radius */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sliders className="h-4 w-4 text-purple-400" />
                Button Border Radius
              </label>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {config.button.borderRadius ?? 28}px
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "Square", value: 0 },
                { label: "Small", value: 8 },
                { label: "Smooth", value: 16 },
                { label: "Circle", value: 28 },
                { label: "Pill", value: 32 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onConfigChange("button", "borderRadius", preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    (config.button.borderRadius ?? 28) === preset.value
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "bg-background border-input text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {preset.label} ({preset.value}px)
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={32}
                step={1}
                value={config.button.borderRadius ?? 28}
                onChange={(e) =>
                  onConfigChange("button", "borderRadius", Number(e.target.value))
                }
                className="flex-1 accent-purple-600 h-2 bg-muted rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={32}
                value={config.button.borderRadius ?? 28}
                onChange={(e) =>
                  onConfigChange(
                    "button",
                    "borderRadius",
                    Math.min(32, Math.max(0, Number(e.target.value))),
                  )
                }
                className="w-16 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm font-mono text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              Corner roundness of action buttons.
            </p>
          </div>

          {/* Button Width */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MoveHorizontal className="h-4 w-4 text-purple-400" />
                Button Width
              </label>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {config.button.width || 56}px
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "Icon Only", value: 56 },
                { label: "Medium", value: 100 },
                { label: "Wide", value: 140 },
                { label: "Full", value: 160 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onConfigChange("button", "width", preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    (config.button.width || 56) === preset.value
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "bg-background border-input text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {preset.label} ({preset.value}px)
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={56}
                max={200}
                step={4}
                value={config.button.width || 56}
                onChange={(e) =>
                  onConfigChange("button", "width", Number(e.target.value))
                }
                className="flex-1 accent-purple-600 h-2 bg-muted rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={56}
                max={200}
                value={config.button.width || 56}
                onChange={(e) =>
                  onConfigChange(
                    "button",
                    "width",
                    Math.min(200, Math.max(56, Number(e.target.value))),
                  )
                }
                className="w-16 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm font-mono text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              Width of the launcher button (expands to show bot name when wide).
            </p>
          </div>

          {/* Button Max Width */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Maximize2 className="h-4 w-4 text-purple-400" />
                Button Max Width Limit
              </label>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {config.button.maxWidth || 160}px
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "120px", value: 120 },
                { label: "140px", value: 140 },
                { label: "160px", value: 160 },
                { label: "200px", value: 200 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onConfigChange("button", "maxWidth", preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    (config.button.maxWidth || 160) === preset.value
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "bg-background border-input text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={100}
                max={240}
                step={10}
                value={config.button.maxWidth || 160}
                onChange={(e) =>
                  onConfigChange("button", "maxWidth", Number(e.target.value))
                }
                className="flex-1 accent-purple-600 h-2 bg-muted rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={100}
                max={240}
                value={config.button.maxWidth || 160}
                onChange={(e) =>
                  onConfigChange(
                    "button",
                    "maxWidth",
                    Math.min(240, Math.max(100, Number(e.target.value))),
                  )
                }
                className="w-16 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm font-mono text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              Maximum width cap for the launcher button.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 4: Input Field Customization */}
      <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-purple-400" />
            Input Field Customization
          </CardTitle>
          <CardDescription>
            Customize the message textarea background, text color, border color, and corner roundness.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Input Background Color */}
          {renderColorPicker(
            "Input Background Color",
            "input",
            "bgColor",
            config.input.bgColor,
            "Default background",
            "Background color of the message input box.",
            <Paintbrush className="h-4 w-4 text-purple-400" />,
          )}

          {/* Input Text Color */}
          {renderColorPicker(
            "Input Text Color",
            "input",
            "textColor",
            config.input.textColor,
            "Default text color",
            "Text color inside the message input box.",
            <Type className="h-4 w-4 text-purple-400" />,
          )}

          {/* Input Border Color */}
          {renderColorPicker(
            "Input Border Color",
            "input",
            "borderColor",
            config.input.borderColor,
            "Default border",
            "Border color around the message input box.",
            <Square className="h-4 w-4 text-purple-400" />,
          )}

          {/* Input Border Radius */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sliders className="h-4 w-4 text-purple-400" />
                Input Border Radius
              </label>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {config.input.borderRadius ?? 12}px
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { label: "Square", value: 0 },
                { label: "Small", value: 6 },
                { label: "Smooth", value: 12 },
                { label: "Curved", value: 18 },
                { label: "Pill", value: 24 },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onConfigChange("input", "borderRadius", preset.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    (config.input.borderRadius ?? 12) === preset.value
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                      : "bg-background border-input text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {preset.label} ({preset.value}px)
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={config.input.borderRadius ?? 12}
                onChange={(e) =>
                  onConfigChange("input", "borderRadius", Number(e.target.value))
                }
                className="flex-1 accent-purple-600 h-2 bg-muted rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={24}
                value={config.input.borderRadius ?? 12}
                onChange={(e) =>
                  onConfigChange(
                    "input",
                    "borderRadius",
                    Math.min(24, Math.max(0, Number(e.target.value))),
                  )
                }
                className="w-16 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm font-mono text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              Corner roundness of the message input textarea box.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CARD 5: Message Customization */}
      <Card className="border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-purple-400" />
            Message Customization
          </CardTitle>
          <CardDescription>
            Tailor the appearance of bot responses and human user message bubbles.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Bot Message Text Color */}
          {renderColorPicker(
            "Bot Message Text Color",
            "messages",
            "botTextColor",
            config.messages.botTextColor,
            "Default theme",
            "Custom text color specifically for bot responses.",
            <Bot className="h-4 w-4 text-purple-400" />,
          )}

          {/* Bot Message Background Color */}
          {renderColorPicker(
            "Bot Message Background Color",
            "messages",
            "botBgColor",
            config.messages.botBgColor,
            "Default soft gray",
            "Custom background color for bot response bubbles.",
            <Bot className="h-4 w-4 text-purple-400" />,
          )}

          {/* User Message Background Color */}
          {renderColorPicker(
            "Human Response Background Color",
            "messages",
            "userBgColor",
            config.messages.userBgColor,
            "Default accent color",
            "Custom background color for human / user message bubbles.",
            <User className="h-4 w-4 text-purple-400" />,
          )}

          {/* User Message Text Color */}
          {renderColorPicker(
            "Human Response Text Color",
            "messages",
            "userTextColor",
            config.messages.userTextColor,
            "#ffffff",
            "Custom text color for human / user message bubbles.",
            <User className="h-4 w-4 text-purple-400" />,
          )}
        </CardContent>
      </Card>
    </div>
  );
}
