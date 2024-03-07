const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  active: { type: Boolean, default: true },
  monitoringSchedule: {
    frequency: { type: String, required: true },
    timeRange: {
      start: { type: String },
      end: { type: String },
    },
  },
  monitoringSettings: {
    checks: {
      httpStatus: { type: Boolean, default: true },
      content: { type: Boolean, default: false },
      ssl: { type: Boolean, default: false },
      performance: { type: Boolean, default: false },
      syntheticMonitoring: { type: Boolean, default: false },
    },
    alertThresholds: {
      responseTime: { type: Number },
      missingContent: { type: String },
    },
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: {
      type: Boolean,
      default: false,
      phoneNumber: { type: String },
    },
    slack: {
      type: Boolean,
      default: false,
      webhookUrl: { type: String },
    },
  },
  monitoringHistory: [
    {
      timestamp: { type: Date, required: true },
      uptime: { type: Boolean, required: true },
      responseTime: { type: Number },
    },
  ],
});

const Website = mongoose.model("Website", websiteSchema);
module.exports = Website;
