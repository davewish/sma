# Testing Guide

This project uses **Vitest** for unit testing and **React Testing Library** for component testing.

## Setup

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Structure

```
src/test/
├── setup.ts                      # Test environment setup
├── test-utils.ts                 # Shared test utilities
├── auth.service.test.ts          # Auth service unit tests
├── social.service.test.ts        # Social service unit tests
├── LoginPage.test.tsx            # Login page component tests
└── ConnectedAccounts.test.tsx    # ConnectedAccounts component tests
```

## Testing Patterns

### 1. Service Unit Tests

Test business logic in isolation:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { authService } from '@/services/api/auth.service';

describe('Auth Service', () => {
  it('should login with valid credentials', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });
    
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});
```

### 2. Component Unit Tests

Test UI components with user interactions:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '@/pages/LoginPage';

describe('LoginPage', () => {
  it('should display login form', () => {
    render(<LoginPage onNavigateToLanding={() => {}} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should submit form with user input', async () => {
    const user = userEvent.setup();
    render(<LoginPage onNavigateToLanding={() => {}} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Assert expected behavior
  });
});
```

### 3. Mocking API Calls

Mock axios API client in tests:

```typescript
import { vi } from 'vitest';

vi.mock('@/services/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

// In your test:
const apiClient = (await import('@/services/api/client')).apiClient;
apiClient.post.mockResolvedValue({ data: { token: 'test-token' } });
```

### 4. Testing Async Code

Use `waitFor` for async operations:

```typescript
import { waitFor, screen } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Test Utilities

### `renderWithProviders`

Render components with common providers:

```typescript
import { renderWithProviders } from '@/test/test-utils';

renderWithProviders(<YourComponent />);
```

### `createMockApiResponse`

Create mock API responses:

```typescript
import { createMockApiResponse } from '@/test/test-utils';

const mockResponse = createMockApiResponse({
  token: 'test-token',
  user: { id: '1', email: 'test@example.com' },
});
```

### `createMockApiError`

Create mock API errors:

```typescript
import { createMockApiError } from '@/test/test-utils';

const mockError = createMockApiError('Invalid credentials', 401);
```

## Coverage Goals

Target test coverage for:

- **Services**: 90%+ coverage
- **Components**: 80%+ coverage
- **Utilities**: 100% coverage

## Current Test Coverage

### ✅ Tested

- `authService.ts` - Login, signup, logout, token verification
- `socialService.ts` - Get accounts, connect, disconnect, refresh token
- `LoginPage.tsx` - Form rendering, validation, submission
- `ConnectedAccounts.tsx` - Display, connect, disconnect flows

### 🚧 To Add

- `DashboardPage.tsx` - Data loading, account management
- `CreatePostPage.tsx` - Form submission, media upload
- `useAuth.ts` - Custom hook behavior
- `Calendar.tsx` - Date selection
- `PostMetrics.tsx` - Data visualization
- `MediaUpload.tsx` - File upload handling

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or implementation details

2. **Use descriptive test names**
   ```typescript
   // ✅ Good
   it('should show password mismatch error when passwords dont match', () => {})
   
   // ❌ Bad
   it('should work', () => {})
   ```

3. **Arrange-Act-Assert (AAA) pattern**
   ```typescript
   it('should login user', async () => {
     // Arrange: Setup test data
     const credentials = { email: 'test@example.com', password: 'pass' };
     
     // Act: Perform action
     const result = await authService.login(credentials);
     
     // Assert: Verify result
     expect(result.token).toBeDefined();
   });
   ```

4. **Mock external dependencies**
   - Always mock API calls
   - Mock timers for time-dependent tests
   - Mock localStorage and window APIs

5. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` to reset mocks between tests
   - Don't rely on test execution order

## Debugging Tests

### View test UI

```bash
npm run test:ui
```

### Run single test file

```bash
npm run test -- auth.service.test.ts
```

### Run tests matching pattern

```bash
npm run test -- --grep "login"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test", "--", "--inspect-brk"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
