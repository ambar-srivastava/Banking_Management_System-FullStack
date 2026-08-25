import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 1. Top Metrics Grid (Balance, Accounts, etc.) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. Middle Summary Card (Badges for Loans / Roles) */}
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {/* Using rounded-full to mimic your <Badge> components */}
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-5 w-20 rounded-full" />
          ))}
        </CardContent>
      </Card>

      {/* 3. Bottom Table Card (Transactions) */}
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulating a table header, then the rows */}
          <Skeleton className="h-4 w-full opacity-50" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
