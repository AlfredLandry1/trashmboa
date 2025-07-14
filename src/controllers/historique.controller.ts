import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getHistorique = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { type, startDate, endDate } = req.query;

    // Construire la condition de date si fournie
    const dateCondition = startDate && endDate ? {
      createdAt: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    } : {};

    // Récupérer l'historique des déchets
    const dechets = await prisma.dechet.findMany({
      where: {
        userId,
        ...dateCondition
      },
      select: {
        id: true,
        type: true,
        quantite: true,
        statut: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Récupérer l'historique des signalements
    const signalements = await prisma.signalement.findMany({
      where: {
        userId,
        ...dateCondition
      },
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Formater les résultats
    const historique = [
      ...dechets.map(d => ({
        type: 'DECHET',
        action: d.statut,
        details: {
          typeDechet: d.type,
          quantite: d.quantite
        },
        date: d.createdAt
      })),
      ...signalements.map(s => ({
        type: 'SIGNALEMENT',
        action: s.status,
        details: {
          typeSignalement: s.type
        },
        date: s.createdAt
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Filtrer par type si spécifié
    const resultatFiltre = type && typeof type === 'string'
      ? historique.filter(h => h.type === type.toUpperCase())
      : historique;

    res.json({
      total: resultatFiltre.length,
      historique: resultatFiltre
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 