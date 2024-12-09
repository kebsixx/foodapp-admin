import { getMonthlyOrders } from "@/actions/orders";
import PageComponent from "./page-component";
import { getCategoryData } from "@/actions/categories";
import { getLatestUsers } from "@/actions/auth";

const AdminDashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();
  const categoryData = await getCategoryData();
  const latestUsers = await getLatestUsers();

  return (
    <PageComponent
      latestUsers={latestUsers}
      monthlyOrders={monthlyOrders}
      categoryData={categoryData}
    />
  );
};

export default AdminDashboard;
