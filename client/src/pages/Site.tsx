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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_API_URL}/api/websites/${siteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setWebsiteData(res.data.data);
        console.log(res.data.data);
      });
  }, [siteId]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div>
      {/* <Heading as="h1" size="4xl" mb={4}> */}
      <h1 className="text-4xl font-bold mb-4">{websiteData?.name}</h1>
      {/* <Flex gap={4} mb={4}> */}
      <div className="flex gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {websiteData?.monitoringHistory[0].uptime ? "✅" : "❌"}
              </div>
              <div>
                Last checked:{" "}
                {new Date(
                  websiteData?.monitoringHistory[0].timestamp
                ).toLocaleString()}
              </div>
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
