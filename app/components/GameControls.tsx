import React from 'react';
import { useGameStore } from '../store';
import { Dices, SkipForward, PlusSquare } from 'lucide-react';

export const GameControls: React.FC = () => {
    const { rollDice, endTurn, log, turn, tileToPlace, drawBoardTile, currentRoll, highlightedTiles, turnPhase, tilesPlacedThisTurn } = useGameStore();

    const handleRoll = () => {
        rollDice();
    };

    return (
        <>
            <div className="fixed top-0 right-0 left-0 md:left-auto md:top-4 md:right-4 flex flex-col gap-2 md:gap-4 items-end z-40 pointer-events-none p-2 md:p-0">
                {/* Turn Indicator */}
                <div className="bg-white/95 p-2 md:p-4 rounded-xl shadow-2xl border-2 border-[#c2b280] pointer-events-auto animate-in slide-in-from-right flex items-center gap-3 self-end">
                    <div className="text-xs md:text-sm uppercase tracking-widest text-gray-700 font-bold hidden md:block">Current Turn</div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: useGameStore.getState().players[useGameStore.getState().currentPlayerIndex]?.color }} />
                        <span className="text-lg md:text-2xl font-black text-gray-900">
                            {useGameStore.getState().players[useGameStore.getState().currentPlayerIndex]?.name}
                        </span>
                    </div>
                    <div className="text-xs font-mono bg-gray-200 text-gray-800 px-2 py-1 rounded">
                        {turnPhase}
                    </div>
                </div>

                {/* LARGE DICE ROLL DISPLAY */}
                {currentRoll !== null && (
                    <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-white pointer-events-auto animate-in self-end">
                        <div className="text-center">
                            <div className="text-sm md:text-base uppercase tracking-widest text-amber-900 font-bold mb-2">Dice Roll</div>
                            <div className="text-7xl md:text-9xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                                {currentRoll}
                            </div>
                            <div className="mt-2 text-sm md:text-base text-amber-100 font-semibold">
                                {highlightedTiles.length > 0 ? `${highlightedTiles.length} moves available` : 'No moves - draw a tile!'}
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white/90 p-3 md:p-4 rounded-lg shadow-lg pointer-events-auto w-full md:w-64 max-w-sm self-end">
                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                        <span className="font-bold text-base md:text-lg text-gray-900">Turn {turn} / 8</span>
                    </div>

                    <div className="flex gap-2 mb-2 md:mb-4">
                        <button
                            onClick={handleRoll}
                            disabled={turnPhase !== 'START'}
                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
                            <Dices className="w-4 h-4 md:w-5 md:h-5" /> Roll
                        </button>
                        <button
                            onClick={endTurn}
                            disabled={turnPhase === 'START'}
                            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 flex items-center justify-center gap-2 font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
                            <SkipForward className="w-4 h-4 md:w-5 md:h-5" /> End
                        </button>
                    </div>

                    {/* Draw Tile Button - Show during ROLLED phase when no tile is being placed */}
                    {turnPhase === 'ROLLED' && !tileToPlace && (
                        <div className="mb-2 md:mb-4">
                            {highlightedTiles.length === 0 && (
                                <p className="text-red-600 text-xs font-bold mb-1 text-center animate-pulse">No moves available!</p>
                            )}
                            <button
                                onClick={drawBoardTile}
                                className={`w-full text-white py-2 rounded flex items-center justify-center gap-2 font-bold shadow text-sm md:text-base ${highlightedTiles.length === 0
                                        ? 'bg-amber-600 hover:bg-amber-700 animate-pulse'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}>
                                <PlusSquare className="w-4 h-4" /> {highlightedTiles.length === 0 ? 'Draw Tile' : 'Add Tile'}
                            </button>
                        </div>
                    )}

                    {/* Road selection hint */}
                    {turnPhase === 'ROLLED' && highlightedTiles.length > 1 && (
                        <div className="mb-2 bg-blue-100 border-2 border-blue-400 rounded-lg p-2">
                            <p className="text-blue-900 text-xs font-bold text-center">
                                💡 Click any highlighted tile to choose your path
                            </p>
                        </div>
                    )}

                    {/* Log Window */}
                    <div className="h-20 md:h-32 overflow-y-auto bg-gray-100 rounded p-2 text-xs font-mono border">
                        {log.slice().reverse().map((entry, i) => (
                            <div key={i} className="mb-1 border-b border-gray-300 pb-1 last:border-0 text-gray-800">{entry}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
