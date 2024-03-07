import React from "react";
import { ModeToggle } from "../components/mode-toggle";
import { buttonVariants } from "../components/ui/button";
import { cn } from "@/lib/utils";
import { FaHeartbeat } from "react-icons/fa";
import { FaTachometerAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            to="#"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <ModeToggle />
          <h1 className="font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Keep Your Websites Up and Running with Uplyze
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Proactive website monitoring and uptime tracking for optimal
            performance and reliability.
          </p>
          <div className="space-x-4">
            <Link to="/loginn" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started for Free
            </Link>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Powerful Features for Comprehensive Website Monitoring
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6 items-center">
              <FaHeartbeat className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">Website Health Checks</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive website health monitoring with HTTP, content,
                  SSL, and custom checks.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6 items-center">
              <FaTachometerAlt className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">Performance Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track response times, page load times, and server performance
                  metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6 items-center">
              <FaClock className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">Scheduled Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Customize monitoring schedules from every 5 minutes to daily
                  checks.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6 items-center">
              <FaChartBar className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">Uptime and Downtime Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed uptime/downtime data and visualizations for analysis
                  and optimization.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6 items-center">
              <FaBell className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">Incident Reporting and Alerting</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time alerts via email, SMS, and messaging apps for prompt
                  issue resolution.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6 items-center">
              <FaCode className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">Monitoring APIs and Microservices</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor APIs, microservices, and web components with endpoint
                  checks and response validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Get Started with Uplyze Today
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Sign up for our free trial and experience the power of proactive
            website monitoring and uptime tracking. Enjoy peace of mind and keep
            your websites running smoothly.
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Start Free Trial
            </a>
            .{" "}
          </p>
        </div>
      </section>
    </>
  );
};

export default Landing;
