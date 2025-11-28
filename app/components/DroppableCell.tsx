import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

interface DroppableCellProps {
    x: number;
    y: number;
    isValid: boolean;
}

export const DroppableCell: React.FC<DroppableCellProps> = ({ x, y, isValid }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `cell-${x}-${y}`,
        data: { x, y },
        disabled: !isValid,
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-dashed transition-all duration-300",
                isOver ? "bg-green-200/50 border-green-500 scale-105 z-10" : "bg-white/20 border-amber-400/50 hover:bg-white/40",
                "animate-pulse"
            )}
            style={{
                gridColumn: x + 10,
                gridRow: y + 10,
            }}
        >
            {isOver ? (
                <span className="text-green-700 font-bold text-sm">Drop Here!</span>
            ) : (
                <div className="flex flex-col items-center text-amber-600/70">
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Place</span>
                </div>
            )}
        </div>
    );
};
