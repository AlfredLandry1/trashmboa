import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import statsRoutes from './routes/stats.routes';
import collecteRoutes from './routes/collecte.routes';
import geoRoutes from './routes/geo.routes';

const app = express();

// Middlewares de sécurité
app.use(helmet()); // Protection des en-têtes HTTP
app.use(cors()); // Configuration CORS
app.use(express.json()); // Parsing du JSON

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/collectes', collecteRoutes);
app.use('/api/geo', geoRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

export default app;
