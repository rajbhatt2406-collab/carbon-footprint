import React from 'react';
import { Calendar } from 'lucide-react';
import { formatFullDateTime } from '../utils/formatters';

/**
 * HistoryLogCard component representing a single historical carbon calculation entry.
 * Memoized using React.memo to isolate re-renders.
 *
 * @param {Object} props
 * @param {Object} props.log - The carbon footprint log details
 * @param {string} props.log.id - Log entry ID
 * @param {number} props.log.total - Total carbon value
 * @param {string} props.log.date - ISO date string of entry
 * @param {Object} props.log.inputs - Original inputs dictionary
 * @param {number} props.log.inputs.carKm - Input car distance
 * @param {number} props.log.inputs.electricityKwh - Input electricity usage
 * @param {string} props.log.inputs.foodHabit - Input food habit type
 * @param {Object} props.log.breakdown - Breakdown components
 * @param {number} props.log.breakdown.transportation - Transportation subtotal
 * @param {number} props.log.breakdown.electricity - Electricity subtotal
 * @param {number} props.log.breakdown.food - Diet subtotal
 * @param {number} props.log.breakdown.shopping - Shopping subtotal
 * @returns {JSX.Element} The rendered history log entry card
 */
const HistoryLogCard = React.memo(function HistoryLogCard({ log }) {
  const { id, total, date, inputs, breakdown } = log;

  return (
    <article
      role="listitem"
      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors"
    >
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-extrabold text-slate-800">
            {total} kg CO₂
          </span>
          <span className="text-[10px] font-semibold text-slate-400 flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            <time dateTime={date}>
              {formatFullDateTime(date)}
            </time>
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
          Car: {inputs.carKm}km/wk • Energy: {inputs.electricityKwh}kWh • Diet: {inputs.foodHabit}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold text-slate-500 shrink-0" aria-label="Breakdown">
        <div className="bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg">
          <p><span aria-hidden="true">🚗</span> {breakdown.transportation}k</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg">
          <p><span aria-hidden="true">⚡</span> {breakdown.electricity}k</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg">
          <p><span aria-hidden="true">🥗</span> {breakdown.food}k</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-lg">
          <p><span aria-hidden="true">🛍️</span> {breakdown.shopping}k</p>
        </div>
      </div>
    </article>
  );
});

export default HistoryLogCard;
