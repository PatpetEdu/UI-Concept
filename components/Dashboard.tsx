
import React from 'react';
import { Play, Users, Trophy, ChevronRight, Clock, Zap } from 'lucide-react';
import { ActiveGameMeta } from '../types';

interface DashboardProps {
  user: any;
  activeGames: ActiveGameMeta[];
  onStartDuo: () => void;
  onStartSingle: () => void;
  onResume: (game: ActiveGameMeta) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, activeGames, onStartDuo, onStartSingle, onResume }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero / Quick Start */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <button 
          onClick={onStartDuo}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2.5rem] text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-emerald-900/20"
        >
          <div className="relative z-10 text-white">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <Users size={24} />
            </div>
            <h3 className="text-3xl font-black italic mb-1 tracking-tighter">DUO BATTLE</h3>
            <p className="text-emerald-100/70 text-sm font-medium">Head-to-head on one device</p>
          </div>
          <Zap className="absolute -right-6 -bottom-6 w-40 h-40 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
        </button>

        <button 
          onClick={onStartSingle}
          className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-zinc-200 dark:shadow-none"
        >
          <div className="relative z-10">
            <div className="bg-zinc-100 dark:bg-zinc-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
              <Trophy size={24} className="text-amber-500" />
            </div>
            <h3 className="text-3xl font-black italic mb-1 text-zinc-900 dark:text-zinc-100 tracking-tighter">SOLO JOURNEY</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Master the music history</p>
          </div>
          <Play className="absolute -right-6 -bottom-6 w-40 h-40 text-zinc-100 dark:text-zinc-800 group-hover:scale-110 transition-transform duration-500" />
        </button>
      </section>

      {/* Active Games */}
      <section className="space-y-5">
        <div className="flex justify-between items-end px-4">
          <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-3 italic tracking-tight">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
            RESUME BATTLE
          </h2>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em]">{activeGames.length} Active Matches</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {activeGames.length === 0 ? (
            <div className="bg-zinc-100/50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-12 rounded-[2.5rem] text-center">
              <p className="text-zinc-400 dark:text-zinc-500 font-bold">No active matches. Ready for a new duel?</p>
            </div>
          ) : (
            activeGames.map((game) => (
              <div 
                key={game.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                onClick={() => onResume(game)}
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-tr from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl flex items-center justify-center font-black text-zinc-300 dark:text-zinc-700 italic text-xl border border-zinc-100 dark:border-zinc-800">
                      {game.player2.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-zinc-900" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Match with {game.player2}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                        <span className="text-emerald-600 dark:text-emerald-500 font-black text-[11px] tabular-nums">
                          {game.p1Score} - {game.p2Score}
                        </span>
                      </div>
                      <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                        Updated {new Date(game.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all text-zinc-400 dark:text-zinc-600">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
