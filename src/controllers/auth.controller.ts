import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import { createSession, refreshSession } from '../services/session.service';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de l'utilisateur
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Mot de passe (minimum 6 caractères)
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone
 *               adresse:
 *                 type: string
 *                 description: Adresse de l'utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token d'accès JWT
 *                 refreshToken:
 *                   type: string
 *                   description: Token de rafraîchissement
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, email, password, telephone, adresse } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email déjà utilisé' });
      return;
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création utilisateur
    const user = await prisma.user.create({
      data: {
        nom,
        email,
        password: hashedPassword,
        telephone,
        adresse,
        updatedAt: new Date(),
      },
    });
    // Créer une session
    const { accessToken, refreshToken } = await createSession({ id: user.id, role: user.role });
    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nom,
        email,
        telephone,
        adresse,
        role: user.role,
      },
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token d'accès JWT
 *                 refreshToken:
 *                   type: string
 *                   description: Token de rafraîchissement
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }
    const { accessToken, refreshToken } = await createSession({ id: user.id, role: user.role });
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
        role: user.role,
      },
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie"
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  await Promise.resolve(); // pour satisfaire require-await
  res.status(200).json({ message: 'Déconnexion réussie' });
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renouveler le token d'accès
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement
 *     responses:
 *       200:
 *         description: Token d'accès renouvelé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token d'accès JWT
 *                 refreshToken:
 *                   type: string
 *                   description: Token de rafraîchissement
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Refresh token manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Refresh token invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token manquant' });
      return;
    }
    const session = await refreshSession(refreshToken);
    if (!session) {
      res.status(401).json({ message: 'Refresh token invalide ou expiré' });
      return;
    }
    res.json(session);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
