import { PublicNav } from "@/components/PublicNav";
import { LegalDocument } from "@/components/LegalDocument";
import privacidade from "@/content/legal/privacidade.json";

export const metadata = {
  title: "Política de Privacidade — Trackpile",
};

export default function PrivacidadePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicNav />
      <LegalDocument content={privacidade} pdfHref="/legal/politica-de-privacidade.pdf" />
    </div>
  );
}
