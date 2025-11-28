import React from 'react';
import { MathematicianCard, MissionCard, EventCard, CardType, MathematicianRarity } from '../types';
import { clsx } from 'clsx';
import { Star, Sparkles } from 'lucide-react';

interface CardProps {
    card: MathematicianCard | MissionCard | EventCard;
    type: CardType;
    onClick?: () => void;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, type, onClick, disabled }) => {
    const isMath = type === CardType.MATHEMATICIAN;
    const isMission = type === CardType.MISSION;

    const getRarityStars = (rarity: MathematicianRarity) => {
        return Array(rarity).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    };

    return (
        <div
            className={clsx(
                "w-28 md:w-32 h-40 md:h-48 rounded-xl p-2 md:p-3 flex flex-col justify-between text-xs shadow-lg transition-all hover:shadow-xl hover:-translate-y-2 border-2 flex-shrink-0",
                isMath && "bg-gradient-to-br from-indigo-100 to-indigo-50 border-indigo-300",
                isMission && "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300",
                !disabled && onClick && "cursor-pointer hover:scale-105",
                disabled && "opacity-50 cursor-not-allowed grayscale"
            )}
            onClick={!disabled && onClick ? onClick : undefined}
        >
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xs md:text-sm leading-tight flex-1 pr-1">
                        {(card as any).name || (card as any).title}
                    </h3>
                    {isMath && (
                        <div className="flex flex-col items-end">
                            <div className="flex">{(card as MathematicianCard).rarity && getRarityStars((card as MathematicianCard).rarity)}</div>
                        </div>
                    )}
                    {isMission && (
                        <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            <Sparkles className="w-3 h-3" />
                            {(card as MissionCard).points}
                        </div>
                    )}
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30 my-1" />
                <p className="text-[9px] md:text-[10px] leading-tight opacity-80">{(card as any).description}</p>
            </div>

            {isMath && (
                <div className="mt-2 opacity-60 italic text-[8px] md:text-[9px] border-t border-current/20 pt-1">
                    "{(card as MathematicianCard).flavorText}"
                </div>
            )}

            {isMission && (card as MissionCard).completed && (
                <div className="bg-green-500 text-white text-center rounded-lg py-1 font-bold text-xs shadow-lg animate-pulse">
                    ✓ COMPLETED
                </div>
            )}
        </div>
    );
};
