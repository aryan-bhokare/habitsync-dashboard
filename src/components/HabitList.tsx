import { motion, AnimatePresence } from 'framer-motion';
import { HabitCard } from './HabitCard';
import type { Habit } from '@/types/habit';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string, completed: boolean) => void;
  togglingId?: string | null;
}

export function HabitList({ habits, onToggle, togglingId }: HabitListProps) {
  const incomplete = habits.filter((h) => !h.completed);
  const completed = habits.filter((h) => h.completed);

  return (
    <div className="space-y-6">
      {/* Incomplete habits */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {incomplete.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <HabitCard
                habit={habit}
                onToggle={onToggle}
                isToggling={togglingId === habit.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Completed section */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Completed ({completed.length})
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <AnimatePresence mode="popLayout">
            {completed.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HabitCard
                  habit={habit}
                  onToggle={onToggle}
                  isToggling={togglingId === habit.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
