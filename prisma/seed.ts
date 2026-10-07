import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cellcraze.lk" },
    update: {},
    create: {
      email: "admin@cellcraze.lk",
      name: "Kasun Perera",
      phone: "+94771234567",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Nimali Fernando",
      phone: "+94779876543",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });

  await prisma.address.create({
    data: {
      userId: customer.id,
      label: "Home",
      recipientName: "Nimali Fernando",
      phone: "+94779876543",
      line1: "42 Galle Road",
      line2: "Dehiwala",
      city: "Colombo",
      province: "Western",
      postalCode: "10350",
      country: "Sri Lanka",
      isDefault: true,
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Phones", slug: "phones", sortOrder: 1, description: "Latest smartphones from top brands" },
    }),
    prisma.category.create({
      data: { name: "Headphones", slug: "headphones", sortOrder: 2, description: "Over-ear and on-ear headphones" },
    }),
    prisma.category.create({
      data: { name: "Earphones", slug: "earphones", sortOrder: 3, description: "Wireless and wired earphones" },
    }),
    prisma.category.create({
      data: { name: "Chargers", slug: "chargers", sortOrder: 4, description: "Fast chargers and power banks" },
    }),
    prisma.category.create({
      data: { name: "Smartwatches", slug: "smartwatches", sortOrder: 5, description: "Smart watches and fitness trackers" },
    }),
    prisma.category.create({
      data: { name: "Accessories", slug: "accessories", sortOrder: 6, description: "Cases, cables and more" },
    }),
  ]);

  const [phones, headphones, earphones, chargers, smartwatches, accessories] = categories;

  const products = [
    {
      sku: "SM-S938B-256",
      name: "Galaxy S25 Ultra",
      slug: "galaxy-s25-ultra-256",
      description: "The ultimate Galaxy experience with S Pen, 200MP camera, and titanium frame.",
      price: 389900,
      compareAtPrice: 419900,
      costPrice: 320000,
      categoryId: phones.id,
      stockQuantity: 12,
      reorderPoint: 5,
      reorderQty: 10,
      isFeatured: true,
      brand: "Samsung",
      model: "SM-S938B",
      specifications: {
        Display: "6.9\" Dynamic AMOLED 2X",
        Processor: "Snapdragon 8 Elite",
        RAM: "12GB",
        Storage: "256GB",
        Camera: "200MP + 50MP + 10MP + 50MP",
        Battery: "5000mAh",
        OS: "Android 15 / One UI 7",
      },
    },
    {
      sku: "SM-S938B-512",
      name: "Galaxy S25 Ultra 512GB",
      slug: "galaxy-s25-ultra-512",
      description: "Galaxy S25 Ultra with expanded 512GB storage.",
      price: 429900,
      compareAtPrice: 459900,
      costPrice: 350000,
      categoryId: phones.id,
      stockQuantity: 8,
      reorderPoint: 3,
      isFeatured: true,
      brand: "Samsung",
      model: "SM-S938B",
      specifications: {
        Display: "6.9\" Dynamic AMOLED 2X",
        Processor: "Snapdragon 8 Elite",
        RAM: "12GB",
        Storage: "512GB",
        Camera: "200MP + 50MP + 10MP + 50MP",
        Battery: "5000mAh",
      },
    },
    {
      sku: "IP16P-256",
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      description: "Apple Intelligence, A18 Pro chip, and the most advanced camera system ever.",
      price: 449900,
      compareAtPrice: 479900,
      costPrice: 380000,
      categoryId: phones.id,
      stockQuantity: 15,
      reorderPoint: 5,
      isFeatured: true,
      brand: "Apple",
      model: "iPhone 16 Pro",
      specifications: {
        Display: "6.3\" Super Retina XDR",
        Processor: "A18 Pro",
        RAM: "8GB",
        Storage: "256GB",
        Camera: "48MP + 48MP + 12MP",
        Battery: "3582mAh",
        OS: "iOS 18",
      },
    },
    {
      sku: "PX9P-128",
      name: "Pixel 9 Pro",
      slug: "pixel-9-pro",
      description: "Google Tensor G4, best-in-class AI features, and pro-level camera.",
      price: 299900,
      compareAtPrice: 329900,
      costPrice: 240000,
      categoryId: phones.id,
      stockQuantity: 7,
      reorderPoint: 3,
      isFeatured: false,
      brand: "Google",
      model: "Pixel 9 Pro",
      specifications: {
        Display: "6.3\" LTPO OLED",
        Processor: "Tensor G4",
        RAM: "16GB",
        Storage: "128GB",
        Camera: "50MP + 48MP + 48MP",
        Battery: "4700mAh",
      },
    },
    {
      sku: "OP13-256",
      name: "OnePlus 13",
      slug: "oneplus-13",
      description: "Flagship killer with Snapdragon 8 Elite and 100W charging.",
      price: 249900,
      costPrice: 190000,
      categoryId: phones.id,
      stockQuantity: 20,
      reorderPoint: 5,
      brand: "OnePlus",
      model: "OnePlus 13",
      specifications: {
        Display: "6.82\" LTPO AMOLED",
        Processor: "Snapdragon 8 Elite",
        RAM: "12GB",
        Storage: "256GB",
        Camera: "50MP + 50MP + 50MP",
        Battery: "6000mAh",
      },
    },
    {
      sku: "SONY-WH1000XM5",
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description: "Industry-leading noise cancellation with exceptional sound quality.",
      price: 89900,
      compareAtPrice: 99900,
      costPrice: 62000,
      categoryId: headphones.id,
      stockQuantity: 18,
      reorderPoint: 5,
      isFeatured: true,
      brand: "Sony",
      model: "WH-1000XM5",
      specifications: {
        Type: "Over-ear, Wireless",
        Driver: "30mm",
        "Noise Cancellation": "Yes, Adaptive",
        "Battery Life": "30 hours",
        Connectivity: "Bluetooth 5.3, 3.5mm",
        Weight: "250g",
      },
    },
    {
      sku: "APM-2",
      name: "AirPods Max 2",
      slug: "airpods-max-2",
      description: "High-fidelity audio with Active Noise Cancellation and USB-C.",
      price: 149900,
      costPrice: 110000,
      categoryId: headphones.id,
      stockQuantity: 5,
      reorderPoint: 3,
      isFeatured: true,
      brand: "Apple",
      model: "AirPods Max 2",
      specifications: {
        Type: "Over-ear, Wireless",
        Driver: "Apple-designed",
        "Noise Cancellation": "Active",
        "Battery Life": "20 hours",
        Connectivity: "Bluetooth 5.3, USB-C",
      },
    },
    {
      sku: "JBL-T770NC",
      name: "JBL Tune 770NC",
      slug: "jbl-tune-770nc",
      description: "Wireless over-ear headphones with Adaptive Noise Cancelling.",
      price: 24900,
      compareAtPrice: 29900,
      costPrice: 15000,
      categoryId: headphones.id,
      stockQuantity: 30,
      reorderPoint: 10,
      brand: "JBL",
      model: "Tune 770NC",
      specifications: {
        Type: "Over-ear, Wireless",
        Driver: "40mm",
        "Noise Cancellation": "Adaptive",
        "Battery Life": "44 hours",
        Connectivity: "Bluetooth 5.3",
      },
    },
    {
      sku: "APP-3",
      name: "AirPods Pro 3",
      slug: "airpods-pro-3",
      description: "Adaptive Audio, personalised Spatial Audio, and hearing health features.",
      price: 79900,
      costPrice: 58000,
      categoryId: earphones.id,
      stockQuantity: 22,
      reorderPoint: 8,
      isFeatured: true,
      brand: "Apple",
      model: "AirPods Pro 3",
      specifications: {
        Type: "In-ear, True Wireless",
        "Noise Cancellation": "Active with Adaptive mode",
        "Battery Life": "6h (buds) / 30h (case)",
        Connectivity: "Bluetooth 5.4",
        "Water Resistance": "IP54",
      },
    },
    {
      sku: "SGE-BUDS3P",
      name: "Galaxy Buds3 Pro",
      slug: "galaxy-buds3-pro",
      description: "Premium true wireless earbuds with AI-powered noise control.",
      price: 59900,
      compareAtPrice: 69900,
      costPrice: 40000,
      categoryId: earphones.id,
      stockQuantity: 0,
      reorderPoint: 5,
      brand: "Samsung",
      model: "Galaxy Buds3 Pro",
      specifications: {
        Type: "In-ear, True Wireless",
        "Noise Cancellation": "Active + Ambient",
        "Battery Life": "7h (buds) / 30h (case)",
        Connectivity: "Bluetooth 5.4",
        "Water Resistance": "IP57",
      },
    },
    {
      sku: "ANK-737",
      name: "Anker 737 Power Bank",
      slug: "anker-737-power-bank",
      description: "24,000mAh portable charger with 140W output.",
      price: 34900,
      costPrice: 22000,
      categoryId: chargers.id,
      stockQuantity: 25,
      reorderPoint: 8,
      isFeatured: true,
      brand: "Anker",
      model: "737",
      specifications: {
        Capacity: "24,000mAh",
        "Max Output": "140W",
        Ports: "2× USB-C, 1× USB-A",
        Weight: "632g",
        Display: "Smart Digital Display",
      },
    },
    {
      sku: "SGC-45W",
      name: "Samsung 45W Super Fast Charger",
      slug: "samsung-45w-charger",
      description: "Official Samsung 45W USB-C wall charger with PPS.",
      price: 8900,
      compareAtPrice: 11900,
      costPrice: 5000,
      categoryId: chargers.id,
      stockQuantity: 40,
      reorderPoint: 15,
      brand: "Samsung",
      model: "EP-T4510",
      specifications: {
        "Max Output": "45W",
        Port: "USB-C",
        Protocol: "PD 3.0 / PPS",
        "Cable Included": "Yes, 1.8m USB-C to USB-C",
      },
    },
    {
      sku: "AW-S10",
      name: "Apple Watch Series 10",
      slug: "apple-watch-series-10",
      description: "The thinnest Apple Watch yet with advanced health features.",
      price: 129900,
      costPrice: 95000,
      categoryId: smartwatches.id,
      stockQuantity: 10,
      reorderPoint: 3,
      isFeatured: true,
      brand: "Apple",
      model: "Watch Series 10",
      specifications: {
        Display: "LTPO3 OLED, Always-on",
        "Case Size": "42mm / 46mm",
        Sensors: "Heart rate, SpO2, Temperature, ECG",
        "Water Resistance": "WR50",
        "Battery Life": "Up to 18 hours",
      },
    },
    {
      sku: "SGW-U7",
      name: "Galaxy Watch Ultra",
      slug: "galaxy-watch-ultra",
      description: "Samsung's most durable smartwatch for extreme conditions.",
      price: 159900,
      compareAtPrice: 179900,
      costPrice: 115000,
      categoryId: smartwatches.id,
      stockQuantity: 3,
      reorderPoint: 2,
      brand: "Samsung",
      model: "Galaxy Watch Ultra",
      specifications: {
        Display: "1.47\" Super AMOLED",
        Processor: "Exynos W1000",
        "Water Resistance": "10ATM + IP68",
        "Battery Life": "Up to 60 hours",
      },
    },
    {
      sku: "SPG-ULTRA",
      name: "Spigen Ultra Hybrid Case",
      slug: "spigen-ultra-hybrid-s25",
      description: "Crystal clear protection for Galaxy S25 Ultra with military-grade drop protection.",
      price: 4900,
      costPrice: 2000,
      categoryId: accessories.id,
      stockQuantity: 50,
      reorderPoint: 20,
      brand: "Spigen",
      model: "Ultra Hybrid",
      specifications: {
        Compatibility: "Galaxy S25 Ultra",
        Material: "TPU + Polycarbonate",
        "Drop Protection": "Military Grade (MIL-STD 810G)",
        Features: "Air Cushion, Anti-yellowing",
      },
    },
    {
      sku: "USBC-2M",
      name: "Anker USB-C Cable 2m",
      slug: "anker-usb-c-cable-2m",
      description: "Durable braided USB-C to USB-C cable with 100W PD support.",
      price: 2900,
      compareAtPrice: 3900,
      costPrice: 1200,
      categoryId: accessories.id,
      stockQuantity: 100,
      reorderPoint: 30,
      brand: "Anker",
      model: "A8856",
      specifications: {
        Length: "2 meters",
        "Max Power": "100W PD",
        "Data Speed": "480Mbps",
        Material: "Braided Nylon",
      },
    },
  ];

  for (const productData of products) {
    await prisma.product.create({ data: productData });
  }

  const suppliers = [
    {
      name: "MobiTech Distributors",
      contactPerson: "Amal Silva",
      email: "amal@mobitech.lk",
      phone: "+94112345678",
      address: "45 Vauxhall Street, Colombo 02",
    },
    {
      name: "DigiWorld Imports",
      contactPerson: "Priya Jayasuriya",
      email: "priya@digiworld.lk",
      phone: "+94112987654",
      address: "12 Duplication Road, Colombo 04",
    },
    {
      name: "TechHub Lanka",
      contactPerson: "Ruwan Bandara",
      email: "ruwan@techhub.lk",
      phone: "+94113456789",
      address: "78 Galle Road, Mount Lavinia",
    },
  ];

  for (const supplierData of suppliers) {
    await prisma.supplier.create({ data: supplierData });
  }

  console.log("Database seeded successfully!");
  console.log("Admin login: admin@cellcraze.lk / admin123");
  console.log("Customer login: customer@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
