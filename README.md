**AI Docs Generator Documentation**
=====================================

**Overview**
------------

The AI Docs Generator is a Next.js project designed to generate comprehensive documentation for various projects. This project utilizes the latest technologies, including Next.js, React, and MongoDB, to provide a robust and scalable solution for document generation.

**Technical Stack**
--------------------

* Framework: Next.js 16.1.1, React 19.2.3, TypeScript
* UI: Tailwind CSS, Radix UI, Lucide Icons, next-themes, Sonner, CVA
* Auth: NextAuth.js, Auth.js Core, bcryptjs, JOSE
* Database: MongoDB, MongoDB Adapter
* APIs: Groq SDK, Octokit, Axios

**Dependencies**
---------------

The project depends on the following packages:

* `@auth/core`: `^0.41.0`
* `@auth/mongodb-adapter`: `^3.11.1`
* `@hookform/resolvers`: `^5.2.2`
* `@octokit/rest`: `^22.0.1`
* `@radix-ui/react-alert-dialog`: `^1.1.15`
* `@radix-ui/react-avatar`: `^1.1.11`
* `@radix-ui/react-dropdown-menu`: `^2.1.16`
* `@radix-ui/react-label`: `^2.1.8`
* `@radix-ui/react-select`: `^2.2.6`
* `@radix-ui/react-separator`: `^1.1.8`
* `@radix-ui/react-slot`: `^1.2.4`
* `@upstash/ratelimit`: `^2.0.8`
* `@upstash/redis`: `^1.36.1`
* `axios`: `^1.13.2`
* `bcryptjs`: `^3.0.3`
* `class-variance-authority`: `^0.7.1`
* `clsx`: `^2.1.1`
* `date-fns`: `^4.1.0`
* `groq-sdk`: `^0.37.0`
* `jose`: `^6.1.3`
* `lucide-react`: `^0.562.0`
* `mongodb`: `^6.9.0`
* `next`: `16.1.1`
* `next-auth`: `^5.0.0-beta.30`
* `next-themes`: `^0.4.6`
* `react`: `19.2.3`
* `react-dom`: `19.2.3`
* `react-hook-form`: `^7.71.1`
* `sonner`: `^2.0.7`
* `tailwind-merge`: `^3.4.0`
* `zod`: `^4.3.5`
* `zustand`: `^5.0.9`

**NPM Scripts**
----------------

The project includes the following NPM scripts:

* `dev`: `next dev --turbopack`
* `build`: `next build`
* `start`: `next start`
* `lint`: `eslint`

**Directory Structure**
-----------------------

The project has the following directory structure:

* `.gitignore`
* `.mcp.json`
* `README.md`
* `app`
* `components.json`
* `eslint.config.mjs`
* `next.config.ts`
* `package-lock.json`
* `package.json`
* `postcss.config.mjs`
* `public`
* `tsconfig.json`

**Files**
---------

The project includes the following files:

* `package.json`: The project's package file, containing dependencies and scripts.
* `README.md`: The project's README file, containing an overview and key features.
* `next.config.ts`: The project's Next.js configuration file.
* `tsconfig.json`: The project's TypeScript configuration file.
* `app/page.tsx`: The project's main page component.
* `app/layout.tsx`: The project's layout component.

**Metadata**
------------

The project's metadata is defined in the `app/layout.tsx` file:

* `title`: "AI Docs Generator - Free Documentation Tool"
* `description`: "Generate professional documentation assisted with AI"
* `metadataBase`: `https://ai-docs-generator.vercel.app`