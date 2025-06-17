import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { createSession } from "../services/session.service";

// Inscription
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

// Connexion
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

// Déconnexion
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
