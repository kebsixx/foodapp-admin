import { getOrdersWithProducts } from "@/actions/orders";
import PageComponent from "@/app/admin/orders/page-component";

const Orders = async () => {
  const ordersWithProducts = await getOrdersWithProducts();

  if (!ordersWithProducts)
    return (
      <div className="text-center font-bold text-2xl">No Orders Found</div>
    );

  const mappedOrders = ordersWithProducts.map((order) => ({
    ...order,
    user: order.users as any,
  }));

  return (
    <div>
      <PageComponent ordersWithProducts={mappedOrders} />
    </div>
  );
};

export default Orders;
