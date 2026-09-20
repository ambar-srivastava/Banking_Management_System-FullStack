// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// export function LoansSkeleton() {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-5 w-40" />
//         </CardHeader>
//         <CardContent className="space-y-2">
//           {[0, 1, 2].map((i) => (
//             <Skeleton key={i} className="h-10 w-full" />
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoansSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Mimics the Loan Application Form */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>

      {/* Mimics the Data Table (Employee Queue / My Loans) */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Headers */}
            <div className="flex justify-between border-b pb-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            {/* Table Rows */}
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-between py-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />{" "}
                {/* Mimics a button/badge */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
