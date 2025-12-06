import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventsAPI } from "../../api/events";

export const fetchEvents = createAsyncThunk(
    "events/fetchEvents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await eventsAPI.getAll();
            return response.data.data;
        } catch (error) {
            console.error("Error fetching events:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch events" });
        }
    }
);

export const createEvent = createAsyncThunk(
    "events/createEvent",
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await eventsAPI.create(eventData);
            return response.data.data;
        } catch (error) {
            console.error("Error creating event:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to create event" });
        }
    }
);

export const updateEvent = createAsyncThunk(
    "events/updateEvent",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await eventsAPI.update(id, data);
            return response.data.data;
        } catch (error) {
            console.error("Error updating event:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to update event" });
        }
    }
);

const eventsSlice = createSlice({
    name: "events",
    initialState: {
        list: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload || [];
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to load events";
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                if (action.payload) {
                    state.list.push(action.payload);
                }
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                const updated = action.payload;
                if (!updated) return;
                const index = state.list.findIndex((e) => e.id === updated.id);
                if (index !== -1) {
                    state.list[index] = updated;
                }
            });
    },
});

export default eventsSlice.reducer;