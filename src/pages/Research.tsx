const Section = ({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) => (
  <section className="py-12 border-t border-border/60 first:border-t-0">
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-3">
        <div className="eyebrow mb-2">{eyebrow}</div>
        <h2 className="font-serif text-3xl tracking-tight">{title}</h2>
      </div>
      <div className="md:col-span-9 space-y-5 text-foreground/85 leading-relaxed">{children}</div>
    </div>
  </section>
);

const Competitor = ({ name, url, position }: { name: string; url: string; position: string }) => (
  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 py-4 border-b border-border/50 last:border-0">
    <div className="md:w-56 font-serif text-xl">{name}</div>
    <div className="md:w-48 text-sm text-muted-foreground tracking-wide">{url}</div>
    <div className="flex-1 text-sm leading-relaxed">{position}</div>
  </div>
);

const Swatch = ({ hex, name, role }: { hex: string; name: string; role: string }) => (
  <div className="space-y-2">
    <div className="aspect-square w-full" style={{ backgroundColor: hex }} />
    <div className="text-sm font-medium">{name}</div>
    <div className="font-mono text-xs text-muted-foreground">{hex}</div>
    <div className="text-xs text-muted-foreground">{role}</div>
  </div>
);

const Research = () => (
  <div className="container-luxe pt-12 md:pt-20 pb-24 max-w-6xl">
    <div className="mb-16 max-w-3xl">
      <div className="eyebrow mb-4">Agent Research Brief — Lumière</div>
      <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-balance">
        How the agent built Lumière.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        A working dossier — what the AI agent discovered when given the brief: <em>"Premium handcrafted soy candles for urban Indian women, 25–40, ₹599–₹2,499, Forest Essentials for home fragrance."</em>
      </p>
    </div>

    <Section eyebrow="Deliverable 2.1" title="Competitive set">
      <p>Five Indian and Indian-adjacent home-fragrance houses occupying overlapping shelf space:</p>
      <div className="mt-4">
        <Competitor name="Bombay Perfumery" url="bombayperfumery.com" position="Niche perfumery first, scaling into home. Cinematic storytelling, French-trained nose, ₹1,800–₹3,500. Aspirational ceiling for Lumière." />
        <Competitor name="Niconica" url="niconica.in" position="Soy-only, Bombay design-forward. Pastel palettes, gen-Z lean, ₹450–₹1,400. Lumière sits one tier above on craft and price." />
        <Competitor name="Boond Fragrances" url="boond.in" position="Affordable accessible scented candles, ₹399–₹1,200. Mass-prestige; Lumière differentiates via vessel quality and perfumery composition." />
        <Competitor name="Bath & Body Works India" url="bathandbodyworks.in" position="Mall-tier, single-note (Vanilla, Apple Pumpkin). Lumière defines itself in opposition: layered, unisex, restrained." />
        <Competitor name="Forest Essentials Home" url="forestessentialsindia.com" position="Closest spiritual reference. Ayurvedic provenance, gold-on-cream packaging, brahmi & kashmiri saffron. Lumière borrows the visual hush, drops the heritage cosplay, modernises typography." />
      </div>
    </Section>

    <Section eyebrow="Deliverable 2.2" title="Product trends & SKU recommendation">
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Format winners (2025–26):</strong> 200–250g amber glass is the price/perceived-value sweet spot. Sub-150g "petit" formats convert as gifts and trial.</li>
        <li><strong>Scent families on the rise in India:</strong> oud + rose, vetiver + cardamom, jasmine + sandalwood, tomato leaf + fig, white tea. Avoid generic vanilla.</li>
        <li><strong>SKU plan:</strong> 3 launch SKUs (one per scent family), single 200g format + one 150g gift size — tested before expanding to refills, room sprays and travel tins.</li>
        <li><strong>Sustainability cues are now table stakes:</strong> soy/coconut wax blend, lead-free wick, FSC packaging, refill program by month 6.</li>
      </ul>
    </Section>

    <Section eyebrow="Deliverable 2.3" title="Pricing recommendation">
      <p>Brief envelope (₹599–₹2,499) maps cleanly onto a three-tier ladder. Recommended:</p>
      <div className="grid sm:grid-cols-3 gap-6 mt-2">
        <div className="p-6 bg-linen-warm space-y-1">
          <div className="eyebrow">Entry / Gift</div>
          <div className="font-serif text-3xl">₹599</div>
          <div className="text-sm text-muted-foreground">150g · Petit Fumé</div>
        </div>
        <div className="p-6 bg-linen-warm space-y-1">
          <div className="eyebrow">Signature</div>
          <div className="font-serif text-3xl">₹1,899</div>
          <div className="text-sm text-muted-foreground">200g · Maison Ivoire</div>
        </div>
        <div className="p-6 bg-linen-warm space-y-1">
          <div className="eyebrow">Hero</div>
          <div className="font-serif text-3xl">₹2,499</div>
          <div className="text-sm text-muted-foreground">220g · Maison Noir</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Hero anchored at the brief ceiling sets perceived quality; entry SKU underwrites gifting volume; signature is the workhorse margin product.</p>
    </Section>

    <Section eyebrow="Deliverable 2.4" title="Tone & brand direction">
      <p><strong>Voice:</strong> quiet, declarative, lower-case-leaning. French-Indian register. Short sentences. No exclamation points. No "luxurious", "indulgent" or "treat yourself" — those are mass-market tells. Use sensory and architectural language: <em>quiet, composed, considered, hand-poured, daylight, ritual.</em></p>
      <p><strong>Reasoning:</strong> the target — urban women 25–40 in Mumbai, Bangalore, Delhi — over-indexes on Aesop, Le Labo, Forest Essentials, Nicobar and Good Earth. They reward restraint and punish performative luxury. The copy should sound like it's read aloud, not announced.</p>
    </Section>

    <Section eyebrow="Deliverable 3.5" title="Colour palette & typography">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Swatch hex="#F6F1E7" name="Linen" role="Background, paper" />
        <Swatch hex="#2E2520" name="Ink" role="Primary text" />
        <Swatch hex="#B68A4E" name="Antique Brass" role="Accent / CTA" />
        <Swatch hex="#E5DCC9" name="Warm Sand" role="Surfaces, cards" />
      </div>
      <div className="space-y-2 pt-4">
        <p><strong>Typography:</strong> Cormorant Garamond (display, italic) paired with Inter (body, 400/500).</p>
        <p className="text-sm text-muted-foreground">Cormorant carries the editorial hush of <em>Vogue India</em> and Aesop without the cliché of Didot. Inter keeps the digital surfaces honest, modern and screen-readable across devices — a deliberate counterweight to the serif. Together they read as a luxury house that built its own website rather than hiring a department store to build it for them.</p>
      </div>
    </Section>
  </div>
);

export default Research;
