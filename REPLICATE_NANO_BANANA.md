# 🍌 Configuration Replicate avec Nano-Banana

## ✅ Migration terminée !

L'application utilise maintenant **Replicate** avec le modèle **google/nano-banana** !

## 🎯 Configuration actuelle

- **Service IA** : Replicate (payant avec crédit)
- **Modèle** : google/nano-banana
- **Crédit** : 1 euro acheté
- **Token** : Configuré dans `.env.local`

## 💰 Coût approximatif

Avec **1 euro de crédit** sur Replicate :
- Coût par génération : ~0.001-0.005€
- Nombre de générations possibles : **200-1000 images** 🎉

## 🚀 Comment utiliser

1. **Démarrez le serveur** :
   ```bash
   npm run dev
   ```

2. **Allez sur** http://localhost:3000

3. **Uploadez une image**

4. **Entrez un prompt** :
   - En anglais : "Transform this into a cartoon style, vibrant colors"
   - En français : "Transforme en style cartoon, couleurs vibrantes"

5. **Cliquez sur "Générer"**

6. **Attendez 5-15 secondes** (Replicate est rapide !)

7. **Téléchargez votre image** ✨

## 🔍 Logs détaillés

Dans le terminal, vous verrez :
- `=== Début génération avec Replicate ===`
- `Appel à Replicate avec le modèle: google/nano-banana`
- `URL de l'image générée par Replicate: ...`
- `=== Génération terminée avec succès ===`

## ⚠️ Si vous voyez "Insufficient credit"

Cela signifie que votre crédit est épuisé :
1. Allez sur https://replicate.com/account/billing
2. Achetez plus de crédit (minimum $5)
3. Attendez 2-3 minutes
4. Réessayez !

## 📊 Vérifier votre crédit restant

1. Allez sur https://replicate.com/account
2. Vérifiez votre "Balance" en haut à droite
3. Consultez l'historique des générations

## 🎨 Conseils pour de bons prompts

Le modèle nano-banana fonctionne bien avec :

### Transformations de style :
```
"Transform into oil painting style"
"Make it look like a cartoon"
"Convert to watercolor art"
"Turn into pixel art style"
```

### Ajout d'éléments :
```
"Add vibrant colors and dramatic lighting"
"Make it look like a fantasy scene"
"Add neon lights and futuristic elements"
```

### Améliorations :
```
"Enhance the colors and details"
"Make it more dramatic and cinematic"
"Improve the lighting and contrast"
```

## 💡 Avantages de Replicate vs Hugging Face gratuit

| Critère | Replicate | Hugging Face Free |
|---------|-----------|-------------------|
| **Vitesse** | ⚡ 5-15s | 🐢 20-60s |
| **Qualité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Fiabilité** | ✅ 99.9% | ❌ Souvent indisponible |
| **Coût** | 💰 ~0.002€/img | 🆓 Gratuit |

Avec 1€, vous avez **beaucoup** de générations !

## 🔧 Dépannage

### Erreur "Invalid API token"
➡️ Vérifiez que le token dans `.env.local` est correct

### Erreur "Model not found"
➡️ Le modèle nano-banana est peut-être temporairement indisponible. Réessayez dans quelques minutes.

### Erreur "Request timeout"
➡️ La génération prend parfois plus de temps. Réessayez.

## 📈 Surveiller l'utilisation

Pour voir combien de crédit vous utilisez :
1. Allez sur https://replicate.com/account
2. Cliquez sur "Usage"
3. Consultez les détails de chaque prédiction

## 🎯 C'est parti !

Tout est configuré ! Lancez simplement :

```bash
npm run dev
```

Et testez la génération d'images avec l'IA ! 🚀🍌

