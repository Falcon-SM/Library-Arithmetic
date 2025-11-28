import React from 'react';
import { MathematicianCard, MissionCard, EventCard, CardType, MathematicianRarity } from '../types';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';

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
                "w-32 h-48 rounded-lg p-2 flex flex-col justify-between text-xs shadow-md transition-transform hover:-translate-y-1 cursor-pointer border-2",
                isMath && "bg-indigo-50 border-indigo-200",
                isMission && "bg-amber-50 border-amber-200",
                disabled && "opacity-50 cursor-not-allowed grayscale"
            )}
            onClick={!disabled ? onClick : undefined}
        >
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm leading-tight">{(card as any).name || (card as any).title}</h3>
                    {isMath && <div className="flex">{(card as MathematicianCard).rarity && getRarityStars((card as MathematicianCard).rarity)}</div>}
                    {isMission && <span className="font-bold text-amber-600">{(card as MissionCard).points}pt</span>}
                </div>
                <div className="w-full h-[1px] bg-current opacity-20 my-1" />
                <p className="text-[10px] leading-snug">{(card as any).description}</p>
            </div>

            {isMath && (
                <div className="mt-2 opacity-70 italic text-[9px]">
                    "{(card as MathematicianCard).flavorText}"
                </div>
            )}

            {isMission && (card as MissionCard).completed && (
                <div className="bg-green-500 text-white text-center rounded py-1 font-bold">COMPLETED</div>
            )}
        </div>
    );
};
