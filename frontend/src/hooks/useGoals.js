import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to orchestrate user carbon reduction targets/goals.
 * @returns {Object} Goals state and action handlers
 */
export function useGoals() {
  const { refreshPoints } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New goal form state
  const [targetValue, setTargetValue] = useState('');
  const [days, setDays] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  // Update progress input states
  const [updateVal, setUpdateVal] = useState({});

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/goals');
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
      setError('Could not fetch goals list. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleCreateGoal = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!targetValue || Number(targetValue) <= 0) return;

    setSubmitting(true);
    setError('');

    try {
      const endDate = new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000).toISOString();
      await api.post('/goals', { targetValue: Number(targetValue), endDate });
      setTargetValue('');
      await loadGoals();
    } catch (err) {
      console.error('Failed to create goal:', err);
      setError('Failed to save goal. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [targetValue, days, loadGoals]);

  const handleUpdateProgress = useCallback(async (goalId) => {
    const progressVal = Number(updateVal[goalId]);
    if (isNaN(progressVal) || progressVal < 0) return;

    try {
      await api.put(`/goals/${goalId}`, { currentProgress: progressVal });
      // Reset input field
      setUpdateVal(prev => ({ ...prev, [goalId]: '' }));
      await loadGoals();
      await refreshPoints(); // Sync badge achievements
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError('Failed to update goal progress.');
    }
  }, [updateVal, loadGoals, refreshPoints]);

  const activeGoals = useMemo(() => goals.filter(g => !g.completed), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.completed), [goals]);

  return {
    goals,
    loading,
    error,
    targetValue,
    setTargetValue,
    days,
    setDays,
    submitting,
    updateVal,
    setUpdateVal,
    handleCreateGoal,
    handleUpdateProgress,
    activeGoals,
    completedGoals
  };
}
