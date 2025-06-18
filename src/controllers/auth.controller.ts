import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { createSession } from "../services/session.service";

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
      res.status(400).json({ message: "Email déjà utilisé" });
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
      },
    });

    // Créer une session
    const { accessToken, refreshToken } = await createSession(user);

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
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
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

    // Trouver utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Créer une session
    const { accessToken, refreshToken } = await createSession(user);

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
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
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
  try {
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
