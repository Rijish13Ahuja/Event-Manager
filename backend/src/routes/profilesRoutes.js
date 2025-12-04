const express = require("express");
const router = express.Router();

const {
    getAllProfiles,
    addProfile,
} = require("../data/profilesStore");

router.get("/", (req, res) => {
    const profiles = getAllProfiles();
    res.json({
        status: "ok",
        data: profiles,
    });
});

router.post("/", (req, res) => {
    const { name, role, timezone } = req.body;

    if (!name || !role || !timezone) {
        return res.status(400).json({
            status: "error",
            message: "name, role and timezone are required",
        });
    }
    if (!["admin", "user"].includes(role)) {
        return res.status(400).json({
            status: "error",
            message: 'role must be "admin" or "user"',
        });
    }

    const newProfile = addProfile({ name, role, timezone });

    res.status(201).json({
        status: "ok",
        data: newProfile,
    });
});

module.exports = router;
