import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfileData } from '../hooks/useProfileData';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import BadgeCard from '../components/BadgeCard';
import HistoryLogCard from '../components/HistoryLogCard';
import { History } from 'lucide-react';

/**
 * Profile page showing user info, badges/achievements, and calculation history.
 * @returns {JSX.Element} The profile page
 */
export default function Profile() {
  const { user } = useAuth();
  const { badges, history, loading, error } = useProfileData();

  if (loading) {
    return <LoadingSpinner message="Loading profile parameters..." />;
  }


  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      
      {/* Profile Header */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6" aria-labelledby="profile-heading">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-gradient-to-tr from-eco-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white uppercase shadow-md shadow-eco-500/10" aria-hidden="true">
            {user?.displayName?.[0] || 'U'}
          </div>
          <div>
            <h1 id="profile-heading" className="text-2xl font-black text-slate-800 tracking-tight">{user?.displayName}</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Eco Achievements</p>
            <p className="text-2xl font-black text-eco-700 mt-1">
              {badges.filter(b => b.unlocked).length} <span className="text-sm font-medium text-slate-400">badges</span>
            </p>
          </div>
          <div className="ml-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience Score</p>
            <p className="text-2xl font-black text-emerald-800 mt-1">
              {user?.points || 0} <span className="text-sm font-medium text-slate-400">PTS</span>
            </p>
          </div>
        </div>
      </section>

      <ErrorAlert message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BADGES & ACHIEVEMENTS PANEL */}
        <section className="lg:col-span-1 space-y-4" aria-labelledby="badges-heading">
          <h2 id="badges-heading" className="text-base font-extrabold text-slate-700">Unlocked Achievements</h2>
          <div className="grid grid-cols-1 gap-4" role="list" aria-label="Achievement badges">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.badgeType}
                badge={badge}
              />
            ))}
          </div>
        </section>

        {/* CARBON HISTORY LIST PANEL */}
        <section className="lg:col-span-2 space-y-4" aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-base font-extrabold text-slate-700 flex items-center space-x-2">
            <History className="h-5 w-5 text-slate-500" aria-hidden="true" />
            <span>Calculation Logs History</span>
          </h2>

          {history.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100" role="list" aria-label="Carbon calculation history">
                {history.map((log) => (
                  <HistoryLogCard
                    key={log.id}
                    log={log}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center text-sm font-semibold text-slate-400">
              No historical log calculations found. Compute your footprint first!
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

