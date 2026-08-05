import { getProducts } from "./products.service";
import { getProductDetails } from "@/app/[locale]/(website)/products/[id]/_services/product-details.service";

// The new backend's Swagger doc has no dedicated "related/similar products"
// endpoint (Products only exposes list/get-by-id/create/update/delete/
// restore/deleted). GET /api/products does support filtering by
// categoryId though, so "related" is approximated as: other products in
// the same category as this one.
export async function getRelatedProducts(productId: string) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const { product } = await getProductDetails(productId);
    if (!product?.category) return { similarProducts: [] };

    const { products } = await getProducts({
      categoryId: product.category,
      limit: 9,
    });

    return {
      similarProducts: products
        .filter((p) => p._id !== productId)
        .slice(0, 8),
    };
  } catch (error) {
    // Fail soft - a broken related-products fetch shouldn't take down the
    // whole product page.
    console.error("Failed to load related products:", error);
    return { similarProducts: [] };
  }
}
