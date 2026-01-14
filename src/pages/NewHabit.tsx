import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Layout } from '@/components/Layout';
import { GoalForm } from '@/components/GoalForm';
import { createHabit } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { CreateHabitRequest } from '@/types/habit';

function NewHabit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: (habit) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ADE80', '#22C55E', '#16A34A'],
      });

      toast({
        title: 'Habit created! 🎉',
        description: `"${habit.title}" has been added to your daily routine.`,
      });

      setTimeout(() => navigate('/'), 1000);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: CreateHabitRequest) => {
    createMutation.mutate(data);
  };

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Habit</h1>
        <p className="text-muted-foreground">
          Build a new habit that will transform your life
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-elevated rounded-xl p-6 max-w-md"
      >
        <GoalForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
      </motion.div>
    </Layout>
  );
}

export default NewHabit;
