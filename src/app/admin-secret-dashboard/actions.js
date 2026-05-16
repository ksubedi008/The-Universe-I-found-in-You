"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createMessage(formData) {
  const content = formData.get("content");
  
  if (!content) throw new Error("Content is required");
  
  await prisma.message.create({
    data: { content },
  });
  
  revalidatePath("/admin-secret-dashboard");
  revalidatePath("/");
}

export async function deleteMessage(id) {
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin-secret-dashboard");
  revalidatePath("/");
}

export async function createMemory(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const image = formData.get("image");
  
  if (!title) throw new Error("Title is required");
  
  let imageUrl = null;
  
  if (image && image.size > 0) {
    const blob = await put(image.name, image, {
      access: 'public',
    });
    imageUrl = blob.url;
  }
  
  await prisma.memory.create({
    data: {
      title,
      description: description || null,
      imageUrl,
    },
  });
  
  revalidatePath("/admin-secret-dashboard");
  revalidatePath("/");
}

export async function deleteMemory(id) {
  await prisma.memory.delete({ where: { id } });
  revalidatePath("/admin-secret-dashboard");
  revalidatePath("/");
}
