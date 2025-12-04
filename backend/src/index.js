const express = require("express");
const cors = require("cors");
const ENV = require("./config/env");
const profilesRouter = require("./routes/profilesRoutes");
const eventsRouter = require("./routes/eventsRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Event Manager Backend is running 🚀",
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use("/profiles", profilesRouter);

app.use("/events", eventsRouter);

app.use((req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});

const port = ENV.PORT;

app.listen(port, () => {
    console.log(`Backend server on http://localhost:${port}`);
});
