# GitHub Pages Deployment Guide

## Enable GitHub Pages for ShoreSquad

Your code is now on GitHub! Follow these simple steps to enable **free hosting** with GitHub Pages.

### Step 1: Go to Repository Settings

1. Visit your GitHub repository:
   ```
   https://github.com/23021626/ShoreSquad
   ```

2. Click the **Settings** tab (top right)

3. Scroll down to **Pages** section in the left sidebar

### Step 2: Configure GitHub Pages

1. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`

2. Click **Save**

3. You'll see a message:
   ```
   ✅ Your site is published at https://23021626.github.io/ShoreSquad
   ```

### Step 3: Wait for Deployment

- **First build**: 1-2 minutes
- **Subsequent updates**: Auto-deploy on `git push` (~1 min)
- **Status**: Check "Deployments" tab to track progress

### Step 4: Visit Your Site

Open in browser:
```
https://23021626.github.io/ShoreSquad
```

---

## Making Updates

Every time you push to GitHub, your site auto-updates:

```bash
cd ShoreSquad

# Make changes to HTML, CSS, or JS
# Then:

git add .
git commit -m "Update ShoreSquad: Add new feature"
git push
```

Changes live in **~1-2 minutes**.

---

## Troubleshooting

### Site not live yet?
- Check "Deployments" tab for status
- Clear browser cache (Ctrl+Shift+Delete)
- Wait a few minutes

### Changes not showing?
- Hard refresh (Ctrl+F5)
- Check commit was pushed: `git log --oneline`
- Verify in GitHub Actions (if available)

### Map/Weather not working?
- Check browser console (F12) for errors
- Verify API endpoints are accessible
- Ensure internet connection

---

## Your Live Site is Ready! 🎉

```
📱 Mobile-responsive
🌐 Free hosting (GitHub Pages)
🔄 Auto-deploy on push
♻️ For the environment
```

**Rally your crew. Clean our coasts. 🌍**
