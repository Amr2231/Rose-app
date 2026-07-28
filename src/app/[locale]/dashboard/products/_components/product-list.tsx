import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/services/products.service";
import { Product } from "@/lib/types/product";
import React from "react";

export default async function ProductList() {
  const data = await getProducts();

  return (
    //  # TODO .. This is component for Testing only
    <div>
      {data.products.map((product: Product) => (
        <Link
          href={`/dashboard/products/${product._id}`}
          key={product._id}
          className=" block"
        >
          {product.title}
        </Link>
      ))}
    </div>
  );
}
