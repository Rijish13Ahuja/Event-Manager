function computeEventChanges(oldEvent, newData) {
    const fieldsToTrack = ["title", "profiles", "timezone", "start", "end"];

    const changes = {};

    for (const field of fieldsToTrack) {
        const oldValue = oldEvent[field];
        const newValue = newData[field];
        if (typeof newValue === "undefined") continue;
        const oldSerialized = JSON.stringify(oldValue);
        const newSerialized = JSON.stringify(newValue);

        if (oldSerialized !== newSerialized) {
            changes[field] = {
                old: oldValue,
                new: newValue,
            };
        }
    }

    return changes;
}

module.exports = {
    computeEventChanges,
};
