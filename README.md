# @sumit-ingale-aot/admin-portal-components

> Reusable login and forgot-password micro frontend for admin portals — built with Next.js, shadcn/ui, React Hook Form, and Zod.

**Version:** `0.1.9` &nbsp;·&nbsp; **Author:** Sumit Ingale &lt;sumit.ingale@algoocean.com&gt; &nbsp;·&nbsp; **Registry:** GitHub Packages

---

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Importing Styles](#importing-styles)
- [Components](#components)
  - [FormLayout](#formlayout)
  - [Form (EmailPasswordForm)](#form-emailpasswordform)
- [Full Example](#full-example)
- [Props Reference](#props-reference)
- [Action Signatures](#action-signatures)
- [Exports](#exports)
- [Peer Dependencies](#peer-dependencies)

---

## Installation

This package is published to **GitHub Packages**. Add the registry to your `.npmrc` first:

```bash
# .npmrc (in the root of your host project)
@sumit-ingale-aot:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
# npm
npm install @sumit-ingale-aot/admin-portal-components

# pnpm
pnpm add @sumit-ingale-aot/admin-portal-components

# yarn
yarn add @sumit-ingale-aot/admin-portal-components
```

---

## Prerequisites

This package externalises all heavy dependencies. The **host application** must have the following peer dependencies installed:

```bash
npm install react react-dom next \
  @radix-ui/react-dialog \
  class-variance-authority \
  clsx \
  lucide-react \
  react-hook-form \
  sonner \
  tailwind-merge \
  zod
```

> **Tailwind CSS v4** must be configured in the host app. Components rely on Tailwind utility classes and will not render correctly without it.

---

## Importing Styles

The package ships a pre-built CSS file. Import it **once** at the root of your app (e.g. `app/layout.tsx`):

```tsx
import "@sumit-ingale-aot/admin-portal-components/styles.css";
```

---

## Components

### `FormLayout`

A full-page wrapper that renders a centred card over a background image. Use it as the outermost shell for any auth screen.

```tsx
import { FormLayout } from "@sumit-ingale-aot/admin-portal-components";

<FormLayout bgImage="https://example.com/your-background.jpg">
  {/* any auth form goes here */}
</FormLayout>
```

#### Props

| Prop       | Type        | Required | Description                                |
|------------|-------------|----------|--------------------------------------------|
| `bgImage`  | `string`    | ✅        | URL of the full-page background image.     |
| `children` | `ReactNode` | ✅        | Content rendered inside the centred card.  |

---

### `Form` (EmailPasswordForm)

A complete login + forgot-password form. Handles its own validation (Zod), state, and submission lifecycle. You supply the async server actions and optional lifecycle callbacks.

```tsx
import { Form } from "@sumit-ingale-aot/admin-portal-components";
```

The form ships with **two views** toggled internally:

- **Login view** — email + password fields with a "Forgot password?" link.
- **Forgot password view** — email-only field inside a dialog, opened via the link.

---

## Full Example

```tsx
"use client";

import { forgotPassword, loginAdmin } from "@/actions/auth.action";
import {
  Form,
  FormLayout,
} from "@sumit-ingale-aot/admin-portal-components";

const LoginPage = () => {
  return (
    <FormLayout bgImage="https://example.com/bg.jpg">
      <Form
        // Branding
        logo="https://example.com/logo.png"

        // Server actions
        loginFn={loginAdmin}
        forgotPasswordFn={forgotPassword}

        // Login callbacks
        onSuccess={(data) => console.log("Login success", data)}
        onError={(error) => console.log("Login error", error)}
        onFinally={() => console.log("Login settled")}

        // Forgot password callbacks
        forgotPasswordOnSuccess={(data) => console.log("Reset email sent", data)}
        forgotPasswordOnError={(error) => console.log("Reset error", error)}
        forgotPasswordOnFinally={() => console.log("Forgot password settled")}
      />
    </FormLayout>
  );
};

export default LoginPage;
```

---

## Props Reference

### `Form`

| Prop                      | Type                       | Required | Description                                                       |
|---------------------------|----------------------------|----------|-------------------------------------------------------------------|
| `logo`                    | `string`                   | ✅        | URL of the logo image shown at the top of the form.              |
| `loginFn`                 | `LoginFn`                  | ✅        | Async function called on login submission. See [Action Signatures](#action-signatures). |
| `forgotPasswordFn`        | `ForgotPasswordFn`         | ✅        | Async function called on forgot-password submission.             |
| `onSuccess`               | `(data: unknown) => void`  | ❌        | Called when `loginFn` resolves successfully.                     |
| `onError`                 | `(error: unknown) => void` | ❌        | Called when `loginFn` rejects or returns an error.               |
| `onFinally`               | `() => void`               | ❌        | Called after login attempt regardless of outcome.                |
| `forgotPasswordOnSuccess` | `(data: unknown) => void`  | ❌        | Called when `forgotPasswordFn` resolves successfully.            |
| `forgotPasswordOnError`   | `(error: unknown) => void` | ❌        | Called when `forgotPasswordFn` rejects or returns an error.      |
| `forgotPasswordOnFinally` | `() => void`               | ❌        | Called after forgot-password attempt regardless of outcome.      |

---

## Action Signatures

Your server action functions must match these signatures:

```ts
type LoginFn = (credentials: {
  email: string;
  password: string;
}) => Promise<unknown>;

type ForgotPasswordFn = (payload: {
  email: string;
}) => Promise<unknown>;
```

### Example — Next.js Server Actions

```ts
// actions/auth.action.ts
"use server";

export async function loginAdmin(credentials: {
  email: string;
  password: string;
}) {
  const res = await fetch("https://api.example.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function forgotPassword(payload: { email: string }) {
  const res = await fetch("https://api.example.com/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to send reset email");
  return res.json();
}
```

> The `onSuccess`, `onError`, and `onFinally` callbacks are the integration point between the MFE and the host app. Use them for redirects, toast notifications, analytics events, etc.

---

## Exports

The package exposes three export paths:

| Export path                                                    | Contents                                        |
|----------------------------------------------------------------|-------------------------------------------------|
| `@sumit-ingale-aot/admin-portal-components`                    | Client components — `Form`, `FormLayout`, etc. |
| `@sumit-ingale-aot/admin-portal-components/server`             | Server-only utilities (if any).                |
| `@sumit-ingale-aot/admin-portal-components/styles.css`         | Pre-built Tailwind CSS — import once at root.  |

---

## Peer Dependencies

All of the following must be installed in the host app. They are externalised in the tsup bundle to prevent duplicate module instances.

| Package                    | Required version | Why externalised                                              |
|----------------------------|-----------------|---------------------------------------------------------------|
| `react` / `react-dom`      | `>=17`          | React must be a singleton across the app.                    |
| `next`                     | `>=12`          | Hooks like `useRouter` must resolve from the host's Next.js. |
| `react-hook-form`          | `>=7`           | Uses React context — duplicate copies break form state.      |
| `@hookform/resolvers`      | —               | Must match the same `react-hook-form` instance.              |
| `zod`                      | `>=3`           | Schema instances must share a single module registry.        |
| `@radix-ui/react-dialog`   | `>=1`           | Used by the forgot-password dialog — needs a single React instance. |
| `sonner`                   | `>=1`           | Toast context must be provided by the host app.              |
| `lucide-react`             | `>=0.300.0`     | Icon tree-shaking works best from a single install.          |
| `class-variance-authority` | `>=0.7.0`       | Used internally by shadcn component variants.                |
| `clsx` / `tailwind-merge`  | `>=2`           | Utility — no need to bundle twice.                           |