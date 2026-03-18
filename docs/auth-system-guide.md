# Beginner Guide: Next.js + Supabase Authentication

This guide walks through a complete beginner-friendly authentication setup using:

- **Next.js App Router**
- **Tailwind CSS**
- **TypeScript**
- **Supabase Auth + Database**
- **Google OAuth**

---

## Phase 1: Setup and Configuration

### 1. Create the Next.js project

Use this command to create a new app with **TypeScript**, **Tailwind CSS**, and the **App Router**:

```bash
npx create-next-app@latest my-auth-app --typescript --tailwind --app
```

After that:

```bash
cd my-auth-app
npm run dev
```

Why this works:

- `create-next-app@latest` downloads the latest official starter.
- `--typescript` gives you type safety.
- `--tailwind` sets up Tailwind automatically.
- `--app` enables the App Router structure.

### 2. Create a Supabase project

1. Go to the Supabase dashboard.
2. Click **New project**.
3. Pick your organization.
4. Enter a project name.
5. Create a strong database password and save it somewhere safe.
6. Choose a region close to your users.
7. Click **Create new project**.

### 3. Find your Supabase URL and anon key

In Supabase:

1. Open your project.
2. Go to **Project Settings** or the **Connect** area.
3. Copy:
   - **Project URL**
   - **Anon / Publishable key**

You will place those values in `.env.local` later.

### 4. Create a Google Cloud project

1. Open the Google Cloud Console.
2. Click the project dropdown in the top bar.
3. Click **New Project**.
4. Give it a name.
5. Click **Create**.

### 5. Configure the Google OAuth consent screen

Inside Google Cloud / Google Auth Platform:

1. Open **Branding** or **OAuth consent screen**.
2. Choose **External** if regular public users will log in.
3. Enter your app name, support email, and developer email.
4. Save.
5. In the **Audience** or testing area, add test users if Google asks for them during development.

Important beginner note:

- While your app is in testing mode, only approved test users can log in.
- This is normal.

### 6. Create the Google Client ID and Client Secret

1. Go to **Clients** / **Credentials**.
2. Click **Create Client** or **Create Credentials**.
3. Choose **Web application**.
4. Add your **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - your production domain later, for example `https://yourapp.com`
5. Add your **Authorized Redirect URI**.

### 7. Find the correct Supabase redirect URI

This is the part that confuses most beginners.

In Supabase:

1. Go to **Authentication**.
2. Go to **Providers**.
3. Open **Google**.
4. Supabase shows a callback / redirect URL for your project.

It usually looks like this:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

That exact URL must be pasted into Google as an **Authorized Redirect URI**.

For local development with the Supabase CLI, Supabase docs also mention:

```text
http://127.0.0.1:54321/auth/v1/callback
```

But if you are using the hosted Supabase dashboard project, the hosted callback URL is the one you usually need.

### 8. Paste Google credentials into Supabase

Back in Supabase:

1. Go to **Authentication**.
2. Open **Providers**.
3. Select **Google**.
4. Enable the provider.
5. Paste:
   - **Client ID**
   - **Client Secret**
6. Save.

### 9. Configure your site URL and redirect URLs in Supabase

In Supabase Auth settings:

- Set **Site URL** to `http://localhost:3000` during development.
- Add extra redirect URLs if needed, such as:
  - `http://localhost:3000`
  - `http://localhost:3000/login`
  - `http://localhost:3000/signup`
  - your real production URL later

Why this matters:

- After Google or email auth finishes, Supabase must know which frontend URLs are allowed.

---

## Phase 2: Connect Next.js to Supabase

### 1. Environment variables

Create a file named `.env.local` in the root of your Next.js app.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Why they start with `NEXT_PUBLIC_`:

- Your login page runs in the browser.
- Next.js only exposes variables to browser code when they start with `NEXT_PUBLIC_`.

### 2. Install the Supabase package

```bash
npm install @supabase/supabase-js
```

### 3. Create a reusable Supabase client

Create `lib/supabaseClient.ts`.

This file creates one reusable browser client so you can import it anywhere in your app.

---

## Phase 3: Build the UI

Suggested App Router structure:

```text
app/
  login/
    page.tsx
  signup/
    page.tsx
  profile/
    page.tsx
components/
  auth/
    AuthFormUI.tsx
lib/
  supabaseClient.ts
```

Why this structure is good:

- `app/login/page.tsx` becomes `/login`
- `app/signup/page.tsx` becomes `/signup`
- shared UI stays in `components`
- shared logic clients stay in `lib`

---

## Phase 4: Make it work

### 1. Google sign-in flow

When a user clicks your Google button, you call:

```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/profile',
  },
})
```

What happens next:

1. Your app asks Supabase to start Google login.
2. Supabase sends the user to Google.
3. Google asks the user to approve login.
4. Google sends the user back to Supabase's callback URL.
5. Supabase creates the session.
6. The user returns to your app.

### 2. Email signup flow

Use `signUp`:

```ts
await supabase.auth.signUp({
  email,
  password,
})
```

### 3. Email login flow

Use `signInWithPassword`:

```ts
await supabase.auth.signInWithPassword({
  email,
  password,
})
```

### 4. Read the current session

Use this when the page loads:

```ts
const {
  data: { session },
} = await supabase.auth.getSession()
```

Then the signed-in user is available at:

```ts
session?.user
```

Useful fields:

- `session?.user.email`
- `session?.user.user_metadata.full_name`
- `session?.user.user_metadata.name`
- `session?.user.user_metadata.avatar_url`

Google users often have their name and avatar in `user_metadata`.

### 5. Listen for login/logout changes

You can subscribe to auth state changes:

```ts
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event)
  console.log(session)
})
```

This helps your UI react when:

- the user logs in
- the user logs out
- the session refreshes

---

## Beginner mental model

Think of the system like this:

- **Next.js** = your website UI
- **Supabase Auth** = your login/security system
- **Google OAuth** = a secure "Sign in with Google" shortcut
- **Session** = the proof that the user is already logged in

---

## Common beginner mistakes

1. **Wrong redirect URI in Google**
   - Fix: copy the exact callback URL from Supabase.

2. **Wrong Site URL in Supabase**
   - Fix: set it to `http://localhost:3000` while developing.

3. **Forgetting `NEXT_PUBLIC_` in environment variables**
   - Fix: browser variables must start with that prefix.

4. **Using the service role key in the frontend**
   - Fix: never do that. Only use the anon/publishable key in browser code.

5. **Not restarting the dev server after editing `.env.local`**
   - Fix: stop and run `npm run dev` again.

---

## Recommended next steps after basic auth works

1. Add a logout button.
2. Protect private routes.
3. Store user profile data in a `profiles` table.
4. Add password reset.
5. Add email confirmation messaging.
6. Move to the SSR pattern later when you want stronger App Router session handling.
