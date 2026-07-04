import { color, font, shadow } from "@/lib/tokens";
import { LinkButton } from "@/components/PublicNav";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalContent = {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalDocument({ content, pdfHref }: { content: LegalContent; pdfHref: string }) {
  return (
    <div className="tp-section" style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 100px" }}>
      <div
        style={{
          border: "3px solid #111",
          background: color.paper,
          boxShadow: shadow.card,
          padding: "36px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "3px solid #111",
            paddingBottom: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={{ font: `700 30px ${font.display}`, margin: 0 }}>{content.title}</h1>
            <p style={{ fontFamily: font.mono, fontSize: 12, color: "#777", margin: "8px 0 0" }}>
              Última atualização: {content.updatedAt}
            </p>
          </div>
          <LinkButton href={pdfHref} variant="yellow">
            Baixar PDF
          </LinkButton>
        </div>

        {content.sections.map((section) => (
          <section key={section.heading} style={{ marginBottom: 26 }}>
            <h2 style={{ font: `700 17px ${font.display}`, margin: "0 0 10px" }}>{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#222", margin: "0 0 10px" }}>
                {p}
              </p>
            ))}
            {section.items && (
              <ul style={{ margin: "0 0 10px", paddingLeft: 20 }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#222", marginBottom: 6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
