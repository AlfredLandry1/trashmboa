import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { dechet_statut } from '@prisma/client';

/**
 * @swagger
 * /api/dechets:
 *   get:
 *     summary: Récupérer tous les déchets
 *     tags: [Déchets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des déchets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dechet'
 */
export const getAll = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dechets = await prisma.dechet.findMany();
  res.json(dechets);
};

/**
 * @swagger
 * /api/dechets/{id}:
 *   get:
 *     summary: Récupérer un déchet par ID
 *     tags: [Déchets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du déchet
 *     responses:
 *       200:
 *         description: Déchet trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dechet'
 *       404:
 *         description: Déchet non trouvé
 */
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dechet = await prisma.dechet.findUnique({ where: { id: Number(id) } });
  if (!dechet) {
    res.status(404).json({ message: 'Déchet non trouvé' });
    return;
  }
  res.json(dechet);
};

/**
 * @swagger
 * /api/dechets:
 *   post:
 *     summary: Créer un déchet
 *     tags: [Déchets]
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
 *               - quantite
 *               - adresse
 *               - ville
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ORGANIQUE, PLASTIQUE, PAPIER, METAL, VERRE, DANGEREUX]
 *               quantite:
 *                 type: number
 *               adresse:
 *                 type: string
 *               ville:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Déchet créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dechet'
 */
export const createDechet = async (req: Request, res: Response): Promise<void> => {
  console.log('Appel de createDechet', req.body);
  try {
    const { type, quantite, adresse, ville, latitude, longitude, photo } = req.body;

    // Validation stricte des champs obligatoires
    if (!type || !quantite || !adresse || !ville) {
      res.status(400).json({ message: 'Champs obligatoires manquants' });
      return;
    }

    // Vérification de l'utilisateur authentifié
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      res.status(401).json({ message: 'Utilisateur non authentifié' });
      return;
    }

    const data: any = {
      type,
      quantite,
      adresse,
      ville,
      latitude,
      longitude,
      statut: dechet_statut.EN_ATTENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    };
    if (photo) {
      data.photo = photo;
    }

    const dechet = await prisma.dechet.create({ data });
    res.status(201).json(dechet);
    return;
  } catch (error) {
    console.error('Erreur lors de la création du déchet :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du déchet' });
    return;
  }
};

/**
 * @swagger
 * /api/dechets/{id}:
 *   put:
 *     summary: Mettre à jour un déchet
 *     tags: [Déchets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du déchet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ORGANIQUE, PLASTIQUE, PAPIER, METAL, VERRE, DANGEREUX]
 *               quantite:
 *                 type: number
 *               adresse:
 *                 type: string
 *               ville:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, COLLECTE, TRAITE]
 *     responses:
 *       200:
 *         description: Déchet mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dechet'
 *       404:
 *         description: Déchet non trouvé
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  console.log('Appel de updateDechet', req.body);
  try {
    const { id } = req.params;
    const { type, quantite, adresse, ville, latitude, longitude, photo, statut } = req.body;

    // Vérification de l'utilisateur authentifié
    const userId = req.user?.userId;
    if (typeof userId !== 'number') {
      res.status(401).json({ message: 'Utilisateur non authentifié' });
      return;
    }

    // Construction de l'objet de mise à jour
    const data: any = {};
    if (type) data.type = type;
    if (quantite) data.quantite = quantite;
    if (adresse) data.adresse = adresse;
    if (ville) data.ville = ville;
    if (latitude) data.latitude = latitude;
    if (longitude) data.longitude = longitude;
    if (photo) data.photo = photo;
    if (statut) data.statut = statut;
    data.updatedAt = new Date();

    const dechet = await prisma.dechet.update({
      where: { id: Number(id), userId },
      data,
    });
    res.status(200).json(dechet);
    return;
  } catch (error) {
    console.error('Erreur lors de la modification du déchet :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la modification du déchet' });
    return;
  }
};

/**
 * @swagger
 * /api/dechets/{id}:
 *   delete:
 *     summary: Supprimer un déchet
 *     tags: [Déchets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du déchet
 *     responses:
 *       204:
 *         description: Déchet supprimé
 *       404:
 *         description: Déchet non trouvé
 */
export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  await prisma.dechet.delete({ where: { id: Number(id) } });
  res.status(204).send();
}; 