import { getMonthlyOrders } from "@/actions/orders";
import PageComponent from "./page-component";

const AdminDashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();

  console.log(monthlyOrders);

  return <PageComponent monthlyOrders={monthlyOrders} />;
};

export default AdminDashboard;
