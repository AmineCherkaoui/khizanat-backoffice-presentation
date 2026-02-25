/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// --- Types ---

interface ResponsiveLineChartProps<T = any> {
  data: T[];
  /** The key in your data object for the X-axis (e.g., "date", "name") */
  xAxisKey: keyof T;
  /** The key in your data object for the Y-axis value (e.g., "price", "value") */
  dataKey: keyof T;
  /** Primary chart color (hex, rgb, etc.) */
  color?: string;
  /** Height of the chart container */
  height?: number | string;
  /** Label to show in tooltip (optional) */
  tooltipLabel?: string;
  /** Suffix for values (e.g., "$", "%", " kg") */
  unit?: string;
  /** Minimum width in pixels per data point before scrolling kicks in */
  minWidthPerPoint?: number;
}

// --- Custom Tooltip Component ---

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  unit?: string;
  color: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  unit = "",
  color,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="overflow-hidden rounded-md border backdrop-blur-md"
        style={{
          backgroundColor: `${color}20`,
          borderColor: color,
          padding: "8px 12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
          {label}
        </p>
        <p className="text-sm font-bold" style={{ color: color }}>
          {payload[0].value}
          <span className="ml-0.5 text-xs font-medium opacity-80">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ResponsiveLineChart({
  data,
  xAxisKey = "name" as any,
  dataKey = "value" as any,
  color = "#2dbcff",
  unit = "",
}: ResponsiveLineChartProps) {
  return (
    <div className="w-full relative group h-full">
      <div
        className="w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight="200px">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#000000"
              opacity={0.1}
            />

            <XAxis
              dataKey={xAxisKey as string}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
              interval="preserveStartEnd"
              minTickGap={30}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />

            <Tooltip
              content={<CustomTooltip unit={unit} color={color} />}
              cursor={{
                stroke: color,
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.5,
              }}
            />

            <Line
              type="monotone"
              dataKey={dataKey as string}
              stroke={color}
              strokeWidth={3}
              dot={
                data.length < 20 ? { r: 4, fill: color, strokeWidth: 0 } : false
              }
              activeDot={{ r: 6, strokeWidth: 0, fill: color }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
