import { color, font, shadow } from "@/lib/tokens";
import { PublicNav, LinkButton } from "@/components/PublicNav";
import { UpgradeProButton } from "@/components/UpgradeProButton";

function Plan({
  name,
  price,
  period,
  features,
  featured,
  cta,
  ctaHref,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  cta: string;
  ctaHref?: string;
}) {
  return (
    <div
      style={{
        border: "3px solid #111",
        background: color.paper,
        padding: 28,
        position: "relative",
        boxShadow: featured ? shadow.card : shadow.sm,
      }}
    >
      {featured && (
        <div
          style={{
            position: "absolute",
            top: -16,
            right: 20,
            background: color.yellow,
            border: "2px solid #111",
            padding: "5px 12px",
            font: `700 11px ${font.mono}`,
            transform: "rotate(4deg)",
            boxShadow: shadow.badge,
          }}
        >
          Mais popular
        </div>
      )}
      <h3 style={{ font: `700 22px ${font.display}`, margin: 0 }}>{name}</h3>
      <div style={{ font: `700 40px ${font.display}`, margin: "14px 0 4px" }}>
        {price}
        <span style={{ fontSize: 14, fontWeight: 400, fontFamily: font.body }}>{period}</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "22px 0", fontSize: 14 }}>
        {features.map((f, i) => (
          <li key={i} style={{ padding: "8px 0", borderTop: i ? "1.5px dashed #ccc" : "none", display: "flex", gap: 8 }}>
            <span>✓</span> {f}
          </li>
        ))}
      </ul>
      {ctaHref ? (
        <LinkButton href={ctaHref} variant={featured ? "blue" : "paper"}>
          <span style={{ width: "100%", textAlign: "center" }}>{cta}</span>
        </LinkButton>
      ) : (
        <UpgradeProButton label={cta} variant={featured ? "blue" : "paper"} full />
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicNav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "70px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ font: `700 38px ${font.display}`, margin: 0 }}>Planos simples, sem pegadinha.</h1>
          <p style={{ color: "#444", marginTop: 10 }}>Comece de graça. Faça upgrade quando o processo esquentar.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <Plan
            name="Grátis"
            price="R$0"
            period="/sempre"
            cta="Começar grátis"
            ctaHref="/login"
            features={[
              "Até 15 vagas ativas",
              "Visualização em tabela",
              "Visualização em kanban",
              "Notas básicas por vaga",
            ]}
          />
          <Plan
            name="Pro"
            price="R$19"
            period="/mês"
            featured
            cta="Assinar Pro"
            features={[
              "Vagas ilimitadas",
              "Tabela + Kanban + Calendário",
              "Lembretes de entrevista por e-mail",
              "Notas ilimitadas + anexos",
            ]}
          />
        </div>
        <p style={{ textAlign: "center", marginTop: 32, fontFamily: font.mono, fontSize: 12, color: "#999" }}>
          Pagamento processado com segurança pela AbacatePay via cartão de crédito.
        </p>
      </div>
    </div>
  );
}
