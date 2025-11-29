import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Page Builder" },
    { name: "description", content: "Drag and drop page builder" },
  ];
}

export default function Home() {
  return <Welcome />;
}
