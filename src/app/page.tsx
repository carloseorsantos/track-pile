import { color, font, shadow } from "@/lib/tokens";
import { PublicNav, LinkButton } from "@/components/PublicNav";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicNav />

      <div className="tp-hero tp-section" style={{ padding: "80px 48px 60px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <h1 className="tp-h1-hero" style={{ font: `700 52px/1.05 ${font.display}`, letterSpacing: "-1px", margin: 0 }}>
            Suas 40 vagas abertas no navegador{" "}
            <mark style={{ background: color.coral, color: color.paper, padding: "0 8px" }}>
              cabem numa tela só
            </mark>
            .
          </h1>
          <p style={{ fontSize: 17, color: "#333", margin: "20px 0 28px", maxWidth: 440, lineHeight: 1.6 }}>
            Chega de aba perdida, planilha bagunçada e &quot;em qual etapa mesmo que eu tava com aquela
            empresa?&quot;. Organize sua busca de emprego numa tabela, kanban e calendário — tudo no mesmo lugar.
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <LinkButton href="/pricing" variant="blue">Criar conta grátis →</LinkButton>
            <LinkButton href="/pricing" variant="paper">Ver planos</LinkButton>
          </div>
        </div>

        <div style={{ border: "3px solid #111", background: color.paper, boxShadow: shadow.card, transform: "rotate(1deg)" }}>
          <div style={{ borderBottom: "3px solid #111", padding: "10px 14px", display: "flex", gap: 6, background: "#EFE9D8" }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 10, height: 10, border: "2px solid #111", display: "inline-block" }} />
            ))}
          </div>
          <div style={{ padding: 16 }}>
            {[
              ["Nimbus Tech — Backend Pleno", "Entrevista", color.blue, color.paper],
              ["Cobalt Systems — Fullstack Sr", "Aplicado", color.yellow, color.ink],
              ["Halcyon Digital — Eng. Software", "Oferta", color.green, color.ink],
              ["Northwind Studio — Java Sr", "Triagem", color.gray, color.ink],
            ].map(([label, tag, bg, fg], i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1.5px dashed #999" : "none", fontSize: 13 }}>
                <span>{label}</span>
                <span style={{ font: `500 11px ${font.mono}`, padding: "4px 9px", border: "2px solid #111", boxShadow: shadow.badge, background: bg as string, color: fg as string }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tp-section" style={{ padding: "60px 48px", borderTop: "3px solid #111", borderBottom: "3px solid #111", background: color.blue, color: color.paper }}>
        <div className="tp-features" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
          {[
            ["01", "Tabela estilo Notion", "Todas as suas vagas numa tela só. Filtre por status, ordene por data e edite tudo — sem planilha bagunçada, sem 12 abas abertas."],
            ["02", "Kanban por etapa", "Arraste cada vaga de \"Salvo\" até \"Oferta\". Bateu o olho, já sabe onde cada processo travou e o que fazer em seguida."],
            ["03", "Calendário de entrevistas", "Suas entrevistas com data e hora em um só lugar. A gente te lembra por e-mail antes de cada uma — nunca mais um \"esqueci que era hoje\"."],
          ].map(([num, title, body]) => (
            <div key={num}>
              <div style={{ font: `500 12px ${font.mono}`, opacity: 0.7, marginBottom: 6 }}>{num}</div>
              <h3 style={{ font: `700 20px ${font.display}`, margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tp-section" style={{ padding: "80px 48px", textAlign: "center" }}>
        <h2 className="tp-h2-cta" style={{ font: `700 36px ${font.display}`, marginBottom: 24 }}>
          Sua próxima vaga merece organização.
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LinkButton href="/pricing" variant="blue" big>Começar de graça agora →</LinkButton>
        </div>
      </div>
    </div>
  );
}
