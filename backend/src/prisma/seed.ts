import { PrismaClient } from '../generated/prisma'; 

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const fixedAssets = [
    { id: 1, name: "Ação XYZ", value: 123.45 },
    { id: 2, name: "Fundo ABC", value: 50.00 },
    { id: 3, name: "Tesouro Direto", value: 1000.00 },
    { id: 4, name: "CDB Banco Seguro", value: 250.75 },
    { id: 5, name: "Bitcoin", value: 60000.00 }
  ];

  // Use upsert to avoid creating duplicates if the seed script is run multiple times
  for (const assetData of fixedAssets) {
    const asset = await prisma.asset.upsert({
      where: { id: assetData.id },
      update: { name: assetData.name, value: assetData.value }, 
      create: { id: assetData.id, name: assetData.name, value: assetData.value }, 
    });
    console.log(`Created/Updated asset with id: ${asset.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });