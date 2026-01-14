import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { CreateHabitRequest } from '@/types/habit';

const ICONS = ['🧘', '💪', '📚', '💧', '💻', '🎨', '🎵', '🏃', '🥗', '😴', '📝', '🌱'];

const DAYS = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' },
];

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title is too long'),
  icon: z.string().min(1, 'Please select an icon'),
  frequency: z.enum(['daily', 'specific_days']),
  specificDays: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.frequency === 'specific_days') {
    return data.specificDays && data.specificDays.length > 0;
  }
  return true;
}, {
  message: 'Please select at least one day',
  path: ['specificDays'],
});

type FormData = z.infer<typeof formSchema>;

interface GoalFormProps {
  onSubmit: (data: CreateHabitRequest) => void;
  isLoading?: boolean;
}

export function GoalForm({ onSubmit, isLoading }: GoalFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      icon: '',
      frequency: 'daily',
      specificDays: [],
    },
  });

  const frequency = watch('frequency');
  const selectedIcon = watch('icon');

  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    setValue('specificDays', newDays);
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      title: data.title,
      icon: data.icon,
      frequency: data.frequency,
      specificDays: data.frequency === 'specific_days' ? data.specificDays : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Habit Title</Label>
        <Input
          id="title"
          placeholder="e.g., Morning Meditation"
          {...register('title')}
          className="bg-secondary border-border"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Icon Picker */}
      <div className="space-y-2">
        <Label>Choose an Icon</Label>
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((icon) => (
            <motion.button
              key={icon}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setValue('icon', icon)}
              className={cn(
                'h-12 rounded-lg text-2xl transition-all duration-200',
                'bg-secondary hover:bg-muted border-2',
                selectedIcon === icon
                  ? 'border-primary glow-success-sm'
                  : 'border-transparent'
              )}
            >
              {icon}
            </motion.button>
          ))}
        </div>
        {errors.icon && (
          <p className="text-sm text-destructive">{errors.icon.message}</p>
        )}
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select
          value={frequency}
          onValueChange={(value: 'daily' | 'specific_days') =>
            setValue('frequency', value)
          }
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="specific_days">Specific Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Day Selector */}
      <AnimatePresence>
        {frequency === 'specific_days' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <Label>Select Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <motion.button
                  key={day.value}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDay(day.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'border-2',
                    selectedDays.includes(day.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-foreground border-transparent hover:border-muted-foreground/30'
                  )}
                >
                  {day.label}
                </motion.button>
              ))}
            </div>
            {errors.specificDays && (
              <p className="text-sm text-destructive">{errors.specificDays.message}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Create Habit
          </>
        )}
      </Button>
    </form>
  );
}
