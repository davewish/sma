import {
  socialService,
  type SocialAccount,
} from "@/services/api/social.service";
import * as apiModule from "@/services/api/client";

jest.mock("@/services/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Social Service", () => {
  const mockAccounts: SocialAccount[] = [
    {
      platform: "facebook",
      accountName: "John Doe",
      accountId: "fb-123",
      expiresAt: "2026-05-15T00:00:00Z",
      connectedAt: "2026-03-15T00:00:00Z",
      followers: 5200,
      verified: true,
      profilePicture: "https://example.com/pic.jpg",
    },
    {
      platform: "instagram",
      accountName: "john.doe.insta",
      accountId: "ig-456",
      expiresAt: "2026-05-15T00:00:00Z",
      connectedAt: "2026-03-15T00:00:00Z",
      followers: 12400,
      verified: true,
      profilePicture: "https://example.com/pic2.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getConnectedAccounts", () => {
    it("should return accounts when response is an array", async () => {
      jest.spyOn(apiModule.apiClient, "get").mockResolvedValue({
        data: mockAccounts,
      });

      const result = await socialService.getConnectedAccounts();

      expect(result).toEqual(mockAccounts);
      expect(apiModule.apiClient.get).toHaveBeenCalledWith("/social/accounts");
    });

    it("should return accounts from wrapped response", async () => {
      jest.spyOn(apiModule.apiClient, "get").mockResolvedValue({
        data: { accounts: mockAccounts },
      });

      const result = await socialService.getConnectedAccounts();

      expect(result).toEqual(mockAccounts);
    });

    it("should throw error on invalid response structure", async () => {
      jest.spyOn(apiModule.apiClient, "get").mockResolvedValue({
        data: { invalid: "structure" },
      });

      await expect(socialService.getConnectedAccounts()).rejects.toThrow(
        "Invalid response structure",
      );
    });

    it("should throw error on null response", async () => {
      jest.spyOn(apiModule.apiClient, "get").mockResolvedValue({
        data: null,
      });

      await expect(socialService.getConnectedAccounts()).rejects.toThrow(
        "Invalid response from server",
      );
    });
  });

  describe("connectAccount", () => {
    it("should connect a new account via OAuth", async () => {
      const newAccount = mockAccounts[0];
      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue({
        data: newAccount,
      });

      const result = await socialService.connectAccount(
        "facebook",
        "auth-code-123",
      );

      expect(result).toEqual(newAccount);
      expect(apiModule.apiClient.post).toHaveBeenCalledWith(
        "/social/accounts/connect",
        { platform: "facebook", code: "auth-code-123" },
      );
    });

    it("should throw error on invalid response", async () => {
      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue({
        data: null,
      });

      await expect(
        socialService.connectAccount("facebook", "code"),
      ).rejects.toThrow("Invalid response from server");
    });
  });

  describe("disconnectAccount", () => {
    it("should disconnect an account", async () => {
      jest.spyOn(apiModule.apiClient, "delete").mockResolvedValue({});

      await socialService.disconnectAccount("fb-123");

      expect(apiModule.apiClient.delete).toHaveBeenCalledWith(
        "/social/accounts/fb-123",
      );
    });
  });

  describe("refreshAccountToken", () => {
    it("should refresh account token", async () => {
      const updatedAccount = {
        ...mockAccounts[0],
        expiresAt: "2026-06-15T00:00:00Z",
      };
      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue({
        data: updatedAccount,
      });

      const result = await socialService.refreshAccountToken("fb-123");

      expect(result).toEqual(updatedAccount);
      expect(apiModule.apiClient.post).toHaveBeenCalledWith(
        "/social/accounts/fb-123/refresh",
      );
    });
  });

  describe("getAccountDetails", () => {
    it("should fetch account details", async () => {
      const account = mockAccounts[0];
      jest.spyOn(apiModule.apiClient, "get").mockResolvedValue({
        data: account,
      });

      const result = await socialService.getAccountDetails("fb-123");

      expect(result).toEqual(account);
      expect(apiModule.apiClient.get).toHaveBeenCalledWith(
        "/social/accounts/fb-123",
      );
    });
  });

  describe("initiateOAuthFlow", () => {
    it("should redirect to Facebook OAuth", () => {
      const originalLocation = window.location;
      delete (window as Partial<Window>).location;
      window.location = { href: "" } as any;

      socialService.initiateOAuthFlow("facebook");

      expect(window.location.href).toContain("facebook.com");
      expect(window.location.href).toContain("oauth");

      window.location = originalLocation;
    });

    it("should throw error for unsupported platform", () => {
      expect(() => socialService.initiateOAuthFlow("unsupported")).toThrow(
        "Unsupported platform: unsupported",
      );
    });
  });
});
