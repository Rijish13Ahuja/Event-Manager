import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentProfile } from "../../store/slices/profilesSlice";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ProfileSelector = () => {
    const dispatch = useDispatch();
    const profiles = useSelector((state) => state.profiles.list);
    const currentProfile = useSelector((state) => state.profiles.currentProfile);

    if (!profiles.length) return null;

    const handleChange = (event) => {
        const profile = profiles.find((p) => p.id === event.target.value);
        if (profile) {
            dispatch(setCurrentProfile(profile));
        }
    };

    return (
        <div className="profile-selector">
            <FormControl
                fullWidth
                size="small"
                className="profile-select-control"
            >
                <InputLabel id="profile-select-label">Viewing as</InputLabel>
                <Select
                    labelId="profile-select-label"
                    label="Viewing as"
                    value={currentProfile?.id || ""}
                    onChange={handleChange}
                >
                    {profiles.map((profile) => (
                        <MenuItem key={profile.id} value={profile.id}>
                            {profile.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {currentProfile && (
                <div className="profile-meta">
                    <span className="chip chip-muted">
                        TZ: {currentProfile.timezone}
                    </span>
                    <span
                        className={
                            "chip " +
                            (currentProfile.role === "admin"
                                ? "chip-primary"
                                : "chip-muted")
                        }
                    >
                        Role: {currentProfile.role}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProfileSelector;
