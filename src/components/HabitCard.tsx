import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';
import type { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string, completed: boolean) => void;
  isToggling?: boolean;
}

export function HabitCard({ habit, onToggle, isToggling }: HabitCardProps) {
  const handleClick = () => {
    if (!isToggling) {
      onToggle(habit.id, !habit.completed);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'habit-card cursor-pointer group',
        habit.completed && 'habit-card-completed'
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <motion.button
          className={cn(
            'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200',
            habit.completed
              ? 'bg-primary border-primary'
              : 'border-muted-foreground/40 group-hover:border-primary/60'
          )}
          whileTap={{ scale: 0.9 }}
          disabled={isToggling}
        >
          {habit.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </motion.button>

        {/* Icon */}
        <span className="text-2xl">{habit.icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-medium text-foreground transition-all duration-200',
              habit.completed && 'line-through text-muted-foreground'
            )}
          >
            {habit.title}
          </h3>
          {habit.frequency === 'specific_days' && habit.specificDays && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {habit.specificDays.join(', ')}
            </p>
          )}
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Flame
            className={cn(
              'w-4 h-4',
              habit.streak >= 7 && 'text-orange-500',
              habit.streak >= 21 && 'text-primary'
            )}
          />
          <span className="text-sm font-medium">{habit.streak}</span>
        </div>
      </div>
    </motion.div>
  );
}
