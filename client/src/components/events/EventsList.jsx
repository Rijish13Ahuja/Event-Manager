import React from "react";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../utils/dateTime";
import EventLogs from "./EventLogs";
import EventEditDialog from "./EventEditDialog";
import { Paper, Button, Box } from "@mui/material";

const EventsList = () => {
    const events = useSelector((state) => state.events.list);
    const eventsStatus = useSelector((state) => state.events.status);
    const eventsError = useSelector((state) => state.events.error);
    const currentProfile = useSelector((state) => state.profiles.currentProfile);

    const [editingEvent, setEditingEvent] = React.useState(null);
    const [editOpen, setEditOpen] = React.useState(false);

    const myEvents = React.useMemo(() => {
        if (!currentProfile) return [];
        return events.filter(
            (event) =>
                Array.isArray(event.profiles) &&
                event.profiles.includes(currentProfile.id)
        );
    }, [events, currentProfile]);

    if (!currentProfile) return null;

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setEditingEvent(null);
    };

    return (
        <Box sx={{ mt: 0 }}>
            {eventsStatus === "loading" && (
                <p className="empty-state">Loading events...</p>
            )}

            {eventsStatus === "failed" && (
                <p className="empty-state">
                    Failed to load events: {eventsError}
                </p>
            )}

            {eventsStatus === "succeeded" && myEvents.length === 0 && (
                <p className="empty-state">
                    No events assigned to you yet.
                </p>
            )}

            {eventsStatus === "succeeded" && myEvents.length > 0 && (
                <div className="timeline">
                    {myEvents.map((event) => (
                        <div key={event.id} className="timeline-item">
                            <div className="timeline-marker"></div>

                            <div className="timeline-card">
                                <Paper elevation={0} sx={{ p: 2, bgcolor: "transparent" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: 2,
                                        }}
                                    >
                                        <Box>
                                            <h3 className="event-title">{event.title}</h3>

                                            <p className="event-meta">
                                                Start:{" "}
                                                <strong>
                                                    {formatDateTime(event.start, currentProfile.timezone)}
                                                </strong>
                                            </p>
                                            <p className="event-meta">
                                                End:{" "}
                                                <strong>
                                                    {formatDateTime(event.end, currentProfile.timezone)}
                                                </strong>
                                            </p>

                                            <div className="event-info-group">
                                                <span className="chip chip-muted">
                                                    {`Event TZ: ${event.timezone}`}
                                                </span>
                                                <span className="chip chip-muted">
                                                    {`Created: ${formatDateTime(
                                                        event.createdAt,
                                                        currentProfile.timezone,
                                                        "DD MMM YYYY, HH:mm"
                                                    )}`}
                                                </span>
                                                <span className="chip chip-muted">
                                                    {`Updated: ${formatDateTime(
                                                        event.updatedAt,
                                                        currentProfile.timezone,
                                                        "DD MMM YYYY, HH:mm"
                                                    )}`}
                                                </span>
                                            </div>
                                        </Box>

                                        <Box>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEditClick(event)}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                    </Box>
                                    <EventLogs event={event} />
                                </Paper>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <EventEditDialog
                open={editOpen}
                onClose={handleEditClose}
                event={editingEvent}
            />
        </Box>
    );
};

export default EventsList;
