import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "./slices/profilesSlice";
import eventsReducer from "./slices/eventsSlice";

export const store = configureStore({
    reducer: {
        profiles: profilesReducer,
        events: eventsReducer,
    },
});