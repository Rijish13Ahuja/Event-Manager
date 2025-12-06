import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchProfiles } from "./store/slices/profilesSlice";
import { fetchEvents } from "./store/slices/eventsSlice";
import ProfileSelector from "./components/common/ProfileSelector";
import Dashboard from "./pages/Dashboard";

import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const currentProfile = useSelector((state) => state.profiles.currentProfile);

  useEffect(() => {
    dispatch(fetchProfiles());
    dispatch(fetchEvents());
  }, [dispatch]);

  if (!currentProfile) {
    return (
      <div className="app-root">
        <div className="app-loading">
          <h1 className="app-title">Event Management System</h1>
          <p className="app-subtitle">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-root">
        <div className="app-shell">
          <aside className="sidebar">
            <div className="sidebar-header">
              <div>
                <div className="sidebar-logo">Event Manager</div>
                <div className="sidebar-caption">Multi-timezone scheduler</div>
              </div>
            </div>

            <div className="sidebar-section">
              <ProfileSelector />
            </div>
          </aside>
          <main className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
