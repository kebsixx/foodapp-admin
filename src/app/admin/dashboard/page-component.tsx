"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ProductsDistributionChart } from "@/components/ProductsDistributionChart";

type MonthlyOrderData = {
  name: string;
  orders: number;
};

type CategoryData = {
  name: string;
  products: number;
};

type LatestUsers = {
  id: string;
  email: string;
  date: string | null;
};

const chartConfig = {
  products: {
    label: "Products",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PageComponent = ({
  monthlyOrders,
  categoryData,
  latestUsers,
}: {
  monthlyOrders: MonthlyOrderData[];
  categoryData: CategoryData[];
  latestUsers: LatestUsers[];
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto px-2 sm:px-4">
        {isLoading && <div className="loading">Loading...</div>}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">
              Dashboard Overview
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Products Chart */}
          <ProductsDistributionChart categoryData={categoryData} />

          {/* Category to Products Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Products per Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer
                  config={chartConfig}
                  className="h-full w-full">
                  <BarChart
                    accessibilityLayer
                    data={categoryData}
                    margin={{
                      top: 20,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 5)} // Potong nama kategori menjadi 5 karakter
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="products" fill="var(--color-products)" radius={8}>
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Latest Users */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Users</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                          {user.date
                            ? format(
                                new Date(user.date),
                                "dd/MM/yyyy HH:mm",
                                {
                                  locale: id,
                                }
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default PageComponent;
