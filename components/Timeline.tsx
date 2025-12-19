
import React from 'react';
import { Star, ChevronDown, ChevronUp, Flame } from 'lucide-react';

interface TimelineNodeProps {
  year: number;
  isCurrentPlayer: boolean;
  isNew?: boolean;
  isTemporary?: boolean;
  isStartYear?: boolean;
}

const TimelineNode: React.FC<TimelineNodeProps> = ({ year, isNew, isTemporary, isStartYear }) => (
  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 relative z-10">
    <div className={`
      relative px-3 py-1.5 rounded-xl border text-[13px] font-black tracking-tight transition-all duration-500
      ${isStartYear 
        ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] dark:shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
        : isNew 
          ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 z-10' 
          : isTemporary
            ? 'bg-emerald-500/5 border-emerald-500/30 dark:border-emerald-400 border-dashed text-emerald-600 dark:text-emerald-400/70'
            : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
      }
    `}>
      {year}
      {isStartYear && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-[6px] px-1 rounded-sm text-zinc-950 font-black">START</span>
      )}
      {isNew && !isStartYear && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 dark:bg-emerald-300 rounded-full animate-ping" />
      )}
    </div>
  </div>
);

interface TimelineProps {
  name: string;
  years: number[];
  tempYears?: number[];
  startYear: number;
  stars: number;
  isCurrent: boolean;
  isCollapsed?: boolean;
  onToggleExpand?: () => void;
  newYear?: number | null;
}

const Timeline: React.FC<TimelineProps> = ({ 
  name, years, tempYears = [], startYear, stars, isCurrent, isCollapsed, onToggleExpand, newYear 
}) => {
  const allYearsSorted = Array.from(new Set([...years, ...tempYears])).sort((a, b) => a - b);
  const MAX_STARS = 5;

  return (
    <div 
      onClick={!isCurrent ? onToggleExpand : undefined}
      className={`
        relative p-5 rounded-[2.5rem] transition-all duration-500
        ${isCurrent 
          ? 'bg-white dark:bg-zinc-900 border border-emerald-500/20 shadow-xl dark:shadow-emerald-950/10 shadow-zinc-200' 
          : 'bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
        }
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {name}
            </span>
            {tempYears.length > 0 && isCurrent && (
              <Flame size={12} className="text-orange-500 animate-pulse" fill="currentColor" />
            )}
          </div>
          {tempYears.length > 0 && isCurrent && (
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              {tempYears.length} PENDING
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-0.5">
            {[...Array(MAX_STARS)].map((_, i) => (
              <Star 
                key={i} 
                size={11} 
                fill={i < stars ? '#fbbf24' : 'transparent'} 
                className={i < stars ? 'text-amber-500 dark:text-amber-400' : 'text-zinc-200 dark:text-zinc-800'} 
              />
            ))}
          </div>
          {!isCurrent && (
            <div className="text-zinc-400 dark:text-zinc-600">
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          )}
        </div>
      </div>
      
      {(!isCollapsed || isCurrent) && (
        <div className="relative pt-2 pb-1">
          {/* Connection Line Background */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 z-0" />
          
          <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-300 relative z-10">
            {allYearsSorted.map((year) => (
              <TimelineNode 
                key={`${name}-${year}`} 
                year={year} 
                isCurrentPlayer={isCurrent} 
                isNew={year === newYear}
                isTemporary={tempYears.includes(year)}
                isStartYear={year === startYear}
              />
            ))}
            {isCurrent && !newYear && (
              <div className="px-3 py-1.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-[13px] font-black text-zinc-300 dark:text-zinc-800 animate-pulse bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                ????
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
