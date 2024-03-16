import React from "react";
import SiteCard from "@/components/SiteCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import CardSkeleton from "@/components/CardSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type Site = {
  _id: string;
  name: string;
  url: string;
};

interface AuthNavProps {
  onLogout: () => void;
}

const Dashboard: React.FC<AuthNavProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [emailChecked, setEmailChecked] = useState(true);
  const [smsChecked, setSmsChecked] = useState(false);
  const [slackChecked, setSlackChecked] = useState(false);
  const [monitoringFrequency, setMonitoringFrequency] = useState("15");
  const [phone, setPhone] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [maxResponseTime, setMaxResponseTime] = useState("");
  const [monitoringCheck, setMonitoringCheck] = useState({
    httpStatus: true,
    content: false,
    performance: false,
    synthetic: false,
  });

  const fetchSites = async () => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_API_URL}/api/websites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setSites(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.error);
        if (err.response.data.error === "Invalid token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          onLogout();
          navigate("/login");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const submitRequest = async () => {
    if (!name || !url || !monitoringFrequency || !maxResponseTime) {
      setError("You must fill all the required fields");
      return;
    }
    setLoading(true);
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/websites`,
        {
          name,
          url,
          monitoringSchedule: {
            frequency: monitoringFrequency,
          },
          monitoringSettings: {
            checks: {
              httpStatus: monitoringCheck.httpStatus,
              content: monitoringCheck.content,
              performance: monitoringCheck.performance,
              synthetic: monitoringCheck.synthetic,
            },
            alertThresholds: {
              responseTime: maxResponseTime,
            },
          },
          notifications: {
            email: emailChecked,
            sms: {
              enabled: smsChecked,
              phoneNumber: phone,
            },
            slack: {
              enabled: slackChecked,
              webhook: slackWebhook,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setSites((prev) => [
          ...prev,
          {
            _id: res.data.data._id,
            name: res.data.data.name,
            url: res.data.data.url,
          },
        ]);
        //clear form
        setName("");
        setUrl("");
        setMonitoringFrequency("15m");
        setPhone("");
        setSlackWebhook("");
        setMaxResponseTime("");
        setMonitoringCheck({
          httpStatus: true,
          content: false,
          performance: false,
          synthetic: false,
        });
        setEmailChecked(true);
        setSmsChecked(false);
        setSlackChecked(false);

        //close dialog box
        setOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.error);
        if (err.response.data.error === "Invalid token") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          onLogout();
          navigate("/login");
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">All Sites</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 sm:grid-cols-1  mt-10 md:mt-6">
        {loading ? (
          <>
            <CardSkeleton />
          </>
        ) : (
          sites?.map((site) => (
            <SiteCard
              key={site._id}
              id={site._id.toString()}
              name={site.name}
              url={site.url}
              // uptime = last monitoringHistory.uptime
              uptime={
                site?.monitoringHistory[site?.monitoringHistory.length - 1]
                  ?.uptime
              }
              responseTime={
                site?.monitoringHistory[site?.monitoringHistory.length - 1]
                  ?.responseTime
              }
            />
          ))
        )}
        <Dialog
          open={open}
          onOpenChange={() => {
            setOpen(!open);
            setError("");
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-64 h-50">
              <Plus size={24} />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Website</DialogTitle>
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="frequency" className="col-span-2">
                  Monitoring Frequency <span className="text-red-600">*</span>
                </Label>
                <Select
                  defaultValue={monitoringFrequency}
                  onValueChange={(value) => setMonitoringFrequency(value)}
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
                      checked={monitoringCheck.httpStatus}
                      onCheckedChange={() =>
                        setMonitoringCheck({
                          ...monitoringCheck,
                          httpStatus: !monitoringCheck.httpStatus,
                        })
                      }
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
                      disabled
                      checked={monitoringCheck.performance}
                      onCheckedChange={() =>
                        setMonitoringCheck({
                          ...monitoringCheck,
                          performance: !monitoringCheck.performance,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Label htmlFor="synthetic">Synthetic Monitoring</Label>
                    <Checkbox
                      id="synthetic"
                      disabled
                      checked={monitoringCheck.synthetic}
                      onCheckedChange={() =>
                        setMonitoringCheck({
                          ...monitoringCheck,
                          synthetic: !monitoringCheck.synthetic,
                        })
                      }
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
                    value={maxResponseTime}
                    onChange={(e) => setMaxResponseTime(e.target.value)}
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
                      checked={emailChecked}
                      onCheckedChange={() => setEmailChecked(!emailChecked)}
                    />
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Label htmlFor="sms">SMS</Label>
                    <Checkbox
                      id="sms"
                      disabled
                      checked={smsChecked}
                      onCheckedChange={() => setSmsChecked(!smsChecked)}
                    />
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Label htmlFor="slack">Slack</Label>
                    <Checkbox
                      id="slack"
                      disabled
                      checked={slackChecked}
                      onCheckedChange={() => setSlackChecked(!slackChecked)}
                    />
                  </div>
                  <div className="col-span-3 ">
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
                  </div>
                </div>
              </div>
              {error && <p className="px-1 text-xs text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <button
                onClick={submitRequest}
                className={cn(buttonVariants())}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Website
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
