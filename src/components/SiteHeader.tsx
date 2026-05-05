import { Link, useLocation } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-[12px] uppercase tracking-[0.22em] transition-colors hover:text-foreground ${
        pathname === to ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container-luxe flex items-center justify-between h-16 md:h-20">
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {link("/collections/signature", "Collection")}
          {link("/about", "Atelier")}
          {link("/research", "Brief")}
        </nav>
        <Link to="/" className="font-serif text-2xl md:text-3xl tracking-[0.18em] uppercase">
          Lumière
        </Link>
        <div className="flex items-center justify-end gap-4 flex-1">
          <span className="hidden md:inline text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Made in India
          </span>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
