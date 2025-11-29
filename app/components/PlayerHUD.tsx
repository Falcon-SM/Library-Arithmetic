import React from 'react';
import { useGameStore } from '../store';
import { Card } from './Card';
import { CardType } from '../types';
import { User, Zap, Trophy } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { MissionCard } from '../types';

// Draggable wrapper for Mission cards
const DraggableMissionCard: React.FC<{ card: MissionCard }> = ({ card }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `mission-${card.id}`,
        data: { type: 'mission', card },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="transition-opacity select-none"
        >
            <Card card={card} type={CardType.MISSION} />
        </div>
    );
};

export const PlayerHUD: React.FC = () => {
    const { players, currentPlayerIndex, useMathematicianCard } = useGameStore();
    const currentPlayer = players[currentPlayerIndex];

    if (!currentPlayer) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-auto max-h-[40vh] bg-white/95 border-t-4 border-[#2c1810] p-2 md:p-4 flex flex-col md:flex-row gap-4 md:gap-8 shadow-2xl z-50 overflow-hidden">
            {/* Stats Panel */}
            <div className="w-full md:w-48 flex-shrink-0 flex flex-row md:flex-col justify-between md:justify-start gap-2 border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-4">
                <div className="flex items-center gap-2 text-lg md:text-xl font-bold" style={{ color: currentPlayer.color }}>
                    <User className="w-5 h-5" /> {currentPlayer.name}
                </div>
                <div className="flex gap-4 md:flex-col md:gap-2">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-base md:text-lg">
                        <Zap className="w-4 h-4" /> MP: {currentPlayer.mp}
                    </div>
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-base md:text-lg">
                        <Trophy className="w-4 h-4" /> Score: {currentPlayer.completedMissions.reduce((acc, m) => acc + m.points, 0)}
                    </div>
                </div>
            </div>

            {/* Scrollable Area for Hand and Missions */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Hand */}
                <div className="flex-1 overflow-x-auto min-h-[100px]">
                    <h4 className="font-bold text-gray-500 mb-1 text-xs uppercase tracking-wider">Hand</h4>
                    <div className="flex gap-2 pb-2">
                        {currentPlayer.hand.map(card => (
                            <Card
                                key={card.id}
                                card={card}
                                type={CardType.MATHEMATICIAN}
                                onClick={() => useMathematicianCard(currentPlayer.id, card.id)}
                            />
                        ))}
                        {currentPlayer.hand.length === 0 && <div className="text-gray-400 text-sm italic p-2">No cards</div>}
                    </div>
                </div>

                {/* Missions - Now Draggable */}
                <div className="flex-1 overflow-x-auto border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-4 min-h-[100px]">
                    <h4 className="font-bold text-gray-500 mb-1 text-xs uppercase tracking-wider">
                        Missions
                        <span className="ml-2 text-[10px] text-gray-400 normal-case">(drag to use)</span>
                    </h4>
                    <div className="flex gap-2 pb-2">
                        {currentPlayer.missions.map(card => (
                            <DraggableMissionCard key={card.id} card={card} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
