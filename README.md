# Vite + React + Shadcn/UI + TypeScript Starter

This is a starter template for building modern web applications using Vite, React, TypeScript, and Shadcn/UI. It includes a basic setup for a content-driven website with a landing page, service detail pages, and an admin dashboard powered by Supabase.

## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.io/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/v5)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Features

- **Public Pages**:
  - Landing Page
  - Service Detail Page
- **Admin Dashboard**:
  - Secure login for administrators.
  - Protected routes for admin-only access.
  - Manage website content, including accordions, FAQs, and logo carousels.
  - User management capabilities.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](httpss://nodejs.org/) (version 18 or higher recommended)
- [npm](httpss://www.npmjs.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the development server
   ```sh
   npm run dev
   ```

## Environment Variables

To connect to your Supabase backend, you will need to create a `.env` file in the root of the project and add the following environment variables:

```
VITE_SUPABASE_URL="your_supabase_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

You can get these values from your Supabase project settings.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

- `npm run build`: Builds the app for production to the `dist` folder.

- `npm run lint`: Lints the code for any errors.

- `npm run preview`: Runs the production build locally.