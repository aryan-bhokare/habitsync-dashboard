import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Calendar, Award } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Heatmap } from '@/components/Heatmap';
import { WeeklyProgressChart } from '@/components/WeeklyProgressChart';
import { StatCard } from '@/components/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getHeatmapData, getWeeklyProgress } from '@/services/api';

function Analytics() {
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ['heatmap'],
    queryFn: getHeatmapData,
  });

  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ['weekly'],
    queryFn: getWeeklyProgress,
  });

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track your progress and build lasting habits
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {heatmapLoading ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Completions"
              value={heatmapData?.totalCompletions || 0}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatCard
              label="Current Streak"
              value={heatmapData?.currentStreak || 0}
              icon={<Flame className="w-5 h-5" />}
            />
            <StatCard
              label="Longest Streak"
              value={heatmapData?.longestStreak || 0}
              icon={<Award className="w-5 h-5" />}
            />
            <StatCard
              label="Active Days"
              value={heatmapData?.data.filter((d) => d.count > 0).length || 0}
              icon={<Calendar className="w-5 h-5" />}
            />
          </>
        )}
      </div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-elevated rounded-xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Weekly Progress
        </h2>
        {weeklyLoading ? (
          <Skeleton className="h-[250px] rounded-lg" />
        ) : (
          <WeeklyProgressChart data={weeklyData || []} />
        )}
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="surface-elevated rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Activity Grid
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your habit completion history over the past year
        </p>
        {heatmapLoading ? (
          <Skeleton className="h-[150px] rounded-lg" />
        ) : (
          <Heatmap data={heatmapData?.data || []} />
        )}
      </motion.div>
    </Layout>
  );
}

export default Analytics;
