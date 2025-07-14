import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalDechets, totalSignalements] = await Promise.all([
      prisma.user.count(),
      prisma.dechet.count(),
      prisma.signalement.count()
    ]);

    res.json({
      totalUsers,
      totalDechets,
      totalSignalements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getDechetsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const statsByType = await prisma.dechet.groupBy({
      by: ['type'],
      _count: true
    });

    const statsByStatus = await prisma.dechet.groupBy({
      by: ['statut'],
      _count: true
    });

    res.json({
      parType: statsByType,
      parStatut: statsByStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getSignalementsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const statsByType = await prisma.signalement.groupBy({
      by: ['type'],
      _count: true
    });

    const statsByStatus = await prisma.signalement.groupBy({
      by: ['status'],
      _count: true
    });

    res.json({
      parType: statsByType,
      parStatut: statsByStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 