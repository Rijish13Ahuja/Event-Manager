const { v4: uuid } = require("uuid");

let profiles = [
    {
        id: uuid(),
        name: "Admin User",
        role: "admin",
        timezone: "Asia/Kolkata",
    },
    {
        id: uuid(),
        name: "Normal User",
        role: "user",
        timezone: "America/New_York",
    },
];

function getAllProfiles() {
    return profiles;
}

function addProfile({ name, role, timezone }) {
    const newProfile = {
        id: uuid(),
        name,
        role,
        timezone,
    };

    profiles.push(newProfile);
    return newProfile;
}

function getProfileById(id) {
    return profiles.find((p) => p.id === id);
}

module.exports = {
    getAllProfiles,
    addProfile,
    getProfileById,
    profiles,
};
