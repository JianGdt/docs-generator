import type { Session } from "next-auth";
import { GenDocsUser } from "./user";

export interface DocsGeneratorProps {
  user: GenDocsUser;
  session: Session;
}

export interface StatsDisplayProps {
  docs: string;
}
