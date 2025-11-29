
import { PageBuilder } from "~/components/layout/pageBuilder";
import type { Route } from "./+types/home";
import { BuilderProvider } from "~/builder/context/builderContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Builder" },
    { name: "description", content: "Drag and drop page builder" },
  ];
}

export default function Home() {
  return (
    <BuilderProvider>
      <PageBuilder/>
    </BuilderProvider>
  );
}
