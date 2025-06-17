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
          "name": "Create User",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/users",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nom\": \"Jane Doe\",\n  \"email\": \"jane@example.com\",\n  \"password\": \"password123\",\n  \"telephone\": \"+237612345679\",\n  \"adresse\": \"Douala, Bonanjo\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
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
              "raw": "{\n  \"type\": \"MENAGER\",\n  \"latitude\": 4.0511,\n  \"longitude\": 9.7679,\n  \"description\": \"Déchets ménagers non collectés\"\n}",
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
              "raw": "{\n  \"type\": \"PLASTIQUE\",\n  \"quantite\": 2.5,\n  \"adresse\": \"Douala, Akwa\",\n  \"ville\": \"Douala\"\n}",
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
