import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';

interface DroppableCellProps {
    x: number;
    y: number;
    isValid: boolean;
}

export const DroppableCell: React.FC<DroppableCellProps> = ({ x, y, isValid }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `cell-${x}-${y}`,
        data: { x, y },
        disabled: !isValid,
    });

    if (!isValid) return null;

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "w-24 h-24 border-2 border-dashed border-white/30 flex items-center justify-center transition-colors",
                isOver ? "bg-green-500/30 border-green-400" : "hover:bg-white/10",
                "absolute"
            )}
            style={{
                gridColumn: x + 10,
                gridRow: y + 10,
            }}
        >
            <div className="text-white/50 text-xs">Place Here</div>
        </div>
    );
};
