import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const TYPE_LABELS = {
  withdrawal: "Withdrawals",
  transfer_out: "Trnasfers Out",
};

const chartConfig = {
  withdrawal: { label: "Withdrawals", color: "var(--chart-3)" },
  transfer_out: { label: "Transfers Out", color: "var(--chart-4)" },
};

export function SpendingBreakdownChart({ data }) {
  const formatted = data.map((row) => ({
    type: row.type,
    label: TYPE_LABELS[row.type] || row.type,
    total: parseFloat(row.total),
    fill: `var(--color-${row.type})`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>
          Withdrawals vs transfers out, last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formatted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No spending recorded yet.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-64 w-full max-w-xs"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
              <Pie
                data={formatted}
                dataKey="total"
                nameKey="label"
                innerRadius={50}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
