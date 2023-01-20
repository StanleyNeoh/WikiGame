import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import {  JourneyState, TitleURL } from '../../types/types'

const journeySlice = createSlice({
    name: 'journey',
    initialState: {
        journeyTitles: [],
        journeyURLs: []
    } as JourneyState,
    reducers: {
        add(state: JourneyState, action: PayloadAction<TitleURL>) {
            state.journeyTitles[state.journeyTitles.length] = action.payload.title;
            state.journeyURLs[state.journeyURLs.length] = action.payload.url;

        },
        addTitle(state: JourneyState, action: PayloadAction<string>) {
            state.journeyTitles[state.journeyTitles.length] = action.payload;
            axios.get("https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=" + action.payload)
                .then(res => {
                    console.log(res.data[3][0].match("[^\/]*$")[0])
                    state.journeyURLs[state.journeyURLs.length] = res.data[3][0].match("[^\/]*$")[0]
                })
                .catch(err => state.journeyURLs[state.journeyURLs.length] = action.payload)
        },
        addURL(state: JourneyState, action: PayloadAction<string>) {
            state.journeyURLs[state.journeyURLs.length] = action.payload;
            axios.get("https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=" + action.payload)
                .then(res => state.journeyTitles[state.journeyTitles.length] = res.data[1][0])
                .catch(err => state.journeyTitles[state.journeyTitles.length] = action.payload)
        },
        clear(state: JourneyState) {
            return {
                journeyTitles: [],
                journeyURLs: []
            } as JourneyState;
        }
    }
})

export default journeySlice;
export const journeyActions = journeySlice.actions;