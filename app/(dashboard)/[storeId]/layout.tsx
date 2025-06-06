import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  // Await params to comply with Next.js 15 dynamic API requirements
  const { storeId } = await params;
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });
  if (!store) {
    redirect("/");
  }
  return (
    <>
      <div>
        <Navbar/>
        {children}
      </div>
    </>
  );
}
