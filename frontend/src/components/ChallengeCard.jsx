import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * ChallengeCard component representing a single weekly challenge item.
 * Memoized using React.memo to isolate re-renders.
 *
 * @param {Object} props
 * @param {Object} props.challenge - The challenge object details
 * @param {string} props.challenge.id - Challenge ID
 * @param {string} props.challenge.title - Challenge title
 * @param {string} props.challenge.description - Challenge description
 * @param {number} props.challenge.points - Earnable points
 * @param {boolean} props.challenge.completed - Completion state
 * @param {string|null} props.completingId - Current challenge ID undergoing completion API call
 * @param {Function} props.onComplete - Callback when user clicks to complete the challenge
 * @returns {JSX.Element} The rendered challenge card
 */
const ChallengeCard = React.memo(function ChallengeCard({ challenge, completingId, onComplete }) {
  const { id, title, description, points, completed } = challenge;
  const isCompleting = completingId === id;

  return (
    <article
      role="listitem"
      className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between min-h-[220px] transition-all duration-300 ${
        completed ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-extrabold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
            +{points} PTS
          </span>
          {completed && (
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-0.5" aria-hidden="true" /> Done
            </span>
          )}
        </div>
        
        <h3 className={`font-extrabold text-base text-slate-800 mt-4 ${completed ? 'line-through text-slate-500' : ''}`}>
          {title}
        </h3>
        <p className={`text-slate-400 text-xs font-medium leading-relaxed mt-2 ${completed ? 'text-slate-350' : ''}`}>
          {description}
        </p>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-50">
        {completed ? (
          <button
            disabled
            aria-label={`${title} - already completed`}
            className="w-full bg-emerald-100 text-emerald-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>Completed</span>
          </button>
        ) : (
          <button
            onClick={() => onComplete(id)}
            disabled={isCompleting}
            aria-label={`Mark ${title} as completed`}
            className="w-full bg-eco-600 hover:bg-eco-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center"
          >
            {isCompleting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" role="status" aria-label="Completing challenge">
                <span className="sr-only">Completing...</span>
              </div>
            ) : (
              'Mark Completed'
            )}
          </button>
        )}
      </div>
    </article>
  );
});

export default ChallengeCard;
