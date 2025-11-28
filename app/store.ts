import { create } from 'zustand';
import {
    GameState,
    Player,
    Tile,
    TileType,
    Direction,
    CardType,
    MathematicianCard,
    MissionCard,
    EventCard,
    BoardCard,
    MathematicianRarity
} from './types';
import { MATHEMATICIAN_CARDS, MISSION_CARDS, EVENT_CARDS, BOARD_CARDS } from './data';
import { getReachableTiles } from './utils/pathfinding';

interface GameStore extends GameState {
    // Actions
    initializeGame: (playerNames: string[]) => void;
    rollDice: () => number;
    movePlayer: (playerId: string, targetTileId: string) => void;
    drawMathematicianCard: (playerId: string) => void;
    drawMissionCard: (playerId: string, count: number) => void;
    drawEventCard: () => EventCard;
    drawBoardTile: () => void;
    rotateTileToPlace: () => void;
    placeTile: (tile: Tile) => void;
    endTurn: () => void;
    useMathematicianCard: (playerId: string, cardId: string) => void;
    checkMissions: (playerId: string) => void;
}

// Helper to shuffle arrays
function shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const INITIAL_MP = 5;
const MAX_TURNS = 8;

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial State
    turn: 1,
    currentPlayerIndex: 0,
    players: [],
    board: [],
    mathematicianDeck: [],
    missionDeck: [],
    eventDeck: [],
    boardDeck: [],
    catPosition: null,
    gameStatus: 'SETUP',
    log: [],
    highlightedTiles: [],
    currentRoll: null,
    tileToPlace: null,

    initializeGame: (playerNames: string[]) => {
        console.log('Initializing game with players:', playerNames);
        // 1. Setup Decks
        const mathDeck = shuffle([...MATHEMATICIAN_CARDS]);
        const missionDeck = shuffle([...MISSION_CARDS]);
        const eventDeck = shuffle([...EVENT_CARDS]);
        const boardDeck = shuffle([...BOARD_CARDS]);

        // 2. Setup Board (Start Tile)
        const startTile: Tile = {
            id: 'start-tile',
            x: 0,
            y: 0,
            type: TileType.START,
            connections: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT],
            rotation: 0,
        };

        // 3. Setup Players
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']; // Blue, Red, Green, Amber, Violet
        const players: Player[] = playerNames.map((name, index) => ({
            id: `p${index + 1}`,
            name,
            color: colors[index % colors.length],
            mp: INITIAL_MP,
            hand: [],
            missions: [],
            completedMissions: [],
            position: { x: 0, y: 0 },
            skipTurn: false,
            silenced: false,
            protected: false,
        }));

        // Deal initial missions (2 per player)
        players.forEach(p => {
            p.missions.push(missionDeck.pop()!);
            p.missions.push(missionDeck.pop()!);
        });

        set({
            turn: 1,
            currentPlayerIndex: 0,
            players,
            board: [startTile],
            mathematicianDeck: mathDeck,
            missionDeck,
            eventDeck,
            boardDeck,
            gameStatus: 'PLAYING',
            log: ['Game Started!'],
            highlightedTiles: [],
            currentRoll: null,
            tileToPlace: null,
        });
    },

    rollDice: () => {
        const roll = Math.floor(Math.random() * 3) + 1;
        const state = get();
        const currentPlayer = state.players[state.currentPlayerIndex];
        const currentTile = state.board.find(t => t.x === currentPlayer.position.x && t.y === currentPlayer.position.y);

        if (!currentTile) return roll;

        // Calculate reachable tiles
        const reachable = getReachableTiles(currentTile, roll, state.board);

        set({
            currentRoll: roll,
            highlightedTiles: reachable,
            log: [...state.log, `${currentPlayer.name} rolled a ${roll}. Select a highlighted tile to move.`]
        });

        return roll;
    },

    drawBoardTile: () => {
        set(state => {
            if (state.boardDeck.length === 0) return state;
            const tileCard = state.boardDeck[0];
            const newDeck = state.boardDeck.slice(1);

            // Convert card to tile format (temporary ID and position)
            const newTile: Tile = {
                id: `tile-${Date.now()}`,
                x: 0,
                y: 0,
                type: tileCard.specialType || TileType.NORMAL,
                connections: tileCard.connections,
                rotation: 0,
            };

            return {
                boardDeck: newDeck,
                tileToPlace: newTile,
                log: [...state.log, 'Drew a new tile. Drag to place it.'],
            };
        });
    },

    rotateTileToPlace: () => {
        set(state => {
            if (!state.tileToPlace) return state;
            const connections = state.tileToPlace.connections.map(d => {
                switch (d) {
                    case Direction.TOP: return Direction.RIGHT;
                    case Direction.RIGHT: return Direction.BOTTOM;
                    case Direction.BOTTOM: return Direction.LEFT;
                    case Direction.LEFT: return Direction.TOP;
                    default: return d; // Should not happen
                }
            });
            return {
                tileToPlace: {
                    ...state.tileToPlace,
                    connections,
                    rotation: (state.tileToPlace.rotation + 90) % 360,
                }
            };
        });
    },

    placeTile: (tile: Tile) => {
        set(state => {
            // Validate placement (simple check: adjacent to existing)
            // In real app, check connection match

            const newBoard = [...state.board, tile];
            return {
                board: newBoard,
                tileToPlace: null,
                log: [...state.log, `Placed tile at (${tile.x}, ${tile.y}).`],
            };
        });
    },

    movePlayer: (playerId, targetTileId) => {
        set(state => {
            // Validate move
            if (!state.highlightedTiles.includes(targetTileId)) {
                return state; // Invalid move
            }

            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return state;

            const targetTile = state.board.find(t => t.id === targetTileId);
            if (!targetTile) return state;

            const newPlayers = [...state.players];
            newPlayers[playerIndex] = {
                ...newPlayers[playerIndex],
                position: { x: targetTile.x, y: targetTile.y },
            };

            let logMsg = `${newPlayers[playerIndex].name} moved to (${targetTile.x}, ${targetTile.y}).`;

            // Tile Effects
            if (targetTile.type === TileType.ARCHIVE) {
                logMsg += ' Landed on Archive! (Draw Math Card)';
                // Auto-draw for now or add button
            } else if (targetTile.type === TileType.EVENT) {
                logMsg += ' Landed on Event!';
            }

            return {
                players: newPlayers,
                highlightedTiles: [], // Clear highlights
                currentRoll: null, // Reset roll
                log: [...state.log, logMsg],
            };
        });

        // Check missions after move
        get().checkMissions(playerId);
    },

    drawMathematicianCard: (playerId) => {
        set(state => {
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1 || state.mathematicianDeck.length === 0) return state;

            const card = state.mathematicianDeck[0];
            const newDeck = state.mathematicianDeck.slice(1);
            const newPlayers = [...state.players];
            newPlayers[playerIndex].hand.push(card);

            return {
                mathematicianDeck: newDeck,
                players: newPlayers,
                log: [...state.log, `${newPlayers[playerIndex].name} drew ${card.name}.`],
            };
        });
    },

    drawMissionCard: (playerId, count) => {
        set(state => {
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return state;

            const newDeck = [...state.missionDeck];
            const newPlayers = [...state.players];
            const drawnCards: MissionCard[] = [];

            for (let i = 0; i < count; i++) {
                if (newDeck.length > 0) {
                    const card = newDeck.shift()!;
                    newPlayers[playerIndex].missions.push(card);
                    drawnCards.push(card);
                }
            }

            return {
                missionDeck: newDeck,
                players: newPlayers,
                log: [...state.log, `${newPlayers[playerIndex].name} drew ${drawnCards.length} mission(s).`],
            };
        });
    },

    drawEventCard: () => {
        const state = get();
        if (state.eventDeck.length === 0) return state.eventDeck[0];
        const card = state.eventDeck[0];

        let extraUpdates: Partial<GameStore> = {};

        if (card.id === 'ev-cat') {
            // Place cat on random tile (excluding start)
            const availableTiles = state.board.filter(t => t.type !== TileType.START);
            if (availableTiles.length > 0) {
                const target = availableTiles[Math.floor(Math.random() * availableTiles.length)];
                // Update tile to have cat? No, catPosition is in state.
                // But Tile component checks tile.hasCat? 
                // Wait, Tile interface has `hasCat`. But store has `catPosition`.
                // I should sync them or just use `catPosition` in Board/Tile rendering.
                // My Tile component uses `tile.hasCat`. 
                // So I should update the board state OR update Tile component to check store.catPosition.
                // Updating board state is cleaner for the Tile component props.

                // Actually, let's just use catPosition in store and pass it to Tile in Board.tsx.
                // But Tile.tsx takes `tile` prop.
                // Let's update Board.tsx to pass `hasCat` prop based on store.catPosition.

                extraUpdates = { catPosition: { x: target.x, y: target.y } };
            }
        }

        set(state => ({
            eventDeck: state.eventDeck.slice(1),
            log: [...state.log, `Event: ${card.title} - ${card.description}`],
            ...extraUpdates
        }));

        return card;
    },



    endTurn: () => {
        set(state => {
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            let nextTurn = state.turn;

            if (nextPlayerIndex === 0) {
                nextTurn += 1;
            }

            if (nextTurn > MAX_TURNS) {
                return {
                    gameStatus: 'FINISHED',
                    log: [...state.log, 'Game Over!'],
                };
            }

            return {
                currentPlayerIndex: nextPlayerIndex,
                turn: nextTurn,
                log: [...state.log, `Turn ${nextTurn}: ${state.players[nextPlayerIndex].name}'s turn.`],
            };
        });
    },

    useMathematicianCard: (playerId, cardId) => {
        set(state => {
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return state;

            const player = state.players[playerIndex];
            const cardIndex = player.hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return state;

            if (player.mp < 1) {
                return { log: [...state.log, `${player.name} does not have enough MP!`] };
            }

            const newPlayers = [...state.players];
            const card = newPlayers[playerIndex].hand.splice(cardIndex, 1)[0];
            newPlayers[playerIndex].mp -= 1;

            let logMsg = `${player.name} used ${card.name}!`;
            let extraUpdates: Partial<GameStore> = {};

            // Card Effects
            switch (card.id) {
                case 'm-pascal': // MP +3
                    newPlayers[playerIndex].mp += 3;
                    logMsg += ' Recovered 3 MP.';
                    break;
                case 'm-gauss': // Next dice 1 (Implementation: set flag? For now just log)
                    logMsg += ' (Effect not fully implemented: Next dice 1)';
                    break;
                case 'm-pythagoras': // Warp
                    // For now, let's make it "Warp to Start" as a placeholder or "Warp to any tile" (need UI for target selection)
                    // Let's just give +3 movement for now to keep it simple without target selection UI
                    logMsg += ' (Effect simplified: Move +3 spaces)';
                    // Logic to move would require target selection.
                    break;
                case 'm-einstein': // Warp to Event
                    const eventTiles = state.board.filter(t => t.type === TileType.EVENT);
                    if (eventTiles.length > 0) {
                        const target = eventTiles[Math.floor(Math.random() * eventTiles.length)];
                        newPlayers[playerIndex].position = { x: target.x, y: target.y };
                        logMsg += ` Warped to Event tile at (${target.x}, ${target.y}).`;
                    } else {
                        logMsg += ' No Event tiles to warp to.';
                    }
                    break;
                // Add more cases as needed
            }

            return {
                players: newPlayers,
                log: [...state.log, logMsg],
                ...extraUpdates
            };
        });
    },

    checkMissions: (playerId) => {
        set(state => {
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return state;

            const player = state.players[playerIndex];
            const currentTile = state.board.find(t => t.x === player.position.x && t.y === player.position.y);
            if (!currentTile) return state;

            const newPlayers = [...state.players];
            const completedMissions: MissionCard[] = [];
            const remainingMissions: MissionCard[] = [];

            player.missions.forEach(mission => {
                let completed = false;

                // Mission Logic
                switch (mission.id) {
                    case 'mi-start':
                        if (currentTile.type === TileType.START) completed = true;
                        break;
                    case 'mi-archive':
                        if (currentTile.type === TileType.ARCHIVE) completed = true;
                        break;
                    case 'mi-event':
                        if (currentTile.type === TileType.EVENT) completed = true;
                        break;
                    case 'mi-cat':
                        if (state.catPosition && state.catPosition.x === currentTile.x && state.catPosition.y === currentTile.y) {
                            completed = true;
                        }
                        break;
                    // Add more mission checks
                }

                if (completed) {
                    completedMissions.push({ ...mission, completed: true });
                } else {
                    remainingMissions.push(mission);
                }
            });

            if (completedMissions.length === 0) return state;

            newPlayers[playerIndex].missions = remainingMissions;
            newPlayers[playerIndex].completedMissions = [...player.completedMissions, ...completedMissions];

            // Draw new missions
            const newMissionDeck = [...state.missionDeck];
            for (let i = 0; i < completedMissions.length; i++) {
                if (newMissionDeck.length > 0) {
                    newPlayers[playerIndex].missions.push(newMissionDeck.shift()!);
                }
            }

            // Clear Cat if captured
            let newCatPos = state.catPosition;
            if (completedMissions.some(m => m.id === 'mi-cat')) {
                newCatPos = null;
            }

            return {
                players: newPlayers,
                missionDeck: newMissionDeck,
                catPosition: newCatPos,
                log: [...state.log, `${player.name} completed ${completedMissions.length} mission(s)!`],
            };
        });
    }
}));
