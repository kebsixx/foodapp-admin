import { getMonthlyOrders } from "@/actions/orders";
import PageComponent from "./page-component";
import { get } from "http";
import { getCategoryData } from "@/actions/categories";

const AdminDashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();
  const categoryData = await getCategoryData();

  console.log(categoryData);

  return <PageComponent monthlyOrders={monthlyOrders} />;
};

export default AdminDashboard;
