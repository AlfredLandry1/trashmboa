import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

interface JWTConfig {
  secret: string;
  accessTokenExpiry: SignOptions['expiresIn'];
  refreshTokenExpiry: SignOptions['expiresIn'];
}

interface DBConfig {
  url: string | undefined;
}

interface ServerConfig {
  port: number;
}

interface Config {
  jwt: JWTConfig;
  db: DBConfig;
  server: ServerConfig;
}

export const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
}; 