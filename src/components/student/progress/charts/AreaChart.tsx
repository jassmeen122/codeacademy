
import React from "react";
import { 
  AreaChart as RechartAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface AreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  yAxisLabel?: string;
  color?: string;
  gradientId?: string;
  tooltipFormatter?: (value: any) => string;
}

export const AreaChart = ({ 
  data, 
  dataKey, 
  xAxisKey, 
  yAxisLabel, 
  color = "#8884d8", 
  gradientId = "colorData",
  tooltipFormatter
}: AreaChartProps) => {
  return (
    <div className="h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartAreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis dataKey={xAxisKey} />
          {yAxisLabel && (
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          )}
          {!yAxisLabel && <YAxis />}
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={tooltipFormatter} />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#${gradientId})`} 
          />
        </RechartAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
