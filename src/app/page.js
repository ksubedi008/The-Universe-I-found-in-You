import { prisma } from "@/lib/prisma";
import MainExperience from "@/components/MainExperience";

export const dynamic = "force-dynamic";

export default async function Home() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" }
  });

  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" }
  });

  const songs = await prisma.song.findMany({
    orderBy: { createdAt: "asc" }
  });

  return <MainExperience messages={messages} memories={memories} songs={songs} />;
}

