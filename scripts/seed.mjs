import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const beginnings = [
  "I love the way your eyes",
  "The gentle way you",
  "Every time your smile",
  "Your beautiful soul",
  "The soft sound of your voice",
  "How your mere presence",
  "The quiet moments when you",
  "I adore how your laugh",
  "Your touch",
  "The way your heart",
  "I am mesmerized by how you",
  "Your endless kindness",
  "The light in your eyes",
  "Every whisper from you",
  "The warmth of your hand"
];

const middles = [
  "illuminates my darkest days",
  "brings peace to my chaotic mind",
  "makes the entire world disappear",
  "heals the wounds I thought would never close",
  "awakens a love I never knew existed",
  "guides me through the storm",
  "reminds me that magic is real",
  "makes every heavy burden feel light",
  "turns the ordinary into a masterpiece",
  "melts away all my fears",
  "captivates my wandering heart",
  "sparks a fire deep within my soul",
  "paints my universe with vibrant colors",
  "sings a melody only my heart can hear",
  "wraps me in infinite comfort"
];

const endings = [
  "like a sunrise after a seemingly endless night.",
  "and makes me realize I am finally home.",
  "like stars guiding a lost ship to safety.",
  "and proves that true love exists.",
  "reminding me that I am yours, forever.",
  "like a soft breeze on a summer evening.",
  "and I couldn't imagine my life any other way.",
  "leaving me breathless and entirely in love.",
  "and in that moment, nothing else matters.",
  "like poetry written specifically for my soul.",
  "and it makes me want to be a better man.",
  "anchoring me when the world spins too fast.",
  "and it's a feeling I want to hold onto for eternity.",
  "like the universe aligning just for us.",
  "and I fall for you all over again."
];

// Generate unique combinations
const reasons = new Set();
while(reasons.size < 500) {
  const b = beginnings[Math.floor(Math.random() * beginnings.length)];
  const m = middles[Math.floor(Math.random() * middles.length)];
  const e = endings[Math.floor(Math.random() * endings.length)];
  reasons.add(`${b} ${m}, ${e}`);
}

async function main() {
  console.log("Seeding 500 poetic reasons...");
  
  // Clear existing messages to start fresh (optional, but good for testing)
  await prisma.message.deleteMany();

  const data = Array.from(reasons).map(content => ({ content }));
  
  // Insert in batches of 100
  for (let i = 0; i < data.length; i += 100) {
    const batch = data.slice(i, i + 100);
    await prisma.message.createMany({
      data: batch,
    });
    console.log(`Inserted ${i + batch.length} reasons...`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
