import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../utils/api';
import { formatShortDate } from '../utils/formatters';
import { Footprint, FootprintSummary } from '../types/Footprint';
import { Goal } from '../types/Goal';

export interface PieDataItem {
  name: string;
  value: number;
}

export interface LineDataItem {
  name: string;
  CO2: number;
}

export interface UseDashboardDataResult {
  summary: FootprintSummary | null;
  history: Footprint[];
  activeGoal: Goal | null;
  latestFootprint: Footprint | null;
  pieData: PieDataItem[];
  lineData: LineDataItem[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to manage fetching and preparing dashboard metrics.
 */
export function useDashboardData(): UseDashboardDataResult {
  const [summary, setSummary] = useState<FootprintSummary | null>(null);
  const [history, setHistory] = useState<Footprint[]>([]);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Run queries in parallel to eliminate waterfall latency
      const [summaryData, historyLogs, goals] = await Promise.all([
        api.get<FootprintSummary>('/footprint-logs/summary'),
        api.get<Footprint[]>('/footprint-logs/history'),
        api.get<Goal[]>('/goals')
      ]);

      setSummary(summaryData);
      setHistory(historyLogs);
      const active = goals.find(g => !g.completed) || null;
      setActiveGoal(active);
    } catch (err: any) {
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

  const pieData = useMemo<PieDataItem[]>(() => {
    if (!latestFootprint) return [];
    return [
      { name: 'Transportation', value: latestFootprint.breakdown.transportation },
      { name: 'Electricity', value: latestFootprint.breakdown.electricity },
      { name: 'Diet & Food', value: latestFootprint.breakdown.food },
      { name: 'Shopping Habits', value: latestFootprint.breakdown.shopping }
    ].filter(item => item.value > 0);
  }, [latestFootprint]);

  const lineData = useMemo<LineDataItem[]>(() => {
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
