# Trash Mboa API

API de gestion des déchets pour la ville de Douala.

## Description

Cette API permet de gérer les signalements de déchets, les utilisateurs et l'authentification pour l'application Trash Mboa.

## Technologies utilisées

- Node.js
- TypeScript
- Express
- Prisma (PostgreSQL)
- JWT pour l'authentification
- bcrypt pour le hachage des mots de passe

## Installation

1. Cloner le repository
```bash
git clone [[url-du-repo](https://github.com/AlfredLandry1/trashmboa.git)]
cd trash-mboa-api
```

2. Installer les dépendances
```bash
pnpm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Remplir les variables dans le fichier `.env` :
```
DATABASE_URL="postgresql://user:password@localhost:5432/trash_mboa"
JWT_SECRET="votre-secret-jwt"
PORT=3000
```

4. Générer le client Prisma
```bash
npx prisma generate
```

5. Lancer les migrations
```bash
npx prisma migrate dev
```

6. Démarrer le serveur
```bash
pnpm dev
```

## Routes API

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "nom": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "telephone": "+237612345678",
  "adresse": "Douala, Akwa"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Déconnexion
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### Utilisateurs

#### Créer un utilisateur (Admin uniquement)
```http
POST /api/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "nom": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "telephone": "+237612345679",
  "adresse": "Douala, Bonanjo"
}
```

#### Obtenir les informations de l'utilisateur connecté
```http
GET /api/users/me
Authorization: Bearer <access_token>
```

#### Lister tous les utilisateurs (Admin uniquement)
```http
GET /api/users
Authorization: Bearer <access_token>
```

#### Obtenir un utilisateur
```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

#### Mettre à jour un utilisateur
```http
PUT /api/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "nom": "Nouveau Nom",
  "email": "nouveau@email.com",
  "password": "nouveaumotdepasse",
  "telephone": "237612345678",
  "adresse": "Nouvelle adresse",
  "photoUrl": "https://example.com/photo.jpg"
}
```

#### Supprimer un utilisateur (Admin uniquement)
```http
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

### Signalements

#### Créer un signalement
```http
POST /api/signalements
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "description": "Déchets ménagers non collectés",
  "localisation": "Douala, Akwa",
  "type": "MENAGER",
  "urgence": "MOYENNE"
}
```

#### Lister les signalements
```http
GET /api/signalements
Authorization: Bearer <access_token>
```

#### Obtenir un signalement
```http
GET /api/signalements/:id
Authorization: Bearer <access_token>
```

#### Mettre à jour un signalement
```http
PUT /api/signalements/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "statut": "EN_COURS"
}
```

#### Supprimer un signalement
```http
DELETE /api/signalements/:id
Authorization: Bearer <access_token>
```

### Déchets

#### Créer un déchet
```http
POST /api/dechets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "PLASTIQUE",
  "quantite": 2.5,
  "adresse": "Douala, Akwa",
  "ville": "Douala"
}
```

#### Lister les déchets
```http
GET /api/dechets
Authorization: Bearer <access_token>
```

#### Obtenir un déchet
```http
GET /api/dechets/:id
Authorization: Bearer <access_token>
```

#### Mettre à jour un déchet
```http
PUT /api/dechets/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "statut": "COLLECTE"
}
```

#### Supprimer un déchet
```http
DELETE /api/dechets/:id
Authorization: Bearer <access_token>
```

### Collectes (Collecteur uniquement)

#### Voir les déchets en attente
```http
GET /api/collectes/a-faire
Authorization: Bearer <access_token>
```

Réponse :
```json
[
  {
    "id": 1,
    "type": "PLASTIQUE",
    "quantite": 2.5,
    "adresse": "Douala, Akwa",
    "ville": "Douala",
    "statut": "EN_ATTENTE",
    "createdAt": "2024-03-17T10:00:00Z",
    "user": {
      "nom": "John Doe",
      "telephone": "+237612345678",
      "adresse": "Douala, Akwa"
    }
  }
]
```

#### Valider une collecte
```http
POST /api/collectes/:id/valider
Authorization: Bearer <access_token>
```

Réponse :
```json
{
  "message": "Collecte validée avec succès",
  "dechet": {
    "id": 1,
    "type": "PLASTIQUE",
    "quantite": 2.5,
    "adresse": "Douala, Akwa",
    "ville": "Douala",
    "statut": "COLLECTE",
    "createdAt": "2024-03-17T10:00:00Z",
    "user": {
      "nom": "John Doe",
      "telephone": "+237612345678",
      "adresse": "Douala, Akwa"
    }
  }
}
```

### Statistiques (Admin uniquement)

#### Tableau de bord
```http
GET /api/stats/dashboard
Authorization: Bearer <access_token>
```

Réponse :
```json
{
  "totalUsers": 100,
  "totalDechets": 500,
  "totalSignalements": 200
}
```

#### Statistiques des déchets
```http
GET /api/stats/dechets
Authorization: Bearer <access_token>
```

Réponse :
```json
{
  "parType": [
    { "type": "PLASTIQUE", "_count": 150 },
    { "type": "PAPIER", "_count": 100 }
  ],
  "parStatut": [
    { "statut": "EN_ATTENTE", "_count": 200 },
    { "statut": "COLLECTE", "_count": 150 }
  ]
}
```

#### Statistiques des signalements
```http
GET /api/stats/signalements
Authorization: Bearer <access_token>
```

Réponse :
```json
{
  "parType": [
    { "type": "MENAGER", "_count": 80 },
    { "type": "DANGEREUX", "_count": 20 }
  ],
  "parStatut": [
    { "status": "en_attente", "_count": 100 },
    { "status": "en_cours", "_count": 50 }
  ]
}
```

### Géolocalisation

#### Obtenir les déchets et signalements à proximité
- **Route:** `GET /api/geo/proximite`
- **Headers requis:**
  - `Authorization: Bearer <access_token>`
- **Paramètres de requête:**
  - `latitude` (obligatoire): Latitude de la position
  - `longitude` (obligatoire): Longitude de la position
  - `rayon` (optionnel, défaut: 5): Rayon de recherche en kilomètres
  - `type` (optionnel, défaut: 'all'): Type de résultats ('dechets', 'signalements', 'all')
- **Exemple de réponse:**
```json
{
  "dechets": [
    {
      "id": 1,
      "type": "PLASTIQUE",
      "quantite": 2,
      "description": "Bouteilles en plastique",
      "statut": "EN_ATTENTE",
      "latitude": 4.0511,
      "longitude": 9.7679,
      "distance": 0.5,
      "utilisateur": {
        "id": 1,
        "nom": "John Doe",
        "telephone": "237612345678",
        "adresse": "Douala, Akwa"
      }
    }
  ],
  "signalements": [
    {
      "id": 1,
      "type": "DECHET_SAUVAGE",
      "description": "Déchets abandonnés",
      "statut": "EN_ATTENTE",
      "latitude": 4.0512,
      "longitude": 9.7680,
      "distance": 0.7,
      "utilisateur": {
        "id": 1,
        "nom": "John Doe",
        "telephone": "237612345678",
        "adresse": "Douala, Akwa"
      }
    }
  ]
}
```

### Historique

#### Obtenir l'historique des actions
- **Route:** `GET /api/historique`
- **Headers requis:**
  - `Authorization: Bearer <access_token>`
- **Paramètres de requête:**
  - `type` (optionnel): Type d'action ('DECHET' ou 'SIGNALEMENT')
  - `startDate` (optionnel): Date de début (format: YYYY-MM-DD)
  - `endDate` (optionnel): Date de fin (format: YYYY-MM-DD)
- **Exemple de réponse:**
```json
{
  "total": 2,
  "historique": [
    {
      "type": "DECHET",
      "action": "EN_ATTENTE",
      "details": {
        "typeDechet": "PLASTIQUE",
        "quantite": 2.5
      },
      "date": "2024-03-17T10:00:00Z"
    },
    {
      "type": "SIGNALEMENT",
      "action": "en_attente",
      "details": {
        "typeSignalement": "DECHET_SAUVAGE"
      },
      "date": "2024-03-17T09:30:00Z"
    }
  ]
}
```

## Collection Postman

Importez la collection suivante dans Postman pour tester l'API :

```json
{
  "info": {
    "name": "Trash Mboa API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nom\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"telephone\": \"+237612345678\",\n  \"adresse\": \"Douala, Akwa\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/logout",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/users/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/users",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Get User by ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/users/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Update User",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/api/users/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nom\": \"Nouveau Nom\",\n  \"email\": \"nouveau@email.com\",\n  \"password\": \"nouveaumotdepasse\",\n  \"telephone\": \"237612345678\",\n  \"adresse\": \"Nouvelle adresse\",\n  \"photoUrl\": \"https://example.com/photo.jpg\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Delete User",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/api/users/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Dechets",
      "item": [
        {
          "name": "Create Dechet",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/dechets",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"PLASTIQUE\",\n  \"quantite\": 2.5,\n  \"adresse\": \"Douala, Akwa\",\n  \"ville\": \"Douala\",\n  \"latitude\": 4.0511,\n  \"longitude\": 9.7679\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Get All Dechets",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/dechets",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Get Dechet by ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/dechets/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Update Dechet",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/api/dechets/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"statut\": \"COLLECTE\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Delete Dechet",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/api/dechets/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Signalements",
      "item": [
        {
          "name": "Create Signalement",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/signalements",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"DECHET_SAUVAGE\",\n  \"latitude\": 4.0511,\n  \"longitude\": 9.7679,\n  \"description\": \"Déchets abandonnés\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Get All Signalements",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/signalements",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Get Signalement by ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/signalements/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Update Signalement",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/api/signalements/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"en_cours\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Delete Signalement",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/api/signalements/:id",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Collectes",
      "item": [
        {
          "name": "Get Collectes à Faire",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/collectes/a-faire",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Valider Collecte",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/collectes/:id/valider",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Stats",
      "item": [
        {
          "name": "Get Dashboard Stats",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/stats/dashboard",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Get Dechets Stats",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/stats/dechets",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        },
        {
          "name": "Get Signalements Stats",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/stats/signalements",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Geo",
      "item": [
        {
          "name": "Get Proximite",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/geo/proximite",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "query": [
              {
                "key": "latitude",
                "value": "4.0511"
              },
              {
                "key": "longitude",
                "value": "9.7679"
              },
              {
                "key": "rayon",
                "value": "5"
              },
              {
                "key": "type",
                "value": "all"
              }
            ]
          }
        }
      ]
    },
    {
      "name": "Historique",
      "item": [
        {
          "name": "Get Historique",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/historique",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "query": [
              {
                "key": "type",
                "value": "DECHET"
              },
              {
                "key": "startDate",
                "value": "2024-03-01"
              },
              {
                "key": "endDate",
                "value": "2024-03-17"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

## Variables d'environnement Postman

Créez les variables suivantes dans votre environnement Postman :
- `base_url`: http://localhost:3000
- `access_token`: Le token JWT reçu lors de la connexion

## Sécurité

- Les mots de passe sont hachés avec bcrypt
- L'authentification utilise JWT avec des tokens d'accès et de rafraîchissement
- Les routes sensibles sont protégées par des middlewares d'authentification et d'autorisation
- Les données sensibles sont validées avant traitement

## Structure du projet

```
src/
├── config/         # Configuration (DB, env)
├── controllers/    # Contrôleurs
├── middlewares/    # Middlewares (auth, validation)
├── routes/         # Routes API
├── services/       # Services métier
└── prisma/         # Schéma et migrations Prisma
```
