import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

interface TokenPayload {
  userId: number;
  role: string;
}

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export const createSession = async (user: { id: number; role: string }): Promise<SessionTokens> => {
  await Promise.resolve(); // pour satisfaire require-await
  const payload: TokenPayload = { userId: user.id, role: user.role };

  const signOptions: SignOptions = {
    expiresIn: config.jwt.accessTokenExpiry
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, signOptions);
  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    ...signOptions,
    expiresIn: config.jwt.refreshTokenExpiry
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const validateSession = async (token: string): Promise<TokenPayload | null> => {
  await Promise.resolve(); // pour satisfaire require-await
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const refreshSession = async (refreshToken: string): Promise<SessionTokens | null> => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as TokenPayload;
    
    // Créer une nouvelle session avec les mêmes informations
    return await createSession({
      id: decoded.userId,
      role: decoded.role,
    });
  } catch (error) {
    console.error('Erreur de rafraîchissement de session:', error);
    return null;
  }
}; 