'use client';

import React, { useEffect } from 'react';
import { useGameStore } from './store';
import { Board } from './components/Board';
import { PlayerHUD } from './components/PlayerHUD';
import { GameControls } from './components/GameControls';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const { gameStatus, initializeGame, players, currentPlayerIndex } = useGameStore();

  useEffect(() => {
    // Auto-start for now, or could wait for user interaction
    if (gameStatus === 'SETUP') {
      initializeGame();
    }
  }, [gameStatus, initializeGame]);

  if (gameStatus === 'FINISHED') {
    // Simple Game Over Screen
    const sortedPlayers = [...players].sort((a, b) => {
      const scoreA = a.completedMissions.reduce((acc, m) => acc + m.points, 0) + a.mp;
      const scoreB = b.completedMissions.reduce((acc, m) => acc + m.points, 0) + b.mp;
      return scoreB - scoreA;
    });

    return (
      <div className="min-h-screen bg-[#2c1810] text-[#f0e6d2] flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-bold mb-8 flex items-center gap-4">
          <BookOpen className="w-16 h-16" /> Library Arithmetic
        </h1>
        <h2 className="text-4xl mb-8">Game Over!</h2>
        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-md w-full max-w-2xl">
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className="flex justify-between items-center text-2xl mb-4 border-b border-white/20 pb-2 last:border-0">
              <div className="flex items-center gap-4">
                <span className="font-bold text-3xl">#{i + 1}</span>
                <span style={{ color: p.color }}>{p.name}</span>
              </div>
              <div className="flex gap-8">
                <span>Score: {p.completedMissions.reduce((acc, m) => acc + m.points, 0)}</span>
                <span>MP: {p.mp}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={initializeGame}
          className="mt-12 px-8 py-4 bg-[#c2b280] text-[#2c1810] font-bold text-xl rounded hover:bg-[#d4c5a3] transition-colors"
        >
          Play Again
        </button>
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
