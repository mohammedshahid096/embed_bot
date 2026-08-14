"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DashboardMessagePerDay } from "@/types/context/dashboard.types";

interface MessagesChartProps {
  data: DashboardMessagePerDay[];
}

export default function MessagesChart({ data }: MessagesChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    messages: item.count,
  }));

  return (
    <div className="rounded-2xl border border-white/10 bg-background/60 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Messages Per Day
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          Last 7 days
        </span>
      </h3>

      {chartData.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
          No message data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} barSize={32}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "13px",
              }}
              cursor={{ fill: "rgba(124, 58, 237, 0.08)" }}
            />
            <Bar
              dataKey="messages"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
