import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import DocsGenerator from "./_client/DocsGenerator";

export const metadata = {
  title: "AI Docs Generator - Generate Documentation",
  description: "Generate professional documentation with AI assistance",
};

export default async function DocsGeneratorPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <DocsGenerator user={session?.user} session={session} />;
}
