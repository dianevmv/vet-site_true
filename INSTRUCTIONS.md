# 🔑 Instructions pour finaliser l'installation

## Étape 1 : Ajouter vos clés Supabase dans .env.local

### Option A - Via l'éditeur (RECOMMANDÉ)

1. Ouvrez le fichier `.env.local` dans Cursor/VS Code
2. Remplacez les valeurs temporaires par vos VRAIES clés
3. Sauvegardez le fichier

### Option B - Via le terminal

```bash
# Ouvrez le fichier avec nano
nano "/Users/dianemeyer-vitry/Desktop/AI IN PROD /vet-site/.env.local"

# Remplacez les valeurs, puis :
# - Ctrl+X pour quitter
# - Y pour confirmer
# - Entrée pour sauvegarder
```

### Exemple de contenu avec VOS vraies clés :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-vrai-id-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre-vraie-cle...
```

### 🔍 Où trouver vos clés :

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. **Settings** (⚙️) → **API**
4. Copiez :
   - **Project URL** → Mettez-la dans `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Mettez-la dans `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Étape 2 : Configurer les politiques de sécurité dans Supabase

1. Allez dans votre projet Supabase
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Créez une **New query**
4. Copiez-collez le contenu du fichier `supabase-policies.sql`
5. Cliquez sur **Run** pour exécuter

Ou copiez directement ce code :

```sql
-- Activer Row Level Security
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion publique
CREATE POLICY "Permettre insertion publique dans waiting_list" 
ON public.waiting_list
FOR INSERT 
TO anon
WITH CHECK (true);

-- Permettre la lecture pour admin (optionnel)
CREATE POLICY "Permettre lecture pour admin" 
ON public.waiting_list
FOR SELECT 
TO authenticated
USING (true);
```

---

## Étape 3 : Redémarrer le serveur

Dans votre terminal où tourne le serveur :

```bash
# Arrêter le serveur : Ctrl+C

# Relancer le serveur
cd "/Users/dianemeyer-vitry/Desktop/AI IN PROD /vet-site"
npm run dev
```

---

## Étape 4 : Tester

1. Ouvrez votre navigateur
2. Allez sur `http://localhost:3000` (ou le port indiqué)
3. Testez le formulaire newsletter
4. Vérifiez dans Supabase → **Table Editor** → `waiting_list` que l'email apparaît

---

## ✅ Checklist

- [ ] Fichier `.env.local` créé et rempli avec les vraies clés
- [ ] Politiques RLS configurées dans Supabase
- [ ] Serveur redémarré
- [ ] Site accessible dans le navigateur
- [ ] Test d'inscription newsletter réussi
- [ ] Email visible dans la table `waiting_list` sur Supabase

---

## 🔧 Dépannage

### Erreur "supabaseUrl is required"
→ Les clés dans `.env.local` ne sont pas correctes ou le serveur n'a pas été redémarré

### Erreur "new row violates row-level security policy"
→ Les politiques RLS ne sont pas configurées, exécutez le SQL

### L'email ne s'enregistre pas
→ Vérifiez la console du navigateur (F12) pour voir l'erreur exacte

---

## 📞 Besoin d'aide ?

Si vous avez des problèmes, vérifiez :
1. Que vos clés sont correctes (pas de caractères en trop/manquants)
2. Que le serveur a bien été redémarré après avoir modifié `.env.local`
3. Que les politiques RLS sont bien créées dans Supabase

