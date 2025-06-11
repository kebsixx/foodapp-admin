"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";
import { Pie, PieChart } from "recharts";

interface ProductsDistributionChartProps {
  categoryData: { name: string; products: number }[];
}

// Define colors for categories
const CATEGORY_COLORS = {
  cat1: "hsl(var(--chart-1))",
  cat2: "hsl(var(--chart-2))",
  cat3: "hsl(var(--chart-3))",
  cat4: "hsl(var(--chart-4))",
  cat5: "hsl(var(--chart-5))",
  cat6: "hsl(150, 70%, 50%)",
  cat7: "hsl(180, 65%, 45%)",
  cat8: "hsl(210, 75%, 55%)",
  cat9: "hsl(240, 60%, 50%)",
  cat10: "hsl(270, 70%, 60%)",
  cat11: "hsl(300, 65%, 55%)",
  cat12: "hsl(330, 75%, 50%)",
  cat13: "hsl(360, 70%, 55%)",
  cat14: "hsl(30, 65%, 50%)",
  cat15: "hsl(60, 75%, 45%)",
  cat16: "hsl(90, 70%, 50%)",
};

// Create chart config dynamically based on categories
const createChartConfig = (
  categories: { name: string; products: number }[]
) => {
  const config: ChartConfig = {
    products: { label: "Products" },
  };

  categories.forEach((category, index) => {
    if (category.products > 0) {
      config[category.name] = {
        label: category.name,
        color: Object.values(CATEGORY_COLORS)[index],
      };
    }
  });

  return config;
};

export function ProductsDistributionChart({
  categoryData,
}: ProductsDistributionChartProps) {
  // Filter out categories with 0 products
  const filteredData = categoryData.filter((item) => item.products > 0);

  // Add colors to the data
  const coloredData = filteredData.map((item, index) => ({
    ...item,
    fill: Object.values(CATEGORY_COLORS)[index],
  }));

  const chartConfig = createChartConfig(filteredData);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Products Distribution</CardTitle>
        <CardDescription>Categories Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={coloredData}
              dataKey="products"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-center pt-0 gap-2">
        <div className="text-sm text-muted-foreground">
          {filteredData.length} categories
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredData.reduce((acc, item) => acc + item.products, 0)} products
        </div>
      </CardFooter>
    </Card>
  );
}
