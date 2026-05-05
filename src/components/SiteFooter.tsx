import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="mt-32 border-t border-border/60 bg-linen-warm">
    <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2 space-y-4">
        <div className="font-serif text-2xl tracking-[0.18em] uppercase">Lumière</div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          A modern luxury home fragrance house. Hand-poured soy candles in small batches, from our atelier in Jaipur.
        </p>
      </div>
      <div className="space-y-3">
        <div className="eyebrow">Shop</div>
        <ul className="space-y-2 text-sm">
          <li><Link to="/collections/signature" className="hover:text-accent">Signature Collection</Link></li>
          <li><Link to="/product/maison-noir-oud-rose" className="hover:text-accent">Maison Noir</Link></li>
          <li><Link to="/product/maison-ivoire-jasmine-sandalwood" className="hover:text-accent">Maison Ivoire</Link></li>
          <li><Link to="/product/petit-fume-vetiver-cardamom" className="hover:text-accent">Petit Fumé</Link></li>
        </ul>
      </div>
      <div className="space-y-3">
        <div className="eyebrow">House</div>
        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:text-accent">The Atelier</Link></li>
          <li><Link to="/research" className="hover:text-accent">Agent Research</Link></li>
        </ul>
      </div>
    </div>
    <div className="container-luxe py-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
      <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lumière. Hand-poured in India.</div>
      <div className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Designed, not manufactured.</div>
    </div>
  </footer>
);
