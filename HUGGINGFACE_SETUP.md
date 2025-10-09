# 🤗 Configuration Hugging Face (GRATUIT)

## ✅ Migration vers Hugging Face terminée !

Votre application utilise maintenant l'API **gratuite** de Hugging Face au lieu de Replicate.

## 🔑 Obtenir votre token Hugging Face GRATUIT

### Étape 1 : Créer un compte (gratuit)
1. Allez sur https://huggingface.co
2. Cliquez sur "Sign Up" en haut à droite
3. Créez votre compte gratuitement (email + mot de passe)

### Étape 2 : Créer un Access Token
1. Une fois connecté, allez sur https://huggingface.co/settings/tokens
2. Cliquez sur "New token"
3. Donnez-lui un nom (ex: "ai-image-editor")
4. Sélectionnez le rôle "read" (suffisant pour l'API d'inférence)
5. Cliquez sur "Generate token"
6. **COPIEZ le token** (vous ne pourrez plus le voir après)

### Étape 3 : Ajouter le token dans .env.local
1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez `VOTRE_TOKEN_HUGGINGFACE_ICI` par votre token
3. Sauvegardez le fichier

Exemple :
```env
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🚀 Lancer l'application

Une fois le token configuré :

```bash
npm run dev
```

Allez sur http://localhost:3000 et testez ! 🎉

## 📊 Limites du tier gratuit Hugging Face

✅ **Avantages :**
- Complètement gratuit !
- Pas de carte bancaire nécessaire
- Modèles de qualité (Stable Diffusion 2.1)
- Pas de limite stricte de générations

⚠️ **Limitations :**
- Rate limiting : environ 1 requête par seconde
- Temps de génération : 10-30 secondes (parfois plus si le modèle doit se charger)
- Peut être plus lent aux heures de pointe
- Qualité légèrement inférieure aux modèles payants

## 🎨 Modèle utilisé

**Stable Diffusion 2.1** par Stability AI
- Génération d'images de haute qualité
- Comprend les prompts en anglais (mais fonctionne aussi en français)
- 768x768 pixels par défaut

## 💡 Conseils pour de meilleurs résultats

### Prompts en anglais (recommandé)
```
"A cat wearing a hat in cartoon style, vibrant colors"
"Transform into oil painting, impressionist style"
"Digital art, cyberpunk style, neon lights"
```

### Prompts en français (fonctionne aussi)
```
"Un chat avec un chapeau en style cartoon, couleurs vibrantes"
"Transforme en peinture à l'huile, style impressionniste"
"Art digital, style cyberpunk, lumières néon"
```

## 🔧 Dépannage

### Erreur "Model is loading"
- Le modèle se charge (peut prendre 1-2 minutes la première fois)
- Réessayez après quelques secondes

### Erreur "Rate limit exceeded"
- Attendez quelques secondes entre les générations
- Le tier gratuit a un rate limit (normal)

### Image de mauvaise qualité
- Soyez plus descriptif dans votre prompt
- Utilisez des mots-clés comme "high quality", "detailed", "8k"
- Évitez les prompts trop vagues

## 📖 Ressources

- Documentation Hugging Face : https://huggingface.co/docs/api-inference
- Modèles disponibles : https://huggingface.co/models?pipeline_tag=text-to-image
- Communauté : https://discuss.huggingface.co/

## 🎯 Prochaines étapes

Si vous voulez améliorer la qualité ou la vitesse :
1. **Hugging Face Pro** : $9/mois pour des API plus rapides
2. **Replicate avec crédit** : $5-10 de crédit pour tester
3. **Stability AI Direct** : API payante mais très performante

Mais pour commencer et tester, le tier gratuit est parfait ! 🚀

