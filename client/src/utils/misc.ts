const formatTimestamp = (timestamp: Date) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const getMaxResponseTime = (websiteData) => {
  return Math.max(
    ...(websiteData?.monitoringHistory.map(
      (entry: {
        timestamp: Date;
        responseTime: number;
        uptime: boolean;
        httpStatus: number;
      }) => entry.responseTime
    ) ?? [])
  );
};

const getMinResponseTime = (websiteData) => {
  const responseTimes = websiteData?.monitoringHistory.map(
    (entry: {
      timestamp: Date;
      responseTime: number;
      uptime: boolean;
      httpStatus: number;
    }) => entry.responseTime
  );
  const filteredResponseTimes = responseTimes?.filter((time) => time !== 0);
  return Math.min(...(filteredResponseTimes ?? []));
};

const getAverageResponseTime = (websiteData) => {
  const responseTimes = websiteData?.monitoringHistory.map(
    (entry: {
      timestamp: Date;
      responseTime: number;
      uptime: boolean;
      httpStatus: number;
    }) => entry.responseTime
  );
  const filteredResponseTimes = responseTimes?.filter((time) => time !== 0);
  return (
    filteredResponseTimes?.reduce((a, b) => a + b, 0) /
    (filteredResponseTimes?.length ?? 1)
  );
};

const getNextCheckTime = (
  monitoringHistory: {
    timestamp: Date;
    responseTime: number;
    uptime: boolean;
    httpStatus: number;
  }[],
  monitoringSchedule: { frequency: string }
) => {
  if (!monitoringHistory.length) {
    return "No data available";
  }
  const lastTimestamp =
    monitoringHistory[monitoringHistory.length - 1].timestamp;
  const frequency = monitoringSchedule.frequency;
  console.log(frequency);

  let frequencyInMs;
  switch (frequency) {
    case "15m":
      frequencyInMs = 15 * 60 * 1000;
      break;
    case "30m":
      frequencyInMs = 30 * 60 * 1000;
      break;
    case "hourly":
      frequencyInMs = 60 * 60 * 1000;
      break;
    case "daily":
      frequencyInMs = 24 * 60 * 60 * 1000;
      break;
    case "weekly":
      frequencyInMs = 7 * 24 * 60 * 60 * 1000;
      break;
    case "monthly":
      frequencyInMs = 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      return "Invalid frequency format";
  }

  const date = new Date(lastTimestamp);
  const nextCheckTime = new Date(date.getTime() + frequencyInMs);
  if (nextCheckTime.toDateString() === new Date().toDateString()) {
    return `Today at ${nextCheckTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return nextCheckTime.toDateString();
  }
};

export {
  formatTimestamp,
  getMaxResponseTime,
  getMinResponseTime,
  getAverageResponseTime,
  getNextCheckTime,
};
