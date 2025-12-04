const { v4: uuid } = require("uuid");
const { computeEventChanges } = require("../utils/logChanges");

let events = [
    {
        id: uuid(),
        title: "Kickoff Meeting",
        profiles: [],
        timezone: "Europe/Berlin",
        start: "2025-12-05T09:00:00.000Z",
        end: "2025-12-05T10:00:00.000Z",
        createdAt: new Date("2025-12-01T12:00:00.000Z").toISOString(),
        updatedAt: new Date("2025-12-01T12:00:00.000Z").toISOString(),
        logs: [],
    },
];

function getAllEvents() {
    return events;
}

function addEvent({ title, profiles, timezone, start, end }) {
    const now = new Date().toISOString();

    const newEvent = {
        id: uuid(),
        title,
        profiles: profiles || [],
        timezone,
        start,
        end,
        createdAt: now,
        updatedAt: now,
        logs: [],
    };

    events.push(newEvent);
    return newEvent;
}

function getEventById(id) {
    return events.find((e) => e.id === id);
}

function updateEvent(id, updatedData) {
    const event = getEventById(id);
    if (!event) return null;
    const now = new Date().toISOString();
    const changes = computeEventChanges(event, updatedData);
    if (Object.keys(changes).length > 0) {
        const logEntry = {
            id: uuid(),
            updatedAt: now,
            changes,
        };

        event.logs.push(logEntry);
    }
    if (typeof updatedData.title !== "undefined") {
        event.title = updatedData.title;
    }
    if (typeof updatedData.profiles !== "undefined") {
        event.profiles = updatedData.profiles;
    }
    if (typeof updatedData.timezone !== "undefined") {
        event.timezone = updatedData.timezone;
    }
    if (typeof updatedData.start !== "undefined") {
        event.start = updatedData.start;
    }
    if (typeof updatedData.end !== "undefined") {
        event.end = updatedData.end;
    }
    event.updatedAt = now;

    return event;
}

module.exports = {
    getAllEvents,
    addEvent,
    getEventById,
    updateEvent,
    events,
};
