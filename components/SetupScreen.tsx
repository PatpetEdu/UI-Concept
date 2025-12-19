
import React, { useState } from 'react';
import { UserPlus, PlayCircle, Music2, Globe, Disc, Star } from 'lucide-react';
import { GameCategory } from '../types';

interface SetupScreenProps {
  onStart: (p1: string, p2: string, category: GameCategory) => void;
  onCancel: () => void;
}

const CATEGORIES: { id: GameCategory, label: string, icon: any }[] = [
  { id: 'default', label: 'Mixed 1950-2025', icon: Music2 },
  { id: 'svenska', label: 'Svenska Hits', icon: Globe },
  { id: 'eurovision', label: 'Eurovision', icon: Star },
  { id: 'rock', label: 'Rock & Metal', icon: Disc },
  { id: 'onehitwonder', label: 'One Hit Wonders', icon: PlayCircle },
];

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onCancel }) => {
  const [p1, setP1] = useState('Player 1');
  const [p2, setP2] = useState('Player 2');
  const [category, setCategory] = useState<GameCategory>('default');

  return (
    <div className="max-w-md mx-auto py-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-8 space-y-10 shadow-2xl dark:shadow-none">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-500 mb-4">
            <UserPlus size={40} />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-50">BATTLE SETUP</h2>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">Challenge a friend to a duel</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-2">Player 1</label>
              <input 
                type="text" 
                value={p1} 
                onChange={(e) => setP1(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-100 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl py-4 px-5 font-bold outline-none transition-all text-zinc-900 dark:text-zinc-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-2">Player 2</label>
              <input 
                type="text" 
                value={p2} 
                onChange={(e) => setP2(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-100 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl py-4 px-5 font-bold outline-none transition-all text-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-2">Select Category</label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    category === cat.id 
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <cat.icon size={20} />
                  <span className="font-bold">{cat.label}</span>
                  {category === cat.id && <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button 
            onClick={() => onStart(p1, p2, category)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
          >
            <PlayCircle size={24} /> START MATCH
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-transparent text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 py-4 rounded-2xl font-bold transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
