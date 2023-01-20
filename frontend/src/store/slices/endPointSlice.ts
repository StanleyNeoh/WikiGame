import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EndPointState } from "../../types/types";


const endPointSlice = createSlice({
    name: 'endPoint',
    initialState: {start: '', end: ''} as EndPointState,
    reducers: {
        setEndPoint(state: EndPointState, action: PayloadAction<EndPointState>) {
            return action.payload;
        }
    }
})
export default endPointSlice;

export const endPointActions = endPointSlice.actions;