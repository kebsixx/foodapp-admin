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
    <div className="flex-1 p-8 overflow-auto">
      {isLoading && <div className="loading">Loading...</div>}
      <div className="text-3xl font-bold mb-6">Dashboard Overview</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
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
            <ChartContainer
              config={chartConfig}
              className="max-h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={categoryData}
                margin={{
                  top: 20,
                }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 5)} // Potong nama kategori menjadi 3 karakter
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
          </CardContent>
        </Card>

        {/* Latest Users */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.date
                        ? format(
                            new Date(user.date),
                            "EEEE, dd MM yyyy HH:mm:ss",
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageComponent;
