import React from 'react';
import { useGameStore } from '../store';
import { Dices, SkipForward } from 'lucide-react';

export const GameControls: React.FC = () => {
    const { rollDice, endTurn, log, turn } = useGameStore();

    const handleRoll = () => {
        const result = rollDice();
        // In a real implementation, we'd show the result and trigger movement state
        alert(`Rolled a ${result}!`);
    };

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-4 items-end z-50 pointer-events-none">
            <div className="bg-white/90 p-4 rounded-lg shadow-lg pointer-events-auto w-64">
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                    <span className="font-bold text-lg">Turn {turn} / 8</span>
                </div>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={handleRoll}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 font-bold shadow"
                    >
                        <Dices /> Roll
                    </button>
                    <button
                        onClick={endTurn}
                        className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 flex items-center justify-center gap-2 font-bold shadow"
                    >
                        <SkipForward /> End
                    </button>
                </div>

                {/* Log Window */}
                <div className="h-32 overflow-y-auto bg-gray-100 rounded p-2 text-xs font-mono border">
                    {log.slice().reverse().map((entry, i) => (
                        <div key={i} className="mb-1 border-b border-gray-200 pb-1 last:border-0">{entry}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};
