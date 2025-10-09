# 🎨 Éditeur d'Images IA

Application Next.js pour transformer des images avec l'intelligence artificielle en utilisant **Hugging Face (GRATUIT)** et Supabase.

## 🚀 Technologies utilisées

- **Next.js 14** avec TypeScript
- **Supabase** pour le stockage d'images et la base de données
- **Hugging Face** pour la génération d'images avec IA (GRATUIT 🆓)
- **Stable Diffusion 2.1** comme modèle IA

## 📋 Prérequis

- Node.js 18+ installé
- Un compte Supabase avec :
  - Deux buckets de stockage : `input-images` et `output-images`
  - Une table `projects` configurée
- Un compte Hugging Face **GRATUIT** avec un Access Token (voir HUGGINGFACE_SETUP.md)

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

2. **Obtenir votre token Hugging Face GRATUIT**

👉 **Suivez le guide détaillé dans `HUGGINGFACE_SETUP.md`**

En résumé :
- Allez sur https://huggingface.co/settings/tokens
- Créez un token gratuit
- Ajoutez-le dans `.env.local`

3. **Configurer le fichier `.env.local`**

Le fichier contient déjà :
- URL et clés Supabase
- Placeholder pour token Hugging Face (à remplacer)
- Noms des buckets de stockage

## 🎯 Utilisation

⚠️ **Avant de lancer, assurez-vous d'avoir configuré votre token Hugging Face dans `.env.local`**

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
│   │       └── route.ts          # API pour générer les images
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil avec formulaire
├── lib/
│   ├── supabase.ts               # Configuration Supabase
│   └── huggingface.ts            # Configuration Hugging Face
├── .env.local                    # Variables d'environnement
└── package.json                  # Dépendances
```

## 🔄 Flux de l'application

1. L'utilisateur upload une image et entre un prompt
2. L'image est uploadée dans le bucket `input-images` de Supabase
3. L'URL publique de l'image est récupérée
4. L'API Hugging Face est appelée avec le prompt (génération text-to-image)
5. L'image générée est téléchargée et uploadée dans `output-images`
6. Les informations sont sauvegardées dans la table `projects`
7. L'URL de l'image générée est retournée au frontend
8. L'utilisateur peut visualiser et télécharger l'image

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

- Le modèle `Stable Diffusion 2.1` est utilisé (GRATUIT)
- Les images sont stockées dans Supabase Storage
- La génération peut prendre 10-30 secondes (tier gratuit)
- Assurez-vous que vos buckets Supabase sont publics pour que les URLs fonctionnent
- Prompts en anglais recommandés pour de meilleurs résultats

## 🆘 Dépannage

**Erreur lors de l'upload :**
- Vérifiez que les buckets existent et sont publics dans Supabase
- Vérifiez que les noms des buckets correspondent dans `.env.local`

**Erreur Hugging Face :**
- Vérifiez que votre token Hugging Face est valide dans `.env.local`
- Si "Model is loading", attendez 1-2 minutes et réessayez
- Si "Rate limit", attendez quelques secondes entre les générations

**Erreur base de données :**
- Vérifiez que la table `projects` existe
- Vérifiez les permissions RLS si activé

