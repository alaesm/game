import { Brain } from 'lucide-react';
import { Fireworks } from './Animation';

interface PlayerPanelProps {
    player: 'X' | 'O';
    winner: 'X' | 'O' | 'Draw' | null;
    currentPlayer: 'X' | 'O';
    players: string[];
    totalTime: number;
    errorCount: number;
    moves: number[];
    color: 'blue' | 'red';
    selectedPlayer: string;
    setSelectedPlayer: (player: string) => void;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
    player,
    winner,
    currentPlayer,
    players,
    totalTime,
    errorCount,
    moves,
    color,
    selectedPlayer,
    setSelectedPlayer
}) => {
    const isWinner = winner === player;
    const isActive = currentPlayer === player;

    return (
        <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-4 w-[230px] self-stretch">
            {isWinner && <Fireworks />} {/* Feu d'artifice si le joueur gagne */}

            <div className="flex items-center gap-3 mb-4">
                <Brain className={`w-6 h-6 text-${color}-400 ${!winner && isActive ? 'animate-spin' : ''}`} />
                <select
                    className="w-full bg-gray-800 text-white text-lg rounded-lg p-2 border border-gray-600 
                       truncate overflow-hidden text-ellipsis"
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                >
                    {players.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-between text-white text-sm mb-4">
                <p>Time: {totalTime} ms</p>
                <p>Errors: {errorCount}</p>
            </div>

            <div className="h-[400px] overflow-y-auto">
                {moves.map((move, index) => (
                    <div key={index} className={`text-${color}-200 mb-2 p-2 bg-white/5 rounded`}>
                        Move #{index + 1}: {move} ms
                    </div>
                ))}
            </div>
        </div>
    );
};