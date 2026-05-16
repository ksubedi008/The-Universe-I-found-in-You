const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const songs = [
    { title: "Perfect – Ed Sheeran", url: "/music/Ed Sheeran - Perfect.mp3" },
    { title: "Kaun Tujhe – Armaan Malik", url: "/music/Kaun Tujhe - Armaan Malik.mp3" },
    { title: "Bol Do Na Zara", url: "/music/Bol Do Na Zara.mp3" },
    { title: "Universe", url: "/music/universe.mp3" },
  ];

  for (const song of songs) {
    // Only insert if not already present (idempotent)
    const exists = await prisma.song.findFirst({ where: { url: song.url } });
    if (!exists) {
      await prisma.song.create({ data: song });
      console.log("Seeded:", song.title);
    } else {
      console.log("Already exists:", song.title);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
