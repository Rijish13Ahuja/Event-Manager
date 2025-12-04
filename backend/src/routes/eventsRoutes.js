const express = require("express");
const router = express.Router();

const {
    getAllEvents,
    addEvent,
    getEventById,
    updateEvent,
} = require("../data/eventsStore");

router.get("/", (req, res) => {
    const events = getAllEvents();
    res.json({
        status: "ok",
        data: events,
    });
});

router.post("/", (req, res) => {
    const { title, profiles, timezone, start, end } = req.body;

    if (!title || !timezone || !start || !end) {
        return res.status(400).json({
            status: "error",
            message: "title, timezone, start and end are required",
        });
    }

    const eventProfiles = Array.isArray(profiles) ? profiles : [];

    const newEvent = addEvent({
        title,
        profiles: eventProfiles,
        timezone,
        start,
        end,
    });

    res.status(201).json({
        status: "ok",
        data: newEvent,
    });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;

    const existing = getEventById(id);
    if (!existing) {
        return res.status(404).json({
            status: "error",
            message: "Event not found",
        });
    }

    const { title, profiles, timezone, start, end } = req.body;

    const updatedEvent = updateEvent(id, {
        title,
        profiles,
        timezone,
        start,
        end,
    });

    res.json({
        status: "ok",
        data: updatedEvent,
    });
});

module.exports = router;
