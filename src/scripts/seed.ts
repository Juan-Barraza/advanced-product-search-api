import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

const INDEX_NAME = 'products';

const mockProducts = [
  {
    id: '1',
    name: 'Zapatos Deportivos Running Pro',
    description: 'Tenis ligeros y cómodos para correr maratones',
    category: 'Calzado',
    subcategory: 'Deporte',
    price: 89.99,
    location: 'Bogotá',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Zapatos Formales de Cuero',
    description: 'Zapatos elegantes para eventos y oficina',
    category: 'Calzado',
    subcategory: 'Formal',
    price: 120.0,
    location: 'Medellín',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Laptop Gamer Pro RTX',
    description: 'Potente computadora portátil para gaming y desarrollo',
    category: 'Tecnología',
    subcategory: 'Computadores',
    price: 1250.0,
    location: 'Bogotá',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Silla Ergonómica Premium',
    description: 'Silla de oficina con soporte lumbar ajustable',
    category: 'Hogar',
    subcategory: 'Muebles',
    price: 199.5,
    location: 'Cali',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Camiseta de Algodón Orgánico',
    description: 'Ropa cómoda y sostenible de alta durabilidad',
    category: 'Ropa',
    subcategory: 'Casual',
    price: 25.0,
    location: 'Medellín',
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('Iniciando Seeding en Elasticsearch...');
  const exists = await esClient.indices.exists({ index: INDEX_NAME });
  if (exists) {
    await esClient.indices.delete({ index: INDEX_NAME });
    console.log(`Índice '${INDEX_NAME}' viejo eliminado.`);
  }

  await esClient.indices.create({
    index: INDEX_NAME,
    mappings: {
      properties: {
        id: { type: 'keyword' },
        name: { type: 'text' },
        description: { type: 'text' },
        category: { type: 'keyword' },
        subcategory: { type: 'keyword' },
        price: { type: 'float' },
        location: { type: 'keyword' },
        createdAt: { type: 'date' },
      },
    },
  });
  console.log(`Índice '${INDEX_NAME}' creado con sus Mappings.`);

  for (const product of mockProducts) {
    await esClient.index({
      index: INDEX_NAME,
      id: product.id,
      document: product,
    });
  }

  await esClient.indices.refresh({ index: INDEX_NAME });
  console.log(
    `¡Seeding exitoso! Se insertaron ${mockProducts.length} productos.`,
  );
}

seed().catch((err) => {
  console.error('Error en el proceso de seeding:', err);
});
