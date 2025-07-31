import dotenv from 'dotenv';
import path from 'node:path';
import { SequelizeOptions } from 'sequelize-typescript';
import pg from 'pg'; // Import pg for PostgreSQL dialect support

// Determine the correct .env file based on NODE_ENV
const envFile = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;
const envPath = path.resolve(process.cwd(), envFile);

dotenv.config({
  path: envPath, // Specify the path to your .env file
  override: true, // Override existing environment variables
  debug: false, // Set to true to see debug messages
}); // Load environment variables from .env file

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

let sequelizeOptions: SequelizeOptions;

const dialect = requireEnvVar(
  'POSTGRES_DIALECT',
) as SequelizeOptions['dialect'];

if (dialect === 'sqlite') {
  sequelizeOptions = {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || ':memory:',
    logging: () => {}, // Disable logging for SQLite
  };
} else if (dialect === 'postgres') {
  sequelizeOptions = {
    dialect: 'postgres',
    dialectModule: pg,
    host: requireEnvVar('POSTGRES_HOST'),
    port: Number(process.env.POSTGRES_PORT || '5432'),
    database: requireEnvVar('POSTGRES_DB'),
    username: requireEnvVar('POSTGRES_USER'),
    password: requireEnvVar('POSTGRES_PASSWORD'),
    logging: true,
  };
} else {
  throw new Error(`Unsupported database dialect: ${dialect}`);
}

export default sequelizeOptions;
