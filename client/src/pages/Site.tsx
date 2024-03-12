import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonSite from "@/components/SkeletonSite";
import {
  formatTimestamp,
  getMaxResponseTime,
  getMinResponseTime,
  getAverageResponseTime,
  getNextCheckTime,
  findDomainExpiry,
} from "@/utils/misc";
Chart.register(...registerables);
const Site = () => {
  const siteId = useParams().siteId;
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCheckTime, setNextCheckTime] = useState<string | null>(null);

  useEffect(() => {
    fetchWebsiteData().then(() => setIsLoading(false));
  }, [siteId]);

  const fetchWebsiteData = async () => {
    try {
      await axios
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
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SkeletonSite />;
  }

  return (
    <div className="flex flex-col text-left my-4 max-w-6xl mx-auto">
      {error && <div className="text-red-500 text-lg my-4">{error}</div>}
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
      {websiteData && websiteData.monitoringHistory.length > 0 ? (
        <div>
          <div className="flex gap-4 mb-4">
            <Card>
              <CardHeader style={{ paddingBottom: "0.5rem" }}>
                <CardTitle style={{ fontSize: "1rem" }}>
                  Current Status
                </CardTitle>
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
            {websiteData?.info?.ssl && (
              <Card>
                <CardHeader style={{ paddingBottom: "0.5rem" }}>
                  <CardTitle style={{ fontSize: "1rem" }}>SSL Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h1>
                      {websiteData?.info?.ssl?.valid &&
                      websiteData?.info?.ssl?.valid === true
                        ? // ? `Valid for ${websiteData?.info?.ssl?.extra?.days}`
                          "Valid ✅"
                        : "Invalid ❌"}
                    </h1>
                    <div>
                      {websiteData?.info?.ssl?.valid &&
                      websiteData?.info?.ssl?.valid === true
                        ? `Expires on ${formatTimestamp(
                            new Date(websiteData?.info?.ssl?.extra?.valid_to)
                          )}`
                        : "No SSL certificate found"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {websiteData?.info?.domain && (
              <Card>
                <CardHeader style={{ paddingBottom: "0.5rem" }}>
                  <CardTitle style={{ fontSize: "1rem" }}>
                    Domain Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h1>
                      {websiteData?.info?.domain?.valid &&
                      websiteData?.info?.domain?.valid === true
                        ? (websiteData?.info?.domain?.extra[
                            "Domain Name"
                          ] as string)
                        : "Invalid ❌"}
                    </h1>
                    <div>
                      {websiteData?.info?.ssl?.valid &&
                      websiteData?.info?.ssl?.valid === true
                        ? findDomainExpiry(websiteData?.info?.domain?.extra)
                        : "No domain Info"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Response Time History</CardTitle>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: websiteData?.monitoringHistory
                    .slice(-10)
                    .map(
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
                      data: websiteData?.monitoringHistory
                        .slice(-10)
                        .map(
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
                      pointRadius: 3,
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
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </CardContent>
            <CardContent>
              <div className="flex flex-col lg:flex-row justify-between">
                <h1 style={{ marginBottom: "1rem" }}>
                  Max Response Time: {getMaxResponseTime(websiteData)}ms
                </h1>
                <h1 style={{ marginBottom: "1rem" }}>
                  Min Response Time: {getMinResponseTime(websiteData)}ms
                </h1>
                <h1 style={{ marginBottom: "1rem" }}>
                  Average Response Time:{" "}
                  {getAverageResponseTime(websiteData).toFixed(2)}ms
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
                  labels: websiteData?.monitoringHistory
                    .slice(-10)
                    .map(
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
                      data: websiteData?.monitoringHistory
                        .slice(-10)
                        .map(
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
                      pointRadius: 3,
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
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center h-96">
          <h1 className="text-2xl">
            No monitoring data available for this site
          </h1>
        </div>
      )}
    </div>
  );
};

export default Site;
