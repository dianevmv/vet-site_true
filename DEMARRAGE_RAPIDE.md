# 🚀 Démarrage Rapide - Hugging Face Edition

## ✅ Ce qui a été fait

✅ Migration de Replicate vers Hugging Face (GRATUIT)  
✅ Installation des dépendances (`@huggingface/inference`)  
✅ Configuration de l'API route  
✅ Mise à jour de l'interface utilisateur  

## 🔑 CE QU'IL VOUS RESTE À FAIRE (2 minutes)

### Étape 1 : Obtenir votre token Hugging Face GRATUIT

1. **Créer un compte** (si vous n'en avez pas) :
   - Allez sur https://huggingface.co
   - Cliquez sur "Sign Up"
   - C'est gratuit, pas besoin de carte bancaire ! 🎉

2. **Créer un Access Token** :
   - Connectez-vous et allez sur https://huggingface.co/settings/tokens
   - Cliquez sur "New token"
   - Nom : `ai-image-editor`
   - Type : **Read** (suffisant)
   - Cliquez sur "Generate token"
   - **COPIEZ LE TOKEN** (format: `hf_xxxxxxxxxxxxx`)

### Étape 2 : Ajouter le token dans .env.local

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Trouvez la ligne :
   ```
   HUGGINGFACE_API_TOKEN=VOTRE_TOKEN_HUGGINGFACE_ICI
   ```
3. Remplacez `VOTRE_TOKEN_HUGGINGFACE_ICI` par votre token
4. Sauvegardez

### Étape 3 : Lancer l'application

```bash
npm run dev
```

Allez sur http://localhost:3000 et testez ! 🎉

## 🎨 Comment utiliser

1. **Uploadez une image** (jpg, png, etc.)
2. **Entrez un prompt** en anglais (recommandé) ou français
   - Exemple : "A beautiful landscape in watercolor style"
   - Exemple : "Un chat en style cartoon, couleurs vibrantes"
3. Cliquez sur **Générer**
4. Attendez 10-30 secondes (c'est gratuit, donc un peu plus lent)
5. **Téléchargez** votre image !

## 💡 Conseils pour de bons résultats

### Prompts efficaces en anglais :
```
"A cat wearing sunglasses, digital art, vibrant colors"
"Transform into oil painting, impressionist style, detailed"
"Cyberpunk city at night, neon lights, 8k, high quality"
"Portrait in anime style, colorful, detailed"
```

### Prompts en français (fonctionne aussi) :
```
"Un chat portant des lunettes de soleil, art digital, couleurs vibrantes"
"Transforme en peinture à l'huile, style impressionniste, détaillé"
"Ville cyberpunk la nuit, lumières néon, haute qualité"
```

## ⚠️ À savoir

### Avantages du tier gratuit :
- ✅ Complètement gratuit
- ✅ Pas de limite stricte de générations
- ✅ Qualité correcte (Stable Diffusion 2.1)
- ✅ Pas de carte bancaire nécessaire

### Limitations :
- ⏱️ Génération un peu lente (10-30 secondes)
- 🕐 Parfois le modèle doit se charger (1-2 min la première fois)
- 🔄 Rate limit : évitez de spammer les requêtes

## 🔧 Configuration Supabase

N'oubliez pas de créer dans votre projet Supabase :

### 1. Les buckets de stockage (publics) :
- `input-images`
- `output-images`

### 2. La table `projects` :
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  input_image_url TEXT NOT NULL,
  output_image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL
);
```

## 🆘 Problèmes courants

### "Model is loading"
➡️ Attendez 1-2 minutes, le modèle se charge. Réessayez.

### "Rate limit exceeded"
➡️ Attendez 10-20 secondes entre les générations.

### "Invalid token"
➡️ Vérifiez que vous avez bien copié le token dans `.env.local`

### Erreur de bucket Supabase
➡️ Vérifiez que les buckets existent et sont **publics**

## 📚 Documentation complète

- **HUGGINGFACE_SETUP.md** : Guide détaillé Hugging Face
- **README.md** : Documentation complète du projet
- **REPLICATE_ALTERNATIVES.md** : Alternatives et comparaisons

## 🎯 Vous êtes prêt !

Une fois votre token Hugging Face configuré, lancez simplement :

```bash
npm run dev
```

Et amusez-vous ! 🚀✨

---

**Questions ?** Le tier gratuit de Hugging Face est parfait pour commencer. Si vous avez besoin de performances supérieures plus tard, vous pourrez toujours passer à un plan payant ou utiliser Replicate/Stability AI.

