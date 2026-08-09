import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['MONGO_URI'];

/**
 * Validates that all required environment variables exist at boot time.
 * Exits with code 1 and a clear error message if any variable is missing.
 */
export function validateEnv() {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('====================================================');
    console.error('CRITICAL ERROR: Missing Required Environment Variables');
    console.error('The following required environment variable(s) are missing:');
    missing.forEach((v) => console.error(`  - ${v}`));
    console.error('Please define them in your server/.env file.');
    console.error('====================================================');
    process.exit(1);
  }
}

validateEnv();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};

export default env;
