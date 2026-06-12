import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to orchestrate eco-challenges.
 * @returns {Object} Challenges state and action handlers
 */
export function useChallenges() {
  const { refreshPoints } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingId, setCompletingId] = useState(null);

  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/challenges');
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load challenges:', err);
      setError('Could not fetch weekly challenges. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handleComplete = useCallback(async (challengeId) => {
    setCompletingId(challengeId);
    setError('');

    try {
      await api.post(`/challenges/${challengeId}/complete`);
      // Update local state
      setChallenges(prev =>
        prev.map(ch =>
          ch.id === challengeId ? { ...ch, completed: true } : ch
        )
      );
      // Update user points total in header
      await refreshPoints();
    } catch (err) {
      console.error('Failed to complete challenge:', err);
      setError('Error updating challenge completion. Please retry.');
    } finally {
      setCompletingId(null);
    }
  }, [refreshPoints]);

  const completedCount = useMemo(() => challenges.filter(c => c.completed).length, [challenges]);

  return {
    challenges,
    loading,
    error,
    completingId,
    completedCount,
    handleComplete,
    refetch: loadChallenges
  };
}
