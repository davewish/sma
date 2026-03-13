/**
 * OAuth Hook - Manage OAuth flows and connected accounts
 */

import { useCallback, useState } from "react";
import { oauthService } from "@/services/oauth/oauth.service";
import type {
  OAuthProvider,
  PlatformAccount,
  OAuthError,
} from "@/types/oauth.types";

interface UseOAuthReturn {
  isLoading: boolean;
  error: OAuthError | null;
  initiateConnection: (platform: OAuthProvider) => void;
  handleCallback: (
    platform: OAuthProvider,
    code: string,
    state: string,
  ) => Promise<PlatformAccount>;
  clearError: () => void;
}

export function useOAuth(): UseOAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<OAuthError | null>(null);

  const initiateConnection = useCallback((platform: OAuthProvider) => {
    try {
      setIsLoading(true);
      setError(null);
      oauthService.initiateOAuthFlow(platform);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initiate connection";
      setError({
        code: "OAUTH_INIT_ERROR",
        message,
      });
      setIsLoading(false);
    }
  }, []);

  const handleCallback = useCallback(
    async (
      platform: OAuthProvider,
      code: string,
      state: string,
    ): Promise<PlatformAccount> => {
      setIsLoading(true);
      setError(null);
      try {
        const account = await oauthService.handleOAuthCallback(
          platform,
          code,
          state,
        );
        return account;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "OAuth callback failed";
        setError({
          code: "OAUTH_CALLBACK_ERROR",
          message,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    initiateConnection,
    handleCallback,
    clearError,
  };
}
