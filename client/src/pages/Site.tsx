import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SkeletonSite from "@/components/SkeletonSite";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
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
} from "@/utils/misc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

Chart.register(...registerables);

interface Entry {
  timestamp: Date;
  responseTime: number;
  uptime: boolean;
  httpStatus: number;
  performance: {
    ttfb: number;
    fcp: number;
    domLoad: number;
  };
}

const Site = () => {
  const siteId = useParams().siteId;
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCheckTime, setNextCheckTime] = useState<string | null>(null);
  const [active, setActive] = useState<boolean>(true);
  const [togggleDialog, setToggleDialog] = useState<boolean>(false);

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
          setActive(res.data.data.active);
          setNextCheckTime(
            getNextCheckTime(
              res.data.data.monitoringHistory,
              res.data.data.monitoringSchedule
            )
          );
          console.log(res.data.data);
        });
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const toggleMonitoring = async () => {
    try {
      await axios
        .put(
          `${
            import.meta.env.VITE_SERVER_API_URL
          }/api/websites/${siteId}/toggle-monitoring`,
          {
            active: !active,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
        });
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };

  const makeLabel = (timestamp: Date) => {
    if (
      is15Minutes(websiteData?.monitoringSchedule.frequency) ||
      is30Minutes(websiteData?.monitoringSchedule.frequency) ||
      isHourly(websiteData?.monitoringSchedule.frequency)
    ) {
      return formatTime(timestamp);
    } else {
      return formatXTimestamp(timestamp);
    }
  };

  if (isLoading) {
    return <SkeletonSite />;
  }

  return (
    <>
      <div className="flex flex-col text-left my-4 max-w-6xl mx-auto">
        {error && <div className="text-red-500 text-lg my-4">{error}</div>}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col text-left">
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
          <div className="flex items-center space-x-2">
            <button
              className="cursor-pointer border-2 border-gray-600  p-2 rounded-md"
              onClick={() => setToggleDialog(true)}
            >
              <Pencil size={20} />
            </button>
            <Switch
              id="airplane-mode"
              checked={active}
              onCheckedChange={(checked) => {
                setActive(checked);
                toggleMonitoring();
              }}
            />
            <Label htmlFor="airplane-mode">Monitoring</Label>
          </div>
        </div>
        {websiteData && websiteData.monitoringHistory.length > 0 ? (
          <div>
            <div className="flex gap-4 mb-4 flex-col md:flex-row lg:flex-row">
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
                    <div>
                      Every {websiteData?.monitoringSchedule.frequency}{" "}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {websiteData?.info?.ssl && (
                <Card>
                  <CardHeader style={{ paddingBottom: "0.5rem" }}>
                    <CardTitle style={{ fontSize: "1rem" }}>
                      SSL Status
                    </CardTitle>
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
              {websiteData?.info?.domain?.valid && (
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
                      .map((entry: Entry) => {
                        const timestamp = entry.timestamp;
                        return makeLabel(timestamp);
                      }),
                    datasets: [
                      {
                        label: "Response Time",
                        data: websiteData?.monitoringHistory
                          .slice(-10)
                          .map((entry: Entry) => entry.responseTime),
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1.5,
                        pointRadius: 3,
                        cubicInterpolationMode: "monotone",
                        fill: true,
                        tension: 0.4,
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
                    plugins: {
                      tooltip: {
                        enabled: true,
                        mode: "nearest",
                        intersect: false,
                      },
                    },
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
            {websiteData?.monitoringSettings?.checks?.performance && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line
                    data={{
                      labels: websiteData?.monitoringHistory
                        .slice(-10)
                        .map((entry: Entry) => {
                          const timestamp = entry.timestamp;
                          return makeLabel(timestamp);
                        }),
                      datasets: [
                        {
                          label: "Time to First Byte",
                          data: websiteData?.monitoringHistory
                            .slice(-10)
                            .map((entry: Entry) => entry.performance.ttfb),
                          backgroundColor: "rgba(255, 159, 64, 0.2)",
                          borderColor: "rgba(255, 159, 64, 1)",
                          borderWidth: 1.5,
                          pointRadius: 3,
                          cubicInterpolationMode: "monotone",
                        },
                        {
                          label: "First Contentful Paint",
                          data: websiteData?.monitoringHistory
                            .slice(-10)
                            .map((entry: Entry) => entry.performance.fcp),
                          backgroundColor: "rgba(153, 102, 255, 0.2)",
                          borderColor: "rgba(153, 102, 255, 1)",
                          borderWidth: 1.5,
                          pointRadius: 3,
                          cubicInterpolationMode: "monotone",
                        },
                        {
                          label: "DOM Load",
                          data: websiteData?.monitoringHistory
                            .slice(-10)
                            .map((entry: Entry) => entry.performance.domLoad),
                          backgroundColor: "rgba(255, 99, 132, 0.2)",
                          borderColor: "rgba(255, 99, 132, 1)",
                          borderWidth: 1.5,
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
                      plugins: {
                        tooltip: {
                          enabled: true,
                          mode: "nearest",
                          intersect: false,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Uptime History</CardTitle>
              </CardHeader>
              <CardContent>
                <Line
                  data={{
                    labels: websiteData?.monitoringHistory
                      .slice(-10)
                      .map((entry: Entry) => {
                        const timestamp = entry.timestamp;
                        return makeLabel(timestamp);
                      }),
                    datasets: [
                      {
                        label: "Uptime",
                        data: websiteData?.monitoringHistory
                          .slice(-10)
                          .map((entry: Entry) => (entry.uptime ? 1 : 0)),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1.5,
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
                    plugins: {
                      tooltip: {
                        enabled: true,
                        mode: "nearest",
                        intersect: false,
                      },
                    },
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
      <Dialog
        open={togggleDialog}
        onOpenChange={(open) => setToggleDialog(open)}
        defaultOpen={false}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Update Monitoring Settings for {websiteData?.name}
            </DialogTitle>
            <DialogDescription>
              Enter the details of the website you want to monitor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="name" className="col-span-2">
                Website Name<span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                className="col-span-4"
                placeholder="e.g. My personal blog"
                type="text"
                value={websiteData?.name}
                // onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="url" className="col-span-2">
                Website URL<span className="text-red-600">*</span>
              </Label>
              <Input
                id="url"
                className="col-span-4"
                placeholder="e.g. https://example.com"
                type="url"
                value={websiteData?.url}
                // onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="frequency" className="col-span-2">
                Monitoring Frequency <span className="text-red-600">*</span>
              </Label>
              <Select
                defaultValue={websiteData?.monitoringSchedule.frequency}
                // onValueChange={(value) => setMonitoringFrequency(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="check" className="col-span-2">
                Monitoring Check
              </Label>

              <div className="col-span-4 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 ">
                  <Label htmlFor="httpStatus">HTTP Status</Label>
                  <Checkbox
                    id="httpStatus"
                    disabled
                    checked={websiteData?.monitoringSettings.checks.httpStatus}
                    // onCheckedChange={() =>
                    //   setMonitoringCheck({
                    //     ...monitoringCheck,
                    //     httpStatus: !monitoringCheck.httpStatus,
                    //   })
                    // }
                  />
                </div>
                {/* <div className="flex items-center gap-2 ">
                    <Label htmlFor="content">Content</Label>
                    <Checkbox
                      id="content"
                      disabled
                      checked={monitoringCheck.content}
                      onCheckedChange={() =>
                        setMonitoringCheck({
                          ...monitoringCheck,
                          content: !monitoringCheck.content,
                        })
                      }
                    />
                  </div> */}

                <div className="flex items-center gap-2 ">
                  <Label htmlFor="performance">Performance</Label>
                  <Checkbox
                    id="performance"
                    checked={websiteData?.monitoringSettings.checks.performance}
                    // onCheckedChange={() =>
                    //   setMonitoringCheck({
                    //     ...monitoringCheck,
                    //     performance: !monitoringCheck.performance,
                    //   })
                    // }
                  />
                </div>
                <div className="flex items-center gap-2 ">
                  <Label htmlFor="synthetic">Synthetic Monitoring</Label>
                  <Checkbox
                    id="synthetic"
                    disabled
                    checked={websiteData?.monitoringSettings.checks.synthetic}
                    // onCheckedChange={() =>
                    //   setMonitoringCheck({
                    //     ...monitoringCheck,
                    //     synthetic: !monitoringCheck.synthetic,
                    //   })
                    // }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="alertThresholds" className="col-span-2">
                Alert Thresholds <span className="text-red-600">*</span>
              </Label>
              <div className="col-span-4 grid grid-cols-1 gap-2">
                <Input
                  id="responseTime"
                  placeholder="Max Response Time(ms)"
                  type="number"
                  value={
                    websiteData?.monitoringSettings.alertThresholds.responseTime
                  }
                  // onChange={(e) => setMaxResponseTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="notification" className="col-span-2">
                Notifications
              </Label>

              <div className="col-span-4 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 ">
                  <Label htmlFor="email">Email</Label>
                  <Checkbox
                    id="email"
                    disabled
                    checked={websiteData?.notifications.email}
                    // onCheckedChange={() => setEmailChecked(!emailChecked)}
                  />
                </div>
                <div className="flex items-center gap-2 ">
                  <Label htmlFor="sms">SMS</Label>
                  <Checkbox
                    id="sms"
                    disabled
                    checked={websiteData?.notifications.sms.active}
                    // onCheckedChange={() => setSmsChecked(!smsChecked)}
                  />
                </div>
                <div className="flex items-center gap-2 ">
                  <Label htmlFor="slack">Slack</Label>
                  <Checkbox
                    id="slack"
                    disabled
                    checked={websiteData?.notifications.slack.active}
                    // onCheckedChange={() => setSlackChecked(!slackChecked)}
                  />
                </div>
                {/* <div className="col-span-3 ">
                  {smsChecked && (
                    <div className="flex flex-col gap-2 mb-4">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="123-456-7890"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  )}
                  {slackChecked && (
                    <div className="flex flex-col gap-2 ">
                      <Label htmlFor="slack-webhook">Slack Webhook</Label>
                      <Input
                        id="slack-webhook"
                        placeholder="https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX"
                        type="text"
                        value={slackWebhook}
                        onChange={(e) => setSlackWebhook(e.target.value)}
                      />
                    </div>
                  )}
                </div> */}
              </div>
            </div>
            {error && <p className="px-1 text-xs text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            {/* <button
              onClick={submitRequest}
              className={cn(buttonVariants())}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Website
            </button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Site;
