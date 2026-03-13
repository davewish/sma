# Facebook & Instagram OAuth Connection Implementation

## Overview
Complete OAuth 2.0 integration for Facebook and Instagram social media account connections with support for TikTok.

## Files Created

### Types (`/src/types/oauth.types.ts`)
- `OAuthProvider` - Type for supported platforms (facebook, instagram, tiktok)
- `OAuthConfig` - Configuration interface for each platform
- `PlatformAccount` - Account data structure with tokens and metadata
- `OAuthError` - Error handling for OAuth flows
- `OAuthCallbackParams` - OAuth callback parameters

### OAuth Service (`/src/services/oauth/`)

#### oauth.config.ts
- **OAUTH_CONFIGS** - Platform-specific OAuth configurations with app IDs and URLs
- **generateOAuthUrl()** - Creates authorization URLs with state validation
- **validateOAuthState()** - Security check for state parameters
- **clearOAuthState()** - Cleanup function

#### oauth.service.ts
- **initiateOAuthFlow()** - Redirects to provider authorization page
- **handleOAuthCallback()** - Processes authorization code and returns account data
- **refreshAccessToken()** - Token refresh mechanism (TODO: backend integration)
- **revokeAccessToken()** - Token revocation for disconnecting accounts

#### oauth/index.ts
- Centralized exports for OAuth services

### Custom Hook (`/src/hooks/useOAuth.ts`)
- **useOAuth()** - Hook for managing OAuth flows
  - `initiateConnection(platform)` - Start OAuth flow
  - `handleCallback(platform, code, state)` - Handle OAuth callback
  - `isLoading` - Loading state
  - `error` - Error handling
  - `clearError()` - Error cleanup

### Updated Components

#### ConnectedAccounts.tsx
- Integrated `useOAuth()` hook
- "Connect" buttons now trigger OAuth flows
- Loading states for better UX
- Disabled state handling during authentication

#### DashboardPage.tsx
- Updated `handleConnect()` to accept `OAuthProvider` type
- OAuth flow integration ready

## Features

✅ **OAuth 2.0 Support**
- Facebook authorization
- Instagram authorization  
- TikTok authorization (framework ready)
- State validation for security

✅ **Account Management**
- Display connected accounts with follower counts
- Show platform-specific icons and colors
- Connect new accounts via OAuth
- Disconnect accounts

✅ **Security**
- CSRF protection via state parameter validation
- 10-minute state expiration
- SessionStorage for state management

✅ **Demo Data**
- Mock account creation for testing
- Platform-specific follower counts and metadata

## Environment Variables Required

Add to `.env.local`:
```
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_INSTAGRAM_APP_ID=your_instagram_app_id
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5174
```

## OAuth Flow

1. User clicks "Connect Facebook/Instagram/TikTok"
2. `useOAuth.initiateConnection()` generates OAuth URL with state
3. Redirects to provider's authorization page
4. User grants permissions
5. Provider redirects to callback URL with authorization code
6. Backend exchanges code for access token (TODO)
7. Account data stored in dashboard
8. UI updated with connected account

## Next Steps

1. **Backend Integration** - Exchange authorization codes for access tokens
2. **Callback Handler** - Create OAuth callback page to handle redirects
3. **Token Storage** - Securely store and manage access tokens
4. **Token Refresh** - Implement automatic token refresh mechanism
5. **Real Platform Data** - Fetch actual account data from platforms
6. **Post Publishing** - Implement actual post creation to platforms

## Testing

To test OAuth flows:
1. Set up OAuth applications on each platform
2. Add your app credentials to environment variables
3. Click "Connect" button for desired platform
4. Authorize the app
5. Account data will be populated in dashboard

## Mock Data

For demonstration without real OAuth:
- Facebook: "Your Business Page" - 12,500 followers
- Instagram: "your_instagram_handle" - 8,300 followers
- TikTok: "your_tiktok_handle" - 15,600 followers
