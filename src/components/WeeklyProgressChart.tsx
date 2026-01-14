import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { WeeklyProgress } from '@/types/habit';

interface WeeklyProgressChartProps {
  data: WeeklyProgress[];
}

export function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    percentage: Math.round((item.completed / item.total) * 100),
  }));

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(220 15% 18%)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(215 15% 55%)', fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220 15% 12%)',
              border: '1px solid hsl(220 15% 18%)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            labelStyle={{ color: 'hsl(210 20% 98%)' }}
            formatter={(value: number) => [`${value}%`, 'Completion']}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="hsl(142 71% 45%)"
            strokeWidth={2}
            fill="url(#colorCompleted)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
