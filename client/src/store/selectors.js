export const selectCurrentProfile = (state) => state.profiles.currentProfile;
export const selectIsAdmin = (state) => state.profiles.currentProfile?.role === 'admin';
export const selectAllProfiles = (state) => state.profiles.list;
export const selectAllEvents = (state) => state.events.list;

export const selectEventsForCurrentProfile = (state) => {
    const currentProfile = selectCurrentProfile(state);
    const allEvents = selectAllEvents(state);

    if (!currentProfile) return [];

    return allEvents.filter(event =>
        event.profiles.includes(currentProfile.id)
    );
};