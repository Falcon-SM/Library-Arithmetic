export type PlayerId = string;

export enum TileType {
    NORMAL = 'NORMAL',
    ARCHIVE = 'ARCHIVE', // 書庫マス
    EVENT = 'EVENT', // イベントマス
    SPECIAL_GEOMETRY = 'SPECIAL_GEOMETRY', // 特殊マス（幾何学）
    SPECIAL_ALGEBRA = 'SPECIAL_ALGEBRA', // 特殊マス（代数学）
    START = 'START', // スタートマス
}

export enum Direction {
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
    LEFT = 'LEFT',
}

export interface Tile {
    id: string;
    x: number;
    y: number;
    type: TileType;
    connections: Direction[]; // Which sides have paths
    rotation: number; // 0, 90, 180, 270
    placedBy?: PlayerId;
    hasCat?: boolean; // For "Lost Cat" mission
    hasBlockade?: boolean; // For "Weierstrass" blockade
}

export enum CardType {
    MATHEMATICIAN = 'MATHEMATICIAN',
    MISSION = 'MISSION',
    EVENT = 'EVENT',
    BOARD = 'BOARD', // 盤面カード
}

export enum MathematicianRarity {
    COMMON = 1, // ★☆☆
    UNCOMMON = 2, // ★★☆
    RARE = 3, // ★★★
}

export interface MathematicianCard {
    id: string;
    name: string;
    rarity: MathematicianRarity;
    category: 'MOVEMENT' | 'SPECIAL' | 'DEFENSE' | 'MP' | 'OBSTRUCTION';
    description: string;
    flavorText: string;
}

export interface MissionCard {
    id: string;
    title: string;
    points: number;
    description: string;
    category: 'COLLECTION' | 'ARRIVAL' | 'EVENT' | 'CHAOS';
    completed: boolean;
}

export interface EventCard {
    id: string;
    title: string;
    description: string;
    effectType: 'DISCARD' | 'SILENCE' | 'HEAL' | 'SKIP' | 'WARP' | 'CAT';
}

export interface BoardCard {
    id: string;
    connections: Direction[];
    specialType?: TileType; // If the card specifies a special tile type
}

export interface Player {
    id: PlayerId;
    name: string;
    color: string;
    mp: number;
    hand: MathematicianCard[];
    missions: MissionCard[];
    completedMissions: MissionCard[];
    position: { x: number; y: number }; // Tile coordinates
    skipTurn: boolean;
    silenced: boolean; // Cannot use magic
    protected: boolean; // Protected from obstruction
}

export interface GameState {
    turn: number; // 1-8
    currentPlayerIndex: number;
    players: Player[];
    board: Tile[];
    mathematicianDeck: MathematicianCard[];
    missionDeck: MissionCard[];
    eventDeck: EventCard[];
    boardDeck: BoardCard[];
    catPosition: { x: number; y: number } | null; // If cat is on board
    gameStatus: 'SETUP' | 'PLAYING' | 'FINISHED';
    log: string[];
    highlightedTiles: string[];
    currentRoll: number | null;
    tileToPlace: Tile | null;
}
