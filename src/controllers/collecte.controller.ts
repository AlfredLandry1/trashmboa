import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { dechet_statut } from '@prisma/client';

/**
 * @swagger
 * /api/collectes/en-attente:
 *   get:
 *     summary: Récupérer les collectes en attente
 *     tags: [Collectes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des collectes en attente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *                     enum: [ORGANIQUE, PLASTIQUE, PAPIER, METAL, VERRE]
 *                   quantite:
 *                     type: number
 *                   adresse:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   statut:
 *                     type: string
 *                     enum: [EN_ATTENTE, EN_COURS, TERMINEE]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       nom:
 *                         type: string
 *                       telephone:
 *                         type: string
 *                       adresse:
 *                         type: string
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
export const getCollectesAFaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const dechets = await prisma.dechet.findMany({
      where: {
        statut: dechet_statut.EN_ATTENTE
      },
      include: {
        user: {
          select: {
            nom: true,
            telephone: true,
            adresse: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(dechets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @swagger
 * /api/collectes/{id}/valider:
 *   put:
 *     summary: Valider une collecte
 *     tags: [Collectes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la collecte à valider
 *     responses:
 *       200:
 *         description: Collecte validée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Collecte validée avec succès"
 *                 dechet:
 *                   $ref: '#/components/schemas/Collecte'
 *       400:
 *         description: ID de déchet invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Déchet non trouvé
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
export const validerCollecte = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dechetId = parseInt(id);

    if (isNaN(dechetId)) {
      res.status(400).json({ message: 'ID de déchet invalide' });
      return;
    }

    const dechet = await prisma.dechet.update({
      where: { id: dechetId },
      data: {
        statut: dechet_statut.COLLECTE
      },
      include: {
        user: {
          select: {
            nom: true,
            telephone: true,
            adresse: true
          }
        }
      }
    });

    if (!dechet) {
      res.status(404).json({ message: 'Déchet non trouvé' });
      return;
    }

    res.json({
      message: 'Collecte validée avec succès',
      dechet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @swagger
 * /api/collectes:
 *   get:
 *     summary: Récupérer toutes les collectes (avec filtrage optionnel par statut)
 *     tags: [Collectes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [EN_ATTENTE, EN_COURS, TERMINEE]
 *         required: false
 *         description: Statut de la collecte à filtrer
 *     responses:
 *       200:
 *         description: Liste des collectes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collecte'
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
export const getAllCollectes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const whereClause: any = {};
    if (status) {
      whereClause.statut = status;
    }
    const collectes = await prisma.dechet.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            nom: true,
            telephone: true,
            adresse: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(collectes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 