# 🎨 Éditeur d'Images IA

Application Next.js pour transformer des images avec l'intelligence artificielle en utilisant **Replicate** et Supabase.

## 🚀 Technologies utilisées

- **Next.js 14** avec TypeScript
- **Supabase** pour le stockage d'images et la base de données
- **Replicate** pour la transformation d'images avec IA
- **InstructPix2Pix** - Modèle IA pour éditer des images selon des instructions textuelles

## 📋 Prérequis

- Node.js 18+ installé
- Un compte Supabase avec :
  - Deux buckets de stockage : `input-images` et `output-images`
  - Une table `projects` configurée
- Un compte Replicate avec un API Token (voir https://replicate.com)

## 🔧 Configuration Supabase

### 1. Créer les buckets de stockage

Dans votre projet Supabase, créez deux buckets publics :
- `input-images` (pour les images uploadées)
- `output-images` (pour les images générées)

### 2. Créer la table projects

Exécutez cette requête SQL dans Supabase :

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  input_image_url TEXT NOT NULL,
  output_image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Activer Row Level Security (optionnel)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion (optionnel)
CREATE POLICY "Enable insert for all users" ON projects
  FOR INSERT WITH CHECK (true);

-- Créer une politique pour permettre la lecture (optionnel)
CREATE POLICY "Enable read for all users" ON projects
  FOR SELECT USING (true);
```

## 📦 Installation

1. **Installer les dépendances :**

```bash
npm install
```

2. **Obtenir votre token Replicate**

- Allez sur https://replicate.com/account/api-tokens
- Créez un API token
- Ajoutez-le dans `.env.local`

3. **Configurer le fichier `.env.local`**

Créez un fichier `.env.local` à la racine avec :
- URL et clés Supabase
- Token Replicate API
- Noms des buckets de stockage

## 🎯 Utilisation

⚠️ **Avant de lancer, assurez-vous d'avoir configuré votre token Replicate dans `.env.local`**

1. **Démarrer le serveur de développement :**

```bash
npm run dev
```

2. **Ouvrir l'application :**

Allez sur [http://localhost:3000](http://localhost:3000)

3. **Utiliser l'éditeur :**
   - Uploadez une image
   - Entrez un prompt de transformation (ex: "Transforme cette image en style cartoon")
   - Cliquez sur "Générer"
   - Attendez la génération (peut prendre quelques secondes)
   - Téléchargez l'image générée

## 📁 Structure du projet

```
/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API pour transformer les images avec InstructPix2Pix
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil avec formulaire
├── lib/
│   └── supabase.ts               # Configuration Supabase
├── .env.local                    # Variables d'environnement
└── package.json                  # Dépendances
```

## 🔄 Flux de l'application

1. L'utilisateur upload une image et entre un prompt de transformation
2. L'image est uploadée dans le bucket `input-images` de Supabase
3. L'URL publique de l'image est récupérée
4. L'API Replicate est appelée avec l'image ET le prompt (modèle InstructPix2Pix)
5. Le modèle transforme l'image selon les instructions du prompt
6. L'image transformée est téléchargée et uploadée dans `output-images`
7. Les informations sont sauvegardées dans la table `projects`
8. L'URL de l'image transformée est retournée au frontend
9. L'utilisateur peut visualiser et télécharger l'image

## 🎨 Fonctionnalités

- ✅ Upload d'images
- ✅ Transformation avec IA via prompt
- ✅ Prévisualisation de l'image uploadée
- ✅ Affichage de l'image générée
- ✅ Téléchargement de l'image générée
- ✅ État de chargement avec messages
- ✅ Gestion des erreurs
- ✅ Interface moderne et épurée

## 🚀 Déploiement sur Vercel

1. Pushez votre code sur GitHub
2. Importez le projet sur Vercel
3. Ajoutez les variables d'environnement dans les settings Vercel
4. Déployez !

## 📝 Notes

- Le modèle `InstructPix2Pix` est utilisé pour transformer les images selon des instructions
- Les images sont stockées dans Supabase Storage
- La génération peut prendre 10-30 secondes selon la charge du serveur
- Assurez-vous que vos buckets Supabase sont publics pour que les URLs fonctionnent
- Prompts en anglais recommandés pour de meilleurs résultats
- Le modèle conserve la structure de l'image originale tout en appliquant les transformations demandées

## 🆘 Dépannage

**Erreur lors de l'upload :**
- Vérifiez que les buckets existent et sont publics dans Supabase
- Vérifiez que les noms des buckets correspondent dans `.env.local`

**Erreur Replicate :**
- Vérifiez que votre token Replicate est valide dans `.env.local`
- Si erreur 402 "Insufficient credit", rechargez votre compte sur https://replicate.com/account/billing
- Si le modèle prend du temps, c'est normal (10-30 secondes)

**Erreur base de données :**
- Vérifiez que la table `projects` existe
- Vérifiez les permissions RLS si activé

