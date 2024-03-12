import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SkeletonSite = () => {
  return (
    <div className="flex flex-col text-left my-4 max-w-6xl mx-auto">
      <div className="flex flex-col text-left my-4">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div>
        <div className="flex gap-4 mb-4">
          <Card>
            <CardHeader style={{ paddingBottom: "0.5rem" }}>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader style={{ paddingBottom: "0.5rem" }}>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader style={{ paddingBottom: "0.5rem" }}>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader style={{ paddingBottom: "0.5rem" }}>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        </div>
        <Card className="mb-4">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full" />
          </CardContent>
          <CardContent>
            <div className="flex flex-col lg:flex-row justify-between">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-5 w-48 mb-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-60 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkeletonSite;
