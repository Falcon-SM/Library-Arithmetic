import { Tile, Direction } from '../types';

export function getReachableTiles(
    startTile: Tile,
    moves: number,
    allTiles: Tile[]
): string[] {
    const reachableIds = new Set<string>();
    const queue: { tile: Tile; remaining: number }[] = [{ tile: startTile, remaining: moves }];
    const visited = new Set<string>();

    // Helper to find neighbor
    const getNeighbor = (x: number, y: number) => allTiles.find(t => t.x === x && t.y === y);

    while (queue.length > 0) {
        const { tile, remaining } = queue.shift()!;
        const key = `${tile.id}-${remaining}`;

        if (visited.has(key)) continue;
        visited.add(key);

        if (remaining === 0) {
            reachableIds.add(tile.id);
            continue;
        }

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
                // Valid connection
                queue.push({ tile: neighbor, remaining: remaining - 1 });
            }
        });
    }

    return Array.from(reachableIds);
}
