import { NBAPlayer } from "../models/nbaPlayer";

interface Props {
    player: NBAPlayer;
}

export const NBAPlayerComponent = ({ player }: Props) => {
    return (
        <div>
            <p>{player.first_name} {player.last_name} {player.h_in} </p>
        </div>
    )
}