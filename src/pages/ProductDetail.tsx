import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatINR } from "@/lib/shopify";

const ProductDetail = () => {
  const { handle } = useParams();
  const { data: product, isLoading } = useProduct(handle);
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  if (isLoading) {
    return <div className="container-luxe py-32 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!product) {
    return (
      <div className="container-luxe py-32 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/collections/signature" className="text-accent underline-offset-4 hover:underline mt-4 inline-block">Back to collection</Link>
      </div>
    );
  }

  const node = product.node;
  const img = node.images?.edges?.[0]?.node;
  const variant = node.variants?.edges?.[0]?.node;

  const handleAdd = async () => {
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
    <div className="container-luxe pt-10 pb-24">
      <Link to="/collections/signature" className="inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="h-3 w-3" /> Collection
      </Link>
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-[4/5] bg-linen-warm overflow-hidden">
          {img && <img src={img.url} alt={img.altText ?? node.title} className="w-full h-full object-cover" width={1024} height={1280} />}
        </div>
        <div className="space-y-7 md:pt-8">
          <div className="space-y-3">
            <div className="eyebrow">{node.productType ?? "Candle"}</div>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">{node.title}</h1>
            <div className="font-serif text-2xl text-muted-foreground">
              {variant && formatINR(variant.price.amount, variant.price.currencyCode)}
            </div>
          </div>
          <div className="hairline" />
          <div
            className="prose prose-sm max-w-none text-foreground/85 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:mb-4 [&_em]:italic [&_strong]:font-medium [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: node.description ? `<p>${node.description.replace(/\n+/g, "</p><p>")}</p>` : "" }}
          />
          <div className="hairline" />
          <Button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            className="w-full h-13 py-6 text-[12px] uppercase tracking-[0.24em] bg-primary text-primary-foreground hover:bg-ink rounded-none"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Bag"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">Complimentary shipping on orders above ₹2,000 across India.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
