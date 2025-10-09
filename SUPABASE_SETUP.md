# Guide d'intégration Supabase pour le site vétérinaire

## 📋 Étapes d'installation

### 1. Installer le client Supabase

Dans votre terminal, exécutez :
```bash
cd "/Users/dianemeyer-vitry/Desktop/AI IN PROD /vet-site"
npm install @supabase/supabase-js
```

### 2. Obtenir vos clés Supabase

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** (commence par `https://...supabase.co`)
   - **anon/public key** (clé publique)

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique-ici
```

**Remplacez** les valeurs par vos vraies clés Supabase !

### 4. Créer les tables dans Supabase

Dans Supabase, allez dans **SQL Editor** et exécutez :

#### Table Newsletter
```sql
CREATE TABLE newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique" ON newsletter
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

#### Table Appointments (Rendez-vous)
```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Activer Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique" ON appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour lire ses propres rendez-vous (optionnel)
CREATE POLICY "Permettre lecture pour admin" ON appointments
  FOR SELECT
  TO authenticated
  USING (true);
```

### 5. Redémarrer le serveur de développement

Arrêtez le serveur (Ctrl+C) et relancez :
```bash
npm run dev
```

## 🎯 Fonctionnalités ajoutées

### ✅ Newsletter
- Collecte les emails dans la table `newsletter`
- Validation d'email côté client
- Messages de confirmation/erreur
- Bouton désactivé pendant l'envoi

### ✅ Prise de rendez-vous
- Enregistre dans la table `appointments`
- Collecte : nom propriétaire, nom animal, téléphone, date
- Validation de tous les champs
- État de chargement pendant l'envoi
- Réinitialisation du formulaire après succès

## 🔍 Vérifier que ça fonctionne

1. Ouvrez `http://localhost:3000`
2. Testez l'inscription à la newsletter
3. Testez la prise de rendez-vous
4. Vérifiez dans Supabase → **Table Editor** que les données sont bien enregistrées

## 🛠️ Structure des fichiers créés

```
vet-site/
├── .env.local                 # Variables d'environnement (à configurer)
├── lib/
│   └── supabase.ts           # Client Supabase
└── app/
    └── page.tsx              # Page mise à jour avec intégration Supabase
```

## ⚠️ Points importants

- Ne committez **JAMAIS** le fichier `.env.local` dans git
- Les clés API sont sensibles, gardez-les secrètes
- Row Level Security (RLS) est activé pour la sécurité
- Les politiques permettent l'insertion publique (anon)

## 📊 Voir vos données

Dans Supabase :
- **Table Editor** → `newsletter` : voir les inscriptions
- **Table Editor** → `appointments` : voir les rendez-vous

## 🔧 Dépannage

### Erreur "Invalid API key"
→ Vérifiez que vos clés dans `.env.local` sont correctes

### Erreur "relation does not exist"
→ Les tables ne sont pas créées, exécutez les scripts SQL

### Les données ne s'enregistrent pas
→ Vérifiez les politiques RLS dans Supabase

### Erreur TypeScript
→ Redémarrez le serveur après avoir installé @supabase/supabase-js

