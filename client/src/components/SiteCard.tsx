import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CardProps {
  id: string;
  name: string;
  url: string;
}

const SiteCard = ({ id, name, url }: CardProps) => {
  return (
    <Card className="w-64 h-50">
      <CardHeader className="flex flex-col">
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {url.length > 30 ? url.slice(0, 30) + "..." : url}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p>Uptime</p>
          <p>100%</p>
        </div>
        <div className="flex justify-between">
          <p>Response Time</p>
          <p>0.2s</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={`/sites/${id}`}>
          <Button>Monitor</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
