# Super Simple Google Login + Signup Guide

This guide matches the files in this repository and is written for a beginner.

## What you are building

You are building two simple pages:

1. `/config` - an admin-style configuration page where you paste your settings.
2. `/login` - a login page with one big **Sign in with Google** button.

Important beginner note:

- With Google OAuth, **login and signup are usually the same button**.
- If the Google user already exists, they log in.
- If the Google user is new, Supabase creates the account for them.

---

## Step 1: Create your Next.js project

In a terminal, run:

```bash
npx create-next-app@latest my-auth-app --js --tailwind --app
```

Then go into the project:

```bash
cd my-auth-app
npm install @supabase/supabase-js
npm run dev
```

---

## Step 2: Create `.env.local`

Create a file named `.env.local` in the root of your Next.js project.

Paste this block inside it:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_AUTH_CONFIG_STORAGE_KEY=demo-auth-config
```

Where to paste it:

- Paste it into the file named **`.env.local`**.
- This file lives at the top level of your project, next to `app`, `package.json`, and `node_modules`.

What each value means:

- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your public Supabase anon key.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = your Google client ID.
- `NEXT_PUBLIC_AUTH_CONFIG_STORAGE_KEY` = the browser localStorage key used by the Configuration page.

---

## Step 3: Create `lib/supabaseClient.js`

Create a folder named `lib`.

Inside that folder, create a file named `supabaseClient.js`.

Paste this code into it:

```js
import { createClient } from '@supabase/supabase-js'

const STORAGE_KEY = process.env.NEXT_PUBLIC_AUTH_CONFIG_STORAGE_KEY || 'demo-auth-config'

function readConfigFromStorage() {
  if (typeof window === 'undefined') return null

  const savedConfig = window.localStorage.getItem(STORAGE_KEY)
  if (!savedConfig) return null

  try {
    return JSON.parse(savedConfig)
  } catch {
    return null
  }
}

function getRuntimeConfig() {
  const storedConfig = readConfigFromStorage()

  return {
    supabaseUrl: storedConfig?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey:
      storedConfig?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    googleClientId: storedConfig?.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  }
}

export function getSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getRuntimeConfig()

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key. Add them in .env.local or save them on /config first.')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export function getSavedAuthConfig() {
  return getRuntimeConfig()
}

export function saveAuthConfig(config) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
```

What this file does:

- Connects your app to Supabase.
- First tries to read values the user saved on `/config`.
- If nothing was saved yet, it falls back to `.env.local`.

---

## Step 4: Create the Configuration Page

Create this file:

```text
app/config/page.js
```

Paste the code from the repo's `app/config/page.js` file into it.

What this page does:

- Shows an admin-style form.
- Lets you paste:
  - Supabase URL
  - Supabase Anon Key
  - Google Client ID
- Saves them into browser localStorage.
- Lets the Login page use them automatically.

Important beginner note:

- The **Google Client ID is mainly configured in Supabase and Google Cloud**, not directly used by `signInWithOAuth()` on the frontend.
- We still store it on `/config` because it gives you one simple place to keep track of your values.

---

## Step 5: Create the Login Page

Create this file:

```text
app/login/page.js
```

Paste the code from the repo's `app/login/page.js` file into it.

What this page does:

- Shows a clean UI.
- Has one large **Sign in with Google** button.
- Reads the saved configuration.
- Calls Supabase Google OAuth.

The most important line is:

```js
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/login`,
  },
})
```

What that means:

- `provider: 'google'` says “use Google”.
- `redirectTo` tells Supabase where to send the user after sign-in finishes.

---

## Step 6: Supabase dashboard setup

### A. Create a Supabase project

1. Open Supabase.
2. Click **New project**.
3. Choose a name and password.
4. Wait for the project to finish creating.

### B. Find your Supabase URL and Anon Key

Inside Supabase, copy:

- **Project URL**
- **Anon / Publishable key**

Paste those values into:

- `.env.local`, and/or
- the `/config` page inside your app.

### C. Turn on Google provider in Supabase

1. Go to **Authentication**.
2. Open **Providers**.
3. Click **Google**.
4. Turn it on.
5. Paste your:
   - Google Client ID
   - Google Client Secret
6. Save.

---

## Step 7: Exactly where to paste the Redirect URI in Google Cloud Console

This is the step beginners usually get stuck on.

### In Supabase, first copy the callback URL

1. Open your project.
2. Go to **Authentication**.
3. Go to **Providers**.
4. Open **Google**.
5. Look for the Supabase callback URL.

It usually looks like this:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Copy that exact URL.

### In Google Cloud Console, paste it here

1. Open **Google Cloud Console**.
2. Open your Google project.
3. Go to **Google Auth Platform** or **APIs & Services**.
4. Open **Clients** or **Credentials**.
5. Create a new **OAuth Client ID**.
6. Choose **Web application**.
7. Find the field named **Authorized redirect URIs**.
8. Click **Add URI**.
9. Paste the exact Supabase callback URL there.
10. Save.

### Also add your JavaScript origin

In the same Google OAuth client screen, add this to **Authorized JavaScript origins**:

```text
http://localhost:3000
```

Later, when you deploy, also add your real production domain.

### Also set your site URL in Supabase

In Supabase Auth settings, set:

```text
http://localhost:3000
```

as your **Site URL**.

This helps Supabase know where your frontend lives.

---

## Step 8: How the flow works

1. You open `/config` and save your Supabase values.
2. You go to `/login`.
3. You click **Sign in with Google**.
4. Supabase sends the user to Google.
5. Google checks the allowed redirect URI.
6. Google sends the user back through Supabase.
7. Supabase finishes the login/signup.

---

## Beginner checklist

Before testing, confirm all 6 items:

- [ ] `.env.local` exists
- [ ] `@supabase/supabase-js` is installed
- [ ] Google provider is enabled in Supabase
- [ ] Google Client ID and Secret are pasted into Supabase
- [ ] Supabase callback URL is pasted into Google Cloud Console
- [ ] `http://localhost:3000` is added as an allowed origin/site URL

---

## Very important beginner warning

Your **Google Client Secret should never be stored in frontend code**.

Only paste the Google Client Secret into:

- **Supabase Dashboard → Authentication → Providers → Google**

Do **not** put the secret inside:

- `app/login/page.js`
- `lib/supabaseClient.js`
- `.env.local` for frontend use
- browser localStorage
