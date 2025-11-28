import React from 'react';
import { Tile as TileType, Direction, TileType as ETileType } from '../types';
import { clsx } from 'clsx';
import { Cat, Footprints, BookOpen, Sparkles, Sigma, Variable } from 'lucide-react';

interface TileProps {
    tile: TileType;
    playersOnTile: { id: string; color: string }[];
    onClick?: () => void;
    isHighlight?: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, playersOnTile, onClick, isHighlight }) => {
    const hasConnection = (dir: Direction) => tile.connections.includes(dir);

    // Rotate connections based on tile rotation
    // Note: In a real implementation, we'd rotate the visual container, 
    // but for simplicity here we assume the connections data is already "absolute" or we rotate the div.
    // Let's rotate the div.

    const getIcon = () => {
        switch (tile.type) {
            case ETileType.ARCHIVE: return <BookOpen className="w-6 h-6 text-amber-800" />;
            case ETileType.EVENT: return <Sparkles className="w-6 h-6 text-purple-600" />;
            case ETileType.SPECIAL_GEOMETRY: return <Variable className="w-6 h-6 text-blue-600" />; // Placeholder
            case ETileType.SPECIAL_ALGEBRA: return <Sigma className="w-6 h-6 text-red-600" />;
            case ETileType.START: return <Footprints className="w-6 h-6 text-green-700" />;
            default: return null;
        }
    };

    return (
        <div
            className={clsx(
                "relative w-24 h-24 bg-[#f0e6d2] border-2 border-[#d4c5a3] flex items-center justify-center select-none transition-all",
                isHighlight && "ring-4 ring-yellow-400 z-10",
                "hover:shadow-lg"
            )}
            style={{
                gridColumn: tile.x + 10, // Offset to handle negative coordinates if any, or just center
                gridRow: tile.y + 10
            }}
            onClick={onClick}
        >
            {/* Path Visuals */}
            <div className={clsx("absolute w-4 h-1/2 bg-[#c2b280] top-0 left-1/2 -translate-x-1/2", !hasConnection(Direction.TOP) && "hidden")} />
            <div className={clsx("absolute w-4 h-1/2 bg-[#c2b280] bottom-0 left-1/2 -translate-x-1/2", !hasConnection(Direction.BOTTOM) && "hidden")} />
            <div className={clsx("absolute h-4 w-1/2 bg-[#c2b280] left-0 top-1/2 -translate-y-1/2", !hasConnection(Direction.LEFT) && "hidden")} />
            <div className={clsx("absolute h-4 w-1/2 bg-[#c2b280] right-0 top-1/2 -translate-y-1/2", !hasConnection(Direction.RIGHT) && "hidden")} />

            {/* Center Hub */}
            <div className="absolute w-8 h-8 bg-[#c2b280] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Icon/Type */}
            <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {getIcon()}
            </div>

            {/* Cat */}
            {tile.hasCat && (
                <div className="absolute top-1 right-1 z-20 bg-white rounded-full p-1 shadow">
                    <Cat className="w-4 h-4 text-orange-500" />
                </div>
            )}

            {/* Players */}
            <div className="absolute bottom-1 left-1 flex gap-1 z-20">
                {playersOnTile.map(p => (
                    <div
                        key={p.id}
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: p.color }}
                        title={p.id}
                    />
                ))}
            </div>
        </div>
    );
};
