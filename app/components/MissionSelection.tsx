import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { MissionCard, CardType } from '../types';
import { Card } from './Card';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface MissionSelectionProps {
    playerId: string;
    onComplete: () => void;
}

const DraggableMissionCard: React.FC<{ mission: MissionCard; isSelected: boolean }> = ({ mission, isSelected }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: mission.id,
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
            className={`transform transition-all duration-300 ${isSelected
                    ? 'scale-105 ring-4 ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] z-10'
                    : 'hover:scale-105 opacity-90 hover:opacity-100 hover:shadow-xl'
                }`}
        >
            <Card card={mission} type={CardType.MISSION} />
        </div>
    );
};

const DropZone: React.FC<{ selectedCount: number }> = ({ selectedCount }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'mission-drop-zone',
    });

    return (
        <div
            ref={setNodeRef}
            className={`w-full max-w-2xl h-48 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${isOver
                    ? 'border-green-500 bg-green-500/20 scale-105'
                    : 'border-white/40 bg-white/10'
                }`}
        >
            <div className="text-center">
                <p className="text-white text-2xl font-bold mb-2">
                    {selectedCount === 0 ? '📋 Drag missions here' : `✅ ${selectedCount}/2 missions selected`}
                </p>
                <p className="text-white/70 text-sm">
                    {selectedCount < 2 ? `Select ${2 - selectedCount} more` : 'Ready to confirm!'}
                </p>
            </div>
        </div>
    );
};

export const MissionSelection: React.FC<MissionSelectionProps> = ({ playerId, onComplete }) => {
    const { players, drawMissionsFromDeck, distributeMissions, returnMissionsToDeck } = useGameStore();
    const player = players.find(p => p.id === playerId);
    const [candidates, setCandidates] = useState<MissionCard[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const drawn = drawMissionsFromDeck(5);
        setCandidates(drawn);
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id === 'mission-drop-zone' && active.id) {
            const missionId = active.id as string;

            // Toggle selection
            if (selectedIds.includes(missionId)) {
                setSelectedIds(selectedIds.filter(id => id !== missionId));
            } else if (selectedIds.length < 2) {
                setSelectedIds([...selectedIds, missionId]);
            }
        }
    };

    const handleConfirm = () => {
        if (selectedIds.length !== 2) return;

        const selectedMissions = candidates.filter(c => selectedIds.includes(c.id));
        const rejectedMissions = candidates.filter(c => !selectedIds.includes(c.id));

        distributeMissions(playerId, selectedMissions);
        returnMissionsToDeck(rejectedMissions);
        onComplete();
    };

    if (!player) return null;

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                        Mission Selection
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90">
                        <span style={{ color: player.color }} className="font-bold drop-shadow-md">{player.name}</span>,
                        drag <span className="text-amber-400 font-bold">2 missions</span> to the drop zone below.
                    </p>
                </div>

                {/* Drop Zone */}
                <div className="mb-8 w-full flex justify-center">
                    <DropZone selectedCount={selectedIds.length} />
                </div>

                {/* Mission Cards Grid */}
                <div className="flex flex-wrap gap-6 justify-center mb-10 max-w-6xl p-6">
                    {candidates.map(mission => (
                        <DraggableMissionCard
                            key={mission.id}
                            mission={mission}
                            isSelected={selectedIds.includes(mission.id)}
                        />
                    ))}
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={selectedIds.length !== 2}
                    className={`px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 transform ${selectedIds.length === 2
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-lg hover:shadow-green-500/50 scale-105 hover:scale-110'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                        }`}
                >
                    {selectedIds.length === 2 ? '✅ Confirm Selection' : `Select ${2 - selectedIds.length} more mission(s)`}
                </button>
            </div>
        </DndContext>
    );
};
