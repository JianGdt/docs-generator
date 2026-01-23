import { Session } from "next-auth";

export interface GitHubIntegrationProps {
  documentContent: string;
  documentType: string;
  session: Session;
}
