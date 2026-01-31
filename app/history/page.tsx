import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { getUserHistoryWithSearch } from "../../lib/database";
import HistoryClient from "./_client/HistoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const { history, pagination } = await getUserHistoryWithSearch(
    session.user.id,
    page,
    5,
    search,
  );

  const dataHistory = history.map((doc) => ({
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt.toISOString(),
  }));

  return (
    <HistoryClient
      initialData={dataHistory}
      initialPagination={pagination}
      initialPage={page}
      initialSearch={search}
      userId={session.user.id}
    />
  );
}
