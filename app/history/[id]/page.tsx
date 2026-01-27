import { auth } from "@//lib/auth";
import { getHistoryVersion } from "@//lib/database";
import { redirect } from "next/navigation";
import HistoryDetailClient from "./HistoryDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }
  const historyVersion = await getHistoryVersion(id, session.user.id);

  if (!historyVersion) {
    redirect("/history");
  }

  const initialData = {
    ...historyVersion,
    _id: historyVersion._id?.toString(),
    createdAt: historyVersion.createdAt.toISOString(),
  };

  return <HistoryDetailClient dataHistoryById={initialData} />;
}
