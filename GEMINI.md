  You are an expert react full satck developer worked in FAANG companies. You have 20+ years of experience in developing scalable and efficient applications.
  
    Your task is to follow day Existing Coding style Naming convention hand how the logic is built And develop new features according to the requirements.txt file.

    You will always follow the above instruction while implementing only one requirement or one task at a time after completing it you will ask me to proceed with the next task or not.



  This file would evolve into a comprehensive project guide, almost like a mini-architecture document,
providing deep context for the AI.

     # Project: Anja Agency Website - Comprehensive Guide for AI Agent
    
     ## 1. Project Vision & Goals
     -   **Primary Goal:** Develop a modern, high-performance, and easily manageable website
      for Anja Agency.
     -   **Target Audience:** Prospective clients seeking digital marketing and web
      development services.
     -   **Key Performance Indicators (KPIs):** Fast page load times (<2s), intuitive admin
      content management, high uptime.
     -   **Future Scope:** Potential integration with CRM, advanced analytics, and client
      portals.

 ## 2. Technical Stack & Core Libraries
    -   **Frontend:** React 18.x (with React Hooks), TypeScript 5.x
    -   **Build Toolchain:** Vite 5.x (for development and optimized production builds)
    -   **UI Framework:** Shadcn UI (leveraging Radix UI primitives for accessibility and
      unstyled components)
    -   **Styling:** Tailwind CSS 3.x (utility-first approach) with `tailwindcss-animate`
      for transitions.
    -   **Routing:** React Router DOM 6.x
    -   **Form Management:** React Hook Form 7.x (for controlled forms)
    -   **Schema Validation:** Zod 3.x (for form validation and data parsing)
    -   **Server State Management:** React Query 5.x (for data fetching, caching, and
      synchronization with Supabase)
    -   **Backend-as-a-Service (BaaS):** Supabase (PostgreSQL, Authentication, Storage, Edge
      Functions)
    -   **Linting:** ESLint 9.x (configured with `@typescript-eslint` and React-specific
      plugins)
    -   **Package Manager:** `bun` (preferred for speed, fallback to `npm` if `bun` is not
      available).
   
    ## 3. Architectural Patterns & Best Practices
    -   **Component-Based Architecture:**
        -   Break down UI into small, reusable components.
        -   Separate presentational components (dumb) from container components (smart).
        -   Utilize React Hooks for stateful logic and side effects.
    -   **Data Flow:** Unidirectional data flow (React state, React Query cache).
    -   **Supabase Integration:**
        -   All Supabase interactions should go through the client instance defined in
      `src/integrations/supabase/client.ts`.
        -   **Row Level Security (RLS):** Assume RLS is enabled for all sensitive tables
      (e.g., `hero_content`, `about_content`, `services`). Ensure all database operations
      respect RLS policies.
        -   **Error Handling:** Wrap all Supabase calls in `try...catch` blocks. Display
      user-friendly error messages using `useToast` from `@/hooks/use-toast.ts`. Log detailed
      errors to console for debugging.
        -   **Data Fetching:** Prefer React Query for all data fetching from Supabase to
      leverage caching, background re-fetching, and automatic error handling.
    -   **Form Handling:** Use React Hook Form for all forms, integrating with Zod for
      schema validation.
    -   **Environment Variables:** Access environment variables via `import.meta.env`
      (Vite's method).
   
    ## 4. Coding Conventions & Style Guide
    -   **TypeScript First:** All new code must be written in TypeScript. Leverage
      interfaces and types extensively.
    -   **ESLint Rules:** Adhere strictly to the `eslint.config.js` rules. Address all
      linting warnings and errors.
    -   **Absolute Imports:** Use the `@/` alias for all imports originating from the `src`
      directory.
        -   Example: `import { Button } from '@/components/ui/button';`
    -   **Component Structure:**
        -   Each major component (`HeroSection`, `Navbar`) should reside in its own file.
        -   Shadcn UI components are located in `src/components/ui/`.
    -   **Naming Conventions:**
        -   **Components:** `PascalCase` (e.g., `HeroSection.tsx`, `Navbar.tsx`).
        -   **Variables/Functions:** `camelCase`.
        -   **Files:** `kebab-case` for directories and non-component files (e.g.,
      `use-mobile.tsx`, `pricing-section.tsx`), `PascalCase` for component files.
        -   **CSS Classes:** Primarily use Tailwind's utility classes. For custom classes,
      follow a clear, descriptive naming convention (e.g., `btn-primary`, `glass-card`).
    -   **Styling:**
        -   Prioritize Tailwind CSS utility classes.
        -   For complex or custom styles not easily achievable with Tailwind, use inline
      styles or dedicated CSS modules/files sparingly.
        -   Ensure responsiveness using Tailwind's breakpoint prefixes (`sm:`, `md:`, `lg:`,
      `xl:`, `2xl:`).
    -   **Code Formatting:** Adhere to the implicit formatting (likely Prettier, given the
      stack) for indentation (2 spaces), semicolons (present), and single quotes.
   
    ## 5. Project Structure (Detailed)
  suite-spark-studio/
  ├───public/                 # Static assets (favicon, images, robots.txt)
  ├───src/                    # All application source code
  │   ├───App.css             # Global CSS for basic styles
  │   ├───App.tsx             # Main application component, often contains routing
  │   ├───index.css           # Tailwind CSS imports and base styles
  │   ├───main.tsx            # React app entry point (ReactDOM.createRoot)
  │   ├───vite-env.d.ts       # Vite environment type definitions
  │   ├───components/         # Reusable UI components and section-specific components
  │   │   ├───AboutSection.tsx
  │   │   ├───ClientsSection.tsx
  │   │   ├───FooterSection.tsx
  │   │   ├───HeroSection.tsx
  │   │   ├───Navbar.tsx
  │   │   ├───PricingSection.tsx
  │   │   ├───ServicesSection.tsx
  │   │   └───ui/             # Shadcn UI components (e.g., button.tsx, card.tsx)
  │   ├───hooks/              # Custom React Hooks (e.g., use-mobile.tsx, use-toast.ts)
  │   ├───integrations/       # Integrations with external services
  │   │   └───supabase/       # Supabase client setup and types
  │   │       ├───client.ts   # Supabase client initialization
  │   │       └───types.ts    # Supabase auto-generated types
  │   ├───lib/                # Utility functions (e.g., utils.ts for cn helper)
  │   └───pages/              # Page-level components (routes)
  │       ├───Index.tsx       # Main public index page
  │       ├───LandingPage.tsx # Specific landing page
  │       ├───NotFound.tsx    # 404 error page
  │       └───admin/          # Admin dashboard pages
  │           ├───AdminDashboard.tsx
  │           └───AdminLogin.tsx
  ├───supabase/               # Supabase project configuration and local migrations
  │   ├───config.toml         # Supabase CLI configuration
  │   └───migrations/         # Database migration files
  ├───.gitignore              # Git ignore rules
  ├───bun.lockb               # Bun lock file (if Bun is used)
  ├───components.json         # Shadcn UI components configuration
  ├───eslint.config.js        # ESLint configuration
  ├───index.html              # Main HTML file
  ├───package-lock.json       # npm lock file (if npm is used)
  ├───package.json            # Project dependencies and scripts
  ├───postcss.config.js       # PostCSS configuration (for Tailwind)
  ├───README.md               # Project README (for human developers)
  ├───tailwind.config.ts      # Tailwind CSS configuration
  ├───tsconfig.app.json       # TypeScript config for app
  ├───tsconfig.json           # Base TypeScript config
  ├───tsconfig.node.json      # TypeScript config for Node.js environment
  └───vite.config.ts          # Vite configuration

 
 ---
 
 ### 3. More Detailed User Prompt (Initial Request)
 
 The user prompt would remain concise but would implicitly leverage the extensive detail
      in the `gemini.md` and the system prompt. It would focus on the *outcome* and *scope* of
      the initial phase.
 
 "**Project Kickoff: Anja Agency Website - Phase 1: Foundation & Core Content Sections**
 
    Please initiate the development of the Anja Agency Website. Your task is to establish
      the complete foundational project setup and implement the core content sections as
      outlined in the provided `gemini.md` document.
    
    **Specific Deliverables for Phase 1:**
    
    1.  **Project Initialization & Configuration:**
        *   Create the project directory and initialize a Git repository.
        *   Install all primary dependencies as specified in `package.json` and `gemini.md`.
        *   Ensure Vite, TypeScript, Tailwind CSS, and ESLint are correctly configured and
      integrated, passing all initial linting and type-checking checks.
        *   Verify that the project builds successfully (`bun run build` or `npm run build`)
      and the development server starts (`bun run dev` or `npm run dev`).
   
    2.  **Core Application Structure:**
        *   Implement `src/main.tsx` to correctly render the main `App` component.
        *   Develop `src/App.tsx` to serve as the primary application entry point, setting
      up basic routing for `LandingPage` and `AdminLogin`.
   
    3.  **Landing Page Implementation:**
        *   Create `src/pages/LandingPage.tsx`.
        *   Implement the `HeroSection` component (`src/components/HeroSection.tsx`)
      according to the `hero_content` schema and design principles detailed in `gemini.md`.
        *   Integrate `HeroSection` into `LandingPage.tsx`.
        *   Ensure `HeroSection` fetches its data from the Supabase `hero_content` table
      using React Query, with appropriate loading and error states.
   
    4.  **Admin Login Page:**
        *   Create `src/pages/admin/AdminLogin.tsx`.
        *   Implement a functional login form that authenticates users against Supabase
      Auth, providing visual feedback for success/failure via `toast` notifications.
   
    **Expected Outcome:** A fully set up project with a functional landing page displaying
      dynamic hero content and a basic admin login page, all adhering to the specified tech
      stack, architectural patterns, and coding conventions.
   
    **Upon Completion:** Provide a detailed summary of all completed tasks, any challenges
      encountered and how they were resolved, and instructions on how to run the project
      locally."
