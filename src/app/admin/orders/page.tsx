import { getOrdersWithProducts } from "@/actions/orders";
import PageComponent from "@/app/admin/orders/page-component";

const Orders = async () => {
  const ordersWithProducts = await getOrdersWithProducts();

  if (!ordersWithProducts)
    return <div className="text-center font-bold text-2xl">No Order</div>;

  return (
    <div>
      <PageComponent ordersWIthProducts={ordersWithProducts} />
    </div>
  );
};

export default Orders;
