"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DashboardTokenUsage } from "@/types/context/dashboard.types";

interface TokenUsageChartProps {
  tokenUsage: DashboardTokenUsage;
}

const COLORS = ["#7c3aed", "#3b82f6"];

function formatTokens(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function TokenUsageChart({ tokenUsage }: TokenUsageChartProps) {
  const data = [
    { name: "Input Tokens", value: tokenUsage.totalInputTokens },
    { name: "Output Tokens", value: tokenUsage.totalOutputTokens },
  ];

  const isEmpty = tokenUsage.totalTokens === 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Token Usage
      </h3>

      {isEmpty ? (
        <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
          No token usage data
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "13px",
                }}
                formatter={(value: number) => formatTokens(value)}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Input Tokens</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatTokens(tokenUsage.totalInputTokens)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Output Tokens</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatTokens(tokenUsage.totalOutputTokens)}
                </p>
              </div>
            </div>
            <div className="mt-2 border-t border-white/10 pt-2">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">
                {formatTokens(tokenUsage.totalTokens)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
