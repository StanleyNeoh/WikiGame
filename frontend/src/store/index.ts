import { configureStore } from "@reduxjs/toolkit";
import endPointSlice from "./slices/endPointSlice";
import gameStateSlice from "./slices/gameStateSlice";
import journeySlice from "./slices/journeySlice";

const store = configureStore({
    reducer: {
        journey: journeySlice.reducer,
        endPoint: endPointSlice.reducer,
        gameState: gameStateSlice.reducer,
    }
});

console.log(store.getState());
const unsubscribe = store.subscribe(() => console.log(store.getState())); 

/**
 * if       configureStore({reducer: reducer1}).getState() === State1
 * and      configureStore({reducer: reducer2}).getState() === State2
 * then     configureStore({reducer: {bye: reducer1, hello: reducer2}}).getState() === {bye: State1, hello: State2}
 *
 * Note:    reducer: {bye: reducer1, hell: reducer2} === reducer: combineReducer({bye: reducer1, hell: reducer2})
 *          => reducer <===> state
 */

export default store;
