import React from 'react';
import { useGameStore } from '../store';
import { Tile } from './Tile';

export const Board: React.FC = () => {
    const { board, players } = useGameStore();

    // Calculate bounds to center the board
    // For simplicity, we'll use a fixed large grid and center the view or just let CSS Grid handle it with auto-placement
    // But since we used explicit gridColumn/Row in Tile, we need a container that supports it.

    return (
        <div className="w-full h-full overflow-auto p-8 bg-[#2c1810] flex items-center justify-center">
            <div
                className="grid gap-0 relative"
                style={{
                    // A large enough grid area to accommodate expansion
                    // In a real app, we'd calculate min/max X/Y to size this dynamically
                    width: 'max-content',
                    height: 'max-content',
                }}
            >
                {board.map(tile => (
                    <Tile
                        key={tile.id}
                        tile={tile}
                        playersOnTile={players.filter(p => p.position.x === tile.x && p.position.y === tile.y).map(p => ({ id: p.id, color: p.color }))}
                    />
                ))}
            </div>
        </div>
    );
};
