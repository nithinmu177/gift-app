# Firebase Authentication Setup Guide

## ✅ What's Already Configured

### 1. **Login Component** (`src/app/components/login.ts`) ✅
- Uses Firebase Auth for email/password login
- Real-time Firebase error messages:
  - `auth/invalid-credential` → "Invalid email or password"
  - `auth/user-not-found` → "Account not found"
  - `auth/too-many-requests` → "Too many failed attempts"
- Auto-redirect if already logged in
- Session persistence with Firebase

### 2. **Signup Component** (`src/app/components/signup.ts`) ✅
- Creates Firebase Auth account
- Creates user profile in Firestore `users` collection
- Email validation and password strength checking
- Stores: userId, name, email, phone, role, timestamps
- Timeout protection for network issues
- Specific error messages for each Firebase error code

### 3. **AuthService** (`src/app/services/auth.service.ts`) ✅
- `login(email, password)` - Firebase Auth sign-in
- `signup(email, password, name)` - Firebase Auth registration
- `logout()` - Sign out user
- `getCurrentUser()` - Get current user object
- `user$` - Observable for real-time user state
- Graceful fallback when Firebase is disabled

### 4. **Firebase Configuration** (`src/app/app.config.ts`) ✅
- Providers configured for: Auth, Firestore, Analytics
- Auto-initialization of Firebase app
- Dependency injection ready

---

## 🧪 How to Test

### Step 1: Refresh Browser
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### Step 2: Test Signup (Create Account)
1. Navigate to **Sign up** page
2. Enter details:
   - Full name: `Test User`
   - Email: `test123@example.com` (any email)
   - Password: `password123`
   - Phone: `9876543210` (optional)
3. Click **Create account**

**Expected Results:**
- ✅ Account created in Firebase Auth
- ✅ User profile saved in Firestore `users` collection
- ✅ Redirected to home page automatically
- ✅ Logged in as the new user

### Step 3: Logout
- Click **Logout** in the navigation

### Step 4: Test Login
1. Navigate to **Login** page
2. Enter:
   - Email: `test123@example.com`
   - Password: `password123`
3. Click **Login**

**Expected Results:**
- ✅ Signed in with Firebase Auth
- ✅ Redirected to home page
- ✅ User session persists on page refresh

---

## 📊 Verify in Firebase Console

### Check User in Firebase Auth:
1. Go to [Firebase Console](https://console.firebase.google.com/project/gift-d24a5/authentication/users)
2. Click on **Authentication** → **Users**
3. You should see your test user account with:
   - ✅ Email address
   - ✅ User ID (UID)
   - ✅ Creation date

### Check User Profile in Firestore:
1. Go to [Firestore Database](https://console.firebase.google.com/project/gift-d24a5/firestore/data)
2. Click on **users** collection
3. You should see your user document with:
   - ✅ userId (matching Firebase UID)
   - ✅ name
   - ✅ email
   - ✅ phone
   - ✅ role: "user"
   - ✅ createdAt & updatedAt timestamps

---

## 🔒 Security Notes

### Current Setup:
- ✅ Passwords hashed by Firebase Auth (never stored in Firestore)
- ✅ User profiles stored separately in Firestore
- ✅ Authentication state managed by Firebase
- ✅ Graceful fallback if Firebase unavailable

### Before Production:
1. **Set Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own profile
       match /users/{userId} {
         allow read, write: if request.auth.uid == userId;
       }
       
       // Gifts collection is public read
       match /gifts/{document=**} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid != null && /* admin check */;
       }
       
       // Events collection - user can manage their own
       match /events/{document=**} {
         allow read, write: if request.auth.uid == resource.data.userId;
       }
       
       // Other collections follow similar patterns
     }
   }
   ```

2. **Enable Authentication Methods in Firebase Console:**
   - Email/Password ✅ (already enabled)
   - Google Sign-in (optional)
   - Phone Authentication (optional)

3. **Configure Firestore Rules:**
   - Go to [Firestore Rules](https://console.firebase.google.com/project/gift-d24a5/firestore/rules)
   - Replace default with production rules above

---

## 🐛 Troubleshooting

### Issue: Login/Signup not working
**Solution:** 
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console (F12 → Console tab)
- Verify Firebase config in `src/app/firebase.config.ts`

### Issue: Error "Calling Firebase APIs outside of an Injection context"
**Solution:**
- This is a warning, not an error—app still works
- Caused by SSR hydration—safe to ignore
- See [AngularFire Zones Documentation](https://github.com/angular/angularfire/blob/main/docs/zones.md)

### Issue: Character limit exceeded on password
**Solution:**
- Firebase limits passwords to 8-256 characters
- Validation in signup component enforces 6+ character minimum

### Issue: User data not appearing in Firestore
**Solution:**
- Check network tab in browser (F12 → Network)
- Verify Firestore security rules allow writes
- Check Firestore quota (free tier: 50k writes/day)

---

## 📱 Complete User Journey

```
User visits app
   ↓
Not logged in → Redirect to /login
   ↓
Click "Sign up" → /signup page
   ↓
Enter email/password → Firebase Auth creates account
   ↓
Save user profile → Firestore adds user document
   ↓
Auto-login → /home page
   ↓
Browse gifts, create events, add to cart
   ↓
Place order → Data saved throughout Firestore collections
```

---

## 📁 Related Files

- Auth Component: [login.ts](src/app/components/login.ts) & [signup.ts](src/app/components/signup.ts)
- Auth Service: [auth.service.ts](src/app/services/auth.service.ts)
- Firebase Config: [firebase.config.ts](src/app/firebase.config.ts)
- App Configuration: [app.config.ts](src/app/app.config.ts)

---

## ✨ Next Steps

1. **Test signup & login** using the steps above
2. **Verify data** appears in Firebase Console
3. **Test other pages** (Events, Gifts, Cart, Orders) with logged-in user
4. **Configure Firestore security rules** before going live
5. **Add validation** for email verification if needed
6. **Enable additional auth methods** (Google, Phone) as needed

---

**Status:** ✅ Firebase Authentication is fully integrated and ready to test!
