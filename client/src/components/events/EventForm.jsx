import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Alert,
} from "@mui/material";
import { buildUtcFromLocal } from "../../utils/dateTime";
import { createEvent } from "../../store/slices/eventsSlice";

const EVENT_TIMEZONES = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "Europe/Berlin",
    "Europe/London",
];

const EventForm = () => {
    const dispatch = useDispatch();

    const profiles = useSelector((state) => state.profiles.list);
    const currentProfile = useSelector((state) => state.profiles.currentProfile);

    const [title, setTitle] = useState("");
    const [selectedProfileIds, setSelectedProfileIds] = useState([]);
    const [eventTimezone, setEventTimezone] = useState("UTC");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const isAdmin = useMemo(
        () => currentProfile && currentProfile.role === "admin",
        [currentProfile]
    );

    useEffect(() => {
        if (currentProfile && selectedProfileIds.length === 0) {
            setSelectedProfileIds([currentProfile.id]);
        }
    }, [currentProfile, selectedProfileIds.length]);

    if (!isAdmin) return null;

    const handleProfilesChange = (event) => {
        const value = event.target.value;
        setSelectedProfileIds(typeof value === "string" ? value.split(",") : value);
    };

    const resetForm = () => {
        setTitle("");
        setSelectedProfileIds(currentProfile ? [currentProfile.id] : []);
        setEventTimezone("UTC");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!title.trim()) {
            setErrorMsg("Title is required.");
            return;
        }
        if (!eventTimezone) {
            setErrorMsg("Event timezone is required.");
            return;
        }
        if (!startDate || !startTime || !endDate || !endTime) {
            setErrorMsg("Start and end date/time are required.");
            return;
        }
        if (!selectedProfileIds.length) {
            setErrorMsg("Please assign at least one profile to this event.");
            return;
        }

        const startUtc = buildUtcFromLocal(startDate, startTime, eventTimezone);
        const endUtc = buildUtcFromLocal(endDate, endTime, eventTimezone);

        if (!startUtc || !endUtc) {
            setErrorMsg("Unable to build UTC timestamps from provided date/time.");
            return;
        }

        if (new Date(endUtc) <= new Date(startUtc)) {
            setErrorMsg("End time must be after start time.");
            return;
        }

        const payload = {
            title: title.trim(),
            profiles: selectedProfileIds,
            timezone: eventTimezone,
            start: startUtc,
            end: endUtc,
        };

        try {
            setSubmitting(true);
            await dispatch(createEvent(payload)).unwrap();
            setSuccessMsg("Event created successfully!");
            resetForm();
        } catch (err) {
            console.error("Failed to create event:", err);
            setErrorMsg(
                err?.message || "Failed to create event. Please try again later."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="form-wrapper" onSubmit={handleSubmit}>
            <h3 className="form-title">Create New Event</h3>

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
                    label="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                />
            </div>

            <div className="form-group">
                <FormControl fullWidth className="form-input">
                    <InputLabel id="profiles-label">Assign Profiles</InputLabel>
                    <Select
                        labelId="profiles-label"
                        multiple
                        value={selectedProfileIds}
                        onChange={handleProfilesChange}
                        input={<OutlinedInput label="Assign Profiles" />}
                        renderValue={(selected) =>
                            profiles
                                .filter((p) => selected.includes(p.id))
                                .map((p) => p.name)
                                .join(", ")
                        }
                    >
                        {profiles.map((profile) => (
                            <MenuItem key={profile.id} value={profile.id}>
                                <Checkbox checked={selectedProfileIds.includes(profile.id)} />
                                <ListItemText primary={profile.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="form-group">
                <FormControl fullWidth className="form-input">
                    <InputLabel id="timezone-label">Event Timezone</InputLabel>
                    <Select
                        labelId="timezone-label"
                        value={eventTimezone}
                        label="Event Timezone"
                        onChange={(e) => setEventTimezone(e.target.value)}
                    >
                        {EVENT_TIMEZONES.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                                {tz}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="form-group two-cols">
                <TextField
                    className="form-input"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                />
                <TextField
                    className="form-input"
                    label="Start Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                />
            </div>

            <div className="form-group two-cols">
                <TextField
                    className="form-input"
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                />
                <TextField
                    className="form-input"
                    label="End Time"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                />
            </div>

            <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Event"}
            </button>
        </form>
    );
};

export default EventForm;
