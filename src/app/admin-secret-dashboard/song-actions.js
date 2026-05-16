"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createSong(formData) {
  const title = formData.get("title");
  const file = formData.get("audio");

  if (!title) throw new Error("Title is required");
  if (!file || file.size === 0) throw new Error("Audio file is required");

  // Upload to Vercel Blob (same pattern as images)
  const blob = await put(file.name, file, { access: "public" });

  await prisma.song.create({
    data: { title, url: blob.url },
  });

  revalidatePath("/admin-secret-dashboard");
  revalidatePath("/");
}

export async function deleteSong(id) {
  await prisma.song.delete({ where: { id } });
  revalidatePath("/admin-secret-dashboard");
  revalidatePath("/");
}
