import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatINR, type ShopifyProduct } from "@/lib/shopify";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const node = product.node;
  const img = node.images?.edges?.[0]?.node;
  const variant = node.variants?.edges?.[0]?.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      <div className="aspect-[4/5] bg-linen-warm overflow-hidden mb-5 relative">
        {img && (
          <img
            src={img.url}
            alt={img.altText ?? node.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
          />
        )}
        <button
          onClick={handleAdd}
          disabled={isLoading || !variant}
          className="absolute inset-x-4 bottom-4 h-11 bg-background/95 backdrop-blur text-[11px] uppercase tracking-[0.24em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Add to Bag"}
        </button>
      </div>
      <div className="space-y-1.5 text-center">
        <h3 className="font-serif text-xl leading-tight tracking-tight">{node.title}</h3>
        <p className="text-sm text-muted-foreground">
          {formatINR(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
        </p>
      </div>
    </Link>
  );
};
