import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Tile } from './Tile';
import { Tile as TileType } from '../types';
import { RotateCw } from 'lucide-react';

interface DraggableTileProps {
    tile: TileType;
    onRotate: () => void;
}

export const DraggableTile: React.FC<DraggableTileProps> = ({ tile, onRotate }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable-tile',
        data: { tile },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div className="fixed bottom-[45vh] right-8 flex flex-col items-center gap-2 z-[60]">
            <div className="text-white font-bold text-sm shadow-black drop-shadow-md">New Tile</div>
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing shadow-2xl">
                <Tile tile={tile} playersOnTile={[]} />
            </div>
            <button
                onClick={onRotate}
                className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
                <RotateCw className="w-5 h-5" />
            </button>
        </div>
    );
};
