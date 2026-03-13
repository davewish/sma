/**
 * Authentication Context - Manages global authentication state
 */

import { createContext } from "react";
import type { AuthContextType } from "@/types/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
