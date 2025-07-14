import { Request, Response } from 'express';
import { prisma } from '../config/db';

/**
 * @swagger
 * tags:
 *   name: Signalements
 *   description: Gestion des signalements de déchets
 */

/**
 * @swagger
 * /api/signalements:
 *   post:
 *     summary: Créer un signalement
 *     tags: [Signalements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - latitude
 *               - longitude
 *             properties:
 *               type:
 *                 type: string
 *                 example: DECHET_SAUVAGE
 *               latitude:
 *                 type: number
 *                 example: 4.05
 *               longitude:
 *                 type: number
 *                 example: 9.76
 *               description:
 *                 type: string
 *                 example: Tas de déchets abandonnés
 *               photo:
 *                 type: string
 *                 example: https://res.cloudinary.com/ton-cloud/image/upload/v.../photo.jpg
 *     responses:
 *       201:
 *         description: Signalement créé
 *       400:
 *         description: Champs obligatoires manquants
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
export const createSignalement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, latitude, longitude, description, photo } = req.body;
    if (!type || !latitude || !longitude) {
      res.status(400).json({ message: 'Champs obligatoires manquants' });
      return;
    }
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      res.status(401).json({ message: 'Utilisateur non authentifié' });
      return;
    }
    const data: any = { type, latitude, longitude, userId };
    if (description) data.description = description;
    if (photo) data.photo = photo;
    const signalement = await prisma.signalement.create({ data });
    res.status(201).json(signalement);
  } catch (error) {
    console.error('Erreur lors de la création du signalement :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du signalement' });
  }
};

/**
 * @swagger
 * /api/signalements:
 *   get:
 *     summary: Lister tous les signalements
 *     tags: [Signalements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des signalements
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
export const getAllSignalements = async (req: Request, res: Response): Promise<void> => {
  try {
    const signalements = await prisma.signalement.findMany();
    res.json(signalements);
  } catch (error) {
    console.error('Erreur lors de la récupération des signalements :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des signalements' });
  }
};

/**
 * @swagger
 * /api/signalements/{id}:
 *   get:
 *     summary: Obtenir un signalement par ID
 *     tags: [Signalements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Signalement trouvé
 *       404:
 *         description: Signalement non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
export const getSignalementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const signalement = await prisma.signalement.findUnique({ where: { id: Number(id) } });
    if (!signalement) {
      res.status(404).json({ message: 'Signalement non trouvé' });
      return;
    }
    res.json(signalement);
  } catch (error) {
    console.error('Erreur lors de la récupération du signalement :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du signalement' });
  }
};

/**
 * @swagger
 * /api/signalements/{id}:
 *   put:
 *     summary: Mettre à jour un signalement
 *     tags: [Signalements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               description:
 *                 type: string
 *               photo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signalement mis à jour
 *       404:
 *         description: Signalement non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
export const updateSignalement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, latitude, longitude, description, photo, status } = req.body;
    const data: any = {};
    if (type) data.type = type;
    if (latitude) data.latitude = latitude;
    if (longitude) data.longitude = longitude;
    if (description) data.description = description;
    if (photo) data.photo = photo;
    if (status) data.status = status;
    const signalement = await prisma.signalement.update({ where: { id: Number(id) }, data });
    res.json(signalement);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du signalement :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du signalement' });
  }
};

/**
 * @swagger
 * /api/signalements/{id}:
 *   delete:
 *     summary: Supprimer un signalement
 *     tags: [Signalements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Signalement supprimé
 *       404:
 *         description: Signalement non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
export const deleteSignalement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.signalement.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du signalement :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du signalement' });
  }
}; 