import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profilesAPI } from "../../api/profiles";

export const fetchProfiles = createAsyncThunk(
    "profiles/fetchProfiles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profilesAPI.getAll();
            return response.data.data;
        } catch (error) {
            console.error("Error fetching profiles:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch profiles" });
        }
    }
);

export const createProfile = createAsyncThunk(
    "profiles/createProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profilesAPI.create(profileData);
            return response.data.data;
        } catch (error) {
            console.error("Error creating profile:", error);
            return rejectWithValue(error.response?.data || { message: "Failed to create profile" });
        }
    }
);

const profilesSlice = createSlice({
    name: "profiles",
    initialState: {
        list: [],
        currentProfile: null,
        status: "idle",
        error: null,
    },
    reducers: {
        setCurrentProfile(state, action) {
            state.currentProfile = action.payload || null;
        },
        setCurrentProfileById(state, action) {
            const id = action.payload;
            const profile = state.list.find((p) => p.id === id) || null;
            state.currentProfile = profile;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfiles.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload || [];

                if (!state.currentProfile && state.list.length > 0) {
                    state.currentProfile = state.list[0];
                }
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to load profiles";
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                const newProfile = action.payload;
                if (!newProfile) return;
                state.list.push(newProfile);
            });
    },
});

export const { setCurrentProfile, setCurrentProfileById } = profilesSlice.actions;

export default profilesSlice.reducer;