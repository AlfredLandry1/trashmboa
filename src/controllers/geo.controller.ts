import { Request, Response } from 'express';
import { prisma } from '../config/db';

// Fonction utilitaire pour calculer la distance en km entre deux points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const getProximite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, rayon = 5, type = 'all' } = req.query;
    
    if (!latitude || !longitude) {
      res.status(400).json({ message: 'Latitude et longitude requises' });
      return;
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const radius = parseFloat(rayon as string);

    if (isNaN(lat) || isNaN(lon) || isNaN(radius)) {
      res.status(400).json({ message: 'Paramètres invalides' });
      return;
    }

    // Récupérer les signalements
    const signalements = await prisma.signalement.findMany({
      where: {
        status: 'en_attente'
      },
      include: {
        user: {
          select: {
            nom: true,
            telephone: true
          }
        }
      }
    });

    // Récupérer les déchets
    const dechets = await prisma.dechet.findMany({
      where: {
        statut: 'EN_ATTENTE'
      },
      select: {
        id: true,
        type: true,
        quantite: true,
        adresse: true,
        ville: true,
        statut: true,
        latitude: true,
        longitude: true,
        user: {
          select: {
            nom: true,
            telephone: true
          }
        }
      }
    });

    // Filtrer par distance
    const signalementsProches = signalements
      .map(s => ({
        ...s,
        distance: calculateDistance(lat, lon, s.latitude, s.longitude)
      }))
      .filter(s => s.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const dechetsProches = dechets
      .map(d => ({
        ...d,
        distance: calculateDistance(lat, lon, d.latitude || 0, d.longitude || 0)
      }))
      .filter(d => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Retourner les résultats selon le type demandé
    let result;
    switch (type) {
      case 'signalements':
        result = { signalements: signalementsProches };
        break;
      case 'dechets':
        result = { dechets: dechetsProches };
        break;
      default:
        result = {
          signalements: signalementsProches,
          dechets: dechetsProches
        };
    }

    res.json({
      position: { latitude: lat, longitude: lon },
      rayon: radius,
      ...result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 