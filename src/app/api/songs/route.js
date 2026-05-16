import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const songs = await prisma.song.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(songs);
}
