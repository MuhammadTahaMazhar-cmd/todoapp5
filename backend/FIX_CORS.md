# Fix CORS for Phase-2 Backend

## Issue
"Failed to fetch" error - Frontend can't connect to backend due to CORS restrictions.

## Solution Applied
Updated `src/main.py` to allow all origins by default if `CORS_ORIGINS` is set to "*" or not set.

## Hugging Face Space Settings

Go to: https://huggingface.co/spaces/aleemakhan/hackthon2-phase2/settings

### Update CORS_ORIGINS Secret:

**Option 1: Allow All Origins (Recommended for testing)**
```
CORS_ORIGINS=*
```

**Option 2: Specific Origins**
```
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

After updating, restart the Space.

## Verify Fix

1. Check backend logs for CORS errors
2. Test API from frontend
3. Check browser console for CORS errors

