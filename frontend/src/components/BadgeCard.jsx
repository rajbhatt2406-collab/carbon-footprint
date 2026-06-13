import React from 'react';
import { Award, Lock } from 'lucide-react';
import { formatLocalDate } from '../utils/formatters';

const BADGE_STYLES = {
  beginner: 'bg-blue-100 text-blue-700 border border-blue-200',
  eco_explorer: 'bg-yellow-100 text-yellow-750 border border-yellow-200',
  green_warrior: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  carbon_hero: 'bg-indigo-100 text-indigo-750 border border-indigo-200',
};

function getBadgeIconColor(type, unlocked) {
  if (!unlocked) return 'bg-slate-100 text-slate-400';
  return BADGE_STYLES[type] || 'bg-slate-100 text-slate-700';
}

/**
 * BadgeCard component representing an achievement badge.
 * Memoized using React.memo to isolate re-renders.
 *
 * @param {Object} props
 * @param {Object} props.badge - The badge object
 * @param {string} props.badge.badgeType - The unique badge type identifier
 * @param {string} props.badge.title - Badge title
 * @param {string} props.badge.description - Badge description
 * @param {boolean} props.badge.unlocked - Unlock status
 * @param {string} [props.badge.unlockedAt] - Unlock date string
 * @returns {JSX.Element} The rendered badge card
 */
const BadgeCard = React.memo(function BadgeCard({ badge }) {
  const { badgeType, title, description, unlocked, unlockedAt } = badge;

  return (
    <article
      role="listitem"
      className={`bg-white rounded-3xl p-5 border shadow-sm flex items-start space-x-4 transition-all ${
        unlocked ? 'border-slate-100' : 'border-slate-100/60 opacity-60'
      }`}
    >
      <div className={`p-3 rounded-2xl shrink-0 ${getBadgeIconColor(badgeType, unlocked)}`}>
        {unlocked ? <Award className="h-6 w-6" aria-hidden="true" /> : <Lock className="h-6 w-6" aria-hidden="true" />}
      </div>
      
      <div className="space-y-1 overflow-hidden">
        <h3 className="font-extrabold text-sm text-slate-800 truncate">{title}</h3>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{description}</p>
        {unlocked && unlockedAt && (
          <span className="inline-block text-[9px] font-bold text-eco-600 bg-eco-50 px-2 py-0.5 rounded-md mt-1">
            Unlocked {formatLocalDate(unlockedAt)}
          </span>
        )}
        {!unlocked && (
          <span className="sr-only">Locked - not yet earned</span>
        )}
      </div>
    </article>
  );
});

export default BadgeCard;
