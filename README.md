# 📌 Event Management System — Full Stack MERN Project

A role-based, multi-timezone scheduling system built using the **MERN stack** where users across different timezones can create and manage events with correct local time conversion.

## 🚀 Features

###  Profiles & Roles
- Two roles: **Admin** & **User**
- Each profile has a **timezone**
- Admin can **create profiles**
- Dynamic role-based UI: admin-only actions hidden for normal users

### Event Management
- Admin can **create events**
- Assign events to multiple users
- Start & end date/time selected in **local timezone**
- Backend stores timestamps in **UTC**
- Events are automatically displayed in the **viewer's timezone**

###  Timezone Intelligence
- Ensures the same event is shown correctly for different users
- Conversion handled using Day.js utilities

###  Edit Events + Audit Logs
- Assigned users can edit their events
- Backend logs:
  - What changed
  - Old → New value
  - Timestamp of update
- Log history displayed in a collapsible viewer

###  UI / Styling
- Modern **dark dashboard**
- Sidebar navigation + clean content layout
- **Vanilla CSS styling** with responsive Flex/Grid
- Material UI used only for form inputs

## 🧠 Architecture & Code Structure
event-manager/
├── backend/ # Node.js + Express API (in-memory DB for demo)
└── client/ # React + Vite + Redux Toolkit frontend
### 🔹 Backend
- Express routes for `/profiles` and `/events`
- UTC storage model for global correctness

### 🔹 Frontend
- React + Vite for fast builds
- Redux Toolkit for centralized state
- Axios for API communication
- Day.js for timezone utilities

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Redux Toolkit, Axios, Day.js, Vanilla CSS |
| Backend | Node.js, Express.js |
| Database | JSON (can easily switch to MongoDB) |

## 🧩 DSA & Performance Techniques

| Optimization | Why |
|-------------|-----|
| Filtering events by profile ID efficiently | Scales with larger datasets |
| Append-only history log | Avoids expensive mutation |
| Pure functions for time processing | No repeated heavy calculations |
| Redux immutability | Predictable & optimized state updates |

## 🏁 Getting Started

### 1️⃣ Clone repository
```bash
git clone https://github.com/your-username/event-manager.git
cd event-manager
