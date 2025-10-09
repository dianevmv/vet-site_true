-- Configuration des politiques de sécurité pour la table waiting_list
-- Copiez et exécutez ce code dans Supabase > SQL Editor

-- 1. Activer Row Level Security (RLS)
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- 2. Créer une politique pour permettre l'insertion publique
CREATE POLICY "Permettre insertion publique dans waiting_list" 
ON public.waiting_list
FOR INSERT 
TO anon
WITH CHECK (true);

-- 3. (Optionnel) Permettre la lecture pour les utilisateurs authentifiés
CREATE POLICY "Permettre lecture pour admin" 
ON public.waiting_list
FOR SELECT 
TO authenticated
USING (true);

-- Vérifier que les politiques sont bien créées
SELECT * FROM pg_policies WHERE tablename = 'waiting_list';

