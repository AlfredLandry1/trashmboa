import { Request, Response } from "express";
import { prisma } from "../config/db";
import { StatutDechet } from "@prisma/client";

export const getCollectesAFaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const dechets = await prisma.dechet.findMany({
      where: {
        statut: StatutDechet.EN_ATTENTE
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
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const validerCollecte = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dechetId = parseInt(id);

    if (isNaN(dechetId)) {
      res.status(400).json({ message: "ID de déchet invalide" });
      return;
    }

    const dechet = await prisma.dechet.update({
      where: { id: dechetId },
      data: {
        statut: StatutDechet.COLLECTE
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
      res.status(404).json({ message: "Déchet non trouvé" });
      return;
    }

    res.json({
      message: "Collecte validée avec succès",
      dechet
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}; 