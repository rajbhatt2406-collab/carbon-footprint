import React from 'react';
import { Target, Calendar, CheckCircle } from 'lucide-react';
import { formatLocalDate } from '../utils/formatters';
import ProgressBar from './ProgressBar';

/**
 * GoalCard component representing an active or completed carbon reduction target.
 * Memoized using React.memo to isolate re-renders.
 *
 * @param {Object} props
 * @param {Object} props.goal - The goal object details
 * @param {string} props.goal.id - Goal ID
 * @param {number} props.goal.targetValue - Reduction target value in kg
 * @param {number} props.goal.currentProgress - Current progress value in kg
 * @param {string} props.goal.startDate - Goal start date string
 * @param {string} props.goal.endDate - Goal end date string
 * @param {boolean} props.goal.completed - Whether the goal is achieved
 * @param {string} [props.goal.updatedAt] - Achieved/updated date string
 * @param {string} [props.inputValue=''] - Current update progress input value for this goal
 * @param {Function} [props.onInputChange] - Callback when input value changes
 * @param {Function} [props.onUpdateProgress] - Callback when user submits new progress
 * @returns {JSX.Element} The rendered goal card
 */
const GoalCard = React.memo(function GoalCard({ goal, inputValue = '', onInputChange, onUpdateProgress }) {
  const { id, targetValue, currentProgress, startDate, endDate, completed, updatedAt } = goal;

  if (completed) {
    return (
      <article className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 line-through">Reduce {targetValue} kg CO₂</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Achieved on {formatLocalDate(updatedAt || startDate)}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
          Success
        </span>
      </article>
    );
  }

  return (
    <article className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-eco-50 text-eco-600 rounded-xl">
            <Target className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">Reduce {targetValue} kg CO₂</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center">
              <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
              Started {formatLocalDate(startDate)} • Ends {formatLocalDate(endDate)}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-eco-700 bg-eco-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Active
        </span>
      </div>

      <ProgressBar value={currentProgress} max={targetValue} />

      <div className="flex items-center space-x-3 pt-3 border-t border-slate-50">
        <label htmlFor={`progress-${id}`} className="sr-only">Log reduction in kg for goal: Reduce {targetValue} kg CO₂</label>
        <input
          id={`progress-${id}`}
          type="number"
          min="0"
          name="currentProgress"
          placeholder="Log reduction (kg)..."
          value={inputValue}
          onChange={(e) => onInputChange(id, e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-eco-500 w-full sm:max-w-[150px]"
        />
        <button
          onClick={() => onUpdateProgress(id)}
          className="bg-eco-600 hover:bg-eco-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
        >
          Update Progress
        </button>
      </div>
    </article>
  );
});

export default GoalCard;
