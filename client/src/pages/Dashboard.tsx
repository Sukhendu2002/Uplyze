import React from "react";
import SiteCard from "@/components/SiteCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CardSkeleton from "@/components/CardSkeleton";
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

type Site = {
  _id: string;
  name: string;
  url: string;
};

const Dashboard = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchSites();
  }, []);

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
        setError(err.message);
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
            />
          ))
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-64 h-50">
              <Plus size={24} />
              Add site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
