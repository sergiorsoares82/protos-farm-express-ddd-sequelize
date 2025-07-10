import dotenv from 'dotenv';

dotenv.config({
  path: '.env', // Specify the path to your .env file
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

const dbEnvironmentVariables = {
  POSTGRES_DB: requireEnvVar('POSTGRES_DB'),
  POSTGRES_USER: requireEnvVar('POSTGRES_USER'),
  POSTGRES_PASSWORD: requireEnvVar('POSTGRES_PASSWORD'),
  POSTGRES_HOST: requireEnvVar('POSTGRES_HOST'),
  POSTGRES_DIALECT: requireEnvVar('POSTGRES_DIALECT'),
  POSTGRES_PORT: requireEnvVar('POSTGRES_PORT')
    ? Number(requireEnvVar('POSTGRES_PORT'))
    : 5433,
};
export default dbEnvironmentVariables;
