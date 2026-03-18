const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


app.use(express.static(path.join(__dirname, "../dist")));

const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/song", songRoutes);


app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

module.exports = app;