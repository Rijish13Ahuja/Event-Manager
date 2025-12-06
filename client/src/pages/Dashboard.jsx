import React from "react";
import { useSelector } from "react-redux";
import ProfileForm from "../components/profiles/ProfileForm";
import EventForm from "../components/events/EventForm";
import EventsList from "../components/events/EventsList";

const Dashboard = () => {
    const currentProfile = useSelector((state) => state.profiles.currentProfile);
    const isAdmin = currentProfile?.role === "admin";

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">
                    Manage profiles, schedule events, and view your calendar across
                    timezones.
                </p>
            </header>
            {isAdmin && (
                <section className="dashboard-grid">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Create New Profile</h2>
                            <span className="card-badge">Admin only</span>
                        </div>
                        <p className="card-description">
                            Add users with specific roles and timezones so they can view and
                            manage their events.
                        </p>
                        <div className="card-body">
                            <ProfileForm />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Create New Event</h2>
                            <span className="card-badge">Admin only</span>
                        </div>
                        <p className="card-description">
                            Create events for one or more profiles. All times are stored in
                            UTC and displayed in each user&apos;s local timezone.
                        </p>
                        <div className="card-body">
                            <EventForm />
                        </div>
                    </div>
                </section>
            )}
            <section className="dashboard-section">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">My Events</h2>
                    </div>
                    <p className="card-description">
                        Events assigned to{" "}
                        <strong>{currentProfile?.name || "this profile"}</strong>, shown in{" "}
                        <strong>{currentProfile?.timezone}</strong>.
                    </p>
                    <div className="card-body">
                        <EventsList />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
