import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_QUERY, PRODUCT_BY_HANDLE_QUERY, type ShopifyProduct } from "@/lib/shopify";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ShopifyProduct[]> => {
      const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 24, query: null });
      return (data?.data?.products?.edges as ShopifyProduct[]) ?? [];
    },
  });
}

export function useProduct(handle: string | undefined) {
  return useQuery({
    queryKey: ["product", handle],
    enabled: !!handle,
    queryFn: async () => {
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      const node = data?.data?.product;
      return node ? ({ node } as ShopifyProduct) : null;
    },
  });
}
