const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const websiteRoutes = require("./routes/websites.routes");
const monitorRoutes = require("./routes/monitoring.routes");
const fs = require("fs");
const https = require("https");

const key = fs.readFileSync("./private.key");
const cert = fs.readFileSync("./certificate.crt");

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

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const server = https.createServer({ key, cert }, app);

server.listen(8443, () => {
  console.log("Server is running on port 8443");
});
