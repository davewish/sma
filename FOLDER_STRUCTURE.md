# React TypeScript Modern Project Structure

A professional React + TypeScript project scaffolded with Vite, featuring a modern and scalable folder structure ready for API integration.

## Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components (Button, Spinner, etc.)
│   ├── layout/         # Layout components (Header, Footer, MainLayout)
│   ├── features/       # Feature-specific components (organized by feature)
│   └── index.ts        # Central export file
│
├── pages/              # Page components (for routing)
│   └── HomePage.tsx
│
├── services/           # API and business logic services
│   ├── api/           # API client and endpoints
│   │   ├── client.ts  # Centralized HTTP client
│   │   └── index.ts
│   └── index.ts
│
├── hooks/             # Custom React hooks
│   ├── useAsync.ts    # Async data fetching hook
│   └── index.ts
│
├── context/           # React Context providers (for global state)
├── store/             # State management (Redux, Zustand, etc.)
│
├── types/             # TypeScript types and interfaces
│   ├── api.types.ts   # API-related types
│   ├── common.types.ts # Common application types
│   └── index.ts
│
├── utils/             # Utility functions
│   ├── helpers/       # Helper functions
│   │   ├── common.ts  # Common utilities
│   │   ├── api.ts     # API utilities
│   │   └── index.ts
│   ├── constants/     # Application constants
│   │   ├── app.ts
│   │   └── index.ts
│   └── index.ts
│
├── styles/            # Global styles
│   └── global.css     # Global CSS variables and resets
│
├── config/            # Configuration files
│   └── environment.ts # Environment variables
│
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Update environment variables as needed

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Folder Breakdown

### `src/components`
Organize React components by type and feature:
- **common/** - Shared, reusable components
- **layout/** - Layout wrapper components
- **features/** - Feature-specific components (create subdirectories per feature)

### `src/services/api`
Centralized API integration:
- **client.ts** - Main HTTP client with fetch wrapper
- Add service files (e.g., `user.service.ts`) for specific features

### `src/hooks`
Custom hooks for logic reuse:
- Async data fetching hooks
- Form handling hooks
- Custom state management hooks

### `src/types`
Centralized TypeScript definitions:
- API response types
- Common application types
- Import from `@/types` for consistency

### `src/utils`
Helper functions organized by category:
- **helpers/** - General utility functions
- **constants/** - App-wide constants

### `src/config`
Configuration and environment setup:
- Environment variables
- Feature flags
- App configuration

## Key Features

### API Integration Ready
- Pre-configured `ApiClient` with fetch-based HTTP methods
- Type-safe API responses
- Error handling utilities
- Environment-based configuration

### TypeScript Path Aliases
Import using `@/` alias instead of relative paths:
```typescript
import { Button } from '@/components/common'
import { apiClient } from '@/services/api'
import type { ApiResponse } from '@/types'
```

### Custom Hooks
- `useAsync` - For async data fetching

### Global Styles
- CSS variables for consistent theming
- Responsive design utilities
- Global reset styles

## API Integration Example

### 1. Define Types
```typescript
// src/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### 2. Create Service
```typescript
// src/services/api/user.service.ts
import { apiClient } from './client'
import type { User } from '@/types'

export const userService = {
  getUser: (id: string) => apiClient.get<User>(`/users/${id}`),
  createUser: (data: User) => apiClient.post<User>('/users', data),
}
```

### 3. Use in Component
```typescript
import { useAsync } from '@/hooks'
import { userService } from '@/services/api'

function UserProfile({ userId }: { userId: string }) {
  const { value: user, isLoading, error } = useAsync(
    () => userService.getUser(userId)
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>{user?.name}</div>
}
```

## Best Practices

1. **Keep Components Pure** - Prefer functional components and hooks
2. **Type Everything** - Use TypeScript for better DX and safety
3. **Centralize API Calls** - Use services layer for all API integration
4. **Use Path Aliases** - Import from `@/` for cleaner imports
5. **Organize by Feature** - Group related code together
6. **Reuse Components** - Use common components for consistency

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Next Steps

1. Update `.env.example` with your API endpoints
2. Create feature-specific directories under `src/components/features/`
3. Add API services in `src/services/api/`
4. Implement global state management if needed (Context API or Redux)
5. Add routing with React Router

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **ESLint** - Code linting

## License

MIT
