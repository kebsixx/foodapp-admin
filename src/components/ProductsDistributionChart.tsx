"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, LabelList } from "recharts";

interface ProductsDistributionChartProps {
  categoryData: { name: string; products: number }[];
}

const chartConfig = {
  products: {
    label: "Products",
  },
} satisfies ChartConfig;

export function ProductsDistributionChart({
  categoryData,
}: ProductsDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] [&_.recharts-text]:fill-background">
          <PieChart width={500} height={400}>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="products" hideLabel />}
            />
            <Pie
              data={categoryData}
              dataKey="products"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              labelLine={false}>
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
