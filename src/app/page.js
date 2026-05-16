import { prisma } from "@/lib/prisma";
import MainExperience from "@/components/MainExperience";

export default async function Home() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <MainExperience messages={messages} />;
}

