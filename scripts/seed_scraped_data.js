const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '') + '-' + Math.floor(Math.random() * 1000); // add random suffix to ensure uniqueness just in case
}

async function seed() {
  console.log('Reading scraped_data.json...');
  const data = JSON.parse(fs.readFileSync('scraped_data.json', 'utf8'));

  console.log('Clearing old categories and products...');
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  
  // Need to delete children first if foreign keys are enforced, or just delete many
  await prisma.category.deleteMany({ where: { parentId: { not: null } } });
  await prisma.category.deleteMany();

  console.log('Seeding new data...');

  let order = 1;
  for (const cat of data) {
    // 1. Create Parent Category
    const parentCategory = await prisma.category.create({
      data: {
        name: cat.name,
        slug: slugify(cat.name),
        order: order++,
        isActive: true,
      }
    });

    // 2. If it has subcategories, create them and their products
    if (cat.subCategories && cat.subCategories.length > 0) {
      for (const subCat of cat.subCategories) {
        const childCategory = await prisma.category.create({
          data: {
            name: subCat.name,
            slug: slugify(subCat.name),
            order: order++,
            isActive: true,
            parentId: parentCategory.id, // Linking to parent!
          }
        });

        // Insert products for subcategory
        if (subCat.products && subCat.products.length > 0) {
          for (const prod of subCat.products) {
            const createdProd = await prisma.product.create({
              data: {
                name: prod.name,
                slug: slugify(prod.name),
                categoryId: childCategory.id,
                description: 'Scraped from Texasia.com',
                isActive: true,
              }
            });

            if (prod.image) {
              await prisma.productImage.create({
                data: {
                  productId: createdProd.id,
                  url: prod.image,
                }
              });
            }
          }
        }
      }
    } else {
      // 3. If no subcategories, insert products directly into parent category
      if (cat.products && cat.products.length > 0) {
        for (const prod of cat.products) {
          const createdProd = await prisma.product.create({
            data: {
              name: prod.name,
              slug: slugify(prod.name),
              categoryId: parentCategory.id,
              description: 'Scraped from Texasia.com',
              isActive: true,
            }
          });

          if (prod.image) {
            await prisma.productImage.create({
              data: {
                productId: createdProd.id,
                url: prod.image,
              }
            });
          }
        }
      }
    }
  }

  console.log('Seeding completed successfully!');
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
