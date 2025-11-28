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

    const getIcon = () => {
        const iconClass = "w-5 h-5 md:w-6 md:h-6 drop-shadow-md";
        switch (tile.type) {
            case ETileType.ARCHIVE: return <BookOpen className={`${iconClass} text-amber-700`} />;
            case ETileType.EVENT: return <Sparkles className={`${iconClass} text-purple-600 animate-pulse`} />;
            case ETileType.SPECIAL_GEOMETRY: return <Variable className={`${iconClass} text-blue-600`} />;
            case ETileType.SPECIAL_ALGEBRA: return <Sigma className={`${iconClass} text-red-600`} />;
            case ETileType.START: return <Footprints className={`${iconClass} text-green-700`} />;
            default: return null;
        }
    };

    return (
        <div
            className={clsx(
                "relative w-20 h-20 md:w-24 md:h-24 bg-[#f0e6d2] border-2 border-[#d4c5a3] flex items-center justify-center select-none transition-all",
                isHighlight && "ring-4 ring-yellow-400 ring-opacity-70 z-10 shadow-xl shadow-yellow-400/30 animate-pulse",
                onClick && "hover:shadow-lg cursor-pointer hover:brightness-105",
                !isHighlight && !onClick && "hover:brightness-105"
            )}

            style={{
                gridColumn: tile.x + 10,
                gridRow: tile.y + 10
            }}
            onClick={onClick}
        >
            {/* Path Visuals */}
            <div className={clsx(
                "absolute w-3 md:w-4 h-1/2 bg-gradient-to-b from-[#c2b280] to-[#a89968] top-0 left-1/2 -translate-x-1/2",
                !hasConnection(Direction.TOP) && "hidden"
            )} />
            <div className={clsx(
                "absolute w-3 md:w-4 h-1/2 bg-gradient-to-t from-[#c2b280] to-[#a89968] bottom-0 left-1/2 -translate-x-1/2",
                !hasConnection(Direction.BOTTOM) && "hidden"
            )} />
            <div className={clsx(
                "absolute h-3 md:h-4 w-1/2 bg-gradient-to-r from-[#c2b280] to-[#a89968] left-0 top-1/2 -translate-y-1/2",
                !hasConnection(Direction.LEFT) && "hidden"
            )} />
            <div className={clsx(
                "absolute h-3 md:h-4 w-1/2 bg-gradient-to-l from-[#c2b280] to-[#a89968] right-0 top-1/2 -translate-y-1/2",
                !hasConnection(Direction.RIGHT) && "hidden"
            )} />

            {/* Center Hub with gradient */}
            <div className="absolute w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-[#d4c5a3] to-[#c2b280] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-inner" />

            {/* Icon/Type */}
            <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {getIcon()}
            </div>

            {/* Cat with animation */}
            {tile.hasCat && (
                <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 z-20 bg-white rounded-full p-1 shadow-lg border border-orange-200 animate-bounce">
                    <Cat className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                </div>
            )}

            {/* Players with better styling */}
            <div className="absolute bottom-0.5 left-0.5 md:bottom-1 md:left-1 flex gap-0.5 md:gap-1 z-20 flex-wrap max-w-[90%]">
                {playersOnTile.map(p => (
                    <div
                        key={p.id}
                        className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-md hover:scale-125 transition-transform"
                        style={{ backgroundColor: p.color }}
                        title={p.id}
                    />
                ))}
            </div>
        </div>
    );
};
