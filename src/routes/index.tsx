import { createFileRoute } from "@tanstack/react-router";
import { SalaPlantao } from "@/components/sala-plantao";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sala Vermelha — Choque Hipovolêmico | Enfermagem FAC" },
    { name: "description", content: "Trilha de Patologia Geral com seis atividades e caso clínico interativo de politrauma. Enfermagem FAC Curvelo, orientação da Profa. Paula Silveira." },
    { property: "og:title", content: "Sala Vermelha — Plantão de Enfermagem" },
    { property: "og:description", content: "Estude o choque hipovolêmico e conduza um caso clínico interativo de trauma pélvico." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SalaPlantao,
});
