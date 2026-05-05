import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Leaf, Hand } from "lucide-react";
import hero from "@/assets/hero.jpg";

const VALUES = [
  { icon: Hand, title: "Hand-poured", body: "Each candle is poured by hand in our Jaipur atelier — small batches, never rushed." },
  { icon: Leaf, title: "Clean burn", body: "100% natural soy wax, lead-free cotton wicks, and oils sourced from family distillers." },
  { icon: Sparkles, title: "Refined fragrance", body: "Layered, restrained scents — composed like perfumery, not flavoured like dessert." },
];

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="container-luxe pt-12 md:pt-20 pb-10 grid gap-10 md:grid-cols-12 items-end">
          <div className="md:col-span-5 space-y-6 animate-fade-up">
            <div className="eyebrow">A modern fragrance house · est. 2026</div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-balance">
              The quiet ritual of <em className="italic text-accent">light.</em>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
              Premium handcrafted soy candles, hand-poured in India. Layered fragrance, refillable vessels, considered packaging — for the city's most considered homes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Button asChild className="h-12 px-8 text-[12px] uppercase tracking-[0.22em] bg-primary text-primary-foreground hover:bg-ink rounded-none">
                <Link to="/collections/signature">Shop the Collection</Link>
              </Button>
              <Link to="/about" className="text-[12px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground pb-1 transition-colors">
                Our story →
              </Link>
            </div>
          </div>
          <div className="md:col-span-7 animate-fade-in">
            <div className="aspect-[4/3] md:aspect-[5/4] overflow-hidden bg-linen-warm">
              <img src={hero} alt="Lumière candles arranged in soft natural light" width={1920} height={1280} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="container-luxe py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-4 max-w-xs">
              <Icon className="h-6 w-6 text-accent" strokeWidth={1.25} />
              <h3 className="font-serif text-2xl tracking-tight">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTION */}
      <section className="container-luxe py-12 md:py-16">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-3">
            <div className="eyebrow">The Signature Collection</div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Three scents. One ritual.</h2>
          </div>
          <Link to="/collections/signature" className="hidden md:inline text-[12px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground pb-1 transition-colors">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No products found</div>
        ) : (
          <div className="grid gap-10 md:gap-x-8 md:gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-linen-warm py-20 md:py-28 mt-16 border-y border-border/50">
        <div className="container-luxe text-center max-w-3xl space-y-8">
          <div className="eyebrow text-accent">As featured in</div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 font-serif text-xl md:text-2xl text-muted-foreground italic">
            <span>Vogue India</span>
            <span>·</span>
            <span>Architectural Digest</span>
            <span>·</span>
            <span>Verve</span>
            <span>·</span>
            <span>Conde Nast Traveller</span>
          </div>
          <blockquote className="font-serif text-3xl md:text-4xl leading-snug tracking-tight pt-8">
            "A genuinely modern Indian fragrance house — the kind of object you don't hide in a drawer."
          </blockquote>
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">— Vogue India, Home Issue</div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="container-luxe py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-5">
          <div className="eyebrow">The Atelier</div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">Composed, not assembled.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Lumière was founded on a simple idea: that home fragrance in India deserved the same quiet sophistication as its perfumery. We work with sixth-generation attar distillers in Kannauj, hand-blow our amber glass in Firozabad, and pour every candle within a hundred metres of where it was conceived.
          </p>
          <Link to="/about" className="inline-block text-[12px] uppercase tracking-[0.22em] border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors">
            Read our story
          </Link>
        </div>
        <div className="aspect-[4/5] bg-linen-warm overflow-hidden">
          <img src={hero} alt="Atelier" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </section>
    </>
  );
};

export default Index;
