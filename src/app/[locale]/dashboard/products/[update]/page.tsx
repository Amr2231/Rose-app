import React from "react";
import UpdateProductForm from "../_components/update-product-form";

type UpdateProductProps = {
  params: {
    update: string;
  };
};

export default function Page({ params }: UpdateProductProps ) {
  return (
    <div>
      <UpdateProductForm productId={params.update} />
    </div>
  );
}
