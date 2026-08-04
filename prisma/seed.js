const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@demaple.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@demaple.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Seed employee
  const empPassword = await bcrypt.hash('employee123', 10);
  await prisma.user.upsert({
    where: { email: 'team@demaple.com' },
    update: {},
    create: {
      name: 'Arjun Nair',
      email: 'team@demaple.com',
      password: empPassword,
      role: 'EMPLOYEE',
    },
  });

  // Seed categories (product + project)
  const productCats = [
    'Stone', 'Timber', 'Lighting', 'Metals', 'Fabrics', 'Hardware',
    'Finishes', 'Tiles', 'Flooring', 'Materials', 'Other',
  ];
  const projectCats = ['Residential', 'Interior', 'Commercial', 'Landscape', 'Institutional'];
  for (const name of productCats) {
    await prisma.category.upsert({
      where: { type_name: { type: 'PRODUCT', name } },
      update: {},
      create: { type: 'PRODUCT', name },
    });
  }
  for (const name of projectCats) {
    await prisma.category.upsert({
      where: { type_name: { type: 'PROJECT', name } },
      update: {},
      create: { type: 'PROJECT', name },
    });
  }

  // Seed projects
  const projects = [
    { title: 'The Glass Pavilion', slug: 'glass-pavilion', description: 'A cantilevered concrete villa with infinity pool overlooking the water. Dense tropical landscaping frames every view.', category: 'Residential', location: 'Ponnani, Kerala', area: '4,200 sq ft', year: '2025', image: '/images/pool.png', featured: true },
    { title: 'Coastal Residence', slug: 'tropical-brutalism', description: 'Climate-responsive architecture with indoor-outdoor living, reflecting pools and clear structural expression.', category: 'Residential', location: 'Malappuram, Kerala', area: '6,800 sq ft', year: '2024', image: '/images/hero.png', featured: true },
    { title: 'Urban Sanctuary', slug: 'urban-sanctuary', description: 'Warm oak panels, stone floors and soft lighting for a refined Bengaluru interior.', category: 'Interior', location: 'Bengaluru', area: '3,500 sq ft', year: '2026', image: '/images/interior.png', featured: true },
    { title: 'Gulf Villa', slug: 'nordic-retreat', description: 'Residential design for a Qatar site — generous light, durable materials and calm proportions.', category: 'Residential', location: 'Doha, Qatar', area: '5,100 sq ft', year: '2023', image: '/images/bedroom.png', featured: true },
    { title: 'Courtyard House', slug: 'courtyard-house', description: 'A compact Malappuram home organised around a shaded courtyard for monsoon living.', category: 'Residential', location: 'Tirur, Kerala', area: '2,800 sq ft', year: '2022', image: '/images/interior.png', featured: false },
    { title: 'Retail Atelier', slug: 'retail-atelier', description: 'Boutique retail interior with custom joinery and a calm material palette.', category: 'Interior', location: 'Calicut, Kerala', area: '1,200 sq ft', year: '2024', image: '/images/bedroom.png', featured: false },
    { title: 'Hillside Bungalow', slug: 'hillside-bungalow', description: 'Split-level bungalow stepping with the contour, open to valley views.', category: 'Residential', location: 'Wayanad, Kerala', area: '3,900 sq ft', year: '2021', image: '/images/hero.png', featured: false },
    { title: 'Office Fit-out', slug: 'office-fitout', description: 'Workplace interiors for a Bengaluru studio — light, acoustics and flexible meeting rooms.', category: 'Commercial', location: 'Bengaluru', area: '8,400 sq ft', year: '2025', image: '/images/pool.png', featured: false },
  ];
  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  // Seed products
  const products = [
    { name: 'Matte Concrete Panel', slug: 'matte-concrete', description: 'Premium board-formed concrete wall panels for luxury interiors.', category: 'Materials', price: '₹8,500/sqm', image: '/images/pool.png' },
    { name: 'European Oak Flooring', slug: 'oak-flooring', description: 'Wide-plank engineered oak flooring with natural oil finish.', category: 'Flooring', price: '₹12,000/sqm', image: '/images/interior.png' },
    { name: 'Travertine Slabs', slug: 'travertine-slabs', description: 'Italian travertine stone slabs for walls and floors.', category: 'Materials', price: '₹15,000/sqm', image: '/images/bedroom.png' },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // Seed tasks
  const employee = await prisma.user.findUnique({ where: { email: 'team@demaple.com' } });
  if (employee) {
    await prisma.task.createMany({
      data: [
        { title: 'Site visit - Glass Pavilion', description: 'Conduct weekly site inspection and report.', status: 'IN_PROGRESS', priority: 'HIGH', assigneeId: employee.id, projectName: 'The Glass Pavilion' },
        { title: 'Material sample review', description: 'Review travertine samples from supplier.', status: 'PENDING', priority: 'MEDIUM', assigneeId: employee.id, projectName: 'Tropical Brutalism' },
        { title: 'Client presentation prep', description: 'Prepare 3D renders for the Urban Sanctuary project.', status: 'PENDING', priority: 'HIGH', assigneeId: employee.id, projectName: 'Urban Sanctuary' },
      ],
    });
  }

  console.log('✅ Database seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
