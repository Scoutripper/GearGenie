# Scoutripper Backend Documentation 🚀

This document provides a technical overview of the backend architecture, specifically designed for your team meeting. The application uses **Supabase** as a Backend-as-a-Service (BaaS) provider.

---

## 1. Technology Stack
*   **Database**: PostgreSQL (managed by Supabase)
*   **Authentication**: Supabase Auth (Email/Password & Google OAuth)
*   **File Storage**: Supabase Storage (Buckets for images)
*   **API Interface**: Supabase JS Client (`@supabase/supabase-js`)

---

## 2. Project Structure & Key Files

Here is where the backend logic lives in your codebase:

### **A. Connection Setup**
*   **File**: `src/supabaseClient.js`
*   **Purpose**: Initializes the connection to the Supabase backend using environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
*   **Logic**: It exports a singleton `supabase` client instance used throughout the app to make API calls.

### **B. Authentication & User State**
*   **File**: `src/context/AuthContext.jsx`
*   **Purpose**: Manages the global user session (Login, Signup, Logout).
*   **Key Logic**:
    *   `login(email, password)`: Authenticates user and triggers profile fetching.
    *   `signup(email, password, metadata)`: Creates a new user in Supabase Auth and triggers a trigger to create a profile entry.
    *   `fetchProfile(user)`: Fetches additional user details (name, phone, address) from the `profiles` table, which is separate from the Auth table.
    *   **State Management**: Uses React Context to provide `user` and `loading` state to all pages.

### **C. User Profile & Storage**
*   **File**: `src/pages/UserProfile.jsx`
*   **Purpose**: Handles user profile updates and profile picture uploads.
*   **Key Logic**:
    *   **Image Upload**: Uploads files to the `avatars` bucket.
    *   **Data Update**: Updates textual data (Name, Phone, Address) in the `profiles` table.

---

## 3. Database Schema

We use a "Dual Table" approach for security and flexibility:

1.  **`auth.users`** (Supabase Internal):
    *   Stores `id`, `email`, `encrypted_password`, `last_sign_in_at`.
    *   Managed automatically by Supabase.

2.  **`public.profiles`** (Custom Table):
    *   Linked to `auth.users` via `id` (Foreign Key).
    *   **Columns**:
        *   `first_name`, `last_name` (Text)
        *   `phone` (Text)
        *   `avatar_url` (Text link to Storage)
        *   `address_json` (JSONB for structural address data)
        *   `about_yourself` (Text)

---

## 4. Key Workflows (How it works)

### **Login Flow** 🔐
1.  User enters credentials on `Login.jsx`.
2.  `AuthContext` calls `supabase.auth.signInWithPassword()`.
3.  On success, Supabase returns a Session Token.
4.  We catch the `SIGNED_IN` event and immediately query the `profiles` table to get the user's name and picture.
5.  User is redirected to the Home page.

### **Profile Picture Upload Flow** 📸
1.  User selects a file in `UserProfile.jsx`.
2.  Code generates a unique filename: `userID-random.ext`.
3.  Uploads to `avatars` bucket using `supabase.storage.from('avatars').upload()`.
4.  Retrieves the Public URL of the uploaded image.
5.  Updates the `profiles` table with this new `avatar_url`.

---

## 5. Security & RLS (Row Level Security)

We implemented specific policies to secure user data:

*   **Profiles Table**:
    *   **SELECT**: Public (Anyone can view profiles/reviews).
    *   **UPDATE**: Authenticated Users only (Change own data).

*   **Storage (Avatars Bucket)**:
    *   **INSERT**: Authenticated Users (Upload photo).
    *   **SELECT**: Public (View photos).
    *   **UPDATE/DELETE**: Users can only modify *their own* files.

---

## 6. Common Issues & Fixes (For Ref)
*   **Login Loop**: Fixed by checking `isProcessingAuth` to prevent multiple auth listeners firing at once.
*   **Upload Error**: Fixed by ensuring the code points to the `avatars` bucket (not `profiles`) and applying correct RLS policies for INSERT permissions.

---
*Generated for Scoutripper Team Meeting*
