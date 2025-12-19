
import React, { useState, useEffect } from 'react';
import { User, PlusCircle, History, Trophy, Sun, Moon, MoreVertical, LogOut, X, Home } from 'lucide-react';
import { GameMode, ActiveGameMeta, GameCategory } from './types';
import Dashboard from './components/Dashboard';
import DuoGameScreen from './components/DuoGameScreen';
import SetupScreen from './components/SetupScreen';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('menu');
  const [category, setCategory] = useState<GameCategory>('default');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState({ email: 'demo@mixzter.com', uid: 'demo123' });
  const [activeGames, setActiveGames] = useState<ActiveGameMeta[]>([
    { id: '1', player1: 'You', player2: 'Erik', p1Score: 3, p2Score: 2, category: 'default', updatedAt: Date.now() - 3600000 }
  ]);
  const [players, setPlayers] = useState<{ player1: string, player2: string } | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [showGameMenu, setShowGameMenu] = useState(false);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('mixzter_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mixzter_theme', theme);
  }, [theme]);

  // Load persisted game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('mixzter_current_session');
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        setPlayers({ player1: parsed.p1State.name, player2: parsed.p2State.name });
        setCategory(parsed.category);
        setActiveGameId(parsed.gameId || 'persisted');
        setMode('duo');
      } catch (e) {
        console.error("Failed to load saved game", e);
      }
    }
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const startNewDuo = (p1: string, p2: string, cat: GameCategory) => {
    setPlayers({ player1: p1, player2: p2 });
    setCategory(cat);
    setActiveGameId(Math.random().toString(36).substr(2, 9));
    setMode('duo');
    setShowGameMenu(false);
  };

  const resumeGame = (game: ActiveGameMeta) => {
    setPlayers({ player1: game.player1, player2: game.player2 });
    setCategory(game.category);
    setActiveGameId(game.id);
    setMode('duo');
    setShowGameMenu(false);
  };

  const returnToMenu = () => {
    setMode('menu');
    setPlayers(null);
    setActiveGameId(null);
    setShowGameMenu(false);
    localStorage.removeItem('mixzter_current_session');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={returnToMenu}>
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-zinc-950 italic text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">M</div>
            <h1 className="text-2xl font-black italic tracking-tighter">MIXZTER</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:text-emerald-500 transition-all text-zinc-600 dark:text-zinc-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              <User size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto p-6 flex-1">
        {mode === 'menu' && (
          <Dashboard 
            user={user} 
            activeGames={activeGames} 
            onStartDuo={() => setMode('duo-setup')}
            onStartSingle={() => setMode('single')}
            onResume={resumeGame}
          />
        )}

        {mode === 'duo-setup' && (
          <SetupScreen 
            onCancel={returnToMenu} 
            onStart={startNewDuo} 
          />
        )}

        {mode === 'duo' && players && (
          <DuoGameScreen 
            player1={players.player1} 
            player2={players.player2} 
            gameId={activeGameId}
            category={category}
            onBackToMenu={returnToMenu}
          />
        )}

        {mode === 'single' && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-6">
              <Trophy size={48} className="text-zinc-300 dark:text-zinc-700" />
            </div>
            <h2 className="text-3xl font-black italic mb-2 tracking-tighter uppercase">Single Player</h2>
            <p className="text-zinc-500 mb-8 max-w-xs">Master the timeline solo in the upcoming solo journey.</p>
            <button 
              onClick={returnToMenu}
              className="bg-emerald-500 text-zinc-950 px-8 py-3 rounded-2xl font-black transition-all hover:scale-105"
            >
              BACK TO LOBBY
            </button>
          </div>
        )}
      </main>

      {/* Game Menu Overlay */}
      {showGameMenu && (
        <div className="fixed inset-0 bg-zinc-950/20 dark:bg-zinc-950/80 backdrop-blur-sm z-[100] flex items-end justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-black italic uppercase tracking-widest text-zinc-400 text-sm">Match Menu</h3>
              <button onClick={() => setShowGameMenu(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-400">
                <X size={20} />
              </button>
            </div>
            {mode === 'duo' ? (
              <button 
                onClick={returnToMenu}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-500 py-4 px-6 rounded-2xl font-black flex items-center gap-3 transition-colors mb-2"
              >
                <LogOut size={20} /> QUIT & ABORT MATCH
              </button>
            ) : (
              <button 
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 py-4 px-6 rounded-2xl font-black mb-2 opacity-50 cursor-not-allowed"
              >
                NO ACTIVE MATCH
              </button>
            )}
            <button 
              onClick={() => setShowGameMenu(false)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 py-4 px-6 rounded-2xl font-black transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Simplified Mobile Navigation */}
      <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-12 py-5 flex justify-around items-center z-40">
        <button 
          onClick={returnToMenu} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${mode === 'menu' ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500 hover:text-emerald-500'}`}
        >
          <Home size={22} />
          <span className="text-[10px] uppercase font-black tracking-[0.2em]">Back</span>
        </button>
        
        <button 
          onClick={() => setShowGameMenu(true)}
          className={`flex flex-col items-center gap-1.5 transition-colors ${mode === 'duo' ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500 hover:text-emerald-500'}`}
        >
          <MoreVertical size={22} />
          <span className="text-[10px] uppercase font-black tracking-[0.2em]">Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
