import { PublicNav } from "@/components/PublicNav";
import { LegalDocument } from "@/components/LegalDocument";
import termos from "@/content/legal/termos.json";

export const metadata = {
  title: "Termo de Uso — Trackpile",
};

export default function TermosPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <PublicNav />
      <LegalDocument content={termos} pdfHref="/legal/termo-de-uso.pdf" />
    </div>
  );
}
