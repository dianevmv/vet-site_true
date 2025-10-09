# 🔧 Fix: Permissions insuffisantes Hugging Face

## ❌ Erreur rencontrée
```
This authentication method does not have sufficient permissions to call Inference Providers
```

## 🎯 Solution : Créer un nouveau token avec les bonnes permissions

### Étape 1 : Supprimer l'ancien token (optionnel)
1. Allez sur https://huggingface.co/settings/tokens
2. Trouvez votre token `ai-image-editor`
3. Cliquez sur "Revoke" pour le supprimer

### Étape 2 : Créer un nouveau token avec les BONNES permissions

1. Allez sur https://huggingface.co/settings/tokens
2. Cliquez sur **"New token"**
3. **Nom** : `ai-image-editor-v2`
4. **Type/Role** : Sélectionnez **"Write"** (PAS "Read" !)
   - ⚠️ C'est très important : il faut "Write" pour utiliser l'API d'inférence
5. Cliquez sur **"Generate token"**
6. **Copiez le nouveau token** (commence par `hf_`)

### Étape 3 : Donnez-moi le nouveau token

Une fois que vous avez le nouveau token avec les permissions "Write", donnez-le moi et je le configurerai.

---

## 📝 Pourquoi ce problème ?

Les tokens Hugging Face ont différents niveaux de permissions :
- **Read** : Lire des modèles/datasets (pas suffisant pour nous)
- **Write** ✅ : Lire + Utiliser l'API d'inférence (ce qu'il nous faut)
- **Admin** : Tous les droits (pas nécessaire)

Pour générer des images avec l'API, il faut au minimum "Write".

