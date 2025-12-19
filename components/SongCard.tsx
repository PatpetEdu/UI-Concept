
import React, { useState } from 'react';
import { Music, Disc, ExternalLink, QrCode, X, Play } from 'lucide-react';
import { CardData } from '../types';

interface SongCardProps {
  song: CardData;
  isRevealed: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, isRevealed }) => {
  const [showQR, setShowQR] = useState(false);

  const openSpotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };

  const toggleQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQR(!showQR);
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[3/4] group perspective-1000">
      <div className={`
        relative w-full h-full transition-all duration-1000 transform-style-3d
        ${isRevealed ? '[transform:rotateY(180deg)]' : ''}
      `}>
        {/* Front Side - Premium Audio Aesthetic */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-zinc-950 rounded-[3.5rem] border-2 border-zinc-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">
          
          {/* Background Ambient Effects */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
            <Disc size={450} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-800 animate-[spin_30s_linear_infinite]" />
          </div>

          {/* Central Pulsing Audio Visualizer */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1">
            <div className="relative flex items-center justify-center">
              {/* Pulsing Rings (Layered for depth) */}
              <div className="absolute w-52 h-52 bg-emerald-500/5 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
              <div className="absolute w-40 h-40 bg-emerald-500/10 rounded-full animate-[ping_2s_ease-in-out_infinite]" />
              <div className="absolute w-28 h-28 bg-emerald-500/20 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
              
              <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow-inner relative z-20">
                <Music size={40} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <div className="h-1 w-6 bg-emerald-500/40 mx-auto rounded-full mb-3" />
              <p className="text-[9px] font-black tracking-[0.5em] text-zinc-600 uppercase">Awaiting Reveal</p>
            </div>
          </div>

          {/* Interaction Tray */}
          <div className="relative z-20 w-full flex gap-3 mt-auto">
            <button 
              onClick={openSpotify}
              className="flex-1 bg-white hover:bg-emerald-500 hover:text-white text-zinc-950 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
            >
              <Play size={14} fill="currentColor" /> GO TO SONG
            </button>
            <button 
              onClick={toggleQR}
              className="w-16 bg-zinc-900 border border-zinc-800 text-emerald-500 flex items-center justify-center rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-lg group"
            >
              <QrCode size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Expandable QR Overlay */}
          <div className={`
            absolute inset-x-4 bottom-4 top-4 bg-zinc-950/98 backdrop-blur-2xl rounded-[2.5rem] z-30 flex flex-col items-center justify-center p-8 transition-all duration-500 border border-zinc-800
            ${showQR ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
          `}>
            <button onClick={toggleQR} className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="w-full aspect-square bg-white rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
              <div className="w-full h-full border-4 border-zinc-950 flex flex-col items-center justify-center gap-4">
                 <div className="flex gap-1.5 h-16 items-end">
                    {[2,5,8,4,9,3,7,5,4,2,6,8,5,3].map((h, i) => (
                      <div key={i} className="w-1.5 bg-zinc-950 rounded-full animate-bounce" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <Music size={24} className="text-zinc-950" />
                    <span className="text-[8px] font-black text-zinc-950 tracking-[0.2em]">SCAN ON SPOTIFY</span>
                 </div>
              </div>
            </div>
            <p className="mt-8 text-zinc-400 text-[10px] font-black uppercase tracking-widest text-center px-4">Direct App Access</p>
          </div>
        </div>

        {/* Back Side (Revealed) */}
        <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] backface-hidden bg-white rounded-[3.5rem] border-8 border-emerald-500/10 shadow-2xl overflow-hidden flex flex-col p-8 text-zinc-950">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="mb-6 shrink-0">
                <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-emerald-500 rotate-3 shadow-xl">
                  <Music size={32} />
                </div>
             </div>
             
             <div className="mb-8 shrink-0">
                <h2 className="text-7xl font-black italic leading-none tracking-tighter text-zinc-900">{song.year}</h2>
                <div className="h-2 w-16 bg-emerald-500 mx-auto rounded-full mt-4" />
             </div>

             <div className="space-y-2 mt-2 w-full">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-3">Artist & Låt</p>
                <h3 className="text-2xl font-black leading-tight tracking-tight text-zinc-900 px-2 line-clamp-2">{song.artist}</h3>
                <p className="text-lg font-semibold text-zinc-500 leading-tight italic px-4 line-clamp-2">"{song.title}"</p>
             </div>
          </div>
          
          <div className="border-t border-zinc-100 mt-4 pt-8 flex justify-between items-center px-4 shrink-0">
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Status</span>
                <span className="text-emerald-600 font-black text-xs">VERIFIERAD HIT</span>
             </div>
             <button 
                onClick={openSpotify} 
                className="group flex items-center gap-3 bg-zinc-950 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                <span className="text-[11px] font-black uppercase tracking-wider">Spotify</span>
                <ExternalLink size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
