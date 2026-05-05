import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, X, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatINR } from "@/lib/shopify";

export const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "INR";

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] hover:text-accent transition-colors">
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Bag</span>
          <span className="text-muted-foreground">({totalQty})</span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl tracking-tight">Your Bag</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Your bag is empty.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {items.map((item) => {
                  const img = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <div key={item.variantId} className="flex gap-4 pb-6 border-b border-border/60">
                      <div className="w-20 h-24 bg-secondary overflow-hidden flex-shrink-0">
                        {img && <img src={img.url} alt={img.altText ?? item.product.node.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between gap-2">
                          <h4 className="font-serif text-lg leading-tight">{item.product.node.title}</h4>
                          <button onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm text-muted-foreground">{formatINR(item.price.amount, item.price.currencyCode)}</div>
                        <div className="mt-auto flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-4 pt-4 border-t border-border/60">
                <div className="flex justify-between items-baseline">
                  <span className="eyebrow">Subtotal</span>
                  <span className="font-serif text-2xl">{formatINR(total, currency)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
                <Button onClick={checkout} disabled={isLoading || isSyncing} className="w-full h-12 text-[12px] uppercase tracking-[0.22em] bg-primary text-primary-foreground hover:bg-ink">
                  {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
