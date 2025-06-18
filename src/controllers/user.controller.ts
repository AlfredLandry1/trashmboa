// src/controllers/user.controller.ts
import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { prisma } from "../config/db";
import bcrypt from "bcrypt";

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
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
 *                 description: Mot de passe
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone
 *               adresse:
 *                 type: string
 *                 description: Adresse de l'utilisateur
 *               photoUrl:
 *                 type: string
 *                 description: URL de la photo de profil
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, email, password, telephone, adresse, photoUrl } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nom,
        email,
        password: hashedPassword,
        telephone,
        adresse,
        photoUrl: photoUrl || "https://www.gravatar.com/avatar/?d=identicon",
      },
    });

    res.status(201).json({
      id: user.id,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      adresse: user.adresse,
      photoUrl: user.photoUrl,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        adresse: true,
        photoUrl: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
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
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        adresse: true,
        photoUrl: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                 description: Nouveau mot de passe
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone
 *               adresse:
 *                 type: string
 *                 description: Adresse de l'utilisateur
 *               photoUrl:
 *                 type: string
 *                 description: URL de la photo de profil
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nom, email, password, telephone, adresse, photoUrl } = req.body;

    const updateData: any = {};
    if (nom) updateData.nom = nom;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (telephone) updateData.telephone = telephone;
    if (adresse) updateData.adresse = adresse;
    if (photoUrl) updateData.photoUrl = photoUrl;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({
      id: user.id,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      adresse: user.adresse,
      photoUrl: user.photoUrl,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès
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
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
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
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nom: true,
        email: true,
        telephone: true,
        adresse: true,
        photoUrl: true,
        role: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
