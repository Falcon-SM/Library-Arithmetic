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
            case ETileType.LIBRARY: return <BookOpen className={`${iconClass} text-indigo-800`} />;
            case ETileType.STUDY_ROOM: return <div className={`${iconClass} text-gray-700 font-bold flex items-center justify-center`}>S</div>;
            case ETileType.GARDEN: return <div className={`${iconClass} text-green-500 font-bold flex items-center justify-center`}>G</div>;
            case ETileType.CAFETERIA: return <div className={`${iconClass} text-orange-500 font-bold flex items-center justify-center`}>C</div>;
            default: return null;
        }
    };

    const getTileStyle = () => {
        switch (tile.type) {
            case ETileType.ARCHIVE: return "bg-amber-100/90 border-amber-300 shadow-amber-100";
            case ETileType.EVENT: return "bg-purple-100/90 border-purple-300 shadow-purple-100";
            case ETileType.SPECIAL_GEOMETRY: return "bg-blue-50/90 border-blue-200 shadow-blue-50";
            case ETileType.SPECIAL_ALGEBRA: return "bg-red-50/90 border-red-200 shadow-red-50";
            case ETileType.LIBRARY: return "bg-indigo-50/90 border-indigo-200 shadow-indigo-50";
            case ETileType.STUDY_ROOM: return "bg-stone-100/90 border-stone-300 shadow-stone-100";
            case ETileType.GARDEN: return "bg-emerald-50/90 border-emerald-200 shadow-emerald-50";
            case ETileType.CAFETERIA: return "bg-orange-50/90 border-orange-200 shadow-orange-50";
            case ETileType.START: return "bg-gradient-to-br from-green-100 to-emerald-200 border-emerald-400 shadow-emerald-200";
            default: return "bg-[#f0e6d2] border-[#d4c5a3]";
        }
    };

    return (
        <div
            className={clsx(
                "relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center select-none transition-all duration-300 rounded-lg backdrop-blur-sm",
                getTileStyle(),
                "border-2 shadow-lg hover:shadow-xl hover:-translate-y-1",
                isHighlight && "ring-4 ring-yellow-400 ring-opacity-80 z-20 shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-pulse scale-105",
                onClick && "cursor-pointer hover:brightness-110 hover:scale-105",
                !isHighlight && !onClick && "hover:brightness-105"
            )}

            style={{
                gridColumn: tile.x + 10,
                gridRow: tile.y + 10
            }}
            onClick={onClick}
        >
            {/* Path Visuals - Semi-transparent to blend with background */}
            <div className={clsx(
                "absolute w-3 md:w-4 h-1/2 bg-black/10 top-0 left-1/2 -translate-x-1/2",
                !hasConnection(Direction.TOP) && "hidden"
            )} />
            <div className={clsx(
                "absolute w-3 md:w-4 h-1/2 bg-black/10 bottom-0 left-1/2 -translate-x-1/2",
                !hasConnection(Direction.BOTTOM) && "hidden"
            )} />
            <div className={clsx(
                "absolute h-3 md:h-4 w-1/2 bg-black/10 left-0 top-1/2 -translate-y-1/2",
                !hasConnection(Direction.LEFT) && "hidden"
            )} />
            <div className={clsx(
                "absolute h-3 md:h-4 w-1/2 bg-black/10 right-0 top-1/2 -translate-y-1/2",
                !hasConnection(Direction.RIGHT) && "hidden"
            )} />

            {/* Center Hub */}
            <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-white/40 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md border border-white/50 shadow-sm" />

            {/* Icon/Type */}
            <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {getIcon()}
            </div>

            {/* Cat with animation */}
            {tile.hasCat && (
                <div className="absolute -top-2 -right-2 z-30 bg-white rounded-full p-1.5 shadow-lg border-2 border-orange-200 animate-bounce">
                    <Cat className="w-4 h-4 md:w-5 md:h-5 text-orange-500 fill-orange-100" />
                </div>
            )}

            {/* Players with better styling */}
            <div className="absolute -bottom-2 -left-2 flex gap-1 z-30 flex-wrap max-w-[120%] justify-center pointer-events-none">
                {playersOnTile.map(p => (
                    <div
                        key={p.id}
                        className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white shadow-lg transform transition-transform hover:scale-150 relative group"
                        style={{ backgroundColor: p.color }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {p.id}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
