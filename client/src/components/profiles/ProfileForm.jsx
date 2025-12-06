import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import { createProfile } from "../../store/slices/profilesSlice";

const TIMEZONES = [
    "Asia/Kolkata",
    "America/New_York",
    "Europe/Berlin",
    "Europe/London",
    "UTC",
];

const ProfileForm = () => {
    const dispatch = useDispatch();
    const currentProfile = useSelector((state) => state.profiles.currentProfile);

    const [name, setName] = useState("");
    const [role, setRole] = useState("user");
    const [timezone, setTimezone] = useState("Asia/Kolkata");

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const isAdmin = useMemo(
        () => currentProfile && currentProfile.role === "admin",
        [currentProfile]
    );

    if (!isAdmin) return null;

    const resetForm = () => {
        setName("");
        setRole("user");
        setTimezone("Asia/Kolkata");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!name.trim()) {
            setErrorMsg("Name is required.");
            return;
        }

        const payload = {
            name: name.trim(),
            role,
            timezone,
        };

        try {
            setSubmitting(true);
            await dispatch(createProfile(payload)).unwrap();
            setSuccessMsg("Profile created successfully!");
            resetForm();
        } catch (err) {
            console.error("Failed to create profile:", err);
            setErrorMsg(
                err?.message || "Failed to create profile. Please try again later."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="form-wrapper" onSubmit={handleSubmit}>
            <h3 className="form-title">Create New Profile</h3>

            {errorMsg && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {errorMsg}
                </Alert>
            )}

            {successMsg && (
                <Alert severity="success" sx={{ mb: 1 }}>
                    {successMsg}
                </Alert>
            )}

            <div className="form-group">
                <TextField
                    className="form-input"
                    label="Name"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group two-cols">
                <FormControl fullWidth className="form-input">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth className="form-input">
                    <InputLabel id="timezone-label">Timezone</InputLabel>
                    <Select
                        labelId="timezone-label"
                        label="Timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                    >
                        {TIMEZONES.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                                {tz}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Profile"}
            </button>
        </form>
    );
};

export default ProfileForm;
