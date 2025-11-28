import React, { useMemo } from 'react';
import { useGameStore } from '../store';
import { Tile } from './Tile';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { DraggableTile } from './DraggableTile';
import { DroppableCell } from './DroppableCell';
import { Direction } from '../types';

export const Board: React.FC = () => {
    const { board, players, highlightedTiles, movePlayer, currentPlayerIndex, tileToPlace, placeTile, rotateTileToPlace, catPosition } = useGameStore();

    const handleTileClick = (tileId: string) => {
        const currentPlayer = players[currentPlayerIndex];
        if (highlightedTiles.includes(tileId)) {
            movePlayer(currentPlayer.id, tileId);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over } = event;
        if (over && tileToPlace) {
            const { x, y } = over.data.current as { x: number; y: number };
            placeTile({ ...tileToPlace, x, y });
        }
    };

    // Calculate valid placement spots
    const validSpots = useMemo(() => {
        if (!tileToPlace) return [];

        const spots: { x: number; y: number }[] = [];
        const occupied = new Set(board.map(t => `${t.x},${t.y}`));

        // Check all adjacent spots of existing tiles
        board.forEach(tile => {
            const neighbors = [
                { x: tile.x, y: tile.y - 1, dir: Direction.TOP, opp: Direction.BOTTOM },
                { x: tile.x + 1, y: tile.y, dir: Direction.RIGHT, opp: Direction.LEFT },
                { x: tile.x, y: tile.y + 1, dir: Direction.BOTTOM, opp: Direction.TOP },
                { x: tile.x - 1, y: tile.y, dir: Direction.LEFT, opp: Direction.RIGHT },
            ];

            neighbors.forEach(({ x, y, dir, opp }) => {
                if (occupied.has(`${x},${y}`)) return;

                // Check if this spot is valid for the new tile
                // 1. Must connect to at least one existing tile (which is 'tile' here)
                // 2. Must not conflict with any neighbors

                // Simplified check: Just check if the new tile connects to THIS neighbor 'tile'
                // In a full implementation, we need to check ALL neighbors of the new spot

                const connectsToSource = tile.connections.includes(dir) && tileToPlace.connections.includes(opp);

                // We also need to check if the new tile's other connections match other neighbors if they exist
                // For now, let's just ensure it connects to at least one and doesn't conflict (i.e. if neighbor exists, must connect)

                if (connectsToSource) {
                    // Check for conflicts with other neighbors
                    let conflict = false;
                    // Check all 4 sides of the potential spot
                    const spotNeighbors = [
                        { nx: x, ny: y - 1, ndir: Direction.TOP, nopp: Direction.BOTTOM },
                        { nx: x + 1, ny: y, ndir: Direction.RIGHT, nopp: Direction.LEFT },
                        { nx: x, ny: y + 1, ndir: Direction.BOTTOM, nopp: Direction.TOP },
                        { nx: x - 1, ny: y, ndir: Direction.LEFT, nopp: Direction.RIGHT },
                    ];

                    for (const n of spotNeighbors) {
                        const neighborTile = board.find(t => t.x === n.nx && t.y === n.ny);
                        if (neighborTile) {
                            const tileConnects = tileToPlace.connections.includes(n.ndir);
                            const neighborConnects = neighborTile.connections.includes(n.nopp);
                            if (tileConnects !== neighborConnects) {
                                conflict = true; // Mismatch: one has path, other doesn't
                                break;
                            }
                        }
                    }

                    if (!conflict && !spots.some(s => s.x === x && s.y === y)) {
                        spots.push({ x, y });
                    }
                }
            });
        });
        return spots;
    }, [board, tileToPlace]);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="w-full h-screen overflow-auto bg-[#2c1810] flex items-center justify-center pb-[45vh] pt-20 px-4">
                <div
                    className="grid gap-0 relative shadow-2xl border-4 border-[#c2b280] rounded-lg bg-[#f0e6d2]"
                    style={{
                        width: 'max-content',
                        height: 'max-content',
                    }}
                >
                    {board.map(tile => {
                        const isHighlight = highlightedTiles.includes(tile.id);
                        const isCurrentPlayerTile = players.some(p => p.position.x === tile.x && p.position.y === tile.y);
                        const hasCat = catPosition?.x === tile.x && catPosition?.y === tile.y;

                        return (
                            <Tile
                                key={tile.id}
                                tile={{ ...tile, hasCat }} // Merge hasCat into tile prop
                                playersOnTile={players.filter(p => p.position.x === tile.x && p.position.y === tile.y)}
                                onClick={isHighlight ? () => handleTileClick(tile.id) : undefined}
                                isHighlight={isHighlight}
                            />
                        );
                    })}
                    {validSpots.map(spot => (
                        <DroppableCell key={`${spot.x},${spot.y}`} x={spot.x} y={spot.y} isValid={true} />
                    ))}
                </div>

                {tileToPlace && (
                    <DraggableTile tile={tileToPlace} onRotate={rotateTileToPlace} />
                )}
            </div>
        </DndContext>
    );
};
