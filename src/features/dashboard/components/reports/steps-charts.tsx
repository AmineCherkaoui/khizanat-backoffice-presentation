/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          borderRadius: 12,
          backgroundColor: "#2dbcff27",
          backdropFilter: "blur(8px)",
          border: "1px solid #2dbcff",
          padding: "6px",
          textAlign: "center",
        }}
      >
        <p
          className="text-base-800 font-semibold mb-1 text-xs"
          style={{ margin: 0 }}
        >
          {label}
        </p>
        <p className="text-sm text-[#2dbcff] font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Chart({ data }: ChartProps) {
  const minWidthPerPoint = 60;
  const dynamicWidth = data.length * minWidthPerPoint;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",

        overflowX: "auto",
        overflowY: "hidden",

        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        style={{ width: "100%", minWidth: `${dynamicWidth}px`, height: "100%" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ right: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.8} />

            <XAxis
              dataKey="name"
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
              interval={0}
            />

            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#666" }} />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#2dbcff",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#2dbcff"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2dbcff", strokeWidth: 0 }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
