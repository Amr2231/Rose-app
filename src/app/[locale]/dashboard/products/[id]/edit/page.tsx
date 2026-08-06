import React from "react";
import UpdateProductForm from "../../_components/update-product-form";

type UpdateProductProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: UpdateProductProps) {
  const { id } = await params;

  return (
    <div>
      <UpdateProductForm productId={id} />
    </div>
  );
}