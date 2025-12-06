import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../utils/dateTime";

const FIELD_LABELS = {
    title: "Title",
    timezone: "Timezone",
    start: "Start",
    end: "End",
    profiles: "Assigned Profiles",
};

const EventLogs = ({ event }) => {
    const currentProfile = useSelector((state) => state.profiles.currentProfile);
    const profiles = useSelector((state) => state.profiles.list);
    const [open, setOpen] = useState(false);

    if (!event?.logs || event.logs.length === 0) return null;
    if (!currentProfile) return null;

    const toggleOpen = () => setOpen((prev) => !prev);

    const getProfileNames = (ids) => {
        if (!Array.isArray(ids)) return "";
        return profiles
            .filter((p) => ids.includes(p.id))
            .map((p) => p.name)
            .join(", ");
    };

    return (
        <div className="logs">
            <button
                type="button"
                className="logs-toggle"
                onClick={toggleOpen}
            >
                {open ? "Hide update history" : "View update history"}
                <span className={`logs-toggle-icon ${open ? "open" : ""}`}>⌃</span>
            </button>

            {open && (
                <div className="logs-list">
                    {event.logs.map((log) => (
                        <div key={log.id} className="log-entry">
                            <div className="log-time">
                                {formatDateTime(
                                    log.updatedAt,
                                    currentProfile.timezone,
                                    "DD MMM YYYY, HH:mm"
                                )}
                            </div>

                            <div className="log-changes">
                                {Object.entries(log.changes || {}).map(([field, value]) => {
                                    let oldVal = value.old;
                                    let newVal = value.new;
                                    if (field === "start" || field === "end") {
                                        oldVal = formatDateTime(
                                            value.old,
                                            currentProfile.timezone,
                                            "DD MMM YYYY, HH:mm"
                                        );
                                        newVal = formatDateTime(
                                            value.new,
                                            currentProfile.timezone,
                                            "DD MMM YYYY, HH:mm"
                                        );
                                    }
                                    if (field === "profiles") {
                                        oldVal = getProfileNames(value.old || []);
                                        newVal = getProfileNames(value.new || []);
                                    }

                                    const label = FIELD_LABELS[field] || field;

                                    return (
                                        <div key={field} className="log-change">
                                            <span className="log-field">{label}</span>
                                            <span className="log-values">
                                                <span className="log-old">
                                                    {oldVal || "-"}
                                                </span>
                                                <span className="log-arrow">→</span>
                                                <span className="log-new">
                                                    {newVal || "-"}
                                                </span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventLogs;
