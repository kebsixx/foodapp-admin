"use client";

import { OrdersWithProducts } from "@/app/admin/orders/types";

type Props = {
  ordersWIthProducts: OrdersWithProducts;
};

export default function PageComponent({}: Props) {
  return (
    <div>
      <h1>Orders Page</h1>
    </div>
  );
}
