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
      performance: { type: Boolean, default: false },
      syntheticMonitoring: { type: Boolean, default: false },
    },
    alertThresholds: {
      responseTime: { type: Number },
      missingContent: { type: String },
    },
  },
  info: {
    ssl: {
      valid: { type: Boolean, default: false },
      extra: {
        type: Object,
        default: {
          days: 0,
          issuer: "",
          subject: "",
          valid_from: "",
          valid_to: "",
        },
      },
    },
    domain: {
      valid: { type: Boolean, default: false },
      extra: {
        type: Object,
        default: {
          domainName: "",
          registryDomainId: "",
          registrarWhoisServer: "",
          registrarUrl: "",
          updatedDate: "",
          creationDate: "",
          registryExpiryDate: "",
          registrar: "",
        },
      },
    },
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: {
      active: { type: Boolean, default: false },
      phoneNumber: { type: String },
    },
    slack: {
      active: { type: Boolean, default: false },
      webhookUrl: { type: String },
    },
  },
  monitoringHistory: [
    {
      timestamp: { type: Date, required: true },
      uptime: { type: Boolean, required: true },
      responseTime: { type: Number },
      httpStatus: { type: Number },
      content: { type: String },
      performance: {
        ttfb: { type: Number, default: 0 },
        fcp: { type: Number, default: 0 },
        domLoad: { type: Number, default: 0 },
      },
      syntheticMonitoring: {
        status: { type: Boolean },
        responseTime: { type: Number },
      },
    },
  ],
});

const Website = mongoose.model("Website", websiteSchema);
module.exports = Website;
