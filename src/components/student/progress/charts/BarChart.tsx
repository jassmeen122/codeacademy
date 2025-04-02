
import React from "react";
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  yAxisLabel?: string;
  color?: string;
  tooltipFormatter?: (value: any) => string;
  name?: string;
}

export const BarChart = ({
  data,
  dataKey,
  xAxisKey,
  yAxisLabel,
  color = "#8884d8",
  tooltipFormatter,
  name
}: BarChartProps) => {
  return (
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          {yAxisLabel ? (
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          ) : (
            <YAxis />
          )}
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Bar dataKey={dataKey} fill={color} name={name || dataKey} />
        </RechartBarChart>
      </ResponsiveContainer>
    </div>
  );
};
