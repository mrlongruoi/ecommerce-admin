import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }
    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId,
      }
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}