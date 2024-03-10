import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
Chart.register(...registerables);
const Site = () => {
  const siteId = useParams().siteId;
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCheckTime, setNextCheckTime] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_API_URL}/api/websites/${siteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setWebsiteData(res.data.data);
        setNextCheckTime(
          getNextCheckTime(
            res.data.data.monitoringHistory,
            res.data.data.monitoringSchedule
          )
        );
        console.log(res.data.data);
      });
  }, [siteId]);

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getMaxResponseTime = () => {
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

  const getMinResponseTime = () => {
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

  const getAverageResponseTime = () => {
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

  return (
    <div className="flex flex-col text-left my-4 max-w-6xl mx-auto">
      <div className="flex flex-col text-left my-4">
        <h1
          className="text-4xl"
          style={{ marginBottom: "1rem", fontWeight: "bold" }}
        >
          {websiteData?.name}
        </h1>
        <a
          href={websiteData?.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          {websiteData?.url}
        </a>
      </div>
      <div className="flex gap-4 mb-4">
        <Card>
          <CardHeader style={{ paddingBottom: "0.5rem" }}>
            <CardTitle style={{ fontSize: "1rem" }}>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h1>
                {websiteData?.monitoringHistory[
                  websiteData?.monitoringHistory.length - 1
                ].uptime
                  ? "Up ✅"
                  : "Down ❌"}
              </h1>
              <div>
                Last checked:{" "}
                {formatTimestamp(
                  websiteData?.monitoringHistory[
                    websiteData?.monitoringHistory.length - 1
                  ].timestamp
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader style={{ paddingBottom: "0.5rem" }}>
            <CardTitle style={{ fontSize: "1rem" }}>
              Next Check Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h1>{nextCheckTime}</h1>
              <div>Every {websiteData?.monitoringSchedule.frequency} </div>
            </div>
          </CardContent>
        </Card>

        {/* </Flex> */}
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Response Time History</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: websiteData?.monitoringHistory.map(
                (entry: {
                  timestamp: Date;
                  responseTime: number;
                  uptime: boolean;
                  httpStatus: number;
                }) => formatTimestamp(entry.timestamp)
              ),
              datasets: [
                {
                  label: "Response Time",
                  data: websiteData?.monitoringHistory.map(
                    (entry: {
                      timestamp: Date;
                      responseTime: number;
                      uptime: boolean;
                      httpStatus: number;
                    }) => entry.responseTime
                  ),
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                  pointRadius: 3, // Adjust point radius for visibility
                  cubicInterpolationMode: "monotone",
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              maintainAspectRatio: false, // Set to false to allow resizing
              responsive: true, // Enable responsiveness
            }}
          />
        </CardContent>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between">
            <h1 style={{ marginBottom: "1rem" }}>
              Max Response Time: {getMaxResponseTime()}ms
            </h1>
            <h1 style={{ marginBottom: "1rem" }}>
              Min Response Time: {getMinResponseTime()}ms
            </h1>
            <h1 style={{ marginBottom: "1rem" }}>
              Average Response Time: {getAverageResponseTime().toFixed(2)}ms
            </h1>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uptime History</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: websiteData?.monitoringHistory.map(
                (entry: {
                  timestamp: Date;
                  responseTime: number;
                  uptime: boolean;
                  httpStatus: number;
                }) => formatTimestamp(entry.timestamp)
              ),
              datasets: [
                {
                  label: "Uptime",
                  data: websiteData?.monitoringHistory.map(
                    (entry: {
                      timestamp: Date;
                      responseTime: number;
                      uptime: boolean;
                      httpStatus: number;
                    }) => (entry.uptime ? 1 : 0)
                  ),
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                  pointRadius: 3, // Adjust point radius for visibility
                  cubicInterpolationMode: "monotone",
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  suggestedMax: 1,
                },
              },
              maintainAspectRatio: false, // Set to false to allow resizing
              responsive: true, // Enable responsiveness
            }}
          />
        </CardContent>
      </Card>
      {/* Add more sections for monitoring settings, notifications, etc. */}
    </div>
  );
};

export default Site;
