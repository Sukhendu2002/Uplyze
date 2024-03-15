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

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  try {
    mongoose.connect(process.env.DB_URI).then(() => {
      console.log("Connected to MongoDB");
    });
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
