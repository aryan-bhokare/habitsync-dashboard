import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { HeatmapDay } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  data: HeatmapDay[];
}

const CELL_SIZE = 12;
const CELL_GAP = 3;
const WEEKS = 52;
const DAYS = 7;

const levelColors: Record<number, string> = {
  0: 'bg-heatmap-empty',
  1: 'bg-heatmap-low',
  2: 'bg-heatmap-medium',
  3: 'bg-heatmap-high',
  4: 'bg-heatmap-max',
};

const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function Heatmap({ data }: HeatmapProps) {
  const grid = useMemo(() => {
    const weeks: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];

    // Fill in leading empty days for the first week
    const firstDate = new Date(data[0]?.date);
    const firstDayOfWeek = firstDate.getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }

    data.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit">
        {/* Month labels */}
        <div className="flex mb-2 pl-8">
          {monthLabels.map((month, i) => (
            <div
              key={month}
              className="text-xs text-muted-foreground"
              style={{ width: `${(WEEKS / 12) * (CELL_SIZE + CELL_GAP)}px` }}
            >
              {month}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col justify-around pr-2">
            {dayLabels.map((label, i) => (
              <span key={i} className="text-xs text-muted-foreground h-3 leading-3">
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {grid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: (weekIndex * 7 + dayIndex) * 0.001,
                      duration: 0.2,
                    }}
                    className={cn(
                      'heatmap-cell',
                      levelColors[day.level]
                    )}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                    title={day.date ? `${day.date}: ${day.count} completions` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn('heatmap-cell', levelColors[level])}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
