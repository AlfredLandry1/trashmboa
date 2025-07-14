# Documentation Swagger - Trash Mboa API

## Routes principales
- Authentification : `/api/auth/login`, `/api/auth/register`
- Utilisateurs : `/api/users`, `/api/users/me`, `/api/users/change-password`
- Déchets : `/api/dechets`, `/api/dechets/{id}`
- Collectes : `/api/collectes`, `/api/collectes/en-attente`, `/api/collectes/{id}/valider`
- Signalements : `/api/signalements`, `/api/signalements/{id}`
- Proximité : `/api/geo/proximite?latitude=...&longitude=...&rayon=5&type=dechets`

## Paramètres de la route de proximité
- `latitude` (obligatoire)
- `longitude` (obligatoire)
- `rayon` (optionnel, défaut 5)
- `type` (optionnel, valeurs : `all`, `dechets`, `signalements`)

## Statuts possibles pour un signalement
- `en_attente` : signalement en attente de traitement
- `resolu` ou `traite` : signalement résolu

## Statuts HTTP
Voir le README principal pour le tableau complet.

---

Consultez `/api-docs` pour la documentation interactive complète générée automatiquement.

## 📋 Fonctionnalités disponibles

### Interface Swagger UI
- **Interface interactive** : Testez directement vos API depuis le navigateur
- **Authentification** : Support JWT Bearer Token
- **Validation** : Validation automatique des requêtes et réponses
- **Exemples** : Exemples de requêtes et réponses pour chaque endpoint

### Endpoints documentés

#### 🔐 Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur
- `POST /api/auth/logout` - Déconnexion d'un utilisateur

#### 👥 Utilisateurs
- `GET /api/users` - Récupérer tous les utilisateurs
- `POST /api/users` - Créer un nouvel utilisateur
- `GET /api/users/{id}` - Récupérer un utilisateur par ID
- `PUT /api/users/{id}` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur
- `GET /api/users/me` - Récupérer le profil de l'utilisateur connecté

#### 🗑️ Collectes
- `GET /api/collectes/en-attente` - Récupérer les collectes en attente
- `PUT /api/collectes/{id}/valider` - Valider une collecte

## 🔑 Authentification

Pour tester les endpoints protégés :

1. Connectez-vous via `POST /api/auth/login`
2. Copiez le `accessToken` de la réponse
3. Cliquez sur le bouton "Authorize" en haut de la page Swagger
4. Entrez `Bearer <votre_token>` dans le champ
5. Cliquez sur "Authorize"

## 📊 Spécification OpenAPI

La spécification OpenAPI complète est disponible au format JSON à l'adresse :
`http://localhost:3000/api-docs.json`

## 🛠️ Configuration

La configuration Swagger se trouve dans `src/config/swagger.ts` et inclut :

- **Informations de base** : Titre, version, description
- **Serveurs** : URLs de développement et production
- **Schémas** : Définitions des modèles de données
- **Sécurité** : Configuration JWT Bearer Token

## 📝 Ajouter de la documentation

Pour documenter un nouvel endpoint, ajoutez des commentaires JSDoc dans le contrôleur :

```typescript
/**
 * @swagger
 * /api/nouveau-endpoint:
 *   get:
 *     summary: Description de l'endpoint
 *     tags: [Nom du tag]
 *     responses:
 *       200:
 *         description: Succès
 */
export const nouveauEndpoint = async (req: Request, res: Response) => {
  // Votre code ici
};
```

## 🎨 Personnalisation

L'interface Swagger UI peut être personnalisée dans `src/app.ts` :

- **CSS personnalisé** : Modifier l'apparence
- **Options Swagger** : Configurer les fonctionnalités
- **Titre personnalisé** : Changer le titre de la page

## 🔍 Débogage

Si la documentation ne s'affiche pas correctement :

1. Vérifiez que le serveur est démarré
2. Vérifiez les logs pour les erreurs de parsing JSDoc
3. Assurez-vous que les chemins dans `swagger.ts` sont corrects
4. Vérifiez la syntaxe des commentaires JSDoc

## 📚 Ressources

- [Documentation Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Spécification OpenAPI 3.0](https://swagger.io/specification/)
- [JSDoc pour Swagger](https://github.com/Surnet/swagger-jsdoc) 