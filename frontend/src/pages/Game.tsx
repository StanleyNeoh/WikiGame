import { useSelector } from "react-redux";
import { GameState, State } from "../types/types";
import EndPointForm from "./EndPointForm";
import Journey from "./Journey";

function Game() {
    const gameState = useSelector((state: State) => state.gameState)
    if (gameState === GameState.Start) {
        return <EndPointForm />
    } else if (gameState === GameState.Running) {
        return <Journey />
    } else {
        return <div>bye</div>
    }
}

export default Game;