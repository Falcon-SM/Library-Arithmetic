'use client';

import React, { useEffect } from 'react';
import { useGameStore } from './store';
import { Board } from './components/Board';
import { SetupScreen } from './components/SetupScreen';
import { PlayerHUD } from './components/PlayerHUD';
import { GameControls } from './components/GameControls';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const { gameStatus, players, currentPlayerIndex } = useGameStore();

  useEffect(() => {
    console.log('Game status:', gameStatus);
    console.log('Players:', players);
  }, [gameStatus, players]);

  if (gameStatus === 'SETUP') {
    return <SetupScreen />;
  }

  if (gameStatus === 'FINISHED') {
    const sortedPlayers = [...players].sort((a, b) => {
      const scoreA = a.completedMissions.reduce((acc, m) => acc + m.points, 0) + a.mp;
      const scoreB = b.completedMissions.reduce((acc, m) => acc + m.points, 0) + b.mp;
      return scoreB - scoreA;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2c1810] via-[#3d2415] to-[#2c1810] text-[#f0e6d2] flex flex-col items-center justify-center p-4 md:p-8">
        <div className="animate-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 flex items-center gap-4 justify-center">
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-[#c2b280]" />
            <span className="bg-gradient-to-r from-[#f0e6d2] to-[#c2b280] bg-clip-text text-transparent">
              Library Arithmetic
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl mb-8 text-center font-bold">Game Over!</h2>
          <div className="bg-gradient-to-br from-white/20 to-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-xl w-full max-w-2xl border-2 border-[#c2b280]/40">
            {sortedPlayers.map((p, i) => (
              <div key={p.id} className="flex justify-between items-center text-xl md:text-2xl mb-4 border-b border-white/20 pb-3 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-2xl md:text-3xl text-[#c2b280]">#{i + 1}</span>
                  <span style={{ color: p.color }} className="font-bold">{p.name}</span>
                </div>
                <div className="flex gap-4 md:gap-8 text-base md:text-xl">
                  <span>Score: <span className="font-bold">{p.completedMissions.reduce((acc, m) => acc + m.points, 0)}</span></span>
                  <span>MP: <span className="font-bold">{p.mp}</span></span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 md:mt-12 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#c2b280] to-[#d4c5a3] text-[#2c1810] font-bold text-lg md:text-xl rounded-xl hover:scale-105 transition-transform shadow-lg mx-auto block"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // PLAYING state
  if (players.length === 0) {
    console.error('No players found in PLAYING state!');
    return (
      <div className="h-screen w-screen bg-[#2c1810] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-2xl mb-4">Error: No players initialized</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 rounded">
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#2c1810] relative">
      <Board />
      <GameControls />
      <PlayerHUD />
    </main>
  );
}
