import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

/**
 * Custom hook to load user badges and calculation history in parallel.
 * @returns {Object} Profile data state
 */
export function useProfileData() {
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Run queries in parallel
      const [badgesData, historyData] = await Promise.all([
        api.get('/badges'),
        api.get('/footprint-logs/history')
      ]);
      setBadges(badgesData);
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to load profile details:', err);
      setError('Failed to fetch profile history logs. Verify backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  return {
    badges,
    history,
    loading,
    error,
    refetch: loadProfileData
  };
}
