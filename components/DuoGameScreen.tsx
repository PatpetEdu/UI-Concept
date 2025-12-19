
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Trophy, ChevronRight, Info, SkipForward, CheckCircle2, XCircle, ShieldCheck, Play, Flame } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { CardData, Player, GameCategory } from '../types';
import Timeline from './Timeline';
import SongCard from './SongCard';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface DuoGameScreenProps {
  player1: string;
  player2: string;
  gameId: string | null;
  category: GameCategory;
  onBackToMenu: () => void;
}

const CATEGORY_PROMPTS: Record<GameCategory, string> = {
  default: "Choose a popular, culturally significant song from 1950 to 2025. Prefer global English hits.",
  svenska: "Choose a Swedish song (sung in Swedish or by a very famous Swedish artist) from 1960 to 2025.",
  eurovision: "Choose a song that competed in the Eurovision Song Contest between 1956 and 2025.",
  rock: "Choose a song in the Rock, Hard Rock, Metal or Punk genres from 1960 to 2025.",
  onehitwonder: "Choose a classic One Hit Wonder from 1970 to 2015."
};

const DuoGameScreen: React.FC<DuoGameScreenProps> = ({ player1, player2, category, gameId, onBackToMenu }) => {
  const [activePlayer, setActivePlayer] = useState<'p1' | 'p2'>('p1');
  const [p1State, setP1State] = useState<Player>({ name: player1, timeline: [2000], cards: [], startYear: 2000, stars: 3 });
  const [p2State, setP2State] = useState<Player>({ name: player2, timeline: [1995], cards: [], startYear: 1995, stars: 3 });
  const [opponentExpanded, setOpponentExpanded] = useState(false);
  const [tempYears, setTempYears] = useState<number[]>([]);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [placement, setPlacement] = useState<'before' | 'after' | null>(null);
  const [seenSongs, setSeenSongs] = useState<Set<string>>(new Set());
  const [showValidationError, setShowValidationError] = useState(false);

  const currentYear = new Date().getFullYear();
  const isGuessInRange = parseInt(guess) >= 1900 && parseInt(guess) <= currentYear;
  const isGuessComplete = guess.length === 4;

  useEffect(() => {
    const saved = localStorage.getItem('mixzter_current_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.gameId === gameId || (gameId === 'persisted' && parsed.p1State)) {
          setP1State(parsed.p1State);
          setP2State(parsed.p2State);
          setActivePlayer(parsed.activePlayer);
          setSeenSongs(new Set(parsed.seenSongs || []));
          setTempYears(parsed.tempYears || []);
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const session = {
      p1State, p2State, activePlayer, category, gameId, tempYears,
      seenSongs: Array.from(seenSongs), updatedAt: Date.now()
    };
    localStorage.setItem('mixzter_current_session', JSON.stringify(session));
  }, [p1State, p2State, activePlayer, category, gameId, seenSongs, tempYears]);

  const generateSong = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a music track. ${CATEGORY_PROMPTS[category]} Avoid: ${Array.from(seenSongs).slice(-20).join(', ')}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              artist: { type: Type.STRING },
              title: { type: Type.STRING },
              year: { type: Type.INTEGER },
              spotifyUrl: { type: Type.STRING }
            },
            required: ["artist", "title", "year", "spotifyUrl"]
          }
        }
      });
      const song = JSON.parse(response.text) as CardData;
      if (!song.spotifyUrl.startsWith('http')) {
        song.spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(song.artist + ' ' + song.title)}`;
      }
      setCurrentCard(song);
      setSeenSongs(prev => new Set([...prev, `${song.artist} - ${song.title}`.toLowerCase()]));
    } catch (error) { console.error(error); } finally {
      setIsLoading(false);
      setGuess(''); 
      setShowResult(false); 
      setIsCorrect(null);
      setShowInfo(false); 
      setIsPlacementMode(false); 
      setPlacement(null);
      setShowValidationError(false);
    }
  }, [category, seenSongs]);

  useEffect(() => {
    if (!currentCard && !isLoading) generateSong();
  }, [currentCard, isLoading, generateSong]);

  const currentPlayer = activePlayer === 'p1' ? p1State : p2State;

  const handleGuess = () => {
    if (!isGuessComplete) return;
    if (!isGuessInRange) { setShowValidationError(true); return; }
    const guessYear = parseInt(guess);
    const combinedTimeline = [...currentPlayer.timeline, ...tempYears];
    if (combinedTimeline.includes(guessYear)) { setIsPlacementMode(true); return; }
    finalizeGuess(guessYear);
  };

  const finalizeGuess = (guessYear: number, place?: 'before' | 'after') => {
    if (!currentCard) return;
    let correct = false;
    const actualYear = currentCard.year;
    const combinedTimeline = [...currentPlayer.timeline, ...tempYears].sort((a,b) => a-b);
    if (place) {
      correct = place === 'before' ? actualYear <= guessYear : actualYear >= guessYear;
    } else {
      const upperIdx = combinedTimeline.findIndex(y => y > guessYear);
      let lowerBound = upperIdx === 0 ? -Infinity : combinedTimeline[upperIdx - 1];
      let upperBound = upperIdx === -1 ? Infinity : combinedTimeline[upperIdx];
      correct = actualYear > lowerBound && actualYear <= (upperBound === Infinity ? currentYear + 1 : upperBound);
      if (guessYear === actualYear) correct = true;
    }
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setTempYears(prev => [...prev, actualYear]);
  };

  const handleSkip = () => {
    if (currentPlayer.stars > 0) {
      const updateFn = activePlayer === 'p1' ? setP1State : setP2State;
      updateFn(prev => ({ ...prev, stars: Math.max(0, prev.stars - 1) }));
      generateSong();
    }
  };

  const handleContinue = () => { setCurrentCard(null); };

  const handleSaveAndEnd = () => {
    const updateFn = activePlayer === 'p1' ? setP1State : setP2State;
    updateFn(prev => ({ 
      ...prev, 
      timeline: [...prev.timeline, ...tempYears].sort((a,b) => a-b) 
    }));
    setTempYears([]);
    setActivePlayer(activePlayer === 'p1' ? 'p2' : 'p1');
    setOpponentExpanded(false);
    setCurrentCard(null);
  };

  const handleIncorrectTurnEnd = () => {
    setTempYears([]);
    setActivePlayer(activePlayer === 'p1' ? 'p2' : 'p1');
    setOpponentExpanded(false);
    setCurrentCard(null);
  };

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4 mb-8">
        <Timeline 
          name={activePlayer === 'p1' ? p2State.name : p1State.name} 
          years={activePlayer === 'p1' ? p2State.timeline : p1State.timeline} 
          tempYears={[]}
          startYear={activePlayer === 'p1' ? p2State.startYear : p1State.startYear}
          stars={activePlayer === 'p1' ? p2State.stars : p1State.stars} 
          isCurrent={false}
          isCollapsed={!opponentExpanded}
          onToggleExpand={() => setOpponentExpanded(!opponentExpanded)}
        />
        
        <Timeline 
          name={currentPlayer.name} 
          years={currentPlayer.timeline} 
          tempYears={tempYears}
          startYear={currentPlayer.startYear}
          stars={currentPlayer.stars} 
          isCurrent={true}
          newYear={isCorrect ? currentCard?.year : null}
        />
      </div>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="h-[320px] flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <RefreshCcw className="w-16 h-16 text-emerald-500 animate-spin" />
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
            </div>
            <p className="text-zinc-400 dark:text-zinc-600 font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">Scanning Archives...</p>
          </div>
        ) : currentCard && (
          <div className="w-full flex flex-col items-center">
            <SongCard song={currentCard} isRevealed={showResult} />

            {!showResult ? (
              <div className="w-full max-sm mt-10 space-y-6">
                {isPlacementMode ? (
                  <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-emerald-500/30 p-8 rounded-[3rem] space-y-8 animate-in zoom-in duration-300 shadow-2xl">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-emerald-500">
                        <Trophy size={24} />
                      </div>
                      <h4 className="font-black text-zinc-950 dark:text-white italic tracking-tighter text-3xl uppercase">Timeline Duel</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Du har redan <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-tight">{guess}</span> i din tidslinje. Vart hör denna hemma?</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setPlacement('before')} className={`flex-1 py-5 rounded-2xl font-black text-sm tracking-widest transition-all ${placement === 'before' ? 'bg-emerald-500 text-zinc-950 scale-105 shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>ÄLDRE</button>
                      <button onClick={() => setPlacement('after')} className={`flex-1 py-5 rounded-2xl font-black text-sm tracking-widest transition-all ${placement === 'after' ? 'bg-emerald-500 text-zinc-950 scale-105 shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>NYARE</button>
                    </div>
                    <button onClick={() => placement && finalizeGuess(parseInt(guess), placement)} disabled={!placement} className="w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-5 rounded-2xl font-black text-xl disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95 shadow-xl">CONFIRM <ChevronRight size={22} /></button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative group">
                      <label className={`absolute -top-3 left-8 px-3 bg-zinc-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-[0.4em] z-10 transition-colors ${showValidationError ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}`}>Guess Year</label>
                      <input 
                        type="text" inputMode="numeric" maxLength={4} value={guess}
                        onChange={(e) => { setGuess(e.target.value.replace(/\D/g, '').slice(0, 4)); setShowValidationError(false); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                        className={`w-full bg-white dark:bg-zinc-900 border-2 rounded-[2.5rem] py-8 text-5xl font-black text-center outline-none transition-all text-zinc-900 dark:text-white shadow-lg ${showValidationError ? 'border-rose-500 animate-shake' : 'border-zinc-100 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-emerald-500'}`}
                        placeholder="----"
                      />
                    </div>
                    <button onClick={handleGuess} disabled={!isGuessComplete} className="w-full bg-emerald-500 text-zinc-950 py-6 rounded-[2.5rem] font-black text-2xl active:scale-95 shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-colors uppercase italic tracking-tighter">Lock In Answer</button>
                    
                    <div className="flex flex-col gap-4 px-6">
                      <div className="flex justify-between items-center">
                        <button onClick={() => setShowInfo(!showInfo)} className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors ${showInfo ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-600 hover:text-white'}`}><Info size={14} /> {showInfo ? 'Hide Hint' : 'Get Hint'}</button>
                        <button onClick={handleSkip} disabled={currentPlayer.stars === 0} className="text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-20 hover:text-rose-500 transition-colors"><SkipForward size={14} /> Skip Track (-1 ⭐)</button>
                      </div>
                      
                      {showInfo && (
                        <div className="p-5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] animate-in fade-in slide-in-from-top-4 duration-300">
                           <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-bold italic leading-relaxed">
                             "{currentCard.title}" av {currentCard.artist}
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-sm mt-10 animate-in zoom-in-95 duration-500">
                <div className={`p-10 rounded-[3.5rem] border-4 flex flex-col items-center gap-8 shadow-2xl ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/10' : 'bg-rose-500/5 border-rose-500/20 shadow-rose-500/10'}`}>
                  <div className="text-center space-y-2">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isCorrect ? 'bg-emerald-500 text-zinc-950' : 'bg-rose-500 text-white'}`}>
                      {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                    </div>
                    <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${isCorrect ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>{isCorrect ? 'GENIUS!' : 'NOT QUITE'}</h3>
                    <p className="text-zinc-400 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em]">Released in <span className="text-zinc-950 dark:text-white ml-2 text-xl tabular-nums tracking-normal underline decoration-emerald-500 decoration-2 underline-offset-4">{currentCard.year}</span></p>
                  </div>
                  {isCorrect ? (
                    <div className="w-full space-y-3">
                      <button onClick={handleContinue} className="group w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 shadow-xl transition-all hover:gap-5">
                         CONTINUE STREAK <Flame size={20} className="text-orange-500 group-hover:animate-bounce" fill="currentColor" />
                      </button>
                      <button onClick={handleSaveAndEnd} className="w-full bg-emerald-500 text-zinc-950 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 shadow-lg hover:bg-emerald-400 transition-colors"><ShieldCheck size={20} /> SAVE & PASS TURN</button>
                    </div>
                  ) : (
                    <button onClick={handleIncorrectTurnEnd} className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white py-5 rounded-[2rem] font-black text-lg active:scale-95 border border-zinc-200 dark:border-zinc-700">NEXT PLAYER</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default DuoGameScreen;
