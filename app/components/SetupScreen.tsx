import React, { useState } from 'react';
import { useGameStore } from '../store';
import { Users, Play } from 'lucide-react';
import { MissionSelection } from './MissionSelection';

export const SetupScreen: React.FC = () => {
    const { initializeGame, startGame, players } = useGameStore();
    const [playerCount, setPlayerCount] = useState(2);
    const [names, setNames] = useState<string[]>(['Player 1', 'Player 2']);
    const [missionSelectionIndex, setMissionSelectionIndex] = useState(-1);

    const handleCountChange = (count: number) => {
        setPlayerCount(count);
        setNames(prev => {
            const newNames = [...prev];
            if (count > prev.length) {
                for (let i = prev.length; i < count; i++) {
                    newNames.push(`Player ${i + 1}`);
                }
            } else {
                newNames.splice(count);
            }
            return newNames;
        });
    };

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };

    const handleStart = () => {
        console.log('Starting game with players:', names);
        initializeGame(names);
        setMissionSelectionIndex(0);
    };

    const handleMissionComplete = () => {
        if (missionSelectionIndex < players.length - 1) {
            setMissionSelectionIndex(prev => prev + 1);
        } else {
            startGame();
        }
    };

    if (missionSelectionIndex >= 0 && players.length > 0) {
        // Ensure player exists before rendering
        const currentPlayer = players[missionSelectionIndex];
        if (!currentPlayer) return null; // Should not happen

        return (
            <MissionSelection
                key={currentPlayer.id} // Force re-render for new player
                playerId={currentPlayer.id}
                onComplete={handleMissionComplete}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2c1810] via-[#3d2415] to-[#2c1810] text-[#f0e6d2] flex flex-col items-center justify-center p-4 md:p-8">
            <div className="bg-gradient-to-br from-white/20 to-white/5 p-6 md:p-10 rounded-2xl backdrop-blur-xl w-full max-w-lg shadow-2xl border-2 border-[#c2b280]/40 animate-in">
                <h1 className="text-3xl md:text-5xl font-black mb-8 text-center flex items-center justify-center gap-3 drop-shadow-lg">
                    <Users className="w-8 h-8 md:w-12 md:h-12 text-[#c2b280]" />
                    <span className="bg-gradient-to-r from-[#f0e6d2] to-[#c2b280] bg-clip-text text-transparent">
                        Library Arithmetic
                    </span>
                </h1>

                <div className="mb-8">
                    <label className="block text-sm md:text-base font-bold mb-3 uppercase tracking-wider opacity-90">
                        Number of Players
                    </label>
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                        {[2, 3, 4, 5].map(num => (
                            <button
                                key={num}
                                onClick={() => handleCountChange(num)}
                                className={`
                                    py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl transition-all transform
                                    ${playerCount === num
                                        ? 'bg-gradient-to-br from-[#c2b280] to-[#d4c5a3] text-[#2c1810] shadow-lg scale-105 ring-2 ring-white/50'
                                        : 'bg-black/30 hover:bg-black/50 hover:scale-105'
                                    }
                                `}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8 space-y-3">
                    <label className="block text-sm md:text-base font-bold mb-3 uppercase tracking-wider opacity-90">
                        Player Names
                    </label>
                    {names.map((name, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                            <span className="w-8 font-bold text-[#c2b280] text-lg">{i + 1}.</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => handleNameChange(i, e.target.value)}
                                className="flex-1 bg-black/30 border-2 border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c2b280] focus:ring-2 focus:ring-[#c2b280]/50 transition-all placeholder-white/40 group-hover:border-white/30"
                                placeholder={`Player ${i + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleStart}
                    className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-xl md:text-2xl rounded-xl shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                >
                    <Play className="w-6 h-6 md:w-8 md:h-8 fill-current group-hover:animate-bounce" />
                    <span className="drop-shadow-md">Start Game</span>
                </button>
            </div>

            <p className="mt-8 text-sm md:text-base opacity-60 text-center max-w-md">
                Welcome to Library Arithmetic! A strategic board game where librarians solve missions and earn points.
            </p>
        </div>
    );
};
