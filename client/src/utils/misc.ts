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

const findDomainExpiry = (domainData: any) => {
  const key = Object.keys(domainData).find((key) => key.includes("Expi"));
  return key
    ? `Expires on ${domainData[key]
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-")}`
    : "No expiry date found";
};

function is15Minutes(freq: string): boolean {
  if (freq === "15m") {
    return true;
  }
  return false;
}

function is30Minutes(freq: string): boolean {
  if (freq === "30m") {
    return true;
  }
  return false;
}

function isHourly(freq: string): boolean {
  if (freq === "hourly") {
    return true;
  }
  return false;
}

function formatTime(timestamp: Date): string {
  timestamp = new Date(timestamp);
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function formatXTimestamp(timestamp: Date): string {
  timestamp = new Date(timestamp);
  const month = timestamp.getMonth() + 1;
  const date = timestamp.getDate();
  const year = timestamp.getFullYear();
  return `${month}/${date}/${year}`;
}

export {
  formatTimestamp,
  getMaxResponseTime,
  getMinResponseTime,
  getAverageResponseTime,
  getNextCheckTime,
  findDomainExpiry,
  is15Minutes,
  is30Minutes,
  isHourly,
  formatTime,
  formatXTimestamp,
};
