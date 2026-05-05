import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

const Collection = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <div className="container-luxe pt-16 md:pt-24 pb-20">
      <div className="max-w-2xl mb-16 md:mb-20 space-y-4">
        <div className="eyebrow">Collection</div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-balance">The Signature Collection</h1>
        <p className="text-muted-foreground leading-relaxed text-lg">
          Three scents — one for the evening, one for the morning, one for the in-between. Composed by our perfumer in Jaipur, hand-poured in batches of fewer than fifty.
        </p>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products found</div>
      ) : (
        <div className="grid gap-10 md:gap-x-8 md:gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Collection;
