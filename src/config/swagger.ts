import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trash Mboa API',
      version: '1.0.0',
      description: 'API pour la gestion des déchets à Douala',
      contact: {
        name: 'Support API',
        email: 'alfredlandrytalom2004@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.trashmboa.com',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            nom: { type: 'string' },
            prenom: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'COLLECTOR'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Collecte: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['ORGANIQUE', 'PLASTIQUE', 'PAPIER', 'METAL', 'VERRE'] },
            quantite: { type: 'number' },
            adresse: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            statut: { type: 'string', enum: ['EN_ATTENTE', 'EN_COURS', 'TERMINEE'] },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'number' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'] // Chemins vers les fichiers contenant les annotations JSDoc
};

export const specs = swaggerJsdoc(options); 