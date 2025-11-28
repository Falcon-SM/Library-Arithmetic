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

interface GameStore extends GameState {
    // Actions
    initializeGame: () => void;
    rollDice: () => number;
    movePlayer: (playerId: string, targetTileId: string) => void;
    drawMathematicianCard: (playerId: string) => void;
    drawMissionCard: (playerId: string, count: number) => void;
    drawEventCard: () => EventCard;
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

    initializeGame: () => {
        // 1. Setup Decks
        const mathDeck = shuffle([...MATHEMATICIAN_CARDS]);
        const missionDeck = shuffle([...MISSION_CARDS]);
        const eventDeck = shuffle([...EVENT_CARDS]);
        const boardDeck = shuffle([...BOARD_CARDS]); // In a real game this would be infinite or reshuffled

        // 2. Setup Board (Start Tile)
        const startTile: Tile = {
            id: 'start-tile',
            x: 0,
            y: 0,
            type: TileType.START,
            connections: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT],
            rotation: 0,
        };

        // 3. Setup Players (Example: 2 Players)
        const players: Player[] = [
            {
                id: 'p1',
                name: 'Player 1',
                color: 'blue',
                mp: INITIAL_MP,
                hand: [],
                missions: [],
                completedMissions: [],
                position: { x: 0, y: 0 },
                skipTurn: false,
                silenced: false,
                protected: false,
            },
            {
                id: 'p2',
                name: 'Player 2',
                color: 'red',
                mp: INITIAL_MP,
                hand: [],
                missions: [],
                completedMissions: [],
                position: { x: 0, y: 0 },
                skipTurn: false,
                silenced: false,
                protected: false,
            },
        ];

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
        });
    },

    rollDice: () => {
        return Math.floor(Math.random() * 3) + 1;
    },

    movePlayer: (playerId, targetTileId) => {
        set(state => {
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return state;

            const targetTile = state.board.find(t => t.id === targetTileId);
            if (!targetTile) return state;

            const newPlayers = [...state.players];
            newPlayers[playerIndex] = {
                ...newPlayers[playerIndex],
                position: { x: targetTile.x, y: targetTile.y },
            };

            // Check tile effects
            let logMsg = `${newPlayers[playerIndex].name} moved to (${targetTile.x}, ${targetTile.y}).`;

            // Simple effect handling (more complex logic needed for full implementation)
            if (targetTile.type === TileType.ARCHIVE) {
                // Draw Mathematician Card logic would go here or be triggered by UI
                logMsg += ' Landed on Archive!';
            } else if (targetTile.type === TileType.EVENT) {
                logMsg += ' Landed on Event!';
            }

            return {
                players: newPlayers,
                log: [...state.log, logMsg],
            };
        });
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
        if (state.eventDeck.length === 0) return state.eventDeck[0]; // Should handle empty deck
        const card = state.eventDeck[0];

        set(state => ({
            eventDeck: state.eventDeck.slice(1),
            log: [...state.log, `Event: ${card.title} - ${card.description}`],
        }));

        return card;
    },

    placeTile: (tile) => {
        set(state => ({
            board: [...state.board, tile],
            log: [...state.log, `New tile placed at (${tile.x}, ${tile.y}).`],
        }));
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

            if (player.mp < 1) { // Basic cost check, specific cards might have different costs
                return { log: [...state.log, `${player.name} does not have enough MP!`] };
            }

            const newPlayers = [...state.players];
            const card = newPlayers[playerIndex].hand.splice(cardIndex, 1)[0];
            newPlayers[playerIndex].mp -= 1; // Default cost

            return {
                players: newPlayers,
                log: [...state.log, `${player.name} used ${card.name}!`],
            };
        });
    },

    checkMissions: (playerId) => {
        // Placeholder for mission checking logic
        // This would need to evaluate conditions based on game state
    }
}));
