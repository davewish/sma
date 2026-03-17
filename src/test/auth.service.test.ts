import { authService } from "@/services/api/auth.service";
import * as apiModule from "@/services/api/client";

jest.mock("@/services/api/client", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const mockResponse = {
        data: {
          token: "test-token-123",
          user: {
            id: "123",
            email: "admin@demo.com",
            name: "Admin",
          },
        },
      };

      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: "admin@demo.com",
        password: "password123",
      });

      expect(result).toEqual(mockResponse.data);
      expect(apiModule.apiClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "admin@demo.com",
        password: "password123",
      });
    });

    it("should throw error on invalid response", async () => {
      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue({
        data: null,
      } as any);

      await expect(
        authService.login({
          email: "test@example.com",
          password: "password",
        }),
      ).rejects.toThrow("Invalid response from server");
    });

    it("should throw error on API failure", async () => {
      jest
        .spyOn(apiModule.apiClient, "post")
        .mockRejectedValue(new Error("Network error"));

      await expect(
        authService.login({
          email: "test@example.com",
          password: "password",
        }),
      ).rejects.toThrow("Network error");
    });
  });

  describe("signup", () => {
    it("should successfully signup with valid credentials", async () => {
      const mockResponse = {
        data: {
          token: "new-token-123",
          user: {
            id: "456",
            email: "newuser@example.com",
            name: "New User",
          },
        },
      };

      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue(mockResponse);

      const result = await authService.signup({
        email: "newuser@example.com",
        password: "password123",
        passwordConfirm: "password123",
        name: "New User",
      });

      expect(result).toEqual(mockResponse.data);
      expect(apiModule.apiClient.post).toHaveBeenCalledWith("/auth/register", {
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
        name: "New User",
      });
    });

    it("should use password as fallback for confirmPassword", async () => {
      const mockResponse = {
        data: {
          token: "token",
          user: { id: "1", email: "test@example.com", name: "Test" },
        },
      };

      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue(mockResponse);

      await authService.signup({
        email: "test@example.com",
        password: "password123",
        name: "Test",
      });

      expect(apiModule.apiClient.post).toHaveBeenCalledWith("/auth/register", {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        name: "Test",
      });
    });
  });

  describe("logout", () => {
    it("should call logout endpoint", async () => {
      jest.spyOn(apiModule.apiClient, "post").mockResolvedValue({
        data: {},
      } as any);

      await authService.logout();

      expect(apiModule.apiClient.post).toHaveBeenCalledWith("/auth/logout", {});
    });

    it("should not throw on logout error", async () => {
      jest
        .spyOn(apiModule.apiClient, "post")
        .mockRejectedValue(new Error("Network error"));

      // Should not throw
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token", async () => {
      const mockResponse = {
        data: {
          valid: true,
        },
      };

      jest
        .spyOn(apiModule.apiClient, "get")
        .mockResolvedValue(mockResponse as any);

      const result = await authService.verifyToken("test-token");

      expect(result).toBe(true);
      expect(apiModule.apiClient.get).toHaveBeenCalledWith(
        "/auth/verify",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer test-token",
          },
        }),
      );
    });

    it("should return false for invalid token", async () => {
      jest.spyOn(apiModule.apiClient, "get").mockResolvedValue({
        data: {
          valid: false,
        },
      });

      const result = await authService.verifyToken("invalid-token");

      expect(result).toBe(false);
    });

    it("should return false on error", async () => {
      jest
        .spyOn(apiModule.apiClient, "get")
        .mockRejectedValue(new Error("Error"));

      const result = await authService.verifyToken("token");

      expect(result).toBe(false);
    });
  });
});
