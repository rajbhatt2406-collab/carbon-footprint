import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../utils/api';
import { formatShortDate } from '../utils/formatters';

/**
 * Custom hook to manage fetching and preparing dashboard metrics.
 * Uses Promise.all to optimize query load performance.
 * @returns {Object} Dashboard state and refetch trigger
 */
export function useDashboardData() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Run queries in parallel to eliminate waterfall latency
      const [summaryData, historyLogs, goals] = await Promise.all([
        api.get('/footprint-logs/summary'),
        api.get('/footprint-logs/history'),
        api.get('/goals')
      ]);

      setSummary(summaryData);
      setHistory(historyLogs);
      const active = goals.find(g => !g.completed) || null;
      setActiveGoal(active);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError('Could not retrieve dashboard statistics. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const latestFootprint = useMemo(() => summary?.current || null, [summary]);

  const pieData = useMemo(() => {
    if (!latestFootprint) return [];
    return [
      { name: 'Transportation', value: latestFootprint.breakdown.transportation },
      { name: 'Electricity', value: latestFootprint.breakdown.electricity },
      { name: 'Diet & Food', value: latestFootprint.breakdown.food },
      { name: 'Shopping Habits', value: latestFootprint.breakdown.shopping }
    ].filter(item => item.value > 0);
  }, [latestFootprint]);

  const lineData = useMemo(() => {
    return history
      .map(log => ({
        name: formatShortDate(log.date),
        CO2: log.total
      }))
      .reverse();
  }, [history]);

  return {
    summary,
    history,
    activeGoal,
    latestFootprint,
    pieData,
    lineData,
    loading,
    error,
    refetch: loadDashboardData
  };
}
