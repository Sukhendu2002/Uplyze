import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const CardSkeleton = () => {
  return (
    <Card className="w-64 h-50">
      <CardHeader className="flex flex-col">
        <Skeleton className="h-6 w-32" /> 
        <Skeleton className="h-4 w-48 mt-2" /> 
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" /> 
        </div>
        <div className="flex justify-between mt-2">
          <Skeleton className="h-4 w-24" /> 
          <Skeleton className="h-4 w-8" /> 
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-8 w-20" /> 
      </CardFooter>
    </Card>
  );
};

export default CardSkeleton;
