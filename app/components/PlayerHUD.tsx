import React from 'react';
import { useGameStore } from '../store';
import { Card } from './Card';
import { CardType } from '../types';
import { User, Zap, Trophy } from 'lucide-react';

export const PlayerHUD: React.FC = () => {
    const { players, currentPlayerIndex, useMathematicianCard } = useGameStore();
    const currentPlayer = players[currentPlayerIndex];

    if (!currentPlayer) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-white/95 border-t-4 border-[#2c1810] p-4 flex gap-8 shadow-2xl z-50">
            {/* Stats Panel */}
            <div className="w-48 flex-shrink-0 flex flex-col gap-2 border-r pr-4">
                <div className="flex items-center gap-2 text-xl font-bold" style={{ color: currentPlayer.color }}>
                    <User /> {currentPlayer.name}
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                    <Zap /> MP: {currentPlayer.mp}
                </div>
                <div className="flex items-center gap-2 text-amber-600 font-bold text-lg">
                    <Trophy /> Score: {currentPlayer.completedMissions.reduce((acc, m) => acc + m.points, 0)}
                </div>
            </div>

            {/* Hand */}
            <div className="flex-1 overflow-x-auto">
                <h4 className="font-bold text-gray-500 mb-2">Hand (Mathematicians)</h4>
                <div className="flex gap-2">
                    {currentPlayer.hand.map(card => (
                        <Card
                            key={card.id}
                            card={card}
                            type={CardType.MATHEMATICIAN}
                            onClick={() => useMathematicianCard(currentPlayer.id, card.id)}
                        />
                    ))}
                    {currentPlayer.hand.length === 0 && <div className="text-gray-400 text-sm italic">No cards in hand</div>}
                </div>
            </div>

            {/* Missions */}
            <div className="flex-1 overflow-x-auto border-l pl-4">
                <h4 className="font-bold text-gray-500 mb-2">Active Missions</h4>
                <div className="flex gap-2">
                    {currentPlayer.missions.map(card => (
                        <Card
                            key={card.id}
                            card={card}
                            type={CardType.MISSION}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
