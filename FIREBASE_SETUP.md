# Firebase Configuration Guide

## Required Firebase Variables

The following environment variables must be configured in your `.env` file for Firebase to work correctly:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | `your-project.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket | `your-project.appspot.com` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789012` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:123456789012:web:abcdef123456` |

### Where to Place Variables

**File Location:** `.env` (in the project root)

**Example .env file:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=sindh-saba.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=sindh-saba
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=sindh-saba.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### How to Get These Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (Project Settings)
4. Scroll down to "Your apps" section
5. Click on the web app (</>) icon
6. Copy the configuration values

## Files Modified

### 1. `firebase/config.ts`
- Added `validateFirebaseConfig()` function for detailed error messages
- Provides specific error messages for each missing environment variable

### 2. `firebase/firestore.ts`
- Added helper functions: `fetchCollectionDocuments()`, `fetchDocumentById()`
- Added `culturalItems` to COLLECTIONS constant
- Consolidated Firestore operations in one location

### 3. `firebase/index.ts`
- Removed duplicate re-export that was causing lint errors
- Clean export structure

### 4. `.env`
- **SECURITY FIX:** Removed exposed OPENAI_API_KEY
- Cleaned up comments

### 5. `.env.example` (NEW FILE)
- Created template file with all required variables
- Includes instructions for obtaining values from Firebase Console

### 6. `services/culturalItemsService.ts`
- Updated to import from `@/firebase` instead of `./firebaseService`
- Now uses centralized Firebase configuration

### 7. `services/firebaseService.ts` (DELETED)
- Removed duplicate Firebase initialization logic
- Consolidated into `firebase/firestore.ts`

### 8. `context/AuthContext.tsx`
- Updated to use `validateFirebaseConfig()` for better error messages
- Now provides specific feedback about which environment variables are missing

## Firebase Architecture

### Directory Structure
```
firebase/
├── config.ts       # Environment variable configuration and validation
├── app.ts          # Firebase app initialization
├── auth.ts         # Firebase Auth instance
├── firestore.ts    # Firestore instance and helper functions
├── storage.ts      # Firebase Storage instance
├── functions.ts    # Cloud Functions instance
└── index.ts        # Central exports
```

### Initialization Flow

1. **Config Check:** `config.ts` reads environment variables
2. **Validation:** `validateFirebaseConfig()` checks all required variables
3. **App Init:** `app.ts` initializes Firebase app if config is valid
4. **Service Init:** Individual services (Auth, Firestore, Storage) initialize their instances
5. **Null Returns:** All functions return `null` if Firebase is not configured (graceful degradation)

## Testing Firebase Connectivity

### Step 1: Verify Environment Variables

Run the following in your terminal:
```bash
# Check if .env file exists
cat .env

# Verify variables are set (should not be empty)
grep EXPO_PUBLIC_FIREBASE_ .env
```

### Step 2: Test Firebase Initialization

Create a test file or add this to a component:
```typescript
import { validateFirebaseConfig, isFirebaseConfigured } from '@/firebase/config';

// Test configuration
const validation = validateFirebaseConfig();
console.log('Firebase Config Valid:', validation.valid);
if (!validation.valid) {
  console.error('Missing variables:', validation.errors);
}

console.log('Firebase Configured:', isFirebaseConfigured);
```

### Step 3: Test Auth Connection

```typescript
import { getFirebaseAuth } from '@/firebase/auth';

const auth = getFirebaseAuth();
if (auth) {
  console.log('✅ Firebase Auth initialized successfully');
} else {
  console.log('❌ Firebase Auth failed to initialize');
}
```

### Step 4: Test Firestore Connection

```typescript
import { getFirestoreDb } from '@/firebase/firestore';

const db = getFirestoreDb();
if (db) {
  console.log('✅ Firestore initialized successfully');
} else {
  console.log('❌ Firestore failed to initialize');
}
```

### Step 5: Test Storage Connection

```typescript
import { getFirebaseStorage } from '@/firebase/storage';

const storage = getFirebaseStorage();
if (storage) {
  console.log('✅ Firebase Storage initialized successfully');
} else {
  console.log('❌ Firebase Storage failed to initialize');
}
```

### Step 6: Test Anonymous Authentication

The app uses anonymous authentication by default. Check if it works:

```typescript
import { ensureAnonymousUser } from '@/services/authService';

try {
  const user = await ensureAnonymousUser();
  console.log('✅ Anonymous auth successful:', user.uid);
} catch (error) {
  console.error('❌ Anonymous auth failed:', error);
}
```

### Step 7: Check App Error Messages

If Firebase is not configured, the app will show:
- **Auth Context Error:** "Firebase not configured: EXPO_PUBLIC_FIREBASE_API_KEY is missing, EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN is missing, ... See .env.example."

This indicates which specific variables need to be added.

## Common Issues and Solutions

### Issue: "Firebase not configured" error
**Solution:** Add all required environment variables to `.env` file

### Issue: "Network Error" when fetching data
**Solution:** 
- Check internet connection
- Verify Firebase project is in production mode (not test mode)
- Check Firestore rules allow read access

### Issue: Auth initialization fails
**Solution:**
- Verify Firebase Auth is enabled in Firebase Console
- Check that Anonymous Auth is enabled in Firebase Console → Authentication → Sign-in method

### Issue: Storage upload fails
**Solution:**
- Verify Firebase Storage is enabled in Firebase Console
- Check Storage rules allow write access
- Verify storage bucket name matches environment variable

## Security Notes

1. **Never commit .env file** - it contains sensitive API keys
2. **.env is in .gitignore** - ensure it stays that way
3. **Use .env.example** - commit this file as a template for other developers
4. **Rotate keys if compromised** - regenerate Firebase keys if accidentally exposed
5. **Environment-specific configs** - use different Firebase projects for development and production

## Firebase Console Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Authentication (Anonymous)
- [ ] Create Firestore database
- [ ] Enable Storage
- [ ] Set up Firestore rules (read/write permissions)
- [ ] Set up Storage rules (read/write permissions)
- [ ] Get web app configuration
- [ ] Add configuration to .env file
- [ ] Test all connections

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify all environment variables are set correctly
3. Ensure Firebase services are enabled in the console
4. Check network/firewall settings
