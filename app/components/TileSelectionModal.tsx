import React from 'react';
import { BoardCard, Direction } from '../types';
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';

interface TileSelectionModalProps {
    cards: BoardCard[];
    onSelect: (card: BoardCard) => void;
}

export const TileSelectionModal: React.FC<TileSelectionModalProps> = ({ cards, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in">
            <div className="bg-[#f0e6d2] p-6 rounded-xl shadow-2xl border-4 border-[#c2b280] max-w-4xl w-full">
                <h2 className="text-2xl font-bold text-[#2c1810] mb-6 text-center uppercase tracking-widest">
                    Select a Tile to Place
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map(card => (
                        <button
                            key={card.id}
                            onClick={() => onSelect(card)}
                            className="flex flex-col items-center gap-4 p-4 bg-white/50 rounded-lg border-2 border-[#c2b280]/30 hover:bg-white hover:border-[#c2b280] hover:scale-105 transition-all group"
                        >
                            {/* Visual Preview of Tile */}
                            <div className="w-24 h-24 bg-[#e6dcc0] border-2 border-[#c2b280] relative rounded shadow-inner">
                                {card.connections.includes(Direction.TOP) && <div className="absolute w-4 h-1/2 bg-[#c2b280] top-0 left-1/2 -translate-x-1/2" />}
                                {card.connections.includes(Direction.BOTTOM) && <div className="absolute w-4 h-1/2 bg-[#c2b280] bottom-0 left-1/2 -translate-x-1/2" />}
                                {card.connections.includes(Direction.LEFT) && <div className="absolute h-4 w-1/2 bg-[#c2b280] left-0 top-1/2 -translate-y-1/2" />}
                                {card.connections.includes(Direction.RIGHT) && <div className="absolute h-4 w-1/2 bg-[#c2b280] right-0 top-1/2 -translate-y-1/2" />}
                                <div className="absolute w-8 h-8 bg-[#c2b280] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>

                            <div className="text-center">
                                <h3 className="font-bold text-lg text-[#2c1810] group-hover:text-blue-600 transition-colors">
                                    {card.name}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1">
                                    {card.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
