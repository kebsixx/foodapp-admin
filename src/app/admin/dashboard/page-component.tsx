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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card>
          <CardHeader>
            <CardTitle>Products Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="products"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}`
                  }>
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category to Produccts Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Products per Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="products" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
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
