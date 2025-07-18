// src/infra/database/migrator/create-migration.ts

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (!args[0]) {
  console.error('Please provide a name for the migration.');
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-T:Z.]/g, '')
  .slice(0, 14);
const fileName = `${timestamp}-${args[0]}.ts`;

// CORREÇÃO AQUI 👇 — suba 1 pasta, depois vá para migrations
const migrationsDir = path.resolve(__dirname, '../migrations');
fs.mkdirSync(migrationsDir, { recursive: true }); // garante que o diretório existe

const filePath = path.join(migrationsDir, fileName);

const template = `import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // TODO: implement migration
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // TODO: undo migration
}
`;

fs.writeFileSync(filePath, template);
console.log('✅ Migration created at:', filePath);
