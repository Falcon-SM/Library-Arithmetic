import { Tile, Direction } from '../types';

export function getReachableTiles(
    startTile: Tile,
    moves: number,
    allTiles: Tile[]
): string[] {
    const reachableIds = new Set<string>();
    const queue: { tile: Tile; distance: number }[] = [{ tile: startTile, distance: 0 }];
    const visited = new Map<string, number>(); // tile.id -> minimum distance

    // Helper to find neighbor
    const getNeighbor = (x: number, y: number) => allTiles.find(t => t.x === x && t.y === y);

    while (queue.length > 0) {
        const { tile, distance } = queue.shift()!;

        // Skip if we've already visited this tile with a shorter or equal distance
        if (visited.has(tile.id) && visited.get(tile.id)! <= distance) {
            continue;
        }
        visited.set(tile.id, distance);

        // Add to reachable if distance is > 0 and <= moves
        // (Don't include starting tile)
        if (distance > 0 && distance <= moves) {
            reachableIds.add(tile.id);
        }

        // Continue exploring if we haven't used all moves
        if (distance < moves) {
            // Check all connections
            tile.connections.forEach(dir => {
                let nextX = tile.x;
                let nextY = tile.y;
                let oppositeDir: Direction;

                switch (dir) {
                    case Direction.TOP: nextY -= 1; oppositeDir = Direction.BOTTOM; break;
                    case Direction.RIGHT: nextX += 1; oppositeDir = Direction.LEFT; break;
                    case Direction.BOTTOM: nextY += 1; oppositeDir = Direction.TOP; break;
                    case Direction.LEFT: nextX -= 1; oppositeDir = Direction.RIGHT; break;
                }

                const neighbor = getNeighbor(nextX, nextY);
                if (neighbor && neighbor.connections.includes(oppositeDir)) {
                    // Valid connection - add to queue with increased distance
                    queue.push({ tile: neighbor, distance: distance + 1 });
                }
            });
        }
    }

    return Array.from(reachableIds);
}
