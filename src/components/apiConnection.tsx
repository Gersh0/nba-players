import { useEffect, useState } from "react";
import { NBAPlayer } from "../models/nbaPlayer";
import { NBAPlayerComponent } from "./NBAPlayer";

export const ApiConnection = () => {
    const [players, setPlayers] = useState<NBAPlayer[]>([]);
    const [, setTargetSum] = useState<number | null>(null);
    const [filteredPlayers, setFilteredPlayers] = useState<NBAPlayer[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;

    const loadPlayers = async () => {
        const response = await fetch('https://mach-eight.uc.r.appspot.com/');
        const data = await response.json();
        setPlayers(data.values);
    }

    useEffect(() => {
        loadPlayers();
    }, []);

    const findPairsWithSum = (players: NBAPlayer[], targetSum: number): NBAPlayer[] => {
        const heightMap = new Map<number, NBAPlayer[]>();
        const pairs: NBAPlayer[] = [];

        for (const player of players) {
            const height = parseInt(player.h_in, 10);
            const complement = targetSum - height;

            if (heightMap.has(complement)) {
                const complementPlayers = heightMap.get(complement)!;
                for (const complementPlayer of complementPlayers) {
                    pairs.push(complementPlayer, player);
                }
            }

            if (!heightMap.has(height)) {
                heightMap.set(height, []);
            }
            heightMap.get(height)!.push(player);
        }

        return pairs;
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        const newTargetSum = isNaN(value) ? null : value;
        setTargetSum(newTargetSum);

        if (newTargetSum !== null) {
            const pairs = findPairsWithSum(players, newTargetSum);
            setFilteredPlayers(pairs);
            setCurrentPage(1);
        } else {
            setFilteredPlayers([]);
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <input 
                type="number" 
                placeholder="Enter target sum" 
                onChange={handleInputChange} 
            />
            <div>
                {paginatedPlayers.map((player, index) => {
                    if (index % 2 === 0) {
                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <NBAPlayerComponent player={player} />
                                <span style={{ margin: '0 10px' }}>&</span>
                                <NBAPlayerComponent player={paginatedPlayers[index + 1]} />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <div>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={startIndex + itemsPerPage >= filteredPlayers.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
}