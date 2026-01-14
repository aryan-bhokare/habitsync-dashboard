import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Target, Flame, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { HabitList } from '@/components/HabitList';
import { StatCard } from '@/components/StatCard';
import { getDashboardToday, checkHabit } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

function Dashboard() {
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardToday,
  });

  const toggleMutation = useMutation({
    mutationFn: checkHabit,
    onMutate: (variables) => {
      setTogglingId(variables.habitId);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Trigger confetti on completion
      if (result.habit.completed) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4ADE80', '#22C55E', '#16A34A'],
        });
      }
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  const handleToggle = (habitId: string, completed: boolean) => {
    toggleMutation.mutate({
      habitId,
      completed,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const completionPercentage = data
    ? Math.round((data.completedCount / data.totalCount) * 100)
    : 0;

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Today's Focus</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Completion"
              value={`${completionPercentage}%`}
              icon={<Target className="w-5 h-5" />}
            />
            <StatCard
              label="Current Streak"
              value={data?.streak || 0}
              icon={<Flame className="w-5 h-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              label="Completed Today"
              value={`${data?.completedCount || 0}/${data?.totalCount || 0}`}
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
          </>
        )}
      </div>

      {/* Progress Bar */}
      {!isLoading && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Habit List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <HabitList
          habits={data?.habits || []}
          onToggle={handleToggle}
          togglingId={togglingId}
        />
      )}
    </Layout>
  );
}

export default Dashboard;
