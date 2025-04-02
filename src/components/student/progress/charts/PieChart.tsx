
import React from "react";
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  tooltipFormatter?: (value: any) => string;
  label?: boolean | Function;
  outerRadius?: number;
  innerRadius?: number;
}

export const PieChart = ({
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  tooltipFormatter,
  label = false,
  outerRadius = 100,
  innerRadius = 0
}: PieChartProps) => {
  return (
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={label}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
        </RechartPieChart>
      </ResponsiveContainer>
    </div>
  );
};
