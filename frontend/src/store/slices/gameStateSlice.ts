import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameState } from "../../types/types";

const gameStateSlice = createSlice({
    name: 'gameState',
    initialState: GameState.Start,
    reducers: {
        setGameState(state: GameState, action: PayloadAction<GameState>) {
            return action.payload;
        }
    }
})

export default gameStateSlice;
export const gameStateActions = gameStateSlice.actions;