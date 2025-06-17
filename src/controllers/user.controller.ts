// src/controllers/user.controller.ts
import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { prisma } from "../config/db";
import bcrypt from "bcrypt";

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
