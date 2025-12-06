import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Stack,
    Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { splitToDateAndTime, buildUtcFromLocal } from "../../utils/dateTime";
import { updateEvent } from "../../store/slices/eventsSlice";

const EVENT_TIMEZONES = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "Europe/Berlin",
    "Europe/London",
];

const EventEditDialog = ({ open, onClose, event }) => {
    const dispatch = useDispatch();
    const profiles = useSelector((state) => state.profiles.list);

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

    useEffect(() => {
        if (event && open) {
            setTitle(event.title || "");
            setSelectedProfileIds(event.profiles || []);
            setEventTimezone(event.timezone || "UTC");

            const start = splitToDateAndTime(event.start, event.timezone);
            const end = splitToDateAndTime(event.end, event.timezone);

            setStartDate(start.date);
            setStartTime(start.time);
            setEndDate(end.date);
            setEndTime(end.time);
            setErrorMsg("");
            setSuccessMsg("");
        }
    }, [event, open]);

    const handleProfilesChange = (e) => {
        const value = e.target.value;
        setSelectedProfileIds(typeof value === "string" ? value.split(",") : value);
    };

    const handleClose = () => {
        setErrorMsg("");
        setSuccessMsg("");
        onClose && onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!event) return;

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
            setErrorMsg("Please assign at least one profile.");
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
            await dispatch(updateEvent({ id: event.id, data: payload })).unwrap();
            setSuccessMsg("Event updated successfully!");
            // optionally close after short delay
            setTimeout(() => {
                handleClose();
            }, 700);
        } catch (err) {
            console.error("Failed to update event:", err);
            setErrorMsg(
                err?.message || "Failed to update event. Please try again later."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!event) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    bgcolor: "#020617",
                    color: "var(--text)",
                    borderRadius: 3,
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.95)",
                },
            }}
        >
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
                {errorMsg && (
                    <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                        {errorMsg}
                    </Alert>
                )}
                {successMsg && (
                    <Alert severity="success" sx={{ mt: 1, mb: 1 }}>
                        {successMsg}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            className="form-input"
                            label="Event Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <FormControl fullWidth className="form-input">
                            <InputLabel id="edit-profiles-label">Assign Profiles</InputLabel>
                            <Select
                                labelId="edit-profiles-label"
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
                                        <Checkbox
                                            checked={selectedProfileIds.includes(profile.id)}
                                        />
                                        <ListItemText primary={profile.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="edit-timezone-label">Event Timezone</InputLabel>
                            <Select
                                labelId="edit-timezone-label"
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

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <TextField
                                label="Start Time"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <TextField
                                label="End Time"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </Stack>
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting}
                >
                    {submitting ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventEditDialog;
