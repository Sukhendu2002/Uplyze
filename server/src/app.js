const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const websiteRoutes = require("./routes/websites.routes");
const monitorRoutes = require("./routes/monitoring.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/monitoring", monitorRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the server",
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

app.listen(process.env.PORT, () => {
  try {
    connectDB();
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
});
