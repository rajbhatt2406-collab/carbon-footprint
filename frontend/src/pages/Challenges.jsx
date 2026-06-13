import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useChallenges } from '../hooks/useChallenges';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import ChallengeCard from '../components/ChallengeCard';
import { Zap } from 'lucide-react';

/**
 * Weekly eco challenges page. Users complete sustainability challenges to earn points.
 * @returns {JSX.Element} The challenges page
 */
export default function Challenges() {
  const { user } = useAuth();
  const {
    challenges,
    loading,
    error,
    completingId,
    completedCount,
    handleComplete
  } = useChallenges();

  if (loading && challenges.length === 0) {
    return <LoadingSpinner message="Loading weekly eco challenges..." />;
  }


  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Weekly Eco Challenges</h1>
          <p className="text-slate-500 font-medium mt-1">Complete small actions to establish sustainable carbon habits and earn points.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-3 self-start">
          <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-emerald-800">Your Eco Points</p>
            <p className="text-xl font-black text-emerald-900 leading-none mt-1">{user?.points || 0} PTS</p>
          </div>
        </div>
      </div>

      <ErrorAlert message={error} />

      {/* Week Progress Bar */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4" aria-labelledby="weekly-progress-heading">
        <div className="space-y-1">
          <h2 id="weekly-progress-heading" className="font-extrabold text-sm text-slate-800">Weekly Challenge Completion</h2>
          <p className="text-slate-400 text-xs font-semibold">Complete 5 challenges in total to earn the "Eco Explorer" achievement badge.</p>
        </div>
        <div className="flex items-center space-x-4 shrink-0">
          <span className="text-xs font-bold text-slate-500">{completedCount} of 3 complete</span>
          <div
            className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={3}
            aria-label={`${completedCount} of 3 challenges completed`}
          >
            <div
              className="bg-eco-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Grid of Challenges */}
      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-label="Weekly challenges">
          {challenges.map((ch) => (
            <ChallengeCard
              key={ch.id}
              challenge={ch}
              completingId={completingId}
              onComplete={handleComplete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-slate-100 text-center text-slate-400 font-semibold">
          No weekly challenges available. Try reloading the page.
        </div>
      )}
    </div>
  );
}

